# D3 v5 organization chart
[![NPM Version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=1.1.1&x2=0)](https://npmjs.org/package/d3-org-chart) 
[![](https://img.shields.io/npm/dm/d3-org-chart)](https://npmjs.org/package/d3-org-chart)

<p align="center">
   <!-- Thanks Vasturiano for this trick -  https://github.com/vasturiano -->
     <a href="https://observablehq.com/@bumbeishvili/d3-v5-organization-chart"><img width="100%" src="https://user-images.githubusercontent.com/6873202/129306455-09f47e5e-0dc8-41b5-8fe2-da3fa4e0f7ed.gif"></a>
</p>






Highly customizable org chart built with d3 v5.

Have you impressivelly  customized  an organizational chart and want to be featured on this page? Just email me at me@davidb.dev and include screenshot  of your org chart and it will be featured on this page (dimensions of image should be 500 X 500).


## Jump To Examples



| | | 
|:-------------------------:|:-------------------------:|
|<a href="https://stackblitz.com/edit/web-platform-sgsxzp"><img height="450px"  src="https://user-images.githubusercontent.com/6873202/128979415-1b7fb969-6fc6-4a25-9ae2-87da7a9b031c.png"></a> <div style="100%">Default</div>  |  <a href="https://stackblitz.com/edit/web-platform-jyncb9"><img  height="450px"   src="https://user-images.githubusercontent.com/6873202/128979000-e5111571-8021-4c56-93d3-8d40dfe57536.png"></a> <div style="100%">Sky </div>
 |  <a href="https://stackblitz.com/edit/web-platform-lwyild"><img  height="450px"   src="https://user-images.githubusercontent.com/6873202/128978399-32f890c6-86f7-46e2-b41e-58202e61f03b.png"></a> <div style="100%">Circles</div>|  <a href="https://stackblitz.com/edit/web-platform-uhd3q7"><img  height="450px"   src="https://user-images.githubusercontent.com/6873202/129042576-0a8b27da-7a9d-4dee-b5b6-68080772cc9f.png"></a> <div style="100%">Oval</div>| 
  |  <a href="https://stackblitz.com/edit/web-platform-3gwnsg"><img  height="450px"   src="https://user-images.githubusercontent.com/6873202/129054271-21ba5182-38c5-4856-bb21-727bba49243a.png"></a> <div style="100%">Clean (Design by [Anton](https://dribbble.com/shots/15480691-Org-chart))</div>|  <a href="https://stackblitz.com/edit/web-platform-o5t1ha"><img  height="450px"   src="https://user-images.githubusercontent.com/6873202/129182014-610b6761-6dd4-4847-92cb-66407a900d03.png"></a> <div style="100%">Futuristic - Full Functionality</div>|


#### Featured customizations:

| | | | |
|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|
|<img  alt="screen shot 2017-08-07 at 12 18 15 pm" src="https://user-images.githubusercontent.com/6873202/120426599-753c0f80-c381-11eb-9695-c63808c98951.png"> <div style="100%">Light gradient version with horizontal layout</div>  |  <img  alt="screen shot 2017-08-07 at 12 18 15 pm" src="https://user-images.githubusercontent.com/6873202/120426591-6f462e80-c381-11eb-9f77-2cf85b216a41.png"> <div style="100%">Compact layout</div> |



Check out several libraries and frameworks integrations

* [Vue.js Integration](https://stackblitz.com/edit/d3-org-chart-vue-integration)  
* [React integration](https://stackblitz.com/edit/d3-org-chart-react-integration-hooks)  
* [Angular integration](https://stackblitz.com/edit/d3-org-chart-angular-integration)  

Custom components & algorithms I used

* [Curved edges - vertical](https://observablehq.com/@bumbeishvili/curved-edges-compacty-vertical) 
* [Curved edges - horizontal](https://observablehq.com/@bumbeishvili/curved-edges-compact-horizontal)
* [Flextree Algorithm](https://github.com/Klortho/d3-flextree)


### Installing

```
npm i d3-org-chart
```


### Usage
```javascript
const TreeChart = require ('https://bundle.run/d3-org-chart@1.0.4');


new TreeChart()
   .container(<myDOMElement>)  // Dom element or css selector
   .data(<myData>)    // Tabular data, where hierarchy is defined using id and parentNodeId columns
   .nodeId(d=>d.id)   // By default id and nodeId is looked for
   .parentNodeid(d=>d.parentId) // By default id and parentNodeId is looked for
   .render()
```


## Notes & appreciations 
I created this org-chart when I was hired by [TeamApps](https://github.com/teamapps-org).

Although this Org chart was specifically created for [teamapps java web application framework](https://github.com/teamapps-org/teamapps) , it's very flexible and can be used in any environment, where d3 and DOM is accessible. 

Big thanks to  [Matthias](https://github.com/Matthias-Bernstein) and [Yann](https://github.com/yamass), who assembled requirements for org-chart and had valuable pieces of advice afterwads.

Also, thanks for all people who made generous [donations](https://ko-fi.com/bumbeishvili), it gives me motivation to further improve this org chart component.

Thanks [contractzen](https://www.contractzen.com/)  for the significant contribution, which made implementation of some of the most important features (optimal layout, exporting ) possible.



## Author
 [David   B (twitter)](https://twitter.com/dbumbeishvili)  
 [David   B (linkedin)](https://www.linkedin.com/in/bumbeishvili/)  

I am available for freelance data visualization work. Please [contact me](https://davidb.dev/contact) in case you'd like me to help you with my experience and expertise

