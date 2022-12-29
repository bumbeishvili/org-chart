[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

# Highly customizable d3 based organization chart

<span class="badge-npmversion"><a href="https://npmjs.org/package/d3-org-chart" title="View this project on NPM"><img src="https://img.shields.io/npm/v/d3-org-chart.svg" alt="NPM version" /></a></span>
[![](https://img.shields.io/npm/dm/d3-org-chart)](https://npmjs.org/package/d3-org-chart)

<p align="center">
   <!-- Thanks Vasturiano for this trick -  https://github.com/vasturiano -->
     <a href="https://stackblitz.com/edit/web-platform-o5t1ha"><img width="100%" src="https://user-images.githubusercontent.com/6873202/129306455-09f47e5e-0dc8-41b5-8fe2-da3fa4e0f7ed.gif"></a>
</p>

[Medium article about this project](https://bumbeishvili.medium.com/introducing-a-new-org-chart-130368314f04)

Highly customizable org chart built with d3 v7.

Have you impressively customized an organizational chart and want to be featured on this page? Just email me at me@davidb.dev and include screenshot of your org chart and it will be featured on this page (dimensions of image should be 500 X 500).

## Jump To Examples

|                                                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                          |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                  <a href="https://stackblitz.com/edit/web-platform-sgsxzp"><img height="400px"  src="https://user-images.githubusercontent.com/6873202/128979415-1b7fb969-6fc6-4a25-9ae2-87da7a9b031c.png"></a> <div style="100%">Default</div>                                   |              <a href="https://stackblitz.com/edit/web-platform-jyncb9"><img  height="400px"   src="https://user-images.githubusercontent.com/6873202/128979000-e5111571-8021-4c56-93d3-8d40dfe57536.png"></a> <div style="100%">Sky </div>               |
|                                 <a href="https://stackblitz.com/edit/web-platform-lwyild"><img  height="400px"   src="https://user-images.githubusercontent.com/6873202/128978399-32f890c6-86f7-46e2-b41e-58202e61f03b.png"></a> <div style="100%">Circles</div>                                  |              <a href="https://stackblitz.com/edit/web-platform-uhd3q7"><img  height="400px"   src="https://user-images.githubusercontent.com/6873202/129042576-0a8b27da-7a9d-4dee-b5b6-68080772cc9f.png"></a> <div style="100%">Oval</div>               |
| <a href="https://stackblitz.com/edit/web-platform-3gwnsg"><img  height="400px"   src="https://user-images.githubusercontent.com/6873202/129054271-21ba5182-38c5-4856-bb21-727bba49243a.png"></a> <div style="100%">Clean (Design by [Anton](https://dribbble.com/shots/15480691-Org-chart))</div> | <a href="https://stackblitz.com/edit/web-platform-o5t1ha"><img  height="400px"   src="https://user-images.githubusercontent.com/6873202/129182014-610b6761-6dd4-4847-92cb-66407a900d03.png"></a> <div style="100%">Futuristic - Full Functionality</div> |
|                           <a href="https://stackblitz.com/edit/web-platform-thplyq"><img  height="400px"   src="https://user-images.githubusercontent.com/6873202/129419379-a9d055c8-723c-468f-bd87-4762ba721d87.png"></a> <div style="100%">Prev version design</div>                            |

#### Featured customizations:

Check out several libraries and frameworks integrations

- [Vue.js Integration](https://stackblitz.com/edit/d3-org-chart-vue-integration-su3d6r)
- [React integration](https://stackblitz.com/edit/d3-org-chart-react-integration-hooks)
- [Angular integration](https://stackblitz.com/edit/angular-ivy-gneris)

Custom components & algorithms I used

- [Curved edges - vertical](https://observablehq.com/@bumbeishvili/curved-edges-compacty-vertical)
- [Curved edges - horizontal](https://observablehq.com/@bumbeishvili/curved-edges-compact-horizontal)
- [Flextree Algorithm](https://github.com/Klortho/d3-flextree)

### Usage

Tip: Just copy this code and paste at - https://realtimehtml.com/

```html
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-org-chart@2"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-flextree@2.1.2/build/d3-flextree.js"></script>
<div class="chart-container"></div>

<script>
 var chart;
 d3
  .csv(
   "https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv"
  )
  .then((data) => {
   chart = new d3.OrgChart().container(".chart-container").data(data).render();
  });
</script>
```

### Installing

```
npm i d3-org-chart
```

```javascript
import { OrgChart } from 'd3-org-chart';

 new OrgChart()
     .container(<DomElementOrCssSelector>)
     .data(<Data>) //  https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv
     .render();
```

### Quick Docs

Check the sample data here - https://github.com/bumbeishvili/sample-data/blob/main/org.csv

For the full functionality of exposed methods check [Futuristic Example](https://stackblitz.com/edit/web-platform-o5t1ha) and button bound functions

For the high level overview of margins and content setting check the image bellow

![](https://user-images.githubusercontent.com/6873202/129315269-a2ef1c25-1078-486f-bf0a-0a05d273f354.png)

## Notes & appreciations

I created this org-chart when I was hired by [TeamApps](https://github.com/teamapps-org).

Although this Org chart was specifically created for [teamapps java web application framework](https://github.com/teamapps-org/teamapps) , it's very flexible and can be used in any environment, where d3 and DOM is accessible.

Big thanks to [Matthias](https://github.com/Matthias-Bernstein) and [Yann](https://github.com/yamass), who assembled requirements for org-chart and had valuable pieces of advice afterwads.

Also, thanks all people who made generous [donations](https://ko-fi.com/bumbeishvili), it gives me motivation to further improve this org chart component.

Thanks [contractzen](https://www.contractzen.com/) for the significant contribution, which made implementation of some of the most important features (optimal layout, exporting ) possible.

## Author

[David B (twitter)](https://twitter.com/dbumbeishvili)  
 [David B (linkedin)](https://www.linkedin.com/in/bumbeishvili/)

I am available for freelance data visualization work. Please [contact me](https://davidb.dev/about) in case you'd like me to help you with my experience and expertise

You can also [book data viz related consultation session](https://www.fiverr.com/share/4XxG21) with me



## General approach
In general, it is encouraged to look into the source code as well. The chart code is basically a single class. At the top of the class, we have a state object called `attrs` which stores the state of the org chart and each single property is overridable by  the user.

For example, a one of the property name inside `attrs` object is `duration`, which controls animation duration for char,t when expanding or collapsing nodes.

If we want to get the value, we can either do

```javascript
chart.getChartState().duration
```

or directly
```javascript
chart.duration()
```

`chart` in the above case is an instance of `OrgChart` class. We can get it using `new OrgChart()`

If we want to set property, we can pass argument to the same function and it will automatically set the value

```javascript
chart.duration(3000)  // This will become very slow moving chart
```
You can see list of all properties , their description of what each property does in the actual source code.

https://github.com/bumbeishvili/org-chart/blob/b7e23474716a72b93e6ecd7b7fafccbcd1e621fa/src/d3-org-chart.js#L40

Be aware that they are chainable, so if we wanted to set multiple properties, we would do this

```javascript
const chart = new OrgChart()
                    .data(ourData)
                    .container(ourDomElementOrCssSelector)
                    .duration(ourDuration)
                    .render()


// We can keep chaining values in runtime
chart.data(updatedData).render()

```


## Features

<table>
<tr>
   <td>
     <a href="https://stackblitz.com/edit/js-mfzkbs?file=index.html">
      Simple Data <br/>
      <img  height=100  src="https://user-images.githubusercontent.com/6873202/209858323-9e135676-b95f-491f-897c-182f5d87ffae.png"/>   
     </a>
   </td>
   <td>
     <a href="https://stackblitz.com/edit/js-yw1urt?file=index.html">
          Custom Content  <br/>
          <img height=100 src="https://user-images.githubusercontent.com/6873202/209859788-0404aef9-793d-4f32-9209-bf1baec57a92.png"/>
           </a>
   </td>
    <td>
     <a href="https://stackblitz.com/edit/js-pwlmhf?file=index.html">
      Nested Data <br/>
      <img  height=100  src="https://user-images.githubusercontent.com/6873202/209858323-9e135676-b95f-491f-897c-182f5d87ffae.png"/>   
     </a>
   </td>
    <td>
     <a href="https://stackblitz.com/edit/js-36myfl?file=index.html">
      Online Data <br/>
      <img  height=100  src="https://user-images.githubusercontent.com/6873202/209858323-9e135676-b95f-491f-897c-182f5d87ffae.png"/>   
     </a>
   </td>
</tr>


<tr>
  
   <td>
     <a href="https://stackblitz.com/edit/js-dppjis?file=index.html">
          CSV Data  <br/>
          <img height=100 src="https://user-images.githubusercontent.com/6873202/209864352-d0cbb5d7-0541-4239-86cc-428778a3bb35.png"/>
           </a>
   </td>
    <td>
     <a href="https://stackblitz.com/edit/js-rvwpza?file=index.html">
       Styled tree <br/>
      <img  height=100  src="https://user-images.githubusercontent.com/6873202/209865473-f9c3c846-5602-47a7-8cea-6a3eed3852c0.png"/>   
     </a>
   </td>
       <td>
     <a href="https://stackblitz.com/edit/js-bexsmx?file=index.html">
       Add node <br/>
      <img  height=100  src="https://user-images.githubusercontent.com/6873202/209938311-74dcd25f-9fb2-4b30-a7cd-bd076f5762cc.gif"/>   
     </a>
   </td>
</tr>


</table>
