We are using live server and nodemon during development.

`index.html` is opened using live server vs code extension and nodemon is used to build files every time changes occur

nodemon command is
```npm
nodemon --watch ./src/d3-org-chart.js --exec npm install --ignore build/
```


Npm publish RC

```npm
npm version prerelease --preid=next
npm publish --tag beta
```
