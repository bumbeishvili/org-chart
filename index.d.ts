export type OrgChartDataItem<TData = {}> = TData & {
  id: string;
  parentId?: string;
};

export type OrgChartPropertySetter<T> = (value: T) => OrgChart;

export type OrgChartConnection = {
  from: string;
  to: string;
  label: string;
};

export type LayoutBinding = {
  nodeLeftX: (node) => number;
  nodeRightX: (node) => number;
  nodeTopY: (node) => number;
  nodeBottomY: (node) => number;
  nodeJoinX: (node) => number;
  nodeJoinY: (node) => number;
  linkJoinX: (node) => number;
  linkJoinY: (node) => number;
  linkX: (node) => number;
  linkY: (node) => number;
  linkCompactXStart: (node) => number;
  linkCompactYStart: (node) => number;
  compactLinkMidX: (node) => number;
  compactLinkMidY: (node) => number;
  linkParentX: (node) => number;
  linkParentY: (node) => number;
  buttonX: (node) => number;
  buttonY: (node) => number;
  centerTransform: ({ root, rootMargin, centerY, scale, centerX }) => string;
  compactDimension: {
    sizeColumn: (node) => number;
    sizeRow: (node) => number;
    reverse: <T>(arr: Array<T>) => Array<T>;
  };
  nodeFlexSize: ({ height, width, siblingsMargin, childrenMargin, state, node }) => [number, number];
  zoomTransform: ({ centerY, scale }) => string;
  diagonal: (s, t, m) => string;
  swap: (d) => void;
  nodeUpdateTransform: ({ x, y, width, height }) => string;
};

export type LayoutBindings = {
  left: LayoutBinding;
  top: LayoutBinding;
  bottom: LayoutBinding;
  right: LayoutBinding;
};

export class OrgChart {
  // Configure svg width
  svgWidth: OrgChartPropertySetter<number>;
  // Configure svg height
  svgHeight: OrgChartPropertySetter<number>;
  // Set parent container, either CSS style selector or DOM element
  container: OrgChartPropertySetter<HTMLDivElement | string>;
  // Set data, it must be an array of objects, where hierarchy is clearly defined via id and parent ID (property names are configurable)
  data: OrgChartPropertySetter<OrgChartDataItem[] | null>;
  // Sets connection data, array of objects, SAMPLE:  [{from:"145",to:"201",label:"Conflicts of interest"}]
  connections: OrgChartPropertySetter<OrgChartConnection[]>;
  // Set default font
  defaultFont: OrgChartPropertySetter<string>;
  // Configure accessor for node id, default is either odeId or id
  nodeId: OrgChartPropertySetter<(d) => string>;
  // Configure accessor for parent node id, default is either parentNodeId or parentId
  parentNodeId: OrgChartPropertySetter<(d) => string | undefined>;
  // Configure how much root node is offset from top
  rootMargin: OrgChartPropertySetter<number>;
  // Configure each node width, use with caution, it is better to have the same value set for all nodes
  nodeWidth: OrgChartPropertySetter<(d3Node) => number>;
  //  Configure each node height, use with caution, it is better to have the same value set for all nodes
  nodeHeight: OrgChartPropertySetter<(d) => number>;
  // Configure margin between two nodes, use with caution, it is better to have the same value set for all nodes
  neighbourMargin: OrgChartPropertySetter<(n1, n2) => number>;
  // Configure margin between two siblings, use with caution, it is better to have the same value set for all nodes
  siblingsMargin: OrgChartPropertySetter<(d3Node) => number>;
  // Configure margin between parent and children, use with caution, it is better to have the same value set for all nodes
  childrenMargin: OrgChartPropertySetter<(d) => number>;
  // Configure margin between two nodes in compact mode, use with caution, it is better to have the same value set for all nodes
  compactMarginPair: OrgChartPropertySetter<(d) => number>;
  // Configure margin between two nodes in compact mode, use with caution, it is better to have the same value set for all nodes
  compactMarginBetween: OrgChartPropertySetter<(d3Node) => number>;
  // Configure expand & collapse button width
  nodeButtonWidth: OrgChartPropertySetter<(d) => number>;
  // Configure expand & collapse button height
  nodeButtonHeight: OrgChartPropertySetter<(d) => number>;
  // Configure expand & collapse button x position
  nodeButtonX: OrgChartPropertySetter<(d) => number>;
  // Configure expand & collapse button y position
  nodeButtonY: OrgChartPropertySetter<(d) => number>;
  // When correcting links which is not working for safari
  linkYOffset: OrgChartPropertySetter<number>;
  // Configure how many nodes to show when making new nodes appear
  pagingStep: OrgChartPropertySetter<(d) => number>;
  // Configure minimum number of visible nodes , after which paging button appears
  minPagingVisibleNodes: OrgChartPropertySetter<(d) => number>;
  // Configure zoom scale extent , if you don't want any kind of zooming, set it to [1,1]
  scaleExtent: OrgChartPropertySetter<[number, number]>;
  duration: OrgChartPropertySetter<number>; // Configure duration of transitions
  // Configure exported PNG and SVG image name
  imageName: OrgChartPropertySetter<string>;
  // Configure if active node should be centered when expanded and collapsed
  setActiveNodeCentered: OrgChartPropertySetter<boolean>;
  // Configure layout direction , possible values are "top", "left", "right", "bottom"
  layout: OrgChartPropertySetter<string>;
  // Configure if compact mode is enabled , when enabled, nodes are shown in compact positions, instead of horizontal spread
  compact: OrgChartPropertySetter<boolean>;
  // Callback for zoom & panning start
  onZoomStart: OrgChartPropertySetter<(d) => void>;
  // Callback for zoom & panning
  onZoom: OrgChartPropertySetter<(d) => void>;
  // Callback for zoom & panning end
  onZoomEnd: OrgChartPropertySetter<(d) => void>;
  // Callback for node click
  onNodeClick: OrgChartPropertySetter<(d) => void>;
  nodeContent: OrgChartPropertySetter<(d) => string>;

