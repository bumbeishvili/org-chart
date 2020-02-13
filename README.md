# D3 v5 organization chart
[![NPM Version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=1.0.10&x2=0)](https://npmjs.org/package/d3-org-chart) 





![gff](https://user-images.githubusercontent.com/6873202/74429052-a7b3b780-4e73-11ea-82c2-b65b5bd0c27d.gif)




Org chart built with d3 v5

## Examples

[Observable example](https://observablehq.com/@bumbeishvili/d3-v5-organization-chart)  (Most Updated)   
[Jsfiddle example](https://jsfiddle.net/k2ucqayn/)   
[Codepen example](https://codepen.io/bumbeishvili/full/arpJrv)  



### Installing

```
npm i d3-org-chart
```

### Docs
[Weak Wiki](https://github.com/bumbeishvili/d3-organization-chart/wiki)

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

## Notes & appreciations 
I created this org-chart when I was hired by [TeamApps](https://github.com/teamapps-org).

Although this Org chart was specifically created for [teamapps java web application framework](https://github.com/teamapps-org/teamapps) , it's very flexible and can be used in any envornment, where d3 and DOM is accessible. 

Big thanks to  [Matthias](https://github.com/Matthias-Bernstein) and [Yann](https://github.com/yamass), who assembled requirements for org-chart and had valuable pieces of advice afterwads.



## Authors
 [David   B (twitter)](https://twitter.com/dbumbeishvili)

## Donate
If this project helped you please consider donation. It allows me to find more time from my already busy schedule and put more features in graph (while still maintaining its flexibility) 
 
<a href='https://ko-fi.com/S6S018EES' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi2.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
