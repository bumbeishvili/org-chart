d3 = require('d3');

class TreeChart {
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
            container: 'body',
            defaultTextFill: '#2C3E50',
            nodeTextFill: 'white',
            defaultFont: 'Helvetica',
            backgroundColor: '#fafafa',
            data: null,
            depth: 180,
            duration: 600,
            strokeWidth: 3,
            dropShadowId: null,
			initialZoom: 1,
			//template render
			replaceData:{
				NAME:'name',
				OFFICE_POSITION:'officePosition',
				SUB_TITLE_OFFICE_POSITION:'subTitleOfficePosition',
				DEPARTMENT:'department',
				LOCATION:'location'
			},
			template:"<div><div style=\"margin-left:70px;margin-top:10px;font-size:20px;font-weight:bold; \">{NAME}</div><div style=\"margin-left:70px;margin-top:3px;font-size:16px; \">{OFFICE_POSITION}</div><div style=\"margin-left:70px;margin-top:3px;font-size:14px; \">{SUB_TITLE_OFFICE_POSITION}</div><div style=\"margin-left:196px; margin-top:15px; font-size:13px; position:absolute; bottom:5px;\"><div>{DEPARTMENT}</div><div style=\"margin-top:5px\">{LOCATION}</div></div></div>",
            //default params for node
            defaultNode: {
                width: 350,
                height: 150,
                borderWidth: 1,
                borderRadius: 15,
                borderColor: {
                    red: 15,
                    green: 140,
                    blue: 121,
                    alpha: 1
                },
                backgroundColor: {
                    red: 51,
                    green: 182,
                    blue: 208,
                    alpha: 1
                },
                nodeImage: {
					url: 'data:image/png;base64, /9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAZAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgAjABkAwERAAIRAQMRAf/EAG0AAQACAgMBAQAAAAAAAAAAAAAJCgYIAwQHAgUBAQAAAAAAAAAAAAAAAAAAAAAQAAEEAgEDBAEEAgIDAAAAAAIAAQMEBQYHESESExQVCAkxIhYXQTJxIzMkNBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Av8ICAgICAgICAgICAgICAgICAg+SIQEjMhAAFyIidhERFupERP0YRFm6u7/og69S/RvgUtG5UuxgfgclSxDZAD6MXgRwmYifiTP0fv0dB2kBAQEBAQEBAQEEQv2r/I++t5PJcf8A1+PH5DJUJZqOa5Jtww5HG1LkJyRT1NSx84SUcqdeQej37DS1SdnaKKUXGZBD/unJPIPI148lve6bNttwjIxkz+Zv5KOByd38KdaxOdalCPX9scIBGLdmZmQYxjMrlMLciyGHyV/E34H6w3sZcsULkL9WLrFZqyRTRv5Cz9ibuyCQj68/kW5V4zyFHDcpXMhyloZnDBZmyMwT7xhYG6RnbxedsmB5sowdzKtkZDeZxYQsQdSJwnt0feNV5I1XDbrpWZq57W89VG3jsjUJ/Eh6uEtexEbDNUvVJhKKeCURlhlEgMWJnZBliAgICAgICCNL8jv2QucX6LS4o1K5JU3Hkqhaky1+ubx2cJo4ySUbhQGJCcVzZLQyVIjHr4QQ2f8AU/TJgr+ICAgIJFPx3fYu7xdyjU4wz18v4ByfkYcfHBPI/t8Hu9kYqmDy1di8hiHMnHHj7TN4sfnBIZdK7M4WHEBAQEBAQEFXL7n79Y5E+y/KuUkm9Wlg9js6ViQEhOCLH6aT6+71iFyYoLt+lPa6s7sRWHduzszBq4gICAg5a889WeG1Wlkgs1pY5688JlHLDPCYyRSxSC7EEkcgs4u3dnZBbm4h3X+xuLOO97IhebbNN13OXBBhEYsjfxdabJ12EGYBetkCljdh7M49uyD0VAQEBAQEFQTkozl5G3+SQykkk3XajkkMnMzM87fIjMidyIiJ+ru/d3QYUgICAgILQH0blkl+qXDZSyHITYPLRMUhkZNHDtOehhjZyd3YIoYxEW/QRFmbsyDbBAQEBAQEFSrn3ASatzhy9r5xvGOL5J3OvXF/P91J9gvy4+VvUOSTxnoyRm3kRP0Lu7ug8kQEBAQEFq76o6+WsfW3hTFSRtFK/HuvZWaJh8Hjn2GoOwThIPiLtMMuUdj6t18+vXr+qDYJAQEBAQEFcz8kuhSah9lMpn44vDHci69gtprkH/iG7Uq/xrKwt/lpns4RrBt3/wDpZ/8APRg0CQEBAQZZoepX993bUdIxYk+Q23ZMLrtRxBz9KXL5CvRawbCz9IazTvIZP2EBd36Mzugt80KNXF0KWNoxDBSx1StRpwD18YatSEK9eIeru/jHFGzN/wAIO2gICAgICCOf8lHC1nkbhipvmEpna2LiW5bzM8cIFJPY03KRQQ7QIADfufGnTq3yIn6RVqs/RupIK86AgICCUb8YfCE+1ck5TmbL0y/j3HUM+M1+SaJ3gv7pmaRwSlCRsUUv8fwVo5JG/wBo57lYxfqyCepAQEBAQEBBw2K8FuCeraghs1bMMlezWsRhNBYgmAo5oJ4ZBKOWGWMnEhJnEhd2duiCs394+B8DwHzZLgtS9YNT2zA1d0wdCbyNsGGQyeWx13AxWSZnsV6F3FGcHXqYVpogMjMXMg05QEGW6DqN7kDedO0bGm0V/cNnwWs1ZyApI602bydbHDamEO/oVfcepI/ZmAXd3Zm6oLYvGHGuqcQ6Nr/Hul0ipYHXqnt4HmIJLt6zKZT3spkpwjiGzkslbkOaY2ERcy6CIgwiwZ8gICAgICAgIK9f5PtwxuxfYbHYLGzQzno+h4bCZcoy83hzN/IZfYJapkzuHWDGZWo7s3cTMmfu3RgjjQEHrHA+14vReauKtwzZvFhdc3/Vcrl52/Wti6uZqHftszCTm9Sp5yePbz8fHq3XqwW1YpY5o45oZAlhlAJYpYjGSOSOQWIJIzF3EwMXZ2dndnZ0H2gICAgICDgtWq1KtPcu2IKlSrDJYtWrU0detWghFzlnnnlIIoYYgF3IidhFm6u6CKn7VfkZ13VqmS0XgK/V2XbJGkp3+QIgit6xr3Xyjl/jzyMcGyZYW/0nZix8TuxMVh+oCEHeVymSzmTyOazN61lMvl71rJZTJXp5LN3IZC9Odm5dt2JSKWezZsSkZmTu5ETu6DoICAgkl+o337z/AA7HjuPuVCyG18ZQjFTxOSj62tj0mAegRQ1PUMSy+uwD29oRetXBm9uXiLQEE8OmbxqHImAp7Ro+x4naMBfFir5PEW47UPn4iR17Ai7TU7kPkzSQTDHNEXYxF+yDKkBAQa985/Z/iD6+UQk33YHkzlmD3GN03AhDk9syMLkQhPHjSs1oaFOQgJhsXJq1cyAhEyIXFBFJyT+VHk/NS2anGGma5pONLyjgyeeebati6N5MNmMHfHYKmZ9WJ4jrXBF26eZN3cNDuSOf+Z+XXIeReR9m2SoUgzfES3Bx+vDMPXxmi1vERY/AQzD17EFYSZu3VB4+gICAgICDNNI5H33jXKfM6BuGw6hki8GmsYHK28e1uOMvMIL8EEg1sjVYu7xThJG/+RdBu3o/5NPsdrD14dlLUOQqcbiM5Z3AhicqcLO3aC/q82GqRz+LdPUlq2OrO7kJF3Qb88Q/k24b3m1Uw/IeJynFWWtGEIZC7YHYNQKY3YAabN06tS/jmkkfuVikFaIe5zszO6CRX5rDfD/yH5bGfAfH/LfOe/q/D/Fe3918n8n6vsvj/a/9nrefp+n+7r07oKfmx7HntvzmT2baMvfz2fzNo7uUy+TsyW712zIzM8k08ruTsICwgLdBABYRZhZmYPxUBAQEBAQEBAQEBB6P/b3JX9a/1B/MMx/XHzHzn8W9dvY++6+p6fqeHuvjvdf+z7P1Pae7/wC/0/W/eg84QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQf/Z',
                    cornerShape: "ROUNDED",
                    width: 100,
                    height: 100,
                    centerTopDistance: 0,
                    centerLeftDistance: 0,
                    shadow: true,
                    borderWidth: 0,
                },
                nodeIcon: {
                    icon: "data:image/png;base64, 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",
                    size: 30
                },
                connectorLineColor: {
                    red: 220,
                    green: 189,
                    blue: 207,
                    alpha: 1
				},
				
                connectorLineWidth: 5,
                dashArray: "",
                expanded: false,
            },
            onNodeClick: d => d,
            //add context Menu, return id
            onNodeLeftClick: d => d
        };

        this.getChartState = () => attrs;

        // Dynamically set getter and setter functions for Chart class
        Object.keys(attrs).forEach((key) => {
            //@ts-ignore
            this[key] = function (_) {
                var string = `attrs['${key}'] = _`;
                if (!arguments.length) {
                    return eval(`attrs['${key}'];`);
                }
                eval(string);
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
            var selection = container.selectAll('.' + selector).data(data, (d, i) => {
                if (typeof d === 'object') {
                    if (d.id) {
                        return d.id;
                    }
                }
                return i;
            });
            selection.exit().remove();
            selection = selection.enter().append(elementTag).merge(selection);
            selection.attr('class', selector);
            return selection;
        };
    }

    // This method retrieves passed node's children IDs (including node)      
    getNodeChildrenIds({
        data,
        children,
        _children
    }, nodeIdsStore) {

        // Store current node ID
        nodeIdsStore.push(data.nodeId);

        // Loop over children and recursively store descendants id (expanded nodes)
        if (children) {
            children.forEach(d => {
                this.getNodeChildrenIds(d, nodeIdsStore)
            })
        }

        // Loop over _children and recursively store descendants id (collapsed nodes)
        if (_children) {
            _children.forEach(d => {
                this.getNodeChildrenIds(d, nodeIdsStore)
            })
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

        // Rescale container element accordingly
        attrs.centerG.attr('transform', ` translate(${calc.centerX}, ${calc.nodeMaxHeight / 2}) scale(${attrs.initialZoom})`)
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
        calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
        attrs.calc = calc;

        // Get maximum node width and height
        calc.nodeMaxWidth = d3.max(attrs.data, ({
            width
        }) => width);
        calc.nodeMaxHeight = d3.max(attrs.data, ({
            height
        }) => height);

        // Calculate max node depth (it's needed for layout heights calculation)
        attrs.depth = calc.nodeMaxHeight + 100;
        calc.centerX = calc.chartWidth / 2;

        //********************  LAYOUTS  ***********************
        const layouts = {
            treemap: null
        }
        attrs.layouts = layouts;

        // Generate tree layout function
        layouts.treemap = d3.tree().size([calc.chartWidth, calc.chartHeight])
            .nodeSize([calc.nodeMaxWidth + 100, calc.nodeMaxHeight + attrs.depth])

        // ******************* BEHAVIORS . **********************
        const behaviors = {
            zoom: null
        }

        // Get zooming function 
        behaviors.zoom = d3.zoom().on("zoom", d => this.zoomed(d))

        //****************** ROOT node work ************************

        // Convert flat data to hierarchical
        attrs.root = d3.stratify()
            .id(({
                nodeId
            }) => nodeId)
            .parentId(({
                parentNodeId
            }) => parentNodeId)
            (attrs.data)

        // Set child nodes enter appearance positions
        attrs.root.x0 = 0;
        attrs.root.y0 = 0;

        /** Get all nodes as array (with extended parent & children properties set)
            This way we can access any node's parent directly using node.parent - pretty cool, huh?
        */
        attrs.allNodes = attrs.layouts.treemap(attrs.root).descendants()

        // Assign direct children and total subordinate children's cound
        attrs.allNodes.forEach(d => {
            Object.assign(d.data, {
                directSubordinates: d.children ? d.children.length : 0,
                totalSubordinates: d.descendants().length - 1
            })
        })

        // Collapse all children at first
        //fix if dont have children nodes
        if(attrs.root.children){
            attrs.root.children.forEach(d => this.collapse(d));
            // Then expand some nodes, which have `expanded` property set
            attrs.root.children.forEach(d => this.expandSomeNodes(d));
        }

        // *************************  DRAWING **************************
        //Add svg
        const svg = container
            .patternify({
                tag: 'svg',
                selector: 'svg-chart-container'
            })
            .attr('width', attrs.svgWidth)
            .attr('height', attrs.svgHeight)
            .attr('font-family', attrs.defaultFont)
            .call(behaviors.zoom)
            .attr('cursor', 'move')
            .style('background-color', attrs.backgroundColor);
        attrs.svg = svg;

        //Add container g element
        const chart = svg
            .patternify({
                tag: 'g',
                selector: 'chart'
            })
            .attr('transform', `translate(${calc.chartLeftMargin},${calc.chartTopMargin})`);

        // Add one more container g element, for better positioning controls
        attrs.centerG = chart.patternify({
            tag: 'g',
            selector: 'center-group'
        })
            .attr('transform', `translate(${calc.centerX},${calc.nodeMaxHeight / 2}) scale(${attrs.initialZoom})`);

        attrs.chart = chart;

        // ************************** ROUNDED AND SHADOW IMAGE  WORK USING SVG FILTERS **********************

        //Adding defs element for rounded image
        attrs.defs = svg.patternify({
            tag: 'defs',
            selector: 'image-defs'
        });

        // Adding defs element for image's shadow
        const filterDefs = svg.patternify({
            tag: 'defs',
            selector: 'filter-defs'
        });

        // Adding shadow element - (play with svg filter here - https://bit.ly/2HwnfyL)
        const filter = filterDefs.patternify({
            tag: 'filter',
            selector: 'shadow-filter-element'
        })
            .attr('id', attrs.dropShadowId)
            .attr('y', `${-50}%`)
            .attr('x', `${-50}%`)
            .attr('height', `${200}%`)
            .attr('width', `${200}%`);

        // Add gaussian blur element for shadows - we can control shadow length with this
        filter.patternify({
            tag: 'feGaussianBlur',
            selector: 'feGaussianBlur-element'
        })
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 3.1)
            .attr('result', 'blur');

        // Add fe-offset element for shadows -  we can control shadow positions with it
        filter.patternify({
            tag: 'feOffset',
            selector: 'feOffset-element'
        })
            .attr('in', 'blur')
            .attr('result', 'offsetBlur')
            .attr("dx", 4.28)
            .attr("dy", 4.48)
            .attr("x", 8)
            .attr("y", 8)

        // Add fe-flood element for shadows - we can control shadow color and opacity with this element
        filter.patternify({
            tag: 'feFlood',
            selector: 'feFlood-element'
        })
            .attr("in", "offsetBlur")
            .attr("flood-color", 'black')
            .attr("flood-opacity", 0.3)
            .attr("result", "offsetColor");

        // Add feComposite element for shadows
        filter.patternify({
            tag: 'feComposite',
            selector: 'feComposite-element'
        })
            .attr("in", "offsetColor")
            .attr("in2", "offsetBlur")
            .attr("operator", "in")
            .attr("result", "offsetBlur");

        // Add feMerge element for shadows
        const feMerge = filter.patternify({
            tag: 'feMerge',
            selector: 'feMerge-element'
        });

        // Add feMergeNode element for shadows
        feMerge.patternify({
            tag: 'feMergeNode',
            selector: 'feMergeNode-blur'
        })
            .attr('in', 'offsetBlur')

        // Add another feMergeNode element for shadows
        feMerge.patternify({
            tag: 'feMergeNode',
            selector: 'feMergeNode-graphic'
        })
            .attr('in', 'SourceGraphic')

        // Display tree contenrs
        this.update(attrs.root)



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
        if (typeof DOM != 'undefined') {
            //@ts-ignore
            id = DOM.uid(d.id).id;
        }

        // Extend passed object with drop shadow ID
        Object.assign(d, {
            dropShadowId: id
        })
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
        const node = attrs.allNodes.filter(({
            data
        }) => data.nodeId == nodeId)[0];


        // Remove all node childs
        if (node) {
            // Retrieve all children nodes ids (including current node itself)
            const nodeChildrenIds = this.getNodeChildrenIds(node, []);

            // Filter out retrieved nodes and reassign data
            attrs.data = attrs.data.filter(d => !nodeChildrenIds.includes(d.nodeId))

            const updateNodesState = this.updateNodesState.bind(this);
            // Update state of nodes and redraw graph
            updateNodesState();
        }
    }

    // This function basically redraws visible graph, based on nodes state
    update({
        x0,
        y0,
        x,
        y
    }) {

        const attrs = this.getChartState();
        const calc = attrs.calc;

        //  Assigns the x and y position for the nodes
        const treeData = attrs.layouts.treemap(attrs.root);

        // Get tree nodes and links and attach some properties 
        const nodes = treeData.descendants()
            .map(d => {
                // If at least one property is already set, then we don't want to reset other properties
                if (d.width) return d;

                // Declare properties with deffault values
                let imageWidth = 100;
                let imageHeight = 100;
                let imageBorderColor = 'steelblue';
                let imageBorderWidth = 0;
                let imageRx = 0;
                let imageCenterTopDistance = 0;
                let imageCenterLeftDistance = 0;
                let borderColor = 'steelblue';
                let backgroundColor = 'steelblue';
                let width = (d.data.width || attrs.defaultNode.width);
                let height = (d.data.height || attrs.defaultNode.height);
                let dropShadowId = `none`;

                // Override default values based on data
                if (d.data.nodeImage && d.data.nodeImage.shadow) {
                    dropShadowId = `url(#${attrs.dropShadowId})`
                }
                if (d.data.nodeImage && d.data.nodeImage.width) {
                    imageWidth = d.data.nodeImage.width
                };
                if (d.data.nodeImage && d.data.nodeImage.height) {
                    imageHeight = d.data.nodeImage.height
                };
                if (d.data.nodeImage && d.data.nodeImage.borderColor) {
                    imageBorderColor = this.rgbaObjToColor(d.data.nodeImage.borderColor)
                };
                if (d.data.nodeImage && d.data.nodeImage.borderWidth) {
                    imageBorderWidth = d.data.nodeImage.borderWidth
                };
                if (d.data.nodeImage && d.data.nodeImage.centerTopDistance) {
                    imageCenterTopDistance = d.data.nodeImage.centerTopDistance
                };
                if (d.data.nodeImage && d.data.nodeImage.centerLeftDistance) {
                    imageCenterLeftDistance = d.data.nodeImage.centerLeftDistance
                };
                if (d.data.borderColor) {
                    borderColor = this.rgbaObjToColor(d.data.borderColor);
                }
                if (d.data.backgroundColor) {
                    backgroundColor = this.rgbaObjToColor(d.data.backgroundColor);
                }
                if (d.data.nodeImage && d.data.nodeImage.cornerShape &&
                    d.data.nodeImage.cornerShape.toLowerCase() == "circle") {
                    imageRx = Math.max(imageWidth, imageHeight);
                }
                else if (d.data.nodeImage && d.data.nodeImage.cornerShape &&
                    d.data.nodeImage.cornerShape.toLowerCase() == "rounded") {
                    imageRx = Math.min(imageWidth, imageHeight) / 6;
                }else{
                    imageRx = Math.min(imageWidth, imageHeight) / 6;
                }

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
        nodes.forEach(d => d.y = d.depth * attrs.depth);

        // ------------------- FILTERS ---------------------

        // Add patterns for each node (it's needed for rounded image implementation)
        const patternsSelection = attrs.defs.selectAll('.pattern')
            .data(nodes, ({
                id
            }) => id);

        // Define patterns enter selection
        const patternEnterSelection = patternsSelection.enter().append('pattern')

        // Patters update selection
        const patterns = patternEnterSelection
            .merge(patternsSelection)
            .attr('class', 'pattern')
            .attr('height', 1)
            .attr('width', 1)
            .attr('id', ({
                id
            }) => id)

        // Add images to patterns
        const patternImages = patterns.patternify({
            tag: 'image',
            selector: 'pattern-image',
            data: d => [d]
        })
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', ({
                imageWidth
            }) => imageWidth)
            .attr('width', ({
                imageHeight
            }) => imageHeight)
            .attr('xlink:href', ({
				data
            }) => ((data.nodeImage && data.nodeImage.url) || data.nodeImageUrl || attrs.defaultNode.nodeImage.url))
            .attr('viewbox', ({
                imageWidth,
                imageHeight
            }) => `0 0 ${imageWidth * 2} ${imageHeight}`)
            .attr('preserveAspectRatio', 'xMidYMin slice')

        // Remove patterns exit selection after animation
        patternsSelection.exit().transition().duration(attrs.duration).remove();

        // --------------------------  LINKS ----------------------
        // Get links selection
        const linkSelection = attrs.centerG.selectAll('path.link')
            .data(links, ({
                id
            }) => id);

        // Enter any new links at the parent's previous position.
        const linkEnter = linkSelection.enter()
            .insert('path', "g")
            .attr("class", "link")
            .attr('d', d => {
                const o = {
                    x: x0,
                    y: y0
                };
                return this.diagonal(o, o)
            });

        // Get links update selection
        const linkUpdate = linkEnter.merge(linkSelection);

        // Styling links
        linkUpdate
            .attr("fill", "none")
            .attr("stroke-width", ({
                data
            }) => data.connectorLineWidth || 2)
            .attr('stroke', ({
                data
            }) => {
                if (data.connectorLineColor) {
                    return this.rgbaObjToColor(data.connectorLineColor);
                }
                return 'green';
            })
            .attr('stroke-dasharray', ({
                data
            }) => {
                if (data.dashArray) {
                    return data.dashArray;
                }
                return '';
            })

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(attrs.duration)
            .attr('d', d => this.diagonal(d, d.parent));

        // Remove any  links which is exiting after animation
        const linkExit = linkSelection.exit().transition()
            .duration(attrs.duration)
            .attr('d', d => {
                const o = {
                    x: x,
                    y: y
                };
                return this.diagonal(o, o)
            })
            .remove();

        // --------------------------  NODES ----------------------
        // Get nodes selection
        const nodesSelection = attrs.centerG.selectAll('g.node')
            .data(nodes, ({
                id
            }) => id)
        // Enter any new nodes at the parent's previous position.
        const nodeEnter = nodesSelection.enter().append('g')
            .attr('class', 'node')
            .attr("transform", d => `translate(${x0},${y0})`)
			.attr('cursor', 'pointer')
			//change from array function to normal function becouse var "this"
			.on('click', function(event) {
                if ([...d3.event.srcElement.classList].includes('node-button-circle')) {
                    return;
				}
				//BUG not working on click but in contextmenu work
				d3.selectAll('.node-rect').attr("stroke-width", event.data.borderWidth);
				d3.select(this).select('.node-rect').attr("stroke-width", 5);
				//
				attrs.onNodeClick(event.data.nodeId);
            })
            //add context Menu, return id with position x and y of mouse
            .on('contextmenu', function(event) {
                d3.event.preventDefault();
                if ([...d3.event.srcElement.classList].includes('node-button-circle')) {
                    return;
				}
				let position = d3.mouse(d3.select('body').node());
				d3.selectAll('.node-rect').attr("stroke-width", event.data.borderWidth);
				d3.select(this).select('.node-rect').attr("stroke-width", 5);
                attrs.onNodeLeftClick({
					nodeid:event.data.nodeId,
					x:position[0],
					y:position[1],
				});
            });
        // Add background rectangle for the nodes 
        nodeEnter
            .patternify({
                tag: 'rect',
                selector: 'node-rect',
                data: d => [d]
            })
            .style("fill", ({
                _children
            }) => _children ? "lightsteelblue" : "#fff")



        // Add node icon image inside node
        nodeEnter
            .patternify({
                tag: 'image',
                selector: 'node-icon-image',
                data: d => [d]
            })
            .attr('width', ({
                data
            }) => ((data.nodeIcon && data.nodeIcon.size) || attrs.defaultNode.nodeIcon.size))
            .attr('height', ({
                data
            }) => ((data.nodeIcon && data.nodeIcon.size) || attrs.defaultNode.nodeIcon.size))
            .attr("xlink:href", ({
                data
            }) => (data.nodeIcon && data.nodeIcon.icon) || attrs.defaultNode.nodeIcon.icon)
            .attr('x', ({
                width
            }) => -width / 2 + 5)
            .attr('y', ({
                height,
                data
            }) => height / 2 - ((data.nodeIcon && data.nodeIcon.size) || attrs.defaultNode.nodeIcon.size) - 5)

        // Add total descendants text
        nodeEnter
            .patternify({
                tag: 'text',
                selector: 'node-icon-text-total',
                data: d => [d]
            })
            .text('test')
            .attr('x', ({
                width
            }) => -width / 2 + 7)
            .attr('y', ({
                height,
                data
            }) => height / 2 - ((data.nodeIcon && data.nodeIcon.size) || attrs.defaultNode.nodeIcon.size) - 5)
            .text(({
                data
            }) => `${data.totalSubordinates} Subordinates`)
            .attr('fill', attrs.nodeTextFill)
            .attr('font-weight', 'bold')

        // Add direct descendants text
        nodeEnter
            .patternify({
                tag: 'text',
                selector: 'node-icon-text-direct',
                data: d => [d]
            })
            .text('test')
            .attr('x', ({
                width,
                data
            }) => -width / 2 + 10 + ((data.nodeIcon && data.nodeIcon.size) || attrs.defaultNode.nodeIcon.size))
            .attr('y', ({
                height
            }) => height / 2 - 10)
            .text(({
                data
            }) => `${data.directSubordinates} Direct `)
            .attr('fill', attrs.nodeTextFill)
            .attr('font-weight', 'bold')


        // Defined node images wrapper group
        const nodeImageGroups = nodeEnter.patternify({
            tag: 'g',
            selector: 'node-image-group',
            data: d => [d]
        })

        // Add background rectangle for node image
        nodeImageGroups
            .patternify({
                tag: 'rect',
                selector: 'node-image-rect',
                data: d => [d]
            })



        // Node update styles
        const nodeUpdate = nodeEnter.merge(nodesSelection)
            .style('font', '12px sans-serif');



        // Add foreignObject element inside rectangle
        const fo = nodeUpdate
            .patternify({
                tag: 'foreignObject',
                selector: 'node-foreign-object',
                data: d => [d]
            })


        // Add foreign object 
        fo.patternify({
            tag: 'xhtml:div',
            selector: 'node-foreign-object-div',
            data: d => [d]
        })

        this.restyleForeignObjectElements();



        // Add Node button circle's group (expand-collapse button)
        const nodeButtonGroups = nodeEnter
            .patternify({
                tag: 'g',
                selector: 'node-button-g',
                data: d => [d]
            })
            .on('click', d => this.onButtonClick(d))

        // Add expand collapse button circle 
        nodeButtonGroups
            .patternify({
                tag: 'circle',
                selector: 'node-button-circle',
                data: d => [d]
            })

        // Add button text 
        nodeButtonGroups
            .patternify({
                tag: 'text',
                selector: 'node-button-text',
                data: d => [d]
            })
            .attr('pointer-events', 'none')

        // Transition to the proper position for the node
        nodeUpdate.transition()
            .attr('opacity', 0)
            .duration(attrs.duration)
            .attr("transform", ({
                x,
                y
            }) => `translate(${x},${y})`)
            .attr('opacity', 1)

        // Move images to desired positions
        nodeUpdate.selectAll('.node-image-group')
            .attr('transform', ({
                imageWidth,
                width,
                imageHeight,
                height
            }) => {
                let x = -imageWidth / 2 - width / 2;
                let y = -imageHeight / 2 - height / 2;
                return `translate(${x},${y})`
            })

        // Style node image rectangles
        nodeUpdate.select('.node-image-rect')
            .attr('fill', ({
                id
            }) => `url(#${id})`)
            .attr('width', ({
                imageWidth
            }) => imageWidth)
            .attr('height', ({
                imageHeight
            }) => imageHeight)
            .attr('stroke', ({
                imageBorderColor
            }) => imageBorderColor)
            .attr('stroke-width', ({
                imageBorderWidth
            }) => imageBorderWidth)
            .attr('rx', ({
                imageRx
            }) => imageRx)
            .attr('y', ({
                imageCenterTopDistance
            }) => imageCenterTopDistance)
            .attr('x', ({
                imageCenterLeftDistance
            }) => imageCenterLeftDistance)
            .attr('filter', ({
                dropShadowId
            }) => dropShadowId)

        // Style node rectangles
        nodeUpdate.select('.node-rect')
            .attr('width', ({
                data
            }) => data.width || attrs.defaultNode.width)
            .attr('height', ({
                data
            }) => data.height || attrs.defaultNode.height)
            .attr('x', ({
                data
            }) => -(data.width || attrs.defaultNode.width) / 2)
            .attr('y', ({
                data
            }) => -(data.height || attrs.defaultNode.height) / 2)
            .attr('rx', ({
                data
            }) => data.borderRadius || attrs.defaultNode.borderRadius || 0)
            .attr('stroke-width', ({
                data
            }) => data.borderWidth || attrs.defaultNode.borderWidth || attrs.strokeWidth)
            .attr('cursor', 'pointer')
            .attr('stroke', ({
                borderColor
            }) => borderColor)
            .style("fill", ({
                backgroundColor
            }) => backgroundColor)

        // Move node button group to the desired position
        nodeUpdate.select('.node-button-g')
            .attr('transform', ({
                data
            }) => `translate(0,${(data.height || attrs.defaultNode.height) / 2})`)
            .attr('opacity', ({
                children,
                _children
            }) => {
                if (children || _children) {
                    return 1;
                }
                return 0;
            })

        // Restyle node button circle
        nodeUpdate.select('.node-button-circle')
            .attr('r', 16)
            .attr('stroke-width', ({
                data
            }) => data.borderWidth || attrs.strokeWidth || attrs.defaultNode.strokeWidth)
            .attr('fill', attrs.backgroundColor || attrs.defaultNode.backgroundColor)
            .attr('stroke', ({
                borderColor
            }) => borderColor)

        // Restyle button texts
        nodeUpdate.select('.node-button-text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', attrs.defaultTextFill)
            .attr('font-size', ({
                children
            }) => {
                if (children) return 40;
                return 26;
            })
            .text(({
                children
            }) => {
                if (children) return '-';
                return '+';
            })
            .attr('y', this.isEdge() ? 10 : 0)

        // Remove any exiting nodes after transition
        const nodeExitTransition = nodesSelection.exit()
            .attr('opacity', 1)
            .transition()
            .duration(attrs.duration)
            .attr("transform", d => `translate(${x},${y})`)
            .on('end', function () {
                d3.select(this).remove();
            })
            .attr('opacity', 0);

        // On exit reduce the node rects size to 0
        nodeExitTransition.selectAll('.node-rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('x', 0)
            .attr('y', 0);

        // On exit reduce the node image rects size to 0
        nodeExitTransition.selectAll('.node-image-rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('x', ({
                width
            }) => width / 2)
            .attr('y', ({
                height
            }) => height / 2)

        // Store the old positions for transition.
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // This function detects whether current browser is edge
    isEdge() {
        return window.navigator.userAgent.includes("Edge");
    }

    /* Function converts rgba objects to rgba color string 
      {red:110,green:150,blue:255,alpha:1}  => rgba(110,150,255,1)
    */
    rgbaObjToColor({
        red,
        green,
        blue,
        alpha
    }) {
        return `rgba(${red},${green},${blue},${alpha})`;
    }

    // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges?collection=@bumbeishvili/work-components
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
             C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs} ${x + r * xrvs} ${y + h * yrvs + r * yrvs}
             L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}
             C ${ex}  ${y + h * yrvs + r * yrvs} ${ex}  ${y + h * yrvs + r * yrvs} ${ex} ${ey - h * yrvs}
             L ${ex} ${ey}
           `
        // Return result
        return path;
    }

    restyleForeignObjectElements() {
        const attrs = this.getChartState();

        attrs.svg.selectAll('.node-foreign-object')
            .attr('width', ({
                width
            }) => width)
            .attr('height', ({
                height
            }) => height)
            .attr('x', ({
                width
            }) => -width / 2)
            .attr('y', ({
                height
            }) => -height / 2)
        attrs.svg.selectAll('.node-foreign-object-div')
            .style('width', ({
                width
            }) => `${width}px`)
            .style('height', ({
                height
            }) => `${height}px`)
            .style('color', 'white')
            .html(({
                data
            }) => {
				//process template
				try{
					return this.processTemplate((data.template || attrs.template), (data.replaceData || attrs.replaceData), data);
				}catch(error){
					return (data.template || attrs.template);
				}
			})
	}
	//function for process template 
	processTemplate(html, replaceData, data){
		for (const [key, value] of Object.entries(replaceData)) {
			html = html.replace('{'+key+'}', (data[value] || ''));
		}
		return html;
	}
    // Toggle children on click.
    onButtonClick(d) {

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
            d.children.forEach(({
                data
            }) => data.expanded = true)
        }

        // Redraw Graph 
        this.update(d);
    }

    // This function changes `expanded` property to descendants
    setExpansionFlagToChildren({
        data,
        children,
        _children
    }, flag) {

        // Set flag to the current property
        data.expanded = flag;

        // Loop over and recursively update expanded children's descendants
        if (children) {
            children.forEach(d => {
                this.setExpansionFlagToChildren(d, flag)
            })
        }

        // Loop over and recursively update collapsed children's descendants
        if (_children) {
            _children.forEach(d => {
                this.setExpansionFlagToChildren(d, flag)
            })
        }
    }

    // This function can be invoked via chart.setExpanded API, it expands or collapses particular node
    setExpanded(id, expandedFlag) {
        const attrs = this.getChartState();
        // Retrieve node by node Id
        const node = attrs.allNodes.filter(({
            data
        }) => data.nodeId == id)[0]

        // If node exists, set expansion flag
        if (node) node.data.expanded = expandedFlag;

        // First expand all nodes
        attrs.root.children.forEach(d => this.expand(d));

        // Then collapse all nodes
        attrs.root.children.forEach(d => this.collapse(d));

        // Then expand only the nodes, which were previously expanded, or have an expand flag set
        attrs.root.children.forEach(d => this.expandSomeNodes(d));

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
            d._children.forEach(ch => this.expandSomeNodes(ch));
        }

        // Recursivelly do the same for expanded nodes 
        if (d.children) {
            d.children.forEach(ch => this.expandSomeNodes(ch));
        }
    }


    // This function updates nodes state and redraws graph, usually after data change
    updateNodesState() {
        const attrs = this.getChartState();
        // Store new root by converting flat data to hierarchy
        attrs.root = d3.stratify()
            .id(({
                nodeId
            }) => nodeId)
            .parentId(({
                parentNodeId
            }) => parentNodeId)
            (attrs.data)

        // Store positions, where children appear during their enter animation
        attrs.root.x0 = 0;
        attrs.root.y0 = 0;

        // Store all nodes in flat format (although, now we can browse parent, see depth e.t.c. )
        attrs.allNodes = attrs.layouts.treemap(attrs.root).descendants()

        // Store direct and total descendants count
        attrs.allNodes.forEach(d => {
            Object.assign(d.data, {
                directSubordinates: d.children ? d.children.length : 0,
                totalSubordinates: d.descendants().length - 1
            })
        })

        // Expand all nodes first
        attrs.root.children.forEach(this.expand);

        // Then collapse them all
        attrs.root.children.forEach(d => this.collapse(d));

        // Then only expand nodes, which have expanded proprty set to true
        attrs.root.children.forEach(ch => this.expandSomeNodes(ch));

        // Redraw Graphs
        this.update(attrs.root)
    }


    // Function which collapses passed node and it's descendants
    collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(ch => this.collapse(ch));
            d.children = null;
        }
    }

    // Function which expands passed node and it's descendants 
    expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(ch => this.expand(ch));
            d._children = null;
        }
    }

    // Zoom handler function
    zoomed() {
        const attrs = this.getChartState();
        const chart = attrs.chart;

        // Get d3 event's transform object
        const transform = d3.event.transform;

        // Store it
        attrs.lastTransform = transform;

        // Reposition and rescale chart accordingly
        chart.attr('transform', transform);

        // Apply new styles to the foreign object element
        if (this.isEdge()) {
            this.restyleForeignObjectElements();
        }

    }

}


 
module.exports = TreeChart;
