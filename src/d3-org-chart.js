import { selection, select } from "d3-selection";
import { max } from "d3-array";
import { tree, stratify } from "d3-hierarchy";
import { zoom } from "d3-zoom";

const d3 = {
    selection,
    select,
    max,
    tree,
    stratify,
    zoom
}

export default class OrgChart {
    constructor() {
        // Exposed variables
        const attrs = {
            id: `ID${Math.floor(Math.random() * 1000000)}`, // Id for event handlings
            svgWidth: 800,
            svgHeight: 600,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 0,
            marginLeft: 0,
            container: "body",
            defaultTextFill: "#2C3E50",
            nodeTextFill: "white",
            defaultFont: "Helvetica",
            backgroundColor: "#DFE3E9",
            data: null,
            depth: 180,
            duration: 600,
            strokeWidth: 3,
            dropShadowId: null,
            initialZoom: 1,
            onNodeClick: (d) => d,
            template:d=>'Sample Node Content, override using chart.template(data=>data.htmlContent)',
            layout: "h" // h, v
        };

        this.getChartState = () => attrs;

        // Dynamically set getter and setter functions for Chart class
        Object.keys(attrs).forEach((key) => {
            //@ts-ignore
            this[key] = function (_) {
                if (!arguments.length) {
                    return attrs[key];
                } else {
                    attrs[key] = _;
                }
                return this;
            };
        });

        this.initializeEnterExitUpdatePattern();
    }

    initializeEnterExitUpdatePattern() {

        d3.selection.prototype.patternify = function (params) {
            var container = this;
            var selector = params.selector;
            var elementTag = params.tag;
            var data = params.data || [selector];

            // Pattern in action
            var selection = container.selectAll("." + selector).data(data, (d, i) => {
                if (typeof d === "object") {
                    if (d.id) {
                        return d.id;
                    }
                }
                return i;
            });
            selection.exit().remove();
            selection = selection.enter().append(elementTag).merge(selection);
            selection.attr("class", selector);
            return selection;
        };
    }

    // This method retrieves passed node's children IDs (including node)
    getNodeChildrenIds({ data, children, _children }, nodeIdsStore) {
        // Store current node ID
        nodeIdsStore.push(data.nodeId);

        // Loop over children and recursively store descendants id (expanded nodes)
        if (children) {
            children.forEach((d) => {
                this.getNodeChildrenIds(d, nodeIdsStore);
            });
        }

        // Loop over _children and recursively store descendants id (collapsed nodes)
        if (_children) {
            _children.forEach((d) => {
                this.getNodeChildrenIds(d, nodeIdsStore);
            });
        }

        // Return result
        return nodeIdsStore;
    }

    // This method can be invoked via chart.setZoomFactor API, it zooms to particulat scale
    setZoomFactor(zoomLevel) {
        const attrs = this.getChartState();
        const calc = attrs.calc;

        // Store passed zoom level
        attrs.initialZoom = zoomLevel;

        if (attrs.layout === "h") {
            // Rescale container element accordingly
            attrs.centerG.attr(
                "transform",
                ` translate(${calc.nodeMaxWidth / 2}, ${calc.centerY}) scale(${attrs.initialZoom
                })`
            );
        } else {
            // Rescale container element accordingly
            attrs.centerG.attr(
                "transform",
                ` translate(${calc.centerX}, ${calc.nodeMaxHeight / 2}) scale(${attrs.initialZoom
                })`
            );
        }
    }

