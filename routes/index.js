// framework express.js
var express = require('express');
var router = express.Router();

// module & modèles mongoose
var mongoose = require('../models/connection');
var userModel = require('../models/users')
var activityModel = require('../models/activities')

// modules de chiffrement
var uid2 = require('uid2')
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')

// module de validation d'email
// var validator = require("email-validator");


// ------------------- //
// route d'inscription //
// ------------------- //

router.post('/sign-up', async function(req,res,next){

  var error = []
  var emptyInput = false
  var existingAccount = false
  var result = false
  var saveUser = null
  var token = null

// recherche de l'existence d'un utilisateur en BDD
  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  // conditions pour enregistrer en BDD un nouvel utilisateur
  if(data != null){
    existingAccount = true
    error.push('Ce compte existe déjà')
  }

  if(req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ){
    emptyInput = true
    error.push ('Remplissez le formulaire pour vous inscrire')
  }

  var regex = RegExp ("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
  if(regex.test(req.body.passwordFromFront) == false && emptyInput == false && existingAccount == false
  ){
      // error.push('Mot de passe pas assez complexe (a,A,1,#)')
       error.push('Mot de passe avec minuscule, majuscule, chiffre et caractère spécial requis')
  }

  // enregistrement en BDD
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

  // message d'erreur d'enregistrement
  if (result == false  && existingAccount == false){
    error.push ('Une erreur est advenue. Enregistrement impossible')
  }
  
  // données envoyée en front
  res.json({result, saveUser, error, token})

})


// -------------------- //
// route de reconnexion //
// -------------------- //

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
// conditions avant de chercher en BDD
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push(' ')
  }

// recherche de l'existence d'un utilisateur en BDD
  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
// vérification du mot de passe
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
      error.push('Connexion impossible avec cet email')
    }
  }
  
  // données envoyée en front
  res.json({result, user, error, token})

})


// ---------------------------------- //
// route d'enregistrement d'activités //
// ---------------------------------- //

router.post('/save-activity', async function(req,res,next){

  var error = []
  var result = false
  var saveActivity = null


  // conditions pour enregistrer en BDD une nouvelle activité
  // if(req.body.tokenFromFront = ''){
  //   error.push('Reconnectez-vous pour enregistrer une activité')
  // }

  // enregistrement en BDD
  if(error.length == 0){
    var newActivity = new activityModel({
      token: req.body.tokenFromFront,
      activityID: uid2(32),
      distance: req.body.distanceFromFront,
      date: req.body.dateFromFront,
      chronoH: req.body.chronoHFromFront,
      chronoM: req.body.chronoMFromFront,
      chronoS: req.body.chronoSFromFront,
      type: req.body.typeFromFront,
    })
    saveActivity = await newActivity.save()

    if(saveActivity){
      result = true
    }
  }

  // message d'erreur d'enregistrement
  if (result == false){
    error.push ('Une erreur est advenue. Enregistrement impossible')
  }
  
  // données envoyée en front
  res.json({result, saveActivity, error})

})

// ---------------------------------- //
// route d'historique à afficher      //
// ---------------------------------- //

router.get('/history', async function(req,res,next){

  var error = []
  var activities = []

  var user = await userModel.findOne({token: req.query.token})
  
  if(user != null){
     activities = await activityModel.find({token: req.query.token})
  }

  const sortedActivities = activities.sort((a, b) => b.date - a.date)

  if (user == null){
      error.push ('Veuillez vous connecter')
    }

  res.json({sortedActivities, error})


})

// ---------------------------------- //
// route de suppression d'activité    //
// ---------------------------------- //

router.delete('/history', async function(req,res,next){

  var result = false
  var error = []

  var user = await userModel.findOne({token: req.body.token})

  if(user != null){
    var deleteInDB = await activityModel.deleteOne({activityID: req.body.activityID})

    if(deleteInDB.deletedCount == 1){
      result = true
    }
  }

  if (user == null){
    error.push ('Veuillez vous connecter')
  }

  res.json({result, error})

})

// ---------------------------------- //
// route des stats de l'année 2020    //
// ---------------------------------- //

router.get('/month', async function(req,res,next){

  var error = []
  var activities = []
  var year = []


  

  var user = await userModel.findOne({token: '0BPSNLhyGeDI5vSBTIvb1Hml5QhglQRv'})
  
  if(user != null){
     activities = await activityModel.find({token: '0BPSNLhyGeDI5vSBTIvb1Hml5QhglQRv'})
  }

  // const sortedActivities = activities.sort((a, b) => b.date - a.date)

  for (var j = 0; j < 12; j++) {
    var distanceVarie = 0
    var distanceFractionne = 0
    var distanceEndurance = 0
    var distanceCompetition = 0
    for (var i = 0; i < activities.length; i++) {
      if (activities[i].date.getMonth() === j && activities[i].date.getYear() === 120 && activities[i].type === "varié"
      ){ distanceVarie = distanceVarie + activities[i].distance
      }
      if (activities[i].date.getMonth() === j && activities[i].date.getYear() === 120 && activities[i].type === "endurance"
      ){ distanceEndurance = distanceEndurance + activities[i].distance
      }
      if (activities[i].date.getMonth() === j && activities[i].date.getYear() === 120 && activities[i].type === "fractionné"
      ){ distanceFractionne = distanceFractionne + activities[i].distance
      }
      if (activities[i].date.getMonth() === j && activities[i].date.getYear() === 120 && activities[i].type === "compétition"
      ){ distanceCompetition = distanceCompetition + activities[i].distance
      }
      var month = {
        "mois" : j,
        "varie" : distanceVarie,
        "fractionne" : distanceFractionne,
        "endurance" : distanceEndurance,
        "competition" : distanceCompetition,
      }
    }
    year.push(month)
  }
  

  console.log('console log ------>', year)

  if (user == null){
      error.push ('Veuillez vous connecter')
    }

  res.json({year, error})

})


module.exports = router;
