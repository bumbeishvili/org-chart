import { selection, select } from "d3-selection";
import { max, min, sum, cumsum } from "d3-array";
import { tree, stratify } from "d3-hierarchy";
import { zoom, zoomIdentity } from "d3-zoom";
import { flextree } from 'd3-flextree';
import { linkHorizontal } from 'd3-shape';

const d3 = {
    selection,
    select,
    max,
    min,
    sum,
    cumsum,
    tree,
    stratify,
    zoom,
    zoomIdentity,
    linkHorizontal,
    flextree
}

export class OrgChart {
    constructor() {

        // Exposed variables  test test
        const attrs = {

            /* NOT INTENDED FOR PUBLIC OVERRIDE */

            id: `ID${Math.floor(Math.random() * 1000000)}`, // Id for event handlings
            firstDraw: true,    // Whether chart is drawn for the first time
            ctx: document.createElement('canvas').getContext('2d'),
            initialExpandLevel: 1,
            nodeDefaultBackground: 'none',
            lastTransform: { x: 0, y: 0, k: 1 },  // Panning and zooming values
            allowedNodesCount: {},
            zoomBehavior: null,
            generateRoot: null,

            /*  INTENDED FOR PUBLIC OVERRIDE */

            svgWidth: 800,   // Configure svg width
            svgHeight: window.innerHeight - 100,  // Configure svg height
            container: "body",  // Set parent container, either CSS style selector or DOM element
            data: null, // Set data, it must be an array of objects, where hierarchy is clearly defined via id and parent ID (property names are configurable)
            connections: [], // Sets connection data, array of objects, SAMPLE:  [{from:"145",to:"201",label:"Conflicts of interest"}]
            defaultFont: "Helvetica", // Set default font
            nodeId: d => d.nodeId || d.id, // Configure accessor for node id, default is either odeId or id
            parentNodeId: d => d.parentNodeId || d.parentId, // Configure accessor for parent node id, default is either parentNodeId or parentId
            rootMargin: 40, // Configure how much root node is offset from top
            nodeWidth: d3Node => 250, // Configure each node width, use with caution, it is better to have the same value set for all nodes
            nodeHeight: d => 150,  //  Configure each node height, use with caution, it is better to have the same value set for all nodes
            neighbourMargin: (n1, n2) => 80, // Configure margin between two nodes, use with caution, it is better to have the same value set for all nodes
            siblingsMargin: d3Node => 20, // Configure margin between two siblings, use with caution, it is better to have the same value set for all nodes
            childrenMargin: d => 60, // Configure margin between parent and children, use with caution, it is better to have the same value set for all nodes
            compactMarginPair: d => 100, // Configure margin between two nodes in compact mode, use with caution, it is better to have the same value set for all nodes
            compactMarginBetween: (d3Node => 20), // Configure margin between two nodes in compact mode, use with caution, it is better to have the same value set for all nodes
            nodeButtonWidth: d => 40, // Configure expand & collapse button width
            nodeButtonHeight: d => 40, // Configure expand & collapse button height
            nodeButtonX: d => -20, // Configure expand & collapse button x position
            nodeButtonY: d => -20,  // Configure expand & collapse button y position
            linkYOffset: 30, // When correcting links which is not working for safari
            pagingStep: d => 5, // Configure how many nodes to show when making new nodes appear
            minPagingVisibleNodes: d => 2000, // Configure minimum number of visible nodes , after which paging button appears
            scaleExtent: [0.001, 20],  // Configure zoom scale extent , if you don't want any kind of zooming, set it to [1,1]
            duration: 400, // Configure duration of transitions
            imageName: 'Chart', // Configure exported PNG and SVG image name
            setActiveNodeCentered: true, // Configure if active node should be centered when expanded and collapsed
            layout: "top",// Configure layout direction , possible values are "top", "left", "right", "bottom"
            compact: true, // Configure if compact mode is enabled , when enabled, nodes are shown in compact positions, instead of horizontal spread
            createZoom: d => d3.zoom(),
            onZoomStart: e => { }, // Callback for zoom & panning start
            onZoom: e => { }, // Callback for zoom & panning 
            onZoomEnd: e => { }, // Callback for zoom & panning end
            onNodeClick: (d) => d, // Callback for node click
            onExpandOrCollapse: (d) => d, // Callback for node expand or collapse

            /*
            * Node HTML content generation , remember that you can access some helper methods:

            * node=> node.data - to access node's original data
            * node=> node.leaves() - to access node's leaves
            * node=> node.descendants() - to access node's descendants
            * node=> node.children - to access node's children
            * node=> node.parent - to access node's parent
            * node=> node.depth - to access node's depth
            * node=> node.hierarchyHeight - to access node's hierarchy height ( Height, which d3 assigns to hierarchy nodes)
            * node=> node.height - to access node's height
            * node=> node.width - to access node's width
            * 
            * You can also access additional properties to style your node:
            * 
            * d=>d.data._centeredWithDescendants - when node is centered with descendants
            * d=>d.data._directSubordinatesPaging - subordinates count in paging mode
            * d=>d.data._directSubordinates - subordinates count
            * d=>d.data._totalSubordinates - total subordinates count
            * d=>d._highlighted - when node is highlighted
            * d=>d._upToTheRootHighlighted - when node is highlighted up to the root
            * d=>d._expanded - when node is expanded
            * d=>d.data._centered - when node is centered
            */
            nodeContent: d => `<div style="padding:5px;font-size:10px;">Sample Node(id=${d.id}), override using <br/> 
            <code>chart.nodeContent({data}=>{ <br/>
             &nbsp;&nbsp;&nbsp;&nbsp;return '' // Custom HTML <br/>
             })</code>
             <br/> 
             Or check different <a href="https://github.com/bumbeishvili/org-chart#jump-to-examples" target="_blank">layout examples</a>
             </div>`,

            /* Node expand & collapse button content and styling. You can access same helper methods as above */
            buttonContent: ({ node, state }) => {
                const icons = {
                    "left": d => d ?
                        `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.283 3.50094L6.51 11.4749C6.37348 11.615 6.29707 11.8029 6.29707 11.9984C6.29707 12.194 6.37348 12.3819 6.51 12.5219L14.283 20.4989C14.3466 20.5643 14.4226 20.6162 14.5066 20.6516C14.5906 20.6871 14.6808 20.7053 14.772 20.7053C14.8632 20.7053 14.9534 20.6871 15.0374 20.6516C15.1214 20.6162 15.1974 20.5643 15.261 20.4989C15.3918 20.365 15.4651 20.1852 15.4651 19.9979C15.4651 19.8107 15.3918 19.6309 15.261 19.4969L7.9515 11.9984L15.261 4.50144C15.3914 4.36756 15.4643 4.18807 15.4643 4.00119C15.4643 3.81431 15.3914 3.63482 15.261 3.50094C15.1974 3.43563 15.1214 3.38371 15.0374 3.34827C14.9534 3.31282 14.8632 3.29456 14.772 3.29456C14.6808 3.29456 14.5906 3.31282 14.5066 3.34827C14.4226 3.38371 14.3466 3.43563 14.283 3.50094V3.50094Z" fill="#716E7B" stroke="#716E7B"/>
                      </svg></span><span style="color:#716E7B">${node.data._directSubordinatesPaging} </span></div>` :
                        `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.989 3.49944C7.85817 3.63339 7.78492 3.8132 7.78492 4.00044C7.78492 4.18768 7.85817 4.36749 7.989 4.50144L15.2985 11.9999L7.989 19.4969C7.85817 19.6309 7.78492 19.8107 7.78492 19.9979C7.78492 20.1852 7.85817 20.365 7.989 20.4989C8.05259 20.5643 8.12863 20.6162 8.21261 20.6516C8.2966 20.6871 8.38684 20.7053 8.478 20.7053C8.56916 20.7053 8.6594 20.6871 8.74338 20.6516C8.82737 20.6162 8.90341 20.5643 8.967 20.4989L16.74 12.5234C16.8765 12.3834 16.9529 12.1955 16.9529 11.9999C16.9529 11.8044 16.8765 11.6165 16.74 11.4764L8.967 3.50094C8.90341 3.43563 8.82737 3.38371 8.74338 3.34827C8.6594 3.31282 8.56916 3.29456 8.478 3.29456C8.38684 3.29456 8.2966 3.31282 8.21261 3.34827C8.12863 3.38371 8.05259 3.43563 7.989 3.50094V3.49944Z" fill="#716E7B" stroke="#716E7B"/>
                          </svg></span><span style="color:#716E7B">${node.data._directSubordinatesPaging} </span></div>`
                    ,
                    "bottom": d => d ? `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M19.497 7.98903L12 15.297L4.503 7.98903C4.36905 7.85819 4.18924 7.78495 4.002 7.78495C3.81476 7.78495 3.63495 7.85819 3.501 7.98903C3.43614 8.05257 3.38462 8.12842 3.34944 8.21213C3.31427 8.29584 3.29615 8.38573 3.29615 8.47653C3.29615 8.56733 3.31427 8.65721 3.34944 8.74092C3.38462 8.82463 3.43614 8.90048 3.501 8.96403L11.4765 16.74C11.6166 16.8765 11.8044 16.953 12 16.953C12.1956 16.953 12.3834 16.8765 12.5235 16.74L20.499 8.96553C20.5643 8.90193 20.6162 8.8259 20.6517 8.74191C20.6871 8.65792 20.7054 8.56769 20.7054 8.47653C20.7054 8.38537 20.6871 8.29513 20.6517 8.21114C20.6162 8.12715 20.5643 8.05112 20.499 7.98753C20.3651 7.85669 20.1852 7.78345 19.998 7.78345C19.8108 7.78345 19.6309 7.85669 19.497 7.98753V7.98903Z" fill="#716E7B" stroke="#716E7B"/>
                       </svg></span><span style="margin-left:1px;color:#716E7B" >${node.data._directSubordinatesPaging} </span></div>
                       ` : `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M11.457 8.07005L3.49199 16.4296C3.35903 16.569 3.28485 16.7543 3.28485 16.9471C3.28485 17.1398 3.35903 17.3251 3.49199 17.4646L3.50099 17.4736C3.56545 17.5414 3.64304 17.5954 3.72904 17.6324C3.81504 17.6693 3.90765 17.6883 4.00124 17.6883C4.09483 17.6883 4.18745 17.6693 4.27344 17.6324C4.35944 17.5954 4.43703 17.5414 4.50149 17.4736L12.0015 9.60155L19.4985 17.4736C19.563 17.5414 19.6405 17.5954 19.7265 17.6324C19.8125 17.6693 19.9052 17.6883 19.9987 17.6883C20.0923 17.6883 20.1849 17.6693 20.2709 17.6324C20.3569 17.5954 20.4345 17.5414 20.499 17.4736L20.508 17.4646C20.641 17.3251 20.7151 17.1398 20.7151 16.9471C20.7151 16.7543 20.641 16.569 20.508 16.4296L12.543 8.07005C12.4729 7.99653 12.3887 7.93801 12.2954 7.89801C12.202 7.85802 12.1015 7.8374 12 7.8374C11.8984 7.8374 11.798 7.85802 11.7046 7.89801C11.6113 7.93801 11.527 7.99653 11.457 8.07005Z" fill="#716E7B" stroke="#716E7B"/>
                       </svg></span><span style="margin-left:1px;color:#716E7B" >${node.data._directSubordinatesPaging} </span></div>
                    `,
                    "right": d => d ? `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M7.989 3.49944C7.85817 3.63339 7.78492 3.8132 7.78492 4.00044C7.78492 4.18768 7.85817 4.36749 7.989 4.50144L15.2985 11.9999L7.989 19.4969C7.85817 19.6309 7.78492 19.8107 7.78492 19.9979C7.78492 20.1852 7.85817 20.365 7.989 20.4989C8.05259 20.5643 8.12863 20.6162 8.21261 20.6516C8.2966 20.6871 8.38684 20.7053 8.478 20.7053C8.56916 20.7053 8.6594 20.6871 8.74338 20.6516C8.82737 20.6162 8.90341 20.5643 8.967 20.4989L16.74 12.5234C16.8765 12.3834 16.9529 12.1955 16.9529 11.9999C16.9529 11.8044 16.8765 11.6165 16.74 11.4764L8.967 3.50094C8.90341 3.43563 8.82737 3.38371 8.74338 3.34827C8.6594 3.31282 8.56916 3.29456 8.478 3.29456C8.38684 3.29456 8.2966 3.31282 8.21261 3.34827C8.12863 3.38371 8.05259 3.43563 7.989 3.50094V3.49944Z" fill="#716E7B" stroke="#716E7B"/>
                       </svg></span><span style="color:#716E7B">${node.data._directSubordinatesPaging} </span></div>` :
                        `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M14.283 3.50094L6.51 11.4749C6.37348 11.615 6.29707 11.8029 6.29707 11.9984C6.29707 12.194 6.37348 12.3819 6.51 12.5219L14.283 20.4989C14.3466 20.5643 14.4226 20.6162 14.5066 20.6516C14.5906 20.6871 14.6808 20.7053 14.772 20.7053C14.8632 20.7053 14.9534 20.6871 15.0374 20.6516C15.1214 20.6162 15.1974 20.5643 15.261 20.4989C15.3918 20.365 15.4651 20.1852 15.4651 19.9979C15.4651 19.8107 15.3918 19.6309 15.261 19.4969L7.9515 11.9984L15.261 4.50144C15.3914 4.36756 15.4643 4.18807 15.4643 4.00119C15.4643 3.81431 15.3914 3.63482 15.261 3.50094C15.1974 3.43563 15.1214 3.38371 15.0374 3.34827C14.9534 3.31282 14.8632 3.29456 14.772 3.29456C14.6808 3.29456 14.5906 3.31282 14.5066 3.34827C14.4226 3.38371 14.3466 3.43563 14.283 3.50094V3.50094Z" fill="#716E7B" stroke="#716E7B"/>
                       </svg></span><span style="color:#716E7B">${node.data._directSubordinatesPaging} </span></div>`,
                    "top": d => d ? `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.457 8.07005L3.49199 16.4296C3.35903 16.569 3.28485 16.7543 3.28485 16.9471C3.28485 17.1398 3.35903 17.3251 3.49199 17.4646L3.50099 17.4736C3.56545 17.5414 3.64304 17.5954 3.72904 17.6324C3.81504 17.6693 3.90765 17.6883 4.00124 17.6883C4.09483 17.6883 4.18745 17.6693 4.27344 17.6324C4.35944 17.5954 4.43703 17.5414 4.50149 17.4736L12.0015 9.60155L19.4985 17.4736C19.563 17.5414 19.6405 17.5954 19.7265 17.6324C19.8125 17.6693 19.9052 17.6883 19.9987 17.6883C20.0923 17.6883 20.1849 17.6693 20.2709 17.6324C20.3569 17.5954 20.4345 17.5414 20.499 17.4736L20.508 17.4646C20.641 17.3251 20.7151 17.1398 20.7151 16.9471C20.7151 16.7543 20.641 16.569 20.508 16.4296L12.543 8.07005C12.4729 7.99653 12.3887 7.93801 12.2954 7.89801C12.202 7.85802 12.1015 7.8374 12 7.8374C11.8984 7.8374 11.798 7.85802 11.7046 7.89801C11.6113 7.93801 11.527 7.99653 11.457 8.07005Z" fill="#716E7B" stroke="#716E7B"/>
                        </svg></span><span style="margin-left:1px;color:#716E7B">${node.data._directSubordinatesPaging} </span></div>
                        ` : `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.497 7.98903L12 15.297L4.503 7.98903C4.36905 7.85819 4.18924 7.78495 4.002 7.78495C3.81476 7.78495 3.63495 7.85819 3.501 7.98903C3.43614 8.05257 3.38462 8.12842 3.34944 8.21213C3.31427 8.29584 3.29615 8.38573 3.29615 8.47653C3.29615 8.56733 3.31427 8.65721 3.34944 8.74092C3.38462 8.82463 3.43614 8.90048 3.501 8.96403L11.4765 16.74C11.6166 16.8765 11.8044 16.953 12 16.953C12.1956 16.953 12.3834 16.8765 12.5235 16.74L20.499 8.96553C20.5643 8.90193 20.6162 8.8259 20.6517 8.74191C20.6871 8.65792 20.7054 8.56769 20.7054 8.47653C20.7054 8.38537 20.6871 8.29513 20.6517 8.21114C20.6162 8.12715 20.5643 8.05112 20.499 7.98753C20.3651 7.85669 20.1852 7.78345 19.998 7.78345C19.8108 7.78345 19.6309 7.85669 19.497 7.98753V7.98903Z" fill="#716E7B" stroke="#716E7B"/>
                        </svg></span><span style="margin-left:1px;color:#716E7B">${node.data._directSubordinatesPaging} </span></div>
                    `,
                }
                return `<div style="border:1px solid #E4E2E9;border-radius:3px;padding:3px;font-size:9px;margin:auto auto;background-color:white"> ${icons[state.layout](node.children)}  </div>`
            },
            /* Node paging button content and styling. You can access same helper methods as above. */
            pagingButton: (d, i, arr, state) => {
                const step = state.pagingStep(d.parent);
                const currentIndex = d.parent.data._pagingStep;
                const diff = d.parent.data._directSubordinatesPaging - currentIndex;
                const min = Math.min(diff, step);
                return `
                   <div style="margin-top:90px;">
                      <div style="display:flex;width:170px;border-radius:20px;padding:5px 15px; padding-bottom:4px;;background-color:#E5E9F2">
                      <div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.59 7.41L10.18 12L5.59 16.59L7 18L13 12L7 6L5.59 7.41ZM16 6H18V18H16V6Z" fill="#716E7B" stroke="#716E7B"/>
                      </svg>
                      </div><div style="line-height:2"> Show next ${min}  nodes </div></div>
                   </div>
                `
            },
            /* You can access and modify actual node DOM element in runtime using this method. */
            nodeUpdate: function (d, i, arr) {
                d3.select(this)
                    .select('.node-rect')
                    .attr("stroke", d => d.data._highlighted || d.data._upToTheRootHighlighted ? '#E27396' : 'none')
                    .attr("stroke-width", d.data._highlighted || d.data._upToTheRootHighlighted ? 10 : 1)
            },
            nodeEnter: (d) => d, // Custom handling of node update
            nodeExit: (d) => d, // Custom handling of exit node
            /* You can access and modify actual link DOM element in runtime using this method. */
            linkUpdate: function (d, i, arr) {
                d3.select(this)
                    .attr("stroke", d => d.data._upToTheRootHighlighted ? '#E27396' : '#E4E2E9')
                    .attr("stroke-width", d => d.data._upToTheRootHighlighted ? 5 : 1)

                if (d.data._upToTheRootHighlighted) {
                    d3.select(this).raise()
                }
            },
            /* Horizontal diagonal generation algorithm - https://observablehq.com/@bumbeishvili/curved-edges-compact-horizontal */
            hdiagonal: function (s, t, m) {
                // Define source and target x,y coordinates
                const x = s.x;
                const y = s.y;
                const ex = t.x;
                const ey = t.y;

                let mx = m && m.x != null ? m.x : x;  // This is a changed line
                let my = m && m.y != null ? m.y : y; // This also is a changed line

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
                          M ${mx} ${my}
                          L ${mx} ${y}
                          L ${x} ${y}
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
            },
            /* Vertical diagonal generation algorithm - https://observablehq.com/@bumbeishvili/curved-edges-compacty-vertical */
            diagonal: function (s, t, m, offsets = { sy: 0, }) {
                const x = s.x;
                let y = s.y;

                const ex = t.x;
                const ey = t.y;

                let mx = m && m.x != null ? m.x : x;  // This is a changed line
                let my = m && m.y != null ? m.y : y; // This also is a changed line

                let xrvs = ex - x < 0 ? -1 : 1;
                let yrvs = ey - y < 0 ? -1 : 1;

                y += offsets.sy;


                let rdef = 35;
                let r = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;

                r = Math.abs(ey - y) / 2 < r ? Math.abs(ey - y) / 2 : r;

                let h = Math.abs(ey - y) / 2 - r;
                let w = Math.abs(ex - x) - r * 2;
                //w=0;
                const path = `
                          M ${mx} ${my}
                          L ${x} ${my}
                          L ${x} ${y}
                          L ${x} ${y + h * yrvs}
                          C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs
                    } ${x + r * xrvs} ${y + h * yrvs + r * yrvs}
                          L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}
                          C  ${ex}  ${y + h * yrvs + r * yrvs} ${ex}  ${y + h * yrvs + r * yrvs
                    } ${ex} ${ey - h * yrvs}
                          L ${ex} ${ey}
               `;
                return path;
            },
            // Defining arrows with markers for connections
            defs: function (state, visibleConnections) {
                return `<defs>
                    ${visibleConnections.map(conn => {
                    const labelWidth = this.getTextWidth(conn.label, { ctx: state.ctx, fontSize: 2, defaultFont: state.defaultFont });
                    return `
                       <marker id="${conn.from + "_" + conn.to}" refX="${conn._source.x < conn._target.x ? -7 : 7}" refY="5" markerWidth="500"  markerHeight="500"  orient="${conn._source.x < conn._target.x ? "auto" : "auto-start-reverse"}" >
                       <rect rx=0.5 width=${conn.label ? labelWidth + 3 : 0} height=3 y=1  fill="#E27396"></rect>
                       <text font-size="2px" x=1 fill="white" y=3>${conn.label || ''}</text>
                       </marker>

                       <marker id="arrow-${conn.from + "_" + conn.to}"  markerWidth="500"  markerHeight="500"  refY="2"  refX="1" orient="${conn._source.x < conn._target.x ? "auto" : "auto-start-reverse"}" >
                       <path transform="translate(0)" d='M0,0 V4 L2,2 Z' fill='#E27396' />
                       </marker>
                    `}).join("")}
                    </defs>
                    `},
            /* You can update connections with custom styling using this function */
            connectionsUpdate: function (d, i, arr) {
                d3.select(this)
                    .attr("stroke", d => '#E27396')
                    .attr('stroke-linecap', 'round')
                    .attr("stroke-width", d => '5')
                    .attr('pointer-events', 'none')
                    .attr("marker-start", d => `url(#${d.from + "_" + d.to})`)
                    .attr("marker-end", d => `url(#arrow-${d.from + "_" + d.to})`)
            },
            // Link generator for connections
            linkGroupArc: d3.linkHorizontal().x(d => d.x).y(d => d.y),

            /*
            *   You can customize/offset positions for each node and link by overriding these functions
            *   For example, suppose you want to move link y position 30 px bellow in top layout. You can do it like this:
            *   ```javascript
            *   const layout = chart.layoutBindings();
            *   layout.top.linkY = node => node.y + 30;
            *   chart.layoutBindings(layout);
            *   ```
            */
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
                    "linkCompactXStart": node => node.x + node.width / 2,//node.x + (node.compactEven ? node.width / 2 : -node.width / 2),
                    "linkCompactYStart": node => node.y + (node.compactEven ? node.height / 2 : -node.height / 2),
                    "compactLinkMidX": (node, state) => node.firstCompactNode.x,// node.firstCompactNode.x + node.firstCompactNode.flexCompactDim[0] / 4 + state.compactMarginPair(node) / 4,
                    "compactLinkMidY": (node, state) => node.firstCompactNode.y + node.firstCompactNode.flexCompactDim[0] / 4 + state.compactMarginPair(node) / 4,
                    "linkParentX": node => node.parent.x + node.parent.width,
                    "linkParentY": node => node.parent.y,
                    "buttonX": node => node.width,
                    "buttonY": node => node.height / 2,
                    "centerTransform": ({ root, rootMargin, centerY, scale, centerX }) => `translate(${rootMargin},${centerY}) scale(${scale})`,
                    "compactDimension": {
                        sizeColumn: node => node.height,
                        sizeRow: node => node.width,
                        reverse: arr => arr.slice().reverse()
                    },
                    "nodeFlexSize": ({ height, width, siblingsMargin, childrenMargin, state, node }) => {
                        if (state.compact && node.flexCompactDim) {
                            const result = [node.flexCompactDim[0], node.flexCompactDim[1]]
                            return result;
                        };
                        return [height + siblingsMargin, width + childrenMargin]
                    },
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
                    "linkCompactXStart": node => node.x + (node.compactEven ? node.width / 2 : -node.width / 2),
                    "linkCompactYStart": node => node.y + node.height / 2,
                    "compactLinkMidX": (node, state) => node.firstCompactNode.x + node.firstCompactNode.flexCompactDim[0] / 4 + state.compactMarginPair(node) / 4,
                    "compactLinkMidY": node => node.firstCompactNode.y,
                    "compactDimension": {
                        sizeColumn: node => node.width,
                        sizeRow: node => node.height,
                        reverse: arr => arr,
                    },
                    "linkX": node => node.x,
                    "linkY": node => node.y,
                    "linkParentX": node => node.parent.x,
                    "linkParentY": node => node.parent.y + node.parent.height,
                    "buttonX": node => node.width / 2,
                    "buttonY": node => node.height,
                    "centerTransform": ({ root, rootMargin, centerY, scale, centerX }) => `translate(${centerX},${rootMargin}) scale(${scale})`,
                    "nodeFlexSize": ({ height, width, siblingsMargin, childrenMargin, state, node, compactViewIndex }) => {
                        if (state.compact && node.flexCompactDim) {
                            const result = [node.flexCompactDim[0], node.flexCompactDim[1]]
                            return result;
                        };
                        return [width + siblingsMargin, height + childrenMargin];
                    },
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
                    "linkCompactXStart": node => node.x + (node.compactEven ? node.width / 2 : -node.width / 2),
                    "linkCompactYStart": node => node.y - node.height / 2,
                    "compactLinkMidX": (node, state) => node.firstCompactNode.x + node.firstCompactNode.flexCompactDim[0] / 4 + state.compactMarginPair(node) / 4,
                    "compactLinkMidY": node => node.firstCompactNode.y,
                    "linkX": node => node.x,
                    "linkY": node => node.y,
                    "compactDimension": {
                        sizeColumn: node => node.width,
                        sizeRow: node => node.height,
                        reverse: arr => arr,
                    },
                    "linkParentX": node => node.parent.x,
                    "linkParentY": node => node.parent.y - node.parent.height,
                    "buttonX": node => node.width / 2,
                    "buttonY": node => 0,
                    "centerTransform": ({ root, rootMargin, centerY, scale, centerX, chartHeight }) => `translate(${centerX},${chartHeight - rootMargin}) scale(${scale})`,
                    "nodeFlexSize": ({ height, width, siblingsMargin, childrenMargin, state, node }) => {
                        if (state.compact && node.flexCompactDim) {
                            const result = [node.flexCompactDim[0], node.flexCompactDim[1]]
                            return result;
                        };
                        return [width + siblingsMargin, height + childrenMargin]
                    },
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
                    "linkCompactXStart": node => node.x - node.width / 2,//node.x + (node.compactEven ? node.width / 2 : -node.width / 2),
                    "linkCompactYStart": node => node.y + (node.compactEven ? node.height / 2 : -node.height / 2),
                    "compactLinkMidX": (node, state) => node.firstCompactNode.x,// node.firstCompactNode.x + node.firstCompactNode.flexCompactDim[0] / 4 + state.compactMarginPair(node) / 4,
                    "compactLinkMidY": (node, state) => node.firstCompactNode.y + node.firstCompactNode.flexCompactDim[0] / 4 + state.compactMarginPair(node) / 4,
                    "centerTransform": ({ root, rootMargin, centerY, scale, centerX, chartWidth }) => `translate(${chartWidth - rootMargin},${centerY}) scale(${scale})`,
                    "nodeFlexSize": ({ height, width, siblingsMargin, childrenMargin, state, node }) => {
                        if (state.compact && node.flexCompactDim) {
                            const result = [node.flexCompactDim[0], node.flexCompactDim[1]]
                            return result;
                        };
                        return [height + siblingsMargin, width + childrenMargin]
                    },
                    "compactDimension": {
                        sizeColumn: node => node.height,
                        sizeRow: node => node.width,
                        reverse: arr => arr.slice().reverse()
                    },
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
    initialZoom(zoomLevel) {
        const attrs = this.getChartState();
        attrs.lastTransform.k = zoomLevel;
        return this;
    }

    render() {
        //InnerFunctions which will update visuals
        const attrs = this.getChartState();
        if (!attrs.data || attrs.data.length == 0) {
            console.log('ORG CHART - Data is empty');
            if (attrs.container) {
                select(attrs.container).select('.nodes-wrapper').remove();
                select(attrs.container).select('.links-wrapper').remove();
                select(attrs.container).select('.connections-wrapper').remove();
            }
            return this;
        }

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
            behaviors.zoom = attrs.createZoom()
                .clickDistance(10)
                .on('start', (event, d) => attrs.onZoomStart(event))
                .on('end', (event, d) => attrs.onZoomEnd(event))
                .on("zoom", (event, d) => {
                    attrs.onZoom(event);
                    this.zoomed(event, d);
                })
                .scaleExtent(attrs.scaleExtent)
            attrs.zoomBehavior = behaviors.zoom;
        }

        //****************** ROOT node work ************************

        attrs.flexTreeLayout = flextree({
            nodeSize: node => {
                const width = attrs.nodeWidth(node);;
                const height = attrs.nodeHeight(node);
                const siblingsMargin = attrs.siblingsMargin(node)
                const childrenMargin = attrs.childrenMargin(node);
                return attrs.layoutBindings[attrs.layout].nodeFlexSize({
                    state: attrs,
                    node: node,
                    width,
                    height,
                    siblingsMargin,
                    childrenMargin
                });
            }
        })
            .spacing((nodeA, nodeB) => nodeA.parent == nodeB.parent ? 0 : attrs.neighbourMargin(nodeA, nodeB));

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

        attrs.linksWrapper = attrs.centerG.patternify({
            tag: "g",
            selector: "links-wrapper"
        })

        attrs.nodesWrapper = attrs.centerG.patternify({
            tag: "g",
            selector: "nodes-wrapper"
        })

        attrs.connectionsWrapper = attrs.centerG.patternify({
            tag: "g",
            selector: "connections-wrapper"
        })

        attrs.defsWrapper = svg.patternify({
            tag: "g",
            selector: "defs-wrapper"
        })

        if (attrs.firstDraw) {
            attrs.centerG.attr("transform", () => {
                return attrs.layoutBindings[attrs.layout].centerTransform({
                    centerX: calc.centerX,
                    centerY: calc.centerY,
                    scale: attrs.lastTransform.k,
                    rootMargin: attrs.rootMargin,
                    root: attrs.root,
                    chartHeight: calc.chartHeight,
                    chartWidth: calc.chartWidth
                })
            });
        }

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
        if (obj && (attrs.parentNodeId(obj) == null || attrs.parentNodeId(obj) == attrs.nodeId(obj)) && attrs.data.length == 0) {
            attrs.data.push(obj);
            this.render()
            return this;
        }
        const root = attrs.generateRoot(attrs.data)
        const descendants = root.descendants();
        const nodeFound = descendants.filter(({ data }) => attrs.nodeId(data).toString() === attrs.nodeId(obj).toString())[0];
        const parentFound = descendants.filter(({ data }) => attrs.nodeId(data).toString() === attrs.parentNodeId(obj).toString())[0];
        if (nodeFound) {
            console.log(`ORG CHART - ADD - Node with id "${attrs.nodeId(obj)}" already exists in tree`)
            return this;
        }

        if (obj._centered && !obj._expanded) obj._expanded = true;
        attrs.data.push(obj);

        // Update state of nodes and redraw graph
        this.updateNodesState();

        return this;
    }

    // This function can be invoked via chart.removeNode API, and it removes node from tree at runtime
    removeNode(nodeId) {
        const attrs = this.getChartState();
        const root = attrs.generateRoot(attrs.data)
        const descendants = root.descendants();
        const node = descendants.filter(({ data }) => attrs.nodeId(data) == nodeId)[0];

        if (!node) {
            console.log(`ORG CHART - REMOVE - Node with id "${nodeId}" not found in the tree`);
            return this;
        }

        // Get all node descendants
        const nodeDescendants = node.descendants()

        // Mark all node children and node itself for removal
        nodeDescendants
            .forEach(d => d.data._filteredOut = true)

        // Filter out retrieved nodes and reassign data
        attrs.data = attrs.data.filter(d => !d._filteredOut);

        if (attrs.data.length == 0) {
            this.render();
        } else {
            const updateNodesState = this.updateNodesState.bind(this);
            // Update state of nodes and redraw graph
            updateNodesState();
        }
        return this;
    }

    groupBy(array, accessor, aggegator) {
        const grouped = {}
        array.forEach(item => {
            const key = accessor(item)
            if (!grouped[key]) {
                grouped[key] = []
            }
            grouped[key].push(item)
        })

        Object.keys(grouped).forEach(key => {
            grouped[key] = aggegator(grouped[key])
        })
        return Object.entries(grouped);
    }
    calculateCompactFlexDimensions(root) {
        const attrs = this.getChartState();
        root.eachBefore(node => {
            node.firstCompact = null;
            node.compactEven = null;
            node.flexCompactDim = null;
            node.firstCompactNode = null;
        })
        root.eachBefore(node => {
            if (node.children && node.children.length > 1) {
                const compactChildren = node.children
                    .filter(d => !d.children)

                if (compactChildren.length < 2) return;
                compactChildren.forEach((child, i) => {
                    if (!i) child.firstCompact = true;
                    if (i % 2) child.compactEven = false;
                    else child.compactEven = true;
                    child.row = Math.floor(i / 2);
                })
                const evenMaxColumnDimension = d3.max(compactChildren.filter(d => d.compactEven), attrs.layoutBindings[attrs.layout].compactDimension.sizeColumn);
                const oddMaxColumnDimension = d3.max(compactChildren.filter(d => !d.compactEven), attrs.layoutBindings[attrs.layout].compactDimension.sizeColumn);
                const columnSize = Math.max(evenMaxColumnDimension, oddMaxColumnDimension) * 2;
                const rowsMapNew = this.groupBy(compactChildren, d => d.row, reducedGroup => d3.max(reducedGroup, d => attrs.layoutBindings[attrs.layout].compactDimension.sizeRow(d) + attrs.compactMarginBetween(d)));
                const rowSize = d3.sum(rowsMapNew.map(v => v[1]))
                compactChildren.forEach(node => {
                    node.firstCompactNode = compactChildren[0];
                    if (node.firstCompact) {
                        node.flexCompactDim = [
                            columnSize + attrs.compactMarginPair(node),
                            rowSize - attrs.compactMarginBetween(node)
                        ];
                    } else {
                        node.flexCompactDim = [0, 0];
                    }
                })
                node.flexCompactDim = null;
            }
        })
    }

    calculateCompactFlexPositions(root) {
        const attrs = this.getChartState();
        root.eachBefore(node => {
            if (node.children) {
                const compactChildren = node.children.filter(d => d.flexCompactDim);
                const fch = compactChildren[0];
                if (!fch) return;
                compactChildren.forEach((child, i, arr) => {
                    if (i == 0) fch.x -= fch.flexCompactDim[0] / 2;
                    if (i & i % 2 - 1) child.x = fch.x + fch.flexCompactDim[0] * 0.25 - attrs.compactMarginPair(child) / 4;
                    else if (i) child.x = fch.x + fch.flexCompactDim[0] * 0.75 + attrs.compactMarginPair(child) / 4;
                })
                const centerX = fch.x + fch.flexCompactDim[0] * 0.5;
                fch.x = fch.x + fch.flexCompactDim[0] * 0.25 - attrs.compactMarginPair(fch) / 4;
                const offsetX = node.x - centerX;
                if (Math.abs(offsetX) < 10) {
                    compactChildren.forEach(d => d.x += offsetX);
                }

                const rowsMapNew = this.groupBy(compactChildren, d => d.row, reducedGroup => d3.max(reducedGroup, d => attrs.layoutBindings[attrs.layout].compactDimension.sizeRow(d)));
                const cumSum = d3.cumsum(rowsMapNew.map(d => d[1] + attrs.compactMarginBetween(d)));
                compactChildren
                    .forEach((node, i) => {
                        if (node.row) {
                            node.y = fch.y + cumSum[node.row - 1]
                        } else {
                            node.y = fch.y;
                        }
                    })

            }
        })
    }

    // This function basically redraws visible graph, based on nodes state
    update({ x0, y0, x = 0, y = 0, width, height }) {
        const attrs = this.getChartState();
        const calc = attrs.calc;

        // Paging
        if (attrs.compact) {
            this.calculateCompactFlexDimensions(attrs.root);
        }

        //  Assigns the x and y position for the nodes
        const treeData = attrs.flexTreeLayout(attrs.root);

        // Reassigns the x and y position for the based on the compact layout
        if (attrs.compact) {
            this.calculateCompactFlexPositions(attrs.root);
        }

        const nodes = treeData.descendants();

        // console.table(nodes.map(d => ({ x: d.x, y: d.y, width: d.width, height: d.height, flexCompactDim: d.flexCompactDim + "" })))

        // Get all links
        const links = treeData.descendants().slice(1);
        nodes.forEach(attrs.layoutBindings[attrs.layout].swap)

        // Connections
        const connections = attrs.connections;
        const allNodesMap = {};
        attrs.allNodes.forEach(d => allNodesMap[attrs.nodeId(d.data)] = d);

        const visibleNodesMap = {}
        nodes.forEach(d => visibleNodesMap[attrs.nodeId(d.data)] = d);

        connections.forEach(connection => {
            const source = allNodesMap[connection.from];
            const target = allNodesMap[connection.to];
            connection._source = source;
            connection._target = target;
        })
        const visibleConnections = connections.filter(d => visibleNodesMap[d.from] && visibleNodesMap[d.to]);
        const defsString = attrs.defs.bind(this)(attrs, visibleConnections);
        const existingString = attrs.defsWrapper.html();
        if (defsString !== existingString) {
            attrs.defsWrapper.html(defsString)
        }

        // --------------------------  LINKS ----------------------
        // Get links selection
        const linkSelection = attrs.linksWrapper
            .selectAll("path.link")
            .data(links, (d) => attrs.nodeId(d.data));

        // Enter any new links at the parent's previous position.
        const linkEnter = linkSelection
            .enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", (d) => {
                const xo = attrs.layoutBindings[attrs.layout].linkJoinX({ x: x0, y: y0, width, height });
                const yo = attrs.layoutBindings[attrs.layout].linkJoinY({ x: x0, y: y0, width, height });
                const o = { x: xo, y: yo };
                return attrs.layoutBindings[attrs.layout].diagonal(o, o, o);
            });