    render() {
        //InnerFunctions which will update visuals

        const attrs = this.getChartState();
        const thisObjRef = this;

        //Drawing containers
        const container = d3.select(attrs.container);
        const containerRect = container.node().getBoundingClientRect();
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

        //Attach drop shadow id to attrs object
        this.setDropShadowId(attrs);

        //Calculated properties
        const calc = {
            id: null,
            chartTopMargin: null,
            chartLeftMargin: null,
            chartWidth: null,
            chartHeight: null
        };
        calc.id = `ID${Math.floor(Math.random() * 1000000)}`; // id for event handlings
        calc.chartLeftMargin = attrs.marginLeft;
        calc.chartTopMargin = attrs.marginTop;
        calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
        calc.chartHeight =
            attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
        attrs.calc = calc;

        // Get maximum node width and height
        calc.nodeMaxWidth = d3.max(attrs.data, ({ width }) => width);
        calc.nodeMaxHeight = d3.max(attrs.data, ({ height }) => height);

        // Calculate max node depth (it's needed for layout heights calculation)
        attrs.depth = calc.nodeMaxHeight + 100;
        calc.centerX = calc.chartWidth / 2;
        calc.centerY = calc.chartHeight / 2;

        if (attrs.layout == "h") {
            attrs.depth = calc.nodeMaxWidth + 100;
        }

        //********************  LAYOUTS  ***********************
        const layouts = {
            treemap: null
        };
        attrs.layouts = layouts;

        // Generate tree layout function
        layouts.treemap = d3.tree().size([calc.chartWidth, calc.chartHeight]);

        if (attrs.layout == "h") {
            layouts.treemap.nodeSize([
                calc.nodeMaxHeight + 30,
                calc.nodeMaxWidth + attrs.depth
            ]);
        } else {
            layouts.treemap.nodeSize([
                calc.nodeMaxWidth + 100,
                calc.nodeMaxHeight + attrs.depth
            ]);
        }

        // ******************* BEHAVIORS . **********************
        const behaviors = {
            zoom: null
        };

        // Get zooming function
        behaviors.zoom = d3.zoom().on("zoom", (event, d) => this.zoomed(event, d));

        //****************** ROOT node work ************************

        // Convert flat data to hierarchical
        attrs.root = d3
            .stratify()
            .id(({ nodeId }) => nodeId)
            .parentId(({ parentNodeId }) => parentNodeId)(attrs.data);

        // Set child nodes enter appearance positions
        attrs.root.x0 = 0;
        attrs.root.y0 = 0;

        /** Get all nodes as array (with extended parent & children properties set)
                This way we can access any node's parent directly using node.parent - pretty cool, huh?
            */
        attrs.allNodes = attrs.layouts.treemap(attrs.root).descendants();

        // Assign direct children and total subordinate children's cound
        attrs.allNodes.forEach((d) => {
            Object.assign(d.data, {
                directSubordinates: d.children ? d.children.length : 0,
                totalSubordinates: d.descendants().length - 1
            });
        });

        // Collapse all children at first
        attrs.root.children.forEach((d) => this.collapse(d));

        // Then expand some nodes, which have `expanded` property set
        attrs.root.children.forEach((d) => this.expandSomeNodes(d));

        // *************************  DRAWING **************************
        //Add svg
        const svg = container
            .patternify({
                tag: "svg",
                selector: "svg-chart-container"
            })
            .attr("width", attrs.svgWidth)
            .attr("height", attrs.svgHeight)
            .attr("font-family", attrs.defaultFont)
            .call(behaviors.zoom)
            .on("dblclick.zoom", null)
            .attr("cursor", "move")

        attrs.svg = svg;

        //Add container g element
        const chart = svg
            .patternify({
                tag: "g",
                selector: "chart"
            })
            .attr(
                "transform",
                `translate(${calc.chartLeftMargin},${calc.chartTopMargin})`
            );

        // Add one more container g element, for better positioning controls
        attrs.centerG = chart
            .patternify({
                tag: "g",
                selector: "center-group"
            })
            .attr("transform", () => {
                if (attrs.layout === "h")
                    return `translate(${calc.nodeMaxWidth},${calc.centerY}) scale(${attrs.initialZoom})`;
                return `translate(${calc.centerX},${calc.nodeMaxHeight / 2}) scale(${attrs.initialZoom
                    })`;
            });

        attrs.chart = chart;

        // ************************** ROUNDED AND SHADOW IMAGE  WORK USING SVG FILTERS **********************


        // Display tree contenrs
        this.update(attrs.root);

        //#########################################  UTIL FUNCS ##################################
        // This function restyles foreign object elements ()

        d3.select(window).on(`resize.${attrs.id}`, () => {
            const containerRect = container.node().getBoundingClientRect();
            //  if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
            //	main();
        });

        return this;
    }

