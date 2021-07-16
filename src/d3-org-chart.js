import { selection, select } from "d3-selection";
import { max, min } from "d3-array";
import { tree, stratify } from "d3-hierarchy";
import { zoom, zoomIdentity } from "d3-zoom";
import { flextree } from 'd3-flextree';

const d3 = {
    selection,
    select,
    max,
    min,
    tree,
    stratify,
    zoom,
    zoomIdentity
}
export default class OrgChart {
    constructor() {
        console.log('window.innerheight', window.innerHeight)
        // Exposed variables 
        const attrs = {
            id: `ID${Math.floor(Math.random() * 1000000)}`, // Id for event handlings
            firstDraw: true,
            svgWidth: 800,
            svgHeight: window.innerHeight - 100,
            container: "body",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            data: null,
            duration: 400,
            initialZoom: 1,
            rootMargin: 40,
            nodeDefaultBackground: 'none',
            nodeId: d => d.nodeId || d.id,
            parentNodeId: d => d.parentNodeId || d.parentId,
            zoomBehavior: null,
            linkUpdate: function (d, i, arr) {
                d3.select(this)
                    .attr("stroke", "lightgray")
            },
            nodeUpdate: (d, i, arr) => { },
            nodeWidth: d3Node => 200,
            nodeHeight: d => 100,
            siblingsMargin: d3Node => 20,
            childrenMargin: d => 60,
            onNodeClick: (d) => d,
            nodeContent: d => `<div style="padding:5px;font-size:10px;">Sample Node(id=${d.id}), override using <br/> <br/> 
            <code>chart<br/>
            &nbsp;.nodeContent({data}=>{ <br/>
             &nbsp;&nbsp;&nbsp;&nbsp;return '' // Custom HTML <br/>
             &nbsp;})</code></div>`,
            layout: "top",// top, left,right, bottom
            buttonContent: ({ children, layout, icons }) => `<div style="border-radius:3px;padding:3px;font-size:10px;margin:auto auto;background-color:lightgray"> ${icons[layout](children)}  </div>`,
            icons: {
                "left": d => d ? `<div style="margin-top:-10px;line-height:1.2;font-size:25px;height:22px">‹</div>` : `<div style="margin-top:-10px;font-size:25px;height:23px">›</div>`,
                "bottom": d => d ? `<div style="margin-top:-20px;font-size:25px">ˬ</div>` : `<div style="margin-top:0px;line-height:1.2;height:11px;font-size:25px">ˆ</div>`,
                "right": d => d ? `<div style="margin-top:-10px;font-size:25px;height:23px">›</div>` : `<div style="margin-top:-10px;line-height:1.2;font-size:25px;height:22px">‹</div>`,
                "top": d => d ? `<div style="margin-top:0px;line-height:1.2;height:11px;font-size:25px">ˆ</div>` : `<div style="margin-top:-20px;font-size:25px">ˬ</div>`,
            },
            layoutBindings: {
                "left": {
                    "nodeLeftX": node => 0,
                    "nodeRightX": node => node.width,
                    "nodeTopY": node => - node.height / 2,
                    "nodeBottomY": node => node.height / 2,
                    "nodeJoinX": node => node.x + node.width,
                    "nodeJoinY": node => node.y - node.height / 2,
                    "linkJoinX": node => node.x + node.width,
                    "linkJoinY": node => node.y,
                    "linkX": node => node.x,
                    "linkY": node => node.y,
                    "linkParentX": node => node.parent.x + node.parent.width,
                    "linkParentY": node => node.parent.y,
                    "buttonX": node => node.width,
                    "buttonY": node => node.height / 2,
                    "centerTransform": ({ root, rootMargin, centerY, scale, centerX }) => `translate(${rootMargin},${centerY}) scale(${scale})`,
                    "nodeFlexSize": ({ height, width, siblingsMargin, childrenMargin }) => [height + siblingsMargin, width + childrenMargin],
                    "zoomTransform": ({ centerY, scale }) => `translate(${0},${centerY}) scale(${scale})`,
                    "diagonal": this.hdiagonal.bind(this),
                    "swap": d => { const x = d.x; d.x = d.y; d.y = x; },
                    "nodeUpdateTransform": ({ x, y, width, height }) => `translate(${x},${y - height / 2})`,
                },
                "top": {
                    "nodeLeftX": node => -node.width / 2,
                    "nodeRightX": node => node.width / 2,
                    "nodeTopY": node => 0,
                    "nodeBottomY": node => node.height,
                    "nodeJoinX": node => node.x - node.width / 2,
                    "nodeJoinY": node => node.y + node.height,
                    "linkJoinX": node => node.x,
                    "linkJoinY": node => node.y + node.height,
                    "linkX": node => node.x,
                    "linkY": node => node.y,
                    "linkParentX": node => node.parent.x,
                    "linkParentY": node => node.parent.y + node.parent.height,
                    "buttonX": node => node.width / 2,
                    "buttonY": node => node.height,
                    "centerTransform": ({ root, rootMargin, centerY, scale, centerX }) => `translate(${centerX},${rootMargin}) scale(${scale})`,
                    "nodeFlexSize": ({ height, width, siblingsMargin, childrenMargin }) => [width + siblingsMargin, height + childrenMargin],
                    "zoomTransform": ({ centerX, scale }) => `translate(${centerX},0}) scale(${scale})`,
                    "diagonal": this.diagonal.bind(this),
                    "swap": d => { },
                    "nodeUpdateTransform": ({ x, y, width, height }) => `translate(${x - width / 2},${y})`,
                },
                "bottom": {
                    "nodeLeftX": node => -node.width / 2,
                    "nodeRightX": node => node.width / 2,
                    "nodeTopY": node => -node.height,
                    "nodeBottomY": node => 0,
                    "nodeJoinX": node => node.x - node.width / 2,
                    "nodeJoinY": node => node.y - node.height - node.height,
                    "linkJoinX": node => node.x,
                    "linkJoinY": node => node.y - node.height,
                    "linkX": node => node.x,
                    "linkY": node => node.y,
                    "linkParentX": node => node.parent.x,
                    "linkParentY": node => node.parent.y - node.parent.height,
                    "buttonX": node => node.width / 2,
                    "buttonY": node => 0,
                    "centerTransform": ({ root, rootMargin, centerY, scale, centerX, chartHeight }) => `translate(${centerX},${chartHeight - rootMargin}) scale(${scale})`,
                    "nodeFlexSize": ({ height, width, siblingsMargin, childrenMargin }) => [width + siblingsMargin, height + childrenMargin],
                    "zoomTransform": ({ centerX, scale }) => `translate(${centerX},0}) scale(${scale})`,
                    "diagonal": this.diagonal.bind(this),
                    "swap": d => { d.y = -d.y; },
                    "nodeUpdateTransform": ({ x, y, width, height }) => `translate(${x - width / 2},${y - height})`,
                },
                "right": {
                    "nodeLeftX": node => -node.width,
                    "nodeRightX": node => 0,
                    "nodeTopY": node => - node.height / 2,
                    "nodeBottomY": node => node.height / 2,
                    "nodeJoinX": node => node.x - node.width - node.width,
                    "nodeJoinY": node => node.y - node.height / 2,
                    "linkJoinX": node => node.x - node.width,
                    "linkJoinY": node => node.y,
                    "linkX": node => node.x,
                    "linkY": node => node.y,
                    "linkParentX": node => node.parent.x - node.parent.width,
                    "linkParentY": node => node.parent.y,
                    "buttonX": node => 0,
                    "buttonY": node => node.height / 2,
                    "centerTransform": ({ root, rootMargin, centerY, scale, centerX, chartWidth }) => `translate(${chartWidth - rootMargin},${centerY}) scale(${scale})`,
                    "nodeFlexSize": ({ height, width, siblingsMargin, childrenMargin }) => [height + siblingsMargin, width + childrenMargin],
                    "zoomTransform": ({ centerY, scale }) => `translate(${0},${centerY}) scale(${scale})`,
                    "diagonal": this.hdiagonal.bind(this),
                    "swap": d => { const x = d.x; d.x = -d.y; d.y = x; },
                    "nodeUpdateTransform": ({ x, y, width, height }) => `translate(${x - width},${y - height / 2})`,
                },
            }
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
                    if (d.id) { return d.id; }
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
    getNodeChildren({ data, children, _children }, nodeStore) {
        // Store current node ID
        nodeStore.push(data);

        // Loop over children and recursively store descendants id (expanded nodes)
        if (children) {
            children.forEach((d) => {
                this.getNodeChildren(d, nodeStore);
            });
        }

        // Loop over _children and recursively store descendants id (collapsed nodes)
        if (_children) {
            _children.forEach((d) => {
                this.getNodeChildren(d, nodeStore);
            });
        }

        // Return result
        return nodeStore;
    }

    // This method can be invoked via chart.setZoomFactor API, it zooms to particulat scale
    setZoomFactor(zoomLevel) {
        const attrs = this.getChartState();
        const calc = attrs.calc;

        // Store passed zoom level
        attrs.initialZoom = zoomLevel;

        return attrs.layoutBindings[attrs.layout].zoomTransform({
            centerX: calc.centerX,
            centerY: calc.centerY,
            scale: attrs.initialZoom,
        });

    }

    render() {
        //InnerFunctions which will update visuals
        const attrs = this.getChartState();

        //Drawing containers
        const container = d3.select(attrs.container);
        const containerRect = container.node().getBoundingClientRect();
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

        //Calculated properties
        const calc = {
            id: `ID${Math.floor(Math.random() * 1000000)}`, // id for event handlings,
            chartWidth: attrs.svgWidth,
            chartHeight: attrs.svgHeight
        };
        attrs.calc = calc;

        // Calculate max node depth (it's needed for layout heights calculation)
        calc.centerX = calc.chartWidth / 2;
        calc.centerY = calc.chartHeight / 2;

        // ******************* BEHAVIORS  **********************
        if (attrs.firstDraw) {
            const behaviors = {
                zoom: null
            };

            // Get zooming function
            behaviors.zoom = d3.zoom().on("zoom", (event, d) => this.zoomed(event, d));
            attrs.zoomBehavior = behaviors.zoom;
        }

        //****************** ROOT node work ************************
        attrs.flexTreeLayout = flextree({
            nodeSize: node => {
                const width = attrs.nodeWidth(node);
                const height = attrs.nodeHeight(node);
                const siblingsMargin = attrs.siblingsMargin(node)
                const childrenMargin = attrs.childrenMargin(node);
                return attrs.layoutBindings[attrs.layout].nodeFlexSize({
                    width,
                    height,
                    siblingsMargin,
                    childrenMargin
                });
            }
        });

        this.setLayouts({ expandNodesFirst: false });

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

        if (attrs.firstDraw) {
            svg.call(attrs.zoomBehavior)
                .on("dblclick.zoom", null)
                .attr("cursor", "move")
        }


        attrs.svg = svg;

        //Add container g element
        const chart = svg
            .patternify({
                tag: "g",
                selector: "chart"
            })



        // Add one more container g element, for better positioning controls
        attrs.centerG = chart
            .patternify({
                tag: "g",
                selector: "center-group"
            })

        if (attrs.firstDraw) {
            attrs.centerG.attr("transform", () => {
                return attrs.layoutBindings[attrs.layout].centerTransform({
                    centerX: calc.centerX,
                    centerY: calc.centerY,
                    scale: attrs.initialZoom,
                    rootMargin: attrs.rootMargin,
                    root: attrs.root,
                    chartHeight: calc.chartHeight,
                    chartWidth: calc.chartWidth
                })
            });
        }


        attrs.centerG.patternify({ tag: 'circle', selector: 'center-circle' })
            .attr('r', 10)

        attrs.chart = chart;

        // Display tree contenrs
        this.update(attrs.root);


        //#########################################  UTIL FUNCS ##################################
        // This function restyles foreign object elements ()

        d3.select(window).on(`resize.${attrs.id}`, () => {
            const containerRect = d3.select(attrs.container).node().getBoundingClientRect();
            attrs.svg.attr('width', containerRect.width)
        });

        if (attrs.firstDraw) {
            attrs.firstDraw = false;
        }

        return this;
    }

    // This function can be invoked via chart.addNode API, and it adds node in tree at runtime
    addNode(obj) {
        const attrs = this.getChartState();
        const found = attrs.allNodes.filter(({ data }) => attrs.nodeId(data) === attrs.nodeId(obj))[0];
        if (!found) {
            attrs.data.push(obj);
            // Update state of nodes and redraw graph
            this.updateNodesState();
        } else {
            console.error(`Node with id "${attrs.nodeId(obj)}" already exists in tree`)
        }

        return this;
    }

    // This function can be invoked via chart.removeNode API, and it removes node from tree at runtime
    removeNode(nodeId) {
        const attrs = this.getChartState();
        const node = attrs.allNodes.filter(({ data }) => attrs.nodeId(data) == nodeId)[0];

        // Remove all node childs
        if (node) {
            // Retrieve all children nodes ids (including current node itself)
            node.descendants()
                .forEach(d => d.data._filteredOut = true)

            const descendants = this.getNodeChildren(node, [], attrs.nodeId);
            descendants.forEach(d => d._filtered = true)

            // Filter out retrieved nodes and reassign data
            attrs.data = attrs.data.filter(d => !d._filtered);

            const updateNodesState = this.updateNodesState.bind(this);
            // Update state of nodes and redraw graph
            updateNodesState();
        }
    }

    // This function basically redraws visible graph, based on nodes state
    update({ x0, y0, x, y, width, height }) {
        const attrs = this.getChartState();
        const calc = attrs.calc;

        //  Assigns the x and y position for the nodes
        const treeData = attrs.flexTreeLayout(attrs.root);

        // Get tree nodes and links and attach some properties
        const nodes = treeData.descendants().map((d) => {
            // If at least one property is already set, then we don't want to reset other properties
            if (d.width) return d;

            const width = attrs.nodeWidth(node)
            const height = attrs.nodeHeight(node)

            // Extend node object with calculated properties
            return Object.assign(d, {
                width,
                height,
            });
        });

        // Get all links
        const links = treeData.descendants().slice(1);

        nodes.forEach(attrs.layoutBindings[attrs.layout].swap)

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
                const xo = attrs.layoutBindings[attrs.layout].linkJoinX({ x: x0, y: y0, width, height });
                const yo = attrs.layoutBindings[attrs.layout].linkJoinY({ x: x0, y: y0, width, height });
                const o = { x: xo, y: yo };
                return attrs.layoutBindings[attrs.layout].diagonal(o, o);
            });

        // Get links update selection
        const linkUpdate = linkEnter.merge(linkSelection);

        // Styling links
        linkUpdate
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", ({ data }) => {
                return "#767b9b";
            })

        // Allow external modifications
        linkUpdate.each(attrs.linkUpdate);

        // Transition back to the parent element position
        linkUpdate
            .transition()
            .duration(attrs.duration)
            .attr("d", (d) => {
                const n = {
                    x: attrs.layoutBindings[attrs.layout].linkX(d),
                    y: attrs.layoutBindings[attrs.layout].linkY(d)
                };
                const p = {
                    x: attrs.layoutBindings[attrs.layout].linkParentX(d),
                    y: attrs.layoutBindings[attrs.layout].linkParentY(d),
                };
                return attrs.layoutBindings[attrs.layout].diagonal(n, p);
            });

        // Remove any  links which is exiting after animation
        const linkExit = linkSelection
            .exit()
            .transition()
            .duration(attrs.duration)
            .attr("d", (d) => {
                const xo = attrs.layoutBindings[attrs.layout].linkJoinX({ x, y, width, height });
                const yo = attrs.layoutBindings[attrs.layout].linkJoinY({ x, y, width, height });
                const o = { x: xo, y: yo };
                return attrs.layoutBindings[attrs.layout].diagonal(o, o);
            })
            .remove();

        // --------------------------  NODES ----------------------
        // Get nodes selection
        const nodesSelection = attrs.centerG
            .selectAll("g.node")
            .data(nodes, ({ data }) => attrs.nodeId(data));

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = nodesSelection
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", (d) => {
                if (d == attrs.root) return `translate(${x0},${y0})`
                const xj = attrs.layoutBindings[attrs.layout].nodeJoinX({ x: x0, y: y0, width, height });
                const yj = attrs.layoutBindings[attrs.layout].nodeJoinY({ x: x0, y: y0, width, height });
                return `translate(${xj},${yj})`
            })
            .attr("cursor", "pointer")
            .on("click", (event, { data }) => {
                if ([...event.srcElement.classList].includes("node-button-circle")) {
                    return;
                }
                attrs.onNodeClick(attrs.nodeId(data));
            });

        // Add background rectangle for the nodes
        nodeEnter
            .patternify({
                tag: "rect",
                selector: "node-rect",
                data: (d) => [d]
            })

        // Node update styles
        const nodeUpdate = nodeEnter
            .merge(nodesSelection)
            .style("font", "12px sans-serif");

        nodeUpdate.each(attrs.nodeUpdate);

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

        // Add expand collapse button content
        const nodeFo = nodeButtonGroups
            .patternify({
                tag: "foreignObject",
                selector: "node-button-foreign-object",
                data: (d) => [d]
            })
            .attr('width', 20)
            .attr('height', 20)
            .attr('x', -10)
            .attr('y', -10)
            .patternify({
                tag: "xhtml:div",
                selector: "node-button-div",
                data: (d) => [d]
            })
            .style('display', 'flex')
            .style('width', '100%')
            .style('height', '100%')



        // Transition to the proper position for the node
        nodeUpdate
            .transition()
            .attr("opacity", 0)
            .duration(attrs.duration)
            .attr("transform", ({ x, y, width, height }) => {
                return attrs.layoutBindings[attrs.layout].nodeUpdateTransform({ x, y, width, height });

            })
            .attr("opacity", 1);

        // Style node rectangles
        nodeUpdate
            .select(".node-rect")
            .attr("width", ({ width }) => width)
            .attr("height", ({ height }) => height)
            .attr("x", ({ width }) => 0)
            .attr("y", ({ height }) => 0)
            .attr("cursor", "pointer")
            .attr("fill", attrs.nodeDefaultBackground)
            .attr("stroke", 'black')
            .attr("stroke-width", 0.1)
            .attr('rx', 3)

        // Move node button group to the desired position
        nodeUpdate
            .select(".node-button-g")
            .attr("transform", ({ data, width, height }) => {
                const x = attrs.layoutBindings[attrs.layout].buttonX({ width, height });
                const y = attrs.layoutBindings[attrs.layout].buttonY({ width, height });
                return `translate(${x},${y})`
            })
            .attr("opacity", ({ children, _children }) => {
                if (children || _children) {
                    return 1;
                }
                return 0;
            });

        // Restyle node button circle
        nodeUpdate
            .select(".node-button-foreign-object .node-button-div")
            .html(({ children }) => {
                return attrs.buttonContent({ children, layout: attrs.layout, icons: attrs.icons })
            })

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
            .attr("transform", (d) => {
                const ex = attrs.layoutBindings[attrs.layout].nodeJoinX({ x, y, width, height });
                const ey = attrs.layoutBindings[attrs.layout].nodeJoinY({ x, y, width, height });
                return `translate(${ex},${ey})`
            })
            .on("end", function () {
                d3.select(this).remove();
            })
            .attr("opacity", 0);

        // Store the old positions for transition.
        nodes.forEach((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });


        // CHECK FOR CENTERING
        const centeredNode = attrs.allNodes.filter(d => d.data._centered)[0]
        if (centeredNode) {
            centeredNode.data._centered = null;
            this.fit({
                animate: true,
                scale: false,
                node: centeredNode
            })
        }

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
            .attr("x", ({ width }) => 0)
            .attr("y", ({ height }) => 0);
        attrs.svg
            .selectAll(".node-foreign-object-div")
            .style("width", ({ width }) => `${width}px`)
            .style("height", ({ height }) => `${height}px`)
            .html(attrs.nodeContent);
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
    setExpanded(id, expandedFlag = true) {

        const attrs = this.getChartState();
        // Retrieve node by node Id
        const node = attrs.allNodes.filter(({ data }) => attrs.nodeId(data) == id)[0];

        // If node exists, set expansion flag
        if (node) node.data.expanded = expandedFlag;

        return this;


        // // First expand all nodes
        // [attrs.root].forEach((d) => this.expand(d));

        // // Expand root's chilren in case they are collapsed
        // if (attrs.root._children) {
        //     attrs.root._children.forEach((d) => this.expand(d));
        // }

        // // Then collapse all nodes
        // attrs.root.children.forEach((d) => this.collapse(d));

        // // Then expand only the nodes, which were previously expanded, or have an expand flag set
        // attrs.root.children.forEach((d) => this.expandSomeNodes(d));

        // // Redraw graph
        // this.update(attrs.root);
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

        this.setLayouts({ expandNodesFirst: true });

        // Redraw Graphs
        this.update(attrs.root);
    }

    setLayouts({ expandNodesFirst = true }) {
        const attrs = this.getChartState();
        // Store new root by converting flat data to hierarchy
        attrs.root = d3
            .stratify()
            .id((d) => attrs.nodeId(d))
            .parentId(d => attrs.parentNodeId(d))(attrs.data);

        attrs.root.each((node, i, arr) => {
            let width = attrs.nodeWidth(node);
            let height = attrs.nodeHeight(node);
            Object.assign(node, { width, height })
        })

        attrs.flexTreeLayout(attrs.root);

        // Store positions, where children appear during their enter animation
        attrs.root.x0 = 0;
        attrs.root.y0 = 0;


        attrs.allNodes = attrs.root.descendants();

        // Store direct and total descendants count
        attrs.allNodes.forEach((d) => {
            Object.assign(d.data, {
                _directSubordinates: d.children ? d.children.length : 0,
                _totalSubordinates: d.descendants().length - 1
            });
        });

        if (expandNodesFirst) {
            // Expand all nodes first
            attrs.root.children.forEach(this.expand);
        }



        // Then collapse them all
        attrs.root.children.forEach((d) => this.collapse(d));

        // Then only expand nodes, which have expanded proprty set to true
        attrs.root.children.forEach((ch) => this.expandSomeNodes(ch));

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

    zoomTreeBounds({ x0, x1, y0, y1, params = { animate: true, scale: true } }) {
        console.log({ params })
        const { centerG, svgWidth: w, svgHeight: h, svg, zoomBehavior, duration,lastTransform } = this.getChartState()
        let scaleVal = Math.min(8, 0.9 / Math.max((x1 - x0) / w, (y1 - y0) / h));
        let identity = d3.zoomIdentity.translate(w / 2, h / 2)
        identity = identity.scale(params.scale ? scaleVal : lastTransform.k)

        identity = identity.translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
        // Transition zoom wrapper component into specified bounds
        svg.transition().duration(params.animate ? duration : 0).call(zoomBehavior.transform, identity);
        centerG.transition().duration(params.animate ? duration : 0).attr('transform', 'translate(0,0)')
    }

    fit({ animate = true, node, scale = true } = {}) {
        const attrs = this.getChartState();
        const { root } = attrs;
        const descendants = node ? [node] : root.descendants();
        console.log({ descendants })
        const minX = d3.min(descendants, d => d.x + attrs.layoutBindings[attrs.layout].nodeLeftX(d))
        const maxX = d3.max(descendants, d => d.x + attrs.layoutBindings[attrs.layout].nodeRightX(d))
        const minY = d3.min(descendants, d => d.y + attrs.layoutBindings[attrs.layout].nodeTopY(d))
        const maxY = d3.max(descendants, d => d.y + attrs.layoutBindings[attrs.layout].nodeBottomY(d))

        this.zoomTreeBounds({
            params: { animate: animate, scale },
            x0: minX - 0,
            x1: maxX + 0,
            y0: minY - 0,
            y1: maxY + 0,
        });
    }

    setCentered(nodeId) {
        const attrs = this.getChartState();
        // this.setExpanded(nodeId)
        const node = attrs.allNodes.filter(d => attrs.nodeId(d.data) === nodeId)[0];
        node.data._centered = true;
        node.data.expanded = true;
        return this;
        // this.fit({
        //     animate: true,
        //     scale: false,
        //     node,
        // })
        // this.update(attrs.root);
    }


}