        // Get links update selection
        const linkUpdate = linkEnter.merge(linkSelection);

        // Styling links
        linkUpdate
            .attr("fill", "none")


        if (this.isEdge()) {
            linkUpdate
                .style('display', d => {
                    const display = d.data._pagingButton ? 'none' : 'auto'
                    return display;
                })
        } else {
            linkUpdate
                .attr('display', d => {
                    const display = d.data._pagingButton ? 'none' : 'auto'
                    return display;
                })
        }

        // Allow external modifications
        linkUpdate.each(attrs.linkUpdate);

        // Transition back to the parent element position
        linkUpdate
            .transition()
            .duration(attrs.duration)
            .attr("d", (d) => {
                const n = attrs.compact && d.flexCompactDim ?
                    {
                        x: attrs.layoutBindings[attrs.layout].compactLinkMidX(d, attrs),
                        y: attrs.layoutBindings[attrs.layout].compactLinkMidY(d, attrs)
                    } :
                    {
                        x: attrs.layoutBindings[attrs.layout].linkX(d),
                        y: attrs.layoutBindings[attrs.layout].linkY(d)
                    };

                const p = {
                    x: attrs.layoutBindings[attrs.layout].linkParentX(d),
                    y: attrs.layoutBindings[attrs.layout].linkParentY(d),
                };

                const m = attrs.compact && d.flexCompactDim ? {
                    x: attrs.layoutBindings[attrs.layout].linkCompactXStart(d),
                    y: attrs.layoutBindings[attrs.layout].linkCompactYStart(d),
                } : n;
                return attrs.layoutBindings[attrs.layout].diagonal(n, p, m, { sy: attrs.linkYOffset });
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
                return attrs.layoutBindings[attrs.layout].diagonal(o, o, null, { sy: attrs.linkYOffset });
            })
            .remove();


