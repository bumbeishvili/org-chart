# D3 v5 organization chart
[![NPM Version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=1.0.10&x2=0)](https://npmjs.org/package/d3-org-chart) 





![](https://user-images.githubusercontent.com/6873202/57747856-5c078e00-76e8-11e9-82fe-73aa09ff42dd.gif)




Org chart built with d3 v5

## Examples

[Observable example](https://observablehq.com/@bumbeishvili/d3-v5-organization-chart)  (Most Updated)   
[Jsfiddle example](https://jsfiddle.net/k2ucqayn/)   
[Codepen example](https://codepen.io/bumbeishvili/full/arpJrv)  



### Installing

```
npm i d3-org-chart
```

### Usage
```
const TreeChart = require ('https://bundle.run/d3-org-chart@1.0.4');


new TreeChart()
   .container(container)
   .data(data)
   .svgWidth(width)
   .initialZoom(0.4)
   .onNodeClick(d=> console.log(d+' node clicked'))
   .render()
 
```

See usage example - https://observablehq.com/@bumbeishvili/tree-chart-npm-demo

## Authors

 [David   B ](https://davidb.dev)


