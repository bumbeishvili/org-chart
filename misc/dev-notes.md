We are using live server and nodemon during development.

`index.html` is opened using live server vs code extension and nodemon is used to build files every time changes occur

nodemon command is
```npm
nodemon --exec npm install --ignore build/
```