        // --------------------------  CONNECTIONS ----------------------

        const connectionsSel = attrs.connectionsWrapper
            .selectAll("path.connection")
            .data(visibleConnections)

        // Enter any new connections at the parent's previous position.
        const connEnter = connectionsSel
            .enter()
            .insert("path", "g")
            .attr("class", "connection")
            .attr("d", (d) => {
                const xo = attrs.layoutBindings[attrs.layout].linkJoinX({ x: x0, y: y0, width, height });
                const yo = attrs.layoutBindings[attrs.layout].linkJoinY({ x: x0, y: y0, width, height });
                const o = { x: xo, y: yo };
                return attrs.layoutBindings[attrs.layout].diagonal(o, o, null, { sy: attrs.linkYOffset });
            });


        // Get connections update selection
        const connUpdate = connEnter.merge(connectionsSel);

        // Styling connections
        connUpdate.attr("fill", "none")

        // Transition back to the parent element position
        connUpdate
            .transition()
            .duration(attrs.duration)
            .attr('d', (d) => {
                const xs = attrs.layoutBindings[attrs.layout].linkX({ x: d._source.x, y: d._source.y, width: d._source.width, height: d._source.height });
                const ys = attrs.layoutBindings[attrs.layout].linkY({ x: d._source.x, y: d._source.y, width: d._source.width, height: d._source.height });
                const xt = attrs.layoutBindings[attrs.layout].linkJoinX({ x: d._target.x, y: d._target.y, width: d._target.width, height: d._target.height });
                const yt = attrs.layoutBindings[attrs.layout].linkJoinY({ x: d._target.x, y: d._target.y, width: d._target.width, height: d._target.height });
                return attrs.linkGroupArc({ source: { x: xs, y: ys }, target: { x: xt, y: yt } })
            })

