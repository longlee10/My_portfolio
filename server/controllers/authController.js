let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let passport = require("passport");

//create the user model instance
let userModel = require("../models/user");
let User = userModel.User; //alias

// create contact model instance
let contactModel = require('../models/business_contact');
let Contact = contactModel.contactSchema;

module.exports.displayLoginPage = (req, res, next) => {
    // check if the user is already logged in
    if (!req.user) {
      res.render("login", {
        title: "Please Log In Or Sign Up",
        messages: req.flash("loginMessage"),
        displayName: req.user ? req.user.displayName : "",
      });
    } else {
      return res.redirect("/");
    }
  };


module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      // server err?
      if (err) {
        return next(err);
      }
      // is there a user login error?
      if (!user) {
        req.flash("loginMessage", "Authentication Error");
        return res.redirect("/Login");
      }
      req.login(user, (err) => {
        // server error?
        if (err) {
          return next(err);
        }
        return res.redirect("/business_contact");
      });
    })(req, res, next);
  };

// display register
module.exports.displayRegisterPage = (req, res, next)=>{
  res.render('register');
}

// process register request
module.exports.processRegisterPage = (req, res, next)=>{
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password
    //email: req.body.email,
    //displayName: req.body.displayName,
  });
  console.log(newUser);
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log("Error: Inserting New User");
      if (err.name == "UserExistsError") {
        req.flash(
          "registerMessage",
          "Registration Error: User Already Exists!"
        );
        console.log("Error: User Already Exists!");
      }
      return res.render("/register", {
        //title: "Register",
        messages: req.flash("registerMessage"),
        //displayName: req.user ? req.user.displayName : "",
      });
    } else {
      // if no error exists, then registration is successful

      // redirect the user and authenticate them

      return passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  });
}

// perform log out
module.exports.performLogout = (req, res, next)=>{
  req.logout((err)=>{
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
}

// display business contact
module.exports.displayBusinessContact = (req, res, next)=>{
  Contact.find((err, contact)=>{
   if(err){
    console.log(err);
   }
   else{
    res.render('business_contact',{title: "Business Contact" , contact:contact});
   }
  })
}

// edit page
module.exports.displayEdit = (req, res, next)=>{
  let id = req.params.id;
  Contact.findById(id, (err, contact)=>{
    if(err){
      console.log(err)
    }
    else{
      res.render('edit.ejs', {contact: contact})
    }
  })
}

module.exports.processEdit = (req, res, next)=>{
  let id = req.params.id;
  let updatedContact = Contact({
    "_id": id,
    "name": req.body.name,
    "phone": req.body.phone,
    "email": req.body.email
  })

  Contact.updateOne({_id: id}, updatedContact, (err)=>{
    if(err){
      console.log(err)
    }
    else{
      res.redirect('/business_contact');
    }
  })
}

module.exports.performDelete = (req, res, next)=>{
  let id = req.params.id;

  Contact.remove({_id:id}, (err)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/business_contact');
    }
  })
}

module.exports.getAdd = (req, res , next)=>{
  res.render('add');
}

module.exports.processAdd = (req, res, next)=>{
  let newContact = Contact({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  });

  // pass to create method
  Contact.create(newContact, (err, contact)=>{
    if(err){
      console.log(err);
      res.end(err);
    }
    else{
      res.redirect('/business_contact');
    }
  })
}