    // This function sets drop shadow ID to the passed object
    setDropShadowId(d) {
        // If it's already set, then return
        if (d.dropShadowId) return;

        // Generate drop shadow ID
        let id = `${d.id}-drop-shadow`;

        // If DOM object is available, then use UID method to generated shadow id
        //@ts-ignore
        if (typeof DOM != "undefined") {
            //@ts-ignore
            id = DOM.uid(d.id).id;
        }

        // Extend passed object with drop shadow ID
        Object.assign(d, {
            dropShadowId: id
        });
    }

    // This function can be invoked via chart.addNode API, and it adds node in tree at runtime
    addNode(obj) {
        const attrs = this.getChartState();
        attrs.data.push(obj);

        // Update state of nodes and redraw graph
        this.updateNodesState();
        return this;
    }

    // This function can be invoked via chart.removeNode API, and it removes node from tree at runtime
    removeNode(nodeId) {
        const attrs = this.getChartState();
        const node = attrs.allNodes.filter(({ data }) => data.nodeId == nodeId)[0];

        // Remove all node childs
        if (node) {
            // Retrieve all children nodes ids (including current node itself)
            const nodeChildrenIds = this.getNodeChildrenIds(node, []);

            // Filter out retrieved nodes and reassign data
            attrs.data = attrs.data.filter(
                (d) => !nodeChildrenIds.includes(d.nodeId)
            );

            const updateNodesState = this.updateNodesState.bind(this);
            // Update state of nodes and redraw graph
            updateNodesState();
        }
    }

