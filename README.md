# D3 v5 organization chart
[![NPM Version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=1.1.1&x2=0)](https://npmjs.org/package/d3-org-chart) 
[![](https://img.shields.io/npm/dm/d3-org-chart)](https://npmjs.org/package/d3-org-chart)

<p align="center">
   <!-- Thanks Vasturiano for this trick -  https://github.com/vasturiano -->
     <a href="https://observablehq.com/@bumbeishvili/d3-v5-organization-chart"><img width="80%" src="https://user-images.githubusercontent.com/6873202/74429052-a7b3b780-4e73-11ea-82c2-b65b5bd0c27d.gif"></a>
</p>






Highly customizable org chart built with d3 v5.

Have you impressivelly  customized  an organizational chart and want to be featured on this page? Just email me at me@davidb.dev and include screenshot  of your org chart and it will be featured on this page (dimensions of image should be 500 X 500).


Featured customizations:

| | | | |
|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|
|<img  alt="screen shot 2017-08-07 at 12 18 15 pm" src="https://user-images.githubusercontent.com/6873202/120426599-753c0f80-c381-11eb-9695-c63808c98951.png"> <div style="100%">Light gradient version with horizontal layout</div>  |  <img  alt="screen shot 2017-08-07 at 12 18 15 pm" src="https://user-images.githubusercontent.com/6873202/120426591-6f462e80-c381-11eb-9f77-2cf85b216a41.png"> <div style="100%">Compact layout</div> |




Check out examples

* [Observable example](https://observablehq.com/@bumbeishvili/d3-v5-organization-chart)  (Most Updated)   
* [Jsfiddle example](https://jsfiddle.net/k2ucqayn/)   
* [Codepen example](https://codepen.io/bumbeishvili/full/arpJrv)  


Check out several libraries and frameworks integrations

* [Vue.js Integration](https://stackblitz.com/edit/d3-org-chart-vue-integration)  
* [React integration](https://stackblitz.com/edit/d3-org-chart-react-integration-hooks)  
* [Angular integration](https://stackblitz.com/edit/d3-org-chart-angular-integration)  

Custom components & algorithms I used

* [Curved edges](https://observablehq.com/@bumbeishvili/curved-edges?collection=@bumbeishvili/work-components) - observablehq playground


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
   .container(<myDOMElement>)
   .data(<myData>)
   .svgWidth(700)
   .initialZoom(0.4)
   .onNodeClick(d=> console.log(d+' node clicked'))
   .render()
 
```


## Notes & appreciations 
I created this org-chart when I was hired by [TeamApps](https://github.com/teamapps-org).

Although this Org chart was specifically created for [teamapps java web application framework](https://github.com/teamapps-org/teamapps) , it's very flexible and can be used in any environment, where d3 and DOM is accessible. 

Big thanks to  [Matthias](https://github.com/Matthias-Bernstein) and [Yann](https://github.com/yamass), who assembled requirements for org-chart and had valuable pieces of advice afterwads.



## Author
 [David   B (twitter)](https://twitter.com/dbumbeishvili)  
 [David   B (linkedin)](https://www.linkedin.com/in/bumbeishvili/)  

I am available for freelance data visualization work. Please [contact me](https://davidb.dev/contact) in case you'd like me to help you with my experience and expertise