  // Enable drag and drop
  dragNDrop: OrgChartPropertySetter<boolean>;
  onNodeDrop: OrgChartPropertySetter<(source, target) => boolean>;
  isNodeDraggable: OrgChartPropertySetter<(node) => boolean>;
  isNodeDroppable: OrgChartPropertySetter<(source, target) => boolean>;

  /* Node expand & collapse button content and styling. You can access same helper methods as above */
  buttonContent: OrgChartPropertySetter<({ node, state }) => string>;
  /* Node paging button content and styling. You can access same helper methods as above. */
  pagingButton: OrgChartPropertySetter<(d, i, arr, state) => string>;
  /* You can access and modify actual node DOM element in runtime using this method. */
  nodeUpdate: OrgChartPropertySetter<(d, i, arr) => void>;
  /* You can access and modify actual link DOM element in runtime using this method. */
  linkUpdate: OrgChartPropertySetter<(d, i, arr) => void>;
  /* Horizontal diagonal generation algorithm - https://observablehq.com/@bumbeishvili/curved-edges-compact-horizontal */
  hdiagonal: OrgChartPropertySetter<(s, t, m) => string>;
  /* Vertical diagonal generation algorithm - https://observablehq.com/@bumbeishvili/curved-edges-compacty-vertical */
  diagonal: OrgChartPropertySetter<(s, t, m, offsets?: { sy: number }) => string>;
  // Defining arrows with markers for connections
  defs: OrgChartPropertySetter<(state, visibleConnections) => string>;
  /* You can update connections with custom styling using this function */
  connectionsUpdate: OrgChartPropertySetter<(d, i, arr) => void>;
  // Link generator for connections
  linkGroupArc: OrgChartPropertySetter<any>;

  /*
   *   You can customize/offset positions for each node and link by overriding these functions
   *   For example, suppose you want to move link y position 30 px bellow in top layout. You can do it like this:
   *   ```javascript
   *   const layout = chart.layoutBindings();
   *   layout.top.linkY = node => node.y + 30;
   *   chart.layoutBindings(layout);
   *   ```
   */
  layoutBindings: OrgChartPropertySetter<LayoutBindings>;

  /* Methods*/

  render: () => void;
  setExpanded: (nodeId: string, expandedFlag?: boolean) => OrgChart;
  setCentered: (nodeId: string) => OrgChart;
  setHighlighted: (nodeId: string) => OrgChart;
  setUpToTheRootHighlighted: (nodeId: string) => OrgChart;
  clearHighlighting: () => void;
  addNode: (node: OrgChartDataItem) => void;
  removeNode: (nodeId: string) => void;
  fit: (opts?: { animate: boolean; nodes: string[]; scale: boolean }) => OrgChart;
  fullscreen: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  expandAll: () => void;
  collapseAll: () => void;
  exportSvg: () => void;
  exportImg: (opts?: { full: boolean; scale: number; onLoad: (img: string) => void; save: boolean }) => void;
}
