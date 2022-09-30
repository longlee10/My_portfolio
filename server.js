/*
  Author: Hoang Long Le
  29 September 2022
  Student ID 301236235
*/

const express = require('express');
const route = require('./routes/index');
const app = express();

// register view engine
app.set('view engine', 'ejs');

// listen for request 
app.listen(3000);

// rendering views
app.use(route);

// serving static files (images)
app.use(express.static('public'));

console.log("http://localhost:3000")