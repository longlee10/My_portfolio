/*
users.js
Author: Hoang Long Le 
301236235
30 September 2022
*/

// express routing 
var express = require('express');
var router = express.Router();


router.get('/', (req, res)=>{
  res.render('index');
})

router.get("/AboutMe", (req, res)=>{
  res.render('aboutme.ejs');
})

router.get("/Contact", (req, res)=>{
  res.render ('contact.ejs')
})

router.get("/Projects", (req, res)=>{
  res.render('projects.ejs');
})

router.get("/Services", (req, res)=>{
  res.render('services.ejs');
})

module.exports = router;