        // Allow external modifications
        connUpdate.each(attrs.connectionsUpdate);

        // Remove any  links which is exiting after animation
        const connExit = connectionsSel
            .exit()
            .transition()
            .duration(attrs.duration)
            .attr('opacity', 0)
            .remove();

        // --------------------------  NODES ----------------------
        // Get nodes selection
        const nodesSelection = attrs.nodesWrapper
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
            .on("click.node", (event, node) => {
                const { data } = node;
                if ([...event.srcElement.classList].includes("node-button-foreign-object")) {
                    return;
                }
                if ([...event.srcElement.classList].includes("paging-button-wrapper")) {
                    this.loadPagingNodes(node);
                    return;
                }
                if (!data._pagingButton) {
                    attrs.onNodeClick(node);
                    return;
                }
                console.log('event fired, no handlers')
            })
            //  Event handler to the expand button
            .on("keydown.node", (event, node) => {
                const { data } = node;
                if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
                    if ([...event.srcElement.classList].includes("node-button-foreign-object")) {
                        return;
                    }
                    if ([...event.srcElement.classList].includes("paging-button-wrapper")) {
                        this.loadPagingNodes(node);
                        return;
                    }
                    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
                        this.onButtonClick(event, node)
                    }
                }
            });
        nodeEnter.each(attrs.nodeEnter)

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

        // Add foreignObject element inside rectangle
        const fo = nodeUpdate.patternify({
            tag: "foreignObject",
            selector: "node-foreign-object",
            data: (d) => [d]
        })
            .style('overflow', 'visible')

        // Add foreign object
        fo.patternify({
            tag: "xhtml:div",
            selector: "node-foreign-object-div",
            data: (d) => [d]
        })

        this.restyleForeignObjectElements();

        // Add Node button circle's group (expand-collapse button)
        const nodeButtonGroups = nodeEnter
            .patternify({
                tag: "g",
                selector: "node-button-g",
                data: (d) => [d]
            })
            .on("click", (event, d) => this.onButtonClick(event, d))
            .on("keydown", (event, d) => {
                if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
                    this.onButtonClick(event, d)
                }
            });

        nodeButtonGroups.patternify({
            tag: 'rect',
            selector: 'node-button-rect',
            data: (d) => [d]
        })
            .attr('opacity', 0)
            .attr('pointer-events', 'all')
            .attr('width', d => attrs.nodeButtonWidth(d))
            .attr('height', d => attrs.nodeButtonHeight(d))
            .attr('x', d => attrs.nodeButtonX(d))
            .attr('y', d => attrs.nodeButtonY(d))

        // Add expand collapse button content
        const nodeFo = nodeButtonGroups
            .patternify({
                tag: "foreignObject",
                selector: "node-button-foreign-object",
                data: (d) => [d]
            })
            .attr('width', d => attrs.nodeButtonWidth(d))
            .attr('height', d => attrs.nodeButtonHeight(d))
            .attr('x', d => attrs.nodeButtonX(d))
            .attr('y', d => attrs.nodeButtonY(d))
            .style('overflow', 'visible')
            .patternify({
                tag: "xhtml:div",
                selector: "node-button-div",
                data: (d) => [d]
            })
            .style('pointer-events', 'none')
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
            .attr('rx', 3)
            .attr("fill", attrs.nodeDefaultBackground)


        nodeUpdate.select(".node-button-g").attr("transform", ({ data, width, height }) => {
            const x = attrs.layoutBindings[attrs.layout].buttonX({ width, height });
            const y = attrs.layoutBindings[attrs.layout].buttonY({ width, height });
            return `translate(${x},${y})`
        })
            .attr("display", ({ data }) => {
                return data._directSubordinates > 0 ? null : 'none';
            })
            .attr("opacity", ({ data, children, _children }) => {
                if (data._pagingButton) {
                    return 0;
                }
                if (children || _children) {
                    return 1;
                }
                return 0;
            });

        // Restyle node button circle
        nodeUpdate
            .select(".node-button-foreign-object .node-button-div")
            .html((node) => {
                return attrs.buttonContent({ node, state: attrs })
            })

        // Restyle button texts
        nodeUpdate
            .select(".node-button-text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("font-size", ({ children }) => {
                if (children) return 40;
                return 26;
            })
            .text(({ children }) => {
                if (children) return "-";
                return "+";
            })
            .attr("y", this.isEdge() ? 10 : 0);

        nodeUpdate.each(attrs.nodeUpdate)

        // Remove any exiting nodes after transition
        const nodeExitTransition = nodesSelection
            .exit()
        nodeExitTransition.each(attrs.nodeExit)

        const maxDepthNode = nodeExitTransition.data().reduce((a, b) => a.depth < b.depth ? a : b, { depth: Infinity });

        nodeExitTransition.attr("opacity", 1)
            .transition()
            .duration(attrs.duration)
            .attr("transform", (d) => {

                let { x, y, width, height } = maxDepthNode.parent || {};
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
            let centeredNodes = [centeredNode]
            if (centeredNode.data._centeredWithDescendants) {
                if (attrs.compact) {
                    centeredNodes = centeredNode.descendants().filter((d, i) => i < 7);
                } else {
                    centeredNodes = centeredNode.descendants().filter((d, i, arr) => {
                        const h = Math.round(arr.length / 2);
                        const spread = 2;
                        if (arr.length % 2) {
                            return i > h - spread && i < h + spread - 1;
                        }

                        return i > h - spread && i < h + spread;
                    });
                }

            }
            centeredNode.data._centeredWithDescendants = null;
            centeredNode.data._centered = null;
            this.fit({
                animate: true,
                scale: false,
                nodes: centeredNodes
            })
        }

    }

    // This function detects whether current browser is edge
    isEdge() {
        return window.navigator.userAgent.includes("Edge");
    }

    // Generate horizontal diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges-horizontal-d3-v3-v4-v5-v6
    hdiagonal(s, t, m, offsets) {
        const state = this.getChartState();
        return state.hdiagonal(s, t, m, offsets);
    }

    // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges
    diagonal(s, t, m, offsets) {
        const state = this.getChartState();
        return state.diagonal(s, t, m, offsets);
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
            .html(function (d, i, arr) {
                if (d.data._pagingButton) {
                    return `<div class="paging-button-wrapper"><div style="pointer-events:none">${attrs.pagingButton(d, i, arr, attrs)}</div></div>`;
                }
                return attrs.nodeContent.bind(this)(d, i, arr, attrs)
            })
    }

    // Toggle children on click.
    onButtonClick(event, d) {
        const attrs = this.getChartState();
        if (d.data._pagingButton) {
            return;
        }
        if (attrs.setActiveNodeCentered) {
            d.data._centered = true;
            d.data._centeredWithDescendants = true;
        }

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
            if (d.children) {
                d.children.forEach(({ data }) => (data._expanded = true));
            }
        }

        // Redraw Graph
        this.update(d);
        event.stopPropagation();

        // Trigger callback
        attrs.onExpandOrCollapse(d);

    }

    // This function changes `expanded` property to descendants
    setExpansionFlagToChildren({ data, children, _children }, flag) {
        // Set flag to the current property
        data._expanded = flag;

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


    // Method which only expands nodes, which have property set "expanded=true"
    expandSomeNodes(d) {
        // If node has expanded property set
        if (d.data._expanded) {
            // Retrieve node's parent
            let parent = d.parent;

            // While we can go up
            while (parent && parent._children) {
                // Expand all current parent's children
                parent.children = parent._children;
                parent._children = null;
                // Replace current parent holding object
                parent = parent.parent;
            }
        }

        // Recursively do the same for collapsed nodes
        if (d._children) {
            d._children.forEach((ch) => this.expandSomeNodes(ch));
        }

        // Recursively do the same for expanded nodes
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

        attrs.generateRoot = d3
            .stratify()
            .id((d) => attrs.nodeId(d))
            .parentId(d => attrs.parentNodeId(d))
        attrs.root = attrs.generateRoot(attrs.data);

        const descendantsBefore = attrs.root.descendants();
        if (attrs.initialExpandLevel > 1 && descendantsBefore.length > 0) {
            descendantsBefore.forEach((d) => {
                if (d.depth <= attrs.initialExpandLevel) {
                    d.data._expanded = true;
                }
            })
            attrs.initialExpandLevel = 1;
        }


        const hiddenNodesMap = {};
        attrs.root.descendants()
            .filter(node => node.children)
            .filter(node => !node.data._pagingStep)
            .forEach(node => {
                node.data._pagingStep = attrs.minPagingVisibleNodes(node);
            })



        attrs.root.eachBefore((node, i) => {
            node.data._directSubordinatesPaging = node.children ? node.children.length : 0;
            if (node.children) {
                node.children.forEach((child, j) => {
                    child.data._pagingButton = false;
                    if (j > node.data._pagingStep) {
                        hiddenNodesMap[child.id] = true;
                    }
                    if (j === node.data._pagingStep && (node.children.length - 1) > node.data._pagingStep) {
                        child.data._pagingButton = true;
                    }
                    if (hiddenNodesMap[child.parent.id]) {
                        hiddenNodesMap[child.id] = true;
                    }
                    if (child.data._expanded || child.data._centered || child.data._highlighted || child.data._upToTheRootHighlighted) {
                        let localNode = child;
                        while (localNode && (hiddenNodesMap[localNode.id] || localNode.data._pagingButton)) {
                            hiddenNodesMap[localNode.id] = false;
                            if (localNode.data._pagingButton) {
                                localNode.data._pagingButton = false;
                                localNode.parent.children.forEach(ch => {
                                    ch.data._expanded = true;
                                    hiddenNodesMap[ch.id] = false;
                                })
                            }
                            localNode = localNode.parent;
                        }
                    }
                })
            }
        })


        attrs.root = d3
            .stratify()
            .id((d) => attrs.nodeId(d))
            .parentId(d => attrs.parentNodeId(d))(attrs.data.filter(d => hiddenNodesMap[d.id] !== true));

        attrs.root.each((node, i, arr) => {
            let _hierarchyHeight = node._hierarchyHeight || node.height
            let width = attrs.nodeWidth(node);
            let height = attrs.nodeHeight(node);
            Object.assign(node, { width, height, _hierarchyHeight })
        })

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

        if (attrs.root.children) {
            if (expandNodesFirst) {
                // Expand all nodes first
                attrs.root.children.forEach(this.expand);
            }
            // Then collapse them all
            attrs.root.children.forEach((d) => this.collapse(d));

            // Collapse root if level is 0
            if (attrs.initialExpandLevel == 0) {
                attrs.root._children = attrs.root.children;
                attrs.root.children = null;
            }

            // Then only expand nodes, which have expanded property set to true
            [attrs.root].forEach((ch) => this.expandSomeNodes(ch));
        }
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

    zoomTreeBounds({ x0, x1, y0, y1, params = { animate: true, scale: true, onCompleted: () => { } } }) {
        const { centerG, svgWidth: w, svgHeight: h, svg, zoomBehavior, duration, lastTransform } = this.getChartState()
        let scaleVal = Math.min(8, 0.9 / Math.max((x1 - x0) / w, (y1 - y0) / h));
        let identity = d3.zoomIdentity.translate(w / 2, h / 2)
        identity = identity.scale(params.scale ? scaleVal : lastTransform.k)

        identity = identity.translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
        // Transition zoom wrapper component into specified bounds
        svg.transition().duration(params.animate ? duration : 0).call(zoomBehavior.transform, identity);
        centerG.transition().duration(params.animate ? duration : 0).attr('transform', 'translate(0,0)')
            .on('end', function () {
                if (params.onCompleted) {
                    params.onCompleted()
                }
            })
    }

    fit({ animate = true, nodes, scale = true, onCompleted = () => { } } = {}) {
        const attrs = this.getChartState();
        const { root } = attrs;
        let descendants = nodes ? nodes : root.descendants();
        const minX = d3.min(descendants, d => d.x + attrs.layoutBindings[attrs.layout].nodeLeftX(d))
        const maxX = d3.max(descendants, d => d.x + attrs.layoutBindings[attrs.layout].nodeRightX(d))
        const minY = d3.min(descendants, d => d.y + attrs.layoutBindings[attrs.layout].nodeTopY(d))
        const maxY = d3.max(descendants, d => d.y + attrs.layoutBindings[attrs.layout].nodeBottomY(d))

        this.zoomTreeBounds({
            params: { animate: animate, scale, onCompleted },
            x0: minX - 50,
            x1: maxX + 50,
            y0: minY - 50,
            y1: maxY + 50,

        });
        return this;
    }

    // Load Paging Nodes
    loadPagingNodes(node) {
        const attrs = this.getChartState();
        node.data._pagingButton = false;
        const current = node.parent.data._pagingStep;
        const step = attrs.pagingStep(node.parent)
        const newPagingIndex = current + step;
        node.parent.data._pagingStep = newPagingIndex;
        this.updateNodesState();
    }

    // This function can be invoked via chart.setExpanded API, it expands or collapses particular node
    setExpanded(id, expandedFlag = true) {

        const attrs = this.getChartState();
        // Retrieve node by node Id
        const node = attrs.allNodes.filter(({ data }) => attrs.nodeId(data) == id)[0];

        if (!node) {
            console.log(`ORG CHART - ${expandedFlag ? "EXPAND" : "COLLAPSE"} - Node with id (${id})  not found in the tree`)
            return this;
        }
        node.data._expanded = expandedFlag;
        if (expandedFlag == false) {
            const parent = node.parent || { descendants: () => [] };
            const descendants = parent.descendants().filter(d => d != parent);
            descendants.forEach(d => d.data._expanded = false)
        }


        return this;
    }

    setCentered(nodeId) {
        const attrs = this.getChartState();
        // this.setExpanded(nodeId)
        const root = attrs.generateRoot(attrs.data)
        const descendants = root.descendants();
        const node = descendants.filter(({ data }) => attrs.nodeId(data).toString() == nodeId.toString())[0];
        if (!node) {
            console.log(`ORG CHART - CENTER - Node with id (${nodeId}) not found in the tree`)
            return this;
        }
        const ancestors = node.ancestors();
        ancestors.forEach(d => d.data._expanded = true)
        node.data._centered = true;
        node.data._expanded = true;
        return this;
    }

    setHighlighted(nodeId) {
        const attrs = this.getChartState();
        const root = attrs.generateRoot(attrs.data)
        const descendants = root.descendants();
        const node = descendants.filter(d => attrs.nodeId(d.data).toString() === nodeId.toString())[0];
        if (!node) {
            console.log(`ORG CHART - HIGHLIGHT - Node with id (${nodeId})  not found in the tree`);
            return this
        }
        const ancestors = node.ancestors();
        ancestors.forEach(d => d.data._expanded = true)
        node.data._highlighted = true;
        node.data._expanded = true;
        node.data._centered = true;
        return this;
    }

    setUpToTheRootHighlighted(nodeId) {
        const attrs = this.getChartState();
        const root = attrs.generateRoot(attrs.data)
        const descendants = root.descendants();
        const node = descendants.filter(d => attrs.nodeId(d.data).toString() === nodeId.toString())[0];
        if (!node) {
            console.log(`ORG CHART - HIGHLIGHTROOT - Node with id (${nodeId}) not found in the tree`)
            return this;
        }
        const ancestors = node.ancestors();
        ancestors.forEach(d => d.data._expanded = true)
        node.data._upToTheRootHighlighted = true;
        node.data._expanded = true;
        node.ancestors().forEach(d => d.data._upToTheRootHighlighted = true)
        return this;
    }

    clearHighlighting() {
        const attrs = this.getChartState();
        attrs.allNodes.forEach(d => {
            d.data._highlighted = false;
            d.data._upToTheRootHighlighted = false;
        })
        this.update(attrs.root);
        return this;
    }

    // It can take selector which would go fullscreen
    fullscreen(elem) {
        const attrs = this.getChartState();
        const el = d3.select(elem || attrs.container).node();

        d3.select(document).on('fullscreenchange.' + attrs.id, function (d) {
            const fsElement = document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement;
            if (fsElement == el) {
                setTimeout(d => {
                    attrs.svg.attr('height', window.innerHeight - 40);
                }, 500)
            } else {
                attrs.svg.attr('height', attrs.svgHeight)
            }
        })

        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
    }

    // Zoom in exposed method
    zoomIn() {
        const { svg, zoomBehavior } = this.getChartState();
        svg.transition().call(zoomBehavior.scaleBy, 1.3);
    }

    // Zoom out exposed method
    zoomOut() {
        const { svg, zoomBehavior } = this.getChartState();
        svg.transition().call(zoomBehavior.scaleBy, 0.78);
    }

    toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    exportImg({ full = false, scale = 3, onLoad = d => d, save = true, backgroundColor = "#FAFAFA" } = {}) {
        const that = this;
        const attrs = this.getChartState();
        const { svg: svgImg, root } = attrs
        let count = 0;
        const selection = svgImg.selectAll('img')
        let total = selection.size()

        const exportImage = () => {
            const transform = JSON.parse(JSON.stringify(that.lastTransform()));
            const duration = that.duration();
            if (full) {
                that.fit();
            }
            const { svg } = that.getChartState()

            setTimeout(d => {
                that.downloadImage({
                    node: svg.node(), scale,
                    isSvg: false,
                    backgroundColor,
                    onAlreadySerialized: d => {
                        that.update(root)
                    },
                    imageName: attrs.imageName,
                    onLoad: onLoad,
                    save
                })
            }, full ? duration + 10 : 0)
        }

        if (total > 0) {
            selection
                .each(function () {
                    that.toDataURL(this.src, (dataUrl) => {
                        this.src = dataUrl;
                        if (++count == total) {
                            exportImage();
                        }
                    })
                })
        } else {
            exportImage();
        }


    }



    exportSvg() {
        const { svg, imageName } = this.getChartState();
        this.downloadImage({ imageName: imageName, node: svg.node(), scale: 3, isSvg: true })
        return this;
    }

    expandAll() {
        const { allNodes, root, data } = this.getChartState();
        data.forEach(d => d._expanded = true)
        // allNodes.forEach(d => d.data._expanded = true);
        this.render()
        return this;
    }

    collapseAll() {
        const { allNodes, root } = this.getChartState();
        allNodes.forEach(d => d.data._expanded = false);
        this.initialExpandLevel(0)
        this.render();
        return this;
    }

    downloadImage({ node, scale = 2, imageName = 'graph', isSvg = false, save = true, backgroundColor = "#FAFAFA", onAlreadySerialized = d => { }, onLoad = d => { } }) {
        // Retrieve svg node
        const svgNode = node;

        function saveAs(uri, filename) {
            // create link
            var link = document.createElement('a');
            if (typeof link.download === 'string') {
                document.body.appendChild(link); // Firefox requires the link to be in the body
                link.download = filename;
                link.href = uri;
                link.click();
                document.body.removeChild(link); // remove the link when done
            } else {
                location.replace(uri);
            }
        }
        // This function serializes SVG and sets all necessary attributes
        function serializeString(svg) {
            const xmlns = 'http://www.w3.org/2000/xmlns/';
            const xlinkns = 'http://www.w3.org/1999/xlink';
            const svgns = 'http://www.w3.org/2000/svg';
            svg = svg.cloneNode(true);
            const fragment = window.location.href + '#';
            const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT, null, false);
            while (walker.nextNode()) {
                for (const attr of walker.currentNode.attributes) {
                    if (attr.value.includes(fragment)) {
                        attr.value = attr.value.replace(fragment, '#');
                    }
                }
            }
            svg.setAttributeNS(xmlns, 'xmlns', svgns);
            svg.setAttributeNS(xmlns, 'xmlns:xlink', xlinkns);
            const serializer = new XMLSerializer();
            const string = serializer.serializeToString(svg);
            return string;
        }

        if (isSvg) {
            let source = serializeString(svgNode);
            //add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            //convert svg source to URI data scheme.
            var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            saveAs(url, imageName + ".svg");
            onAlreadySerialized()
            return;
        }
        // Get image quality index (basically,  index you can zoom in)
        const quality = scale
        // Create image
        const image = document.createElement('img');
        image.onload = function () {
            // Create image canvas
            const canvas = document.createElement('canvas');
            // Set width and height based on SVG node
            const rect = svgNode.getBoundingClientRect();
            canvas.width = rect.width * quality;
            canvas.height = rect.height * quality;
            // Draw background
            const context = canvas.getContext('2d');
            context.fillStyle = backgroundColor;;
            context.fillRect(0, 0, rect.width * quality, rect.height * quality);
            context.drawImage(image, 0, 0, rect.width * quality, rect.height * quality);
            // Set some image metadata
            let dt = canvas.toDataURL('image/png');
            if (onLoad) {
                onLoad(dt)
            }
            if (save) {
                // Invoke saving function
                saveAs(dt, imageName + '.png');
            }

        };

        var url = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(serializeString(svgNode));

        onAlreadySerialized()

        image.src = url// URL.createObjectURL(blob);
        // This function invokes save window

    }

    // Calculate what size text will take
    getTextWidth(text, {
        fontSize = 14,
        fontWeight = 400,
        defaultFont = "Helvetice",
        ctx
    } = {}) {
        ctx.font = `${fontWeight || ''} ${fontSize}px ${defaultFont} `
        const measurement = ctx.measureText(text);
        return measurement.width;
    }

    // Clear after moving off from the page
    clear() {
        const attrs = this.getChartState();
        d3.select(window).on(`resize.${attrs.id}`, null);
        attrs.svg && attrs.svg.selectAll("*").remove();
    }
}