    // This function basically redraws visible graph, based on nodes state
    update({ x0, y0, x, y }) {
        const attrs = this.getChartState();
        const calc = attrs.calc;

        //  Assigns the x and y position for the nodes
        const treeData = attrs.layouts.treemap(attrs.root);

        // Get tree nodes and links and attach some properties
        const nodes = treeData.descendants().map((d) => {
            // If at least one property is already set, then we don't want to reset other properties
            if (d.width) return d;

            // Declare properties with deffault values
            let imageWidth = 100;
            let imageHeight = 100;
            let imageBorderColor = "steelblue";
            let imageBorderWidth = 0;
            let imageRx = 0;
            let imageCenterTopDistance = 0;
            let imageCenterLeftDistance = 0;
            let borderColor = "steelblue";
            let backgroundColor = "steelblue";
            let width = d.data.width;
            let height = d.data.height;
            let dropShadowId = `none`;

            // Extend node object with calculated properties
            return Object.assign(d, {
                imageWidth,
                imageHeight,
                imageBorderColor,
                imageBorderWidth,
                borderColor,
                backgroundColor,
                imageRx,
                width,
                height,
                imageCenterTopDistance,
                imageCenterLeftDistance,
                dropShadowId
            });
        });

        // Get all links
        const links = treeData.descendants().slice(1);

        // Set constant depth for each nodes
        nodes.forEach((d) => (d.y = d.depth * attrs.depth));

        if (attrs.layout === "h") {
            // Switch x and y coordinates for horizontal layout
            nodes.forEach((d) => {
                const x = d.x;
                d.x = d.y;
                d.y = x;
            });
        }

        // --------------------------  LINKS ----------------------
        // Get links selection
        const linkSelection = attrs.centerG
            .selectAll("path.link")
            .data(links, ({ id }) => id);

        // Enter any new links at the parent's previous position.
        const linkEnter = linkSelection
            .enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", (d) => {
                const o = {
                    x: x0,
                    y: y0
                };

                if (attrs.layout == "h") {
                    return this.hdiagonal(o, o);
                } else {
                    return this.diagonal(o, o);
                }
            });

        // Get links update selection
        const linkUpdate = linkEnter.merge(linkSelection);

        // Styling links
        linkUpdate
            .attr("fill", "none")
            .attr("stroke-width", ({ data }) => data.connectorLineWidth || 2)
            .attr("stroke", ({ data }) => {
                return "#767b9b";
            })
            .attr("stroke-dasharray", ({ data }) => {
                if (data.dashArray) {
                    return data.dashArray;
                }
                return "";
            });

        // Transition back to the parent element position
        linkUpdate
            .transition()
            .duration(attrs.duration)
            .attr("d", (d) => {
                if (attrs.layout == "h") {
                    return this.hdiagonal(d, d.parent);
                } else {
                    return this.diagonal(d, d.parent);
                }
            });

        // Remove any  links which is exiting after animation
        const linkExit = linkSelection
            .exit()
            .transition()
            .duration(attrs.duration)
            .attr("d", (d) => {
                const o = {
                    x: x,
                    y: y
                };

                if (attrs.layout == "h") {
                    return this.hdiagonal(o, o);
                } else {
                    return this.diagonal(o, o);
                }
            })
            .remove();

        // --------------------------  NODES ----------------------
        // Get nodes selection
        const nodesSelection = attrs.centerG
            .selectAll("g.node")
            .data(nodes, ({ id }) => id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = nodesSelection
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", (d) => `translate(${x0},${y0})`)
            .attr("cursor", "pointer")
            .on("click", (event, { data }) => {
                if ([...event.srcElement.classList].includes("node-button-circle")) {
                    return;
                }
                attrs.onNodeClick(data.nodeId);
            });

        // Add background rectangle for the nodes
        nodeEnter
            .patternify({
                tag: "rect",
                selector: "node-rect",
                data: (d) => [d]
            })
            .style("fill", ({ _children }) =>
                _children ? "lightsteelblue" : "#fff"
            );


        // Node update styles
        const nodeUpdate = nodeEnter
            .merge(nodesSelection)
            .style("font", "12px sans-serif");

        // Add foreignObject element inside rectangle
        const fo = nodeUpdate.patternify({
            tag: "foreignObject",
            selector: "node-foreign-object",
            data: (d) => [d]
        });

        // Add foreign object
        fo.patternify({
            tag: "xhtml:div",
            selector: "node-foreign-object-div",
            data: (d) => [d]
        });

        this.restyleForeignObjectElements();

        // Add Node button circle's group (expand-collapse button)
        const nodeButtonGroups = nodeEnter
            .patternify({
                tag: "g",
                selector: "node-button-g",
                data: (d) => [d]
            })
            .on("click", (event, d) => this.onButtonClick(event, d));

        // Add expand collapse button circle
        nodeButtonGroups.patternify({
            tag: "circle",
            selector: "node-button-circle",
            data: (d) => [d]
        });

        // Add button text
        nodeButtonGroups
            .patternify({
                tag: "text",
                selector: "node-button-text",
                data: (d) => [d]
            })
            .attr("pointer-events", "none");

        // Transition to the proper position for the node
        nodeUpdate
            .transition()
            .attr("opacity", 0)
            .duration(attrs.duration)
            .attr("transform", ({ x, y }) => `translate(${x},${y})`)
            .attr("opacity", 1);


        // Style node rectangles
        nodeUpdate
            .select(".node-rect")
            .attr("width", ({ data }) => data.width)
            .attr("height", ({ data }) => data.height)
            .attr("x", ({ data }) => -data.width / 2)
            .attr("y", ({ data }) => -data.height / 2)
            .attr("cursor", "pointer")
            .style("fill", ({ backgroundColor }) => backgroundColor)

        // Move node button group to the desired position
        nodeUpdate
            .select(".node-button-g")
            .attr("transform", ({ data }) => {
                if (attrs.layout == "h") return `translate(${data.width / 2},0)`;
                return `translate(0,${data.height / 2})`;
            })
            .attr("opacity", ({ children, _children }) => {
                if (children || _children) {
                    return 1;
                }
                return 0;
            });

        // Restyle node button circle
        nodeUpdate
            .select(".node-button-circle")
            .attr("r", 16)
            .attr("stroke-width", ({ data }) => data.borderWidth || attrs.strokeWidth)
            .attr("fill", attrs.backgroundColor)
            .attr("stroke", ({ borderColor }) => borderColor);

        // Restyle button texts
        nodeUpdate
            .select(".node-button-text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("fill", attrs.defaultTextFill)
            .attr("font-size", ({ children }) => {
                if (children) return 40;
                return 26;
            })
            .text(({ children }) => {
                if (children) return "-";
                return "+";
            })
            .attr("y", this.isEdge() ? 10 : 0);

        // Remove any exiting nodes after transition
        const nodeExitTransition = nodesSelection
            .exit()
            .attr("opacity", 1)
            .transition()
            .duration(attrs.duration)
            .attr("transform", (d) => `translate(${x},${y})`)
            .on("end", function () {
                d3.select(this).remove();
            })
            .attr("opacity", 0);

        // On exit reduce the node rects size to 0
        nodeExitTransition
            .selectAll(".node-rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", 0)
            .attr("y", 0);

        // On exit reduce the node image rects size to 0
        nodeExitTransition
            .selectAll(".node-image-rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", ({ width }) => width / 2)
            .attr("y", ({ height }) => height / 2);

        // Store the old positions for transition.
        nodes.forEach((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // This function detects whether current browser is edge
    isEdge() {
        return window.navigator.userAgent.includes("Edge");
    }

    // Generate horizontal diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges-horizontal-d3-v3-v4-v5-v6
    hdiagonal(s, t) {
        // Define source and target x,y coordinates
        const x = s.x;
        const y = s.y;
        const ex = t.x;
        const ey = t.y;

        // Values in case of top reversed and left reversed diagonals
        let xrvs = ex - x < 0 ? -1 : 1;
        let yrvs = ey - y < 0 ? -1 : 1;

        // Define preferred curve radius
        let rdef = 35;

        // Reduce curve radius, if source-target x space is smaller
        let r = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;

        // Further reduce curve radius, is y space is more small
        r = Math.abs(ey - y) / 2 < r ? Math.abs(ey - y) / 2 : r;

        // Defin width and height of link, excluding radius
        let h = Math.abs(ey - y) / 2 - r;
        let w = Math.abs(ex - x) / 2 - r;

        // Build and return custom arc command
        return `
              M ${x} ${y}
              L ${x + w * xrvs} ${y}
              C ${x + w * xrvs + r * xrvs} ${y} 
                ${x + w * xrvs + r * xrvs} ${y} 
                ${x + w * xrvs + r * xrvs} ${y + r * yrvs}
              L ${x + w * xrvs + r * xrvs} ${ey - r * yrvs} 
              C ${x + w * xrvs + r * xrvs}  ${ey} 
                ${x + w * xrvs + r * xrvs}  ${ey} 
                ${ex - w * xrvs}  ${ey}
              L ${ex} ${ey}
   `;
    }

    // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges
    diagonal(s, t) {
        // Calculate some variables based on source and target (s,t) coordinates
        const x = s.x;
        const y = s.y;
        const ex = t.x;
        const ey = t.y;
        let xrvs = ex - x < 0 ? -1 : 1;
        let yrvs = ey - y < 0 ? -1 : 1;
        let rdef = 35;
        let rInitial = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;
        let r = Math.abs(ey - y) / 2 < rInitial ? Math.abs(ey - y) / 2 : rInitial;
        let h = Math.abs(ey - y) / 2 - r;
        let w = Math.abs(ex - x) - r * 2;

        // Build the path
        const path = `
               M ${x} ${y}
               L ${x} ${y + h * yrvs}
               C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs
            } ${x + r * xrvs} ${y + h * yrvs + r * yrvs}
               L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}
               C ${ex}  ${y + h * yrvs + r * yrvs} ${ex}  ${y + h * yrvs + r * yrvs
            } ${ex} ${ey - h * yrvs}
               L ${ex} ${ey}
             `;
        // Return result
        return path;
    }

    restyleForeignObjectElements() {
        const attrs = this.getChartState();

        attrs.svg
            .selectAll(".node-foreign-object")
            .attr("width", ({ width }) => width)
            .attr("height", ({ height }) => height)
            .attr("x", ({ width }) => -width / 2)
            .attr("y", ({ height }) => -height / 2);
        attrs.svg
            .selectAll(".node-foreign-object-div")
            .style("width", ({ width }) => `${width}px`)
            .style("height", ({ height }) => `${height}px`)
            .style("color", "white")
            .html(({ data }) => attrs.template(data));
    }

    // Toggle children on click.
    onButtonClick(event, d) {
        // If childrens are expanded
        if (d.children) {
            //Collapse them
            d._children = d.children;
            d.children = null;

            // Set descendants expanded property to false
            this.setExpansionFlagToChildren(d, false);
        } else {
            // Expand children
            d.children = d._children;
            d._children = null;

            // Set each children as expanded
            d.children.forEach(({ data }) => (data.expanded = true));
        }

        // Redraw Graph
        this.update(d);
    }

    // This function changes `expanded` property to descendants
    setExpansionFlagToChildren({ data, children, _children }, flag) {
        // Set flag to the current property
        data.expanded = flag;

        // Loop over and recursively update expanded children's descendants
        if (children) {
            children.forEach((d) => {
                this.setExpansionFlagToChildren(d, flag);
            });
        }

        // Loop over and recursively update collapsed children's descendants
        if (_children) {
            _children.forEach((d) => {
                this.setExpansionFlagToChildren(d, flag);
            });
        }
    }

    // This function can be invoked via chart.setExpanded API, it expands or collapses particular node
    setExpanded(id, expandedFlag) {
        const attrs = this.getChartState();
        // Retrieve node by node Id
        const node = attrs.allNodes.filter(({ data }) => data.nodeId == id)[0];

        // If node exists, set expansion flag
        if (node) node.data.expanded = expandedFlag;

        // First expand all nodes
        attrs.root.children.forEach((d) => this.expand(d));

        // Expand root's chilren in case they are collapsed
        if (attrs.root._children) {
            attrs.root._children.forEach((d) => this.expand(d));
        }

        // Then collapse all nodes
        attrs.root.children.forEach((d) => this.collapse(d));

        // Then expand only the nodes, which were previously expanded, or have an expand flag set
        attrs.root.children.forEach((d) => this.expandSomeNodes(d));

        // Redraw graph
        this.update(attrs.root);
    }

    // Method which only expands nodes, which have property set "expanded=true"
    expandSomeNodes(d) {
        // If node has expanded property set
        if (d.data.expanded) {
            // Retrieve node's parent
            let parent = d.parent;

            // While we can go up
            while (parent) {
                // Expand all current parent's children
                if (parent._children) {
                    parent.children = parent._children;
                }

                // Replace current parent holding object
                parent = parent.parent;
            }
        }

        // Recursivelly do the same for collapsed nodes
        if (d._children) {
            d._children.forEach((ch) => this.expandSomeNodes(ch));
        }

        // Recursivelly do the same for expanded nodes
        if (d.children) {
            d.children.forEach((ch) => this.expandSomeNodes(ch));
        }
    }

    // This function updates nodes state and redraws graph, usually after data change
    updateNodesState() {
        const attrs = this.getChartState();
        // Store new root by converting flat data to hierarchy
        attrs.root = d3
            .stratify()
            .id(({ nodeId }) => nodeId)
            .parentId(({ parentNodeId }) => parentNodeId)(attrs.data);

        // Store positions, where children appear during their enter animation
        attrs.root.x0 = 0;
        attrs.root.y0 = 0;

        // Store all nodes in flat format (although, now we can browse parent, see depth e.t.c. )
        attrs.allNodes = attrs.layouts.treemap(attrs.root).descendants();

        // Store direct and total descendants count
        attrs.allNodes.forEach((d) => {
            Object.assign(d.data, {
                directSubordinates: d.children ? d.children.length : 0,
                totalSubordinates: d.descendants().length - 1
            });
        });

        // Expand all nodes first
        attrs.root.children.forEach(this.expand);

        // Then collapse them all
        attrs.root.children.forEach((d) => this.collapse(d));

        // Then only expand nodes, which have expanded proprty set to true
        attrs.root.children.forEach((ch) => this.expandSomeNodes(ch));

        // Redraw Graphs
        this.update(attrs.root);
    }

    // Function which collapses passed node and it's descendants
    collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach((ch) => this.collapse(ch));
            d.children = null;
        }
    }

    // Function which expands passed node and it's descendants
    expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach((ch) => this.expand(ch));
            d._children = null;
        }
    }

    // Zoom handler function
    zoomed(event, d) {
        const attrs = this.getChartState();
        const chart = attrs.chart;

        // Get d3 event's transform object
        const transform = event.transform;

        // Store it
        attrs.lastTransform = transform;

        // Reposition and rescale chart accordingly
        chart.attr("transform", transform);

        // Apply new styles to the foreign object element
        if (this.isEdge()) {
            this.restyleForeignObjectElements();
        }
    }
}