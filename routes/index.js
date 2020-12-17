// framework express.js
var express = require('express');
var router = express.Router();

// modèles mongoose
var mongoose = require('../models/connection');
var userModel = require('../models/users')

// modules de chiffrement
var uid2 = require('uid2')
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')

// module de validation d'email
// var validator = require("email-validator");



// route d'inscription 
router.post('/sign-up', async function(req,res,next){

  var error = []
  var emptyInput = false
  var result = false
  var saveUser = null
  var token = null


  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('Ce compte existe déjà')
  }

  var regex = RegExp ("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")

  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    emptyInput = true
    error.push ('Remplissez le formulaire pour vous inscrire')
  }

  // if(validator.validate(req.body.emailFromFront) === false
  // ){
  //   error.push('Email dans un format non valide')
  // }


  // if(emptyInput = false) {
  //     if (regex.test(req.body.passwordFromFront)  === false)
  //   {
  //     error.push('Mot de passe pas assez complexe')
  //   }
  // }

  // var regexOK = regex.test(req.body.passwordFromFront)
  if(regex.test(req.body.passwordFromFront)  === false && emptyInput == false)
  {
    error.push('Mot de passe pas assez complexe')
  }


  console.log ('emptyInput', emptyInput)
  // console.log ('regexOK ', regexOK)
  console.log ('Error', error)

  if(error.length == 0){
    var salt = uid2(32)
    var newUser = new userModel({
      email: req.body.emailFromFront,
      password: SHA256(req.body.passwordFromFront+salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  
  res.json({result, saveUser, error, token})

  console.log(error)
})

// route de reconnexion
router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push(' ')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    if(user){
      const passwordEncrypt = SHA256(req.body.passwordFromFront + user.salt).toString(encBase64)

      if(passwordEncrypt == user.password){
        result = true
        token = user.token
      } else {
        result = false
        error.push('Mot de passe incorrect')
      }
      
    } else {
      error.push('Email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

module.exports = router;
