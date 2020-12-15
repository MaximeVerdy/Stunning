var express = require('express');
var router = express.Router();

var mongoose = require('../models/connection');
var userModel = require('../models/users')


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('Ce compte existe déjà')
  }

  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push(' ')
  }


  if(error.length == 0){
    var newUser = new userModel({
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
    }
  }
  

  res.json({result, saveUser, error})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push(' ')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront
    })
  
    
    if(user){
      result = true
    } else {
      error.push('email ou mot de passe incorrect')
    }
  }
  

  res.json({result, user, error})


})

module.exports = router;
