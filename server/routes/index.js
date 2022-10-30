/*
users.js
Author: Hoang Long Le 
301236235
30 September 2022
*/

// express routing 
// 
var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const BusinessContact = require('../models/business_contact')

function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect("/Login");
  }
  next();
}

router.get('/', (req, res)=>{
  res.render('index');
})

router.get("/AboutMe", requireAuth, (req, res)=>{
  res.render('aboutme.ejs');
})

router.get("/Contact", requireAuth, (req, res)=>{
  res.render ('contact.ejs')
})

router.get("/Projects", requireAuth, (req, res)=>{
  res.render('projects.ejs');
})

router.get("/Services", requireAuth, (req, res)=>{
  res.render('services.ejs');
})


router.get("/Login", authController.displayLoginPage);

router.post("/Login", authController.processLoginPage);

router.get("/contactList", (req, res, next)=>{
 BusinessContact.find((err, contact) => {
    if(err)
    {
        return console.error(err);
    }
    else
    {
        //console.log(BookList);

        res.render('business_list.ejs', {title: 'Contacts', contacts: contact});      
    }
});
})

// Display register
router.get('/register', authController.displayRegisterPage);

// Process register
router.post('/register', authController.processRegisterPage);

// Logout
router.get('/logout', authController.performLogout);

// business contact
router.get('/business_contact',  requireAuth, authController.displayBusinessContact);

//edit
router.get('/edit/:id', requireAuth,  authController.displayEdit);
router.post('/edit/:id', requireAuth, authController.processEdit);

// delete
router.get('/delete/:id',requireAuth, authController.performDelete);

// add
router.get('/add', authController.getAdd);
router.post('/add', authController.processAdd);
module.exports = router;
