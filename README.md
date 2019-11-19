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
 [David   B ](https://davidb.dev)

## Donate
If this project helped you please consider donation. It allows me to find more time from my already busy schedule and put more features in graph (while still maintaining its flexibility) 

Buy me a co-fi here   

<a href="ko-fi.com/bumbeishvili
"> ![Screen Shot 2019-11-19 at 14 54 00](https://user-images.githubusercontent.com/6873202/69140715-82b1e180-0adc-11ea-9616-f25a02630a35.png)</a>
