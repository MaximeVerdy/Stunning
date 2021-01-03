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

  // vérification de la complexité suffisante du mot de passe
  var regex = RegExp ("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
  if(regex.test(req.body.passwordFromFront) == false && emptyInput == false && existingAccount == false
  ){
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
  
  // données envoyées en front
  res.json({result, saveActivity, error})

})

// ---------------------------------- //
// route d'historique à afficher      //
// ---------------------------------- //

router.get('/history', async function(req,res,next){

  var error = []
  var activities = []

  // vérification que ce token existe 
  var user = await userModel.findOne({token: req.query.token})
  if(user != null){
    // recherche des données en BDD
     activities = await activityModel.find({token: req.query.token})
  }

  // rangement par ordre chronologique invervé
  const sortedActivities = activities.sort((a, b) => b.date - a.date)

  if (user == null){
      error.push ('Veuillez vous connecter')
    }

  // données envoyées en front
  res.json({sortedActivities, error})


})

// ---------------------------------- //
// route de suppression d'activité    //
// ---------------------------------- //

router.delete('/history', async function(req,res,next){

  var result = false
  var error = []

  // vérification que ce token existe 
  var user = await userModel.findOne({token: req.body.token})
  if(user != null){
    // suppression des données en BDD
    var deleteInDB = await activityModel.deleteOne({activityID: req.body.activityID})

    if(deleteInDB.deletedCount == 1){
      result = true
    }
  }

   // message d'erreur pour front
  if (user == null){
    error.push ('Veuillez vous connecter')
  }

  // données envoyées en front
  res.json({result, error})

})

// ---------------------------------- //
// ------ route des statistiques ---- //
// ---------------------------------- //

router.get('/stats', async function(req,res,next){

  var error = []
  var activities = []
  var stats = []
  var legende = ''
  var yearChosen = 0
  var dataFormat = ''
  var joursParAn = 0

  // vérification que ce token existe 
  var user = await userModel.findOne({token : req.query.token})
  if(user != null){
    // recherche des données en BDD
     activities = await activityModel.find({token : req.query.token})
     yearChosen = parseInt(await req.query.yearChosen)
     monthChosen = parseInt(await req.query.monthChosen)
     dataFormat = await req.query.dataFormat
     timeGap = await req.query.timeGap
  }


// ------------- intervalle mensuel . annnée affichée ------------------------------
  if (timeGap == 'mensuel' && monthChosen == 12) {

    // boucle permettant de compiler les données pour chaque mois de l'année
    for (var j = 0; j < 12; j++) {

      var varieDistance = 0
      var fractionneDistance = 0
      var enduranceDistance = 0
      var competitionDistance = 0 
      var varieChrono = 0
      var fractionneChrono = 0
      var enduranceChrono = 0
      var competitionChrono = 0
      var varieSpeed = 0
      var fractionneSpeed = 0
      var enduranceSpeed = 0
      var competitionSpeed = 0
      var variePace = 0
      var fractionnePace = 0
      var endurancePace = 0
      var competitionPace = 0

      // boucle permettant de collecter les données de toutes les activités de l'année en BDD
      for (var i = 0; i < activities.length; i++) {

        // si le mois, le type d'activité et l'année correspondent aux critères alors la distance et le chrono sont aggrégés
          if (activities[i].date.getMonth() === j && activities[i].type === "varié" && activities[i].date.getYear() === yearChosen 
          ){ varieDistance = varieDistance + activities[i].distance
            varieChrono = varieChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
          if (activities[i].date.getMonth() === j && activities[i].type === "endurance" && activities[i].date.getYear() === yearChosen
          ){ enduranceDistance = enduranceDistance + activities[i].distance
            enduranceChrono = enduranceChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
          if (activities[i].date.getMonth() === j  && activities[i].type === "fractionné" && activities[i].date.getYear() === yearChosen
          ){ fractionneDistance = fractionneDistance + activities[i].distance
            fractionneChrono = fractionneChrono  + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
          if (activities[i].date.getMonth() === j  && activities[i].type === "compétition" && activities[i].date.getYear() === yearChosen
          ){ competitionDistance = competitionDistance + activities[i].distance 
            competitionChrono = competitionChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }

          if (j === 0) {legende = 'jan'}
          if (j === 1) {legende = 'fév'}
          if (j === 2) {legende = 'mars'}
          if (j === 3) {legende = 'avr'}
          if (j === 4) {legende = 'mai'}
          if (j === 5) {legende = 'juin'}
          if (j === 6) {legende = 'juil'}
          if (j === 7) {legende = 'août'}
          if (j === 8) {legende = 'sept'}
          if (j === 9) {legende = 'oct'}
          if (j === 10) {legende = 'nov'}
          if (j === 11) {legende = 'déc'} 
      }

      // calcul de la vitesse par type d'activité
      varieSpeed = varieDistance / varieChrono
      enduranceSpeed = enduranceDistance / enduranceChrono
      fractionneSpeed = fractionneDistance / fractionneChrono
      competitionSpeed = competitionDistance / competitionChrono

      // calcul du rythme par type d'activité
      variePace =  (varieChrono * 60) / varieDistance
      endurancePace = (enduranceChrono * 60) / enduranceDistance
      fractionnePace =  (fractionneChrono * 60) / fractionneDistance
      competitionPace = (competitionChrono * 60) / competitionDistance 
        
      // création d'un objet par mois et par type de données
        if (dataFormat == 'distance') {
          var month = {
            "légende" : legende,
            "varié" : varieDistance,
            "fractionné" : fractionneDistance,
            "endurance" : enduranceDistance,
            "compétition" : competitionDistance,
          }
        }

        function toFixedIfNecessary( value, dp ){
          return +parseFloat(value).toFixed( dp );
        }

        if (dataFormat == 'temps') {
          var month = {
            "légende" : legende,
            "varié" : toFixedIfNecessary( varieChrono, 2 ) ,
            "fractionné" : toFixedIfNecessary( fractionneChrono, 2 ) , 
            "endurance" : toFixedIfNecessary( enduranceChrono, 2 ) ,
            "compétition" : toFixedIfNecessary( competitionChrono, 2 ) ,
          }
        }

        if (dataFormat == 'vitesse') {
          var month = {
            "légende" : legende,
            "varié" : toFixedIfNecessary( varieSpeed, 2 ) ,
            "fractionné" : toFixedIfNecessary( fractionneSpeed, 2 ) , 
            "endurance" : toFixedIfNecessary( enduranceSpeed, 2 ) ,
            "compétition" : toFixedIfNecessary( competitionSpeed, 2 ) ,
          }
        }

        if (dataFormat == 'rythme') {
          var month = {
            "légende" : legende,
            "varié" : toFixedIfNecessary( variePace, 2 ) ,
            "fractionné" : toFixedIfNecessary( fractionnePace, 2 ) , 
            "endurance" : toFixedIfNecessary( endurancePace, 2 ) ,
            "compétition" : toFixedIfNecessary( competitionPace, 2 ) ,
          }
        }

      // toutes les stats de l'années
      stats.push(month)

    }
  }

// ------------- intervalle mensuel . mois affiché ------------------------------
  if (timeGap == 'mensuel' && monthChosen != 12) {

    // pour chaque mois de l'année 
    for (var j = 0; j < 12; j++) {

      var varieDistance = 0
      var fractionneDistance = 0
      var enduranceDistance = 0
      var competitionDistance = 0 
      var varieChrono = 0
      var fractionneChrono = 0
      var enduranceChrono = 0
      var competitionChrono = 0
      var varieSpeed = 0
      var fractionneSpeed = 0
      var enduranceSpeed = 0
      var competitionSpeed = 0
      var variePace = 0
      var fractionnePace = 0
      var endurancePace = 0
      var competitionPace = 0

      // pour toutes les activités enregistrées en BDD
      for (var i = 0; i < activities.length; i++) {

          // par rapport à "-- intervalle mensuel . mois affiché --", ajout de la condition du mois sélectionné en front
          if (activities[i].date.getMonth() === j && activities[i].type === "varié" && activities[i].date.getYear() === yearChosen && activities[i].date.getMonth() === monthChosen
          ){ varieDistance = varieDistance + activities[i].distance
            varieChrono = varieChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
          if (activities[i].date.getMonth() === j && activities[i].type === "endurance" && activities[i].date.getYear() === yearChosen && activities[i].date.getMonth() === monthChosen
          ){ enduranceDistance = enduranceDistance + activities[i].distance
            enduranceChrono = enduranceChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
          if (activities[i].date.getMonth() === j  && activities[i].type === "fractionné" && activities[i].date.getYear() === yearChosen && activities[i].date.getMonth() === monthChosen
          ){ fractionneDistance = fractionneDistance + activities[i].distance
            fractionneChrono = fractionneChrono  + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
          if (activities[i].date.getMonth() === j  && activities[i].type === "compétition" && activities[i].date.getYear() === yearChosen && activities[i].date.getMonth() === monthChosen
          ){ competitionDistance = competitionDistance + activities[i].distance 
            competitionChrono = competitionChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }

          if (j === 0) {legende = 'jan'}
          if (j === 1) {legende = 'fév'}
          if (j === 2) {legende = 'mars'}
          if (j === 3) {legende = 'avr'}
          if (j === 4) {legende = 'mai'}
          if (j === 5) {legende = 'juin'}
          if (j === 6) {legende = 'juil'}
          if (j === 7) {legende = 'août'}
          if (j === 8) {legende = 'sept'}
          if (j === 9) {legende = 'oct'}
          if (j === 10) {legende = 'nov'}
          if (j === 11) {legende = 'déc'} 
      }

      varieSpeed = varieDistance / varieChrono
      enduranceSpeed = enduranceDistance / enduranceChrono
      fractionneSpeed = fractionneDistance / fractionneChrono
      competitionSpeed = competitionDistance / competitionChrono

      variePace =  (varieChrono * 60) / varieDistance
      endurancePace = (enduranceChrono * 60) / enduranceDistance
      fractionnePace =  (fractionneChrono * 60) / fractionneDistance
      competitionPace = (competitionChrono * 60) / competitionDistance 

        // par rapport à "-- intervalle mensuel . mois affiché --", ajout de la condition du mois sélectionné en front
        if (dataFormat == 'distance' && j === monthChosen) {
          var month = {
            "légende" : legende,
            "varié" : varieDistance,
            "fractionné" : fractionneDistance,
            "endurance" : enduranceDistance,
            "compétition" : competitionDistance,
          }
        }

        function toFixedIfNecessary( value, dp ){
          return +parseFloat(value).toFixed( dp );
        }

        // par rapport à "-- intervalle mensuel . mois affiché --", ajout de la condition du mois sélectionné en front
        if (dataFormat == 'temps' && j === monthChosen) {
          var month = {
            "légende" : legende,
            "varié" : toFixedIfNecessary( varieChrono, 2 ) ,
            "fractionné" : toFixedIfNecessary( fractionneChrono, 2 ) , 
            "endurance" : toFixedIfNecessary( enduranceChrono, 2 ) ,
            "compétition" : toFixedIfNecessary( competitionChrono, 2 ) ,
          }
        }
        
        // par rapport à "-- intervalle mensuel . mois affiché --", ajout de la condition du mois sélectionné en front
        if (dataFormat == 'vitesse' && j === monthChosen) {
          var month = {
            "légende" : legende,
            "varié" : toFixedIfNecessary( varieSpeed, 2 ) ,
            "fractionné" : toFixedIfNecessary( fractionneSpeed, 2 ) , 
            "endurance" : toFixedIfNecessary( enduranceSpeed, 2 ) ,
            "compétition" : toFixedIfNecessary( competitionSpeed, 2 ) ,
          }
        }

        // par rapport à "-- intervalle mensuel . mois affiché --", ajout de la condition du mois sélectionné en front
        if (dataFormat == 'rythme' && j === monthChosen) {
          var month = {
            "légende" : legende,
            "varié" : toFixedIfNecessary( variePace, 2 ) ,
            "fractionné" : toFixedIfNecessary( fractionnePace, 2 ) , 
            "endurance" : toFixedIfNecessary( endurancePace, 2 ) ,
            "compétition" : toFixedIfNecessary( competitionPace, 2 ) ,
          }
        }

        if (month) {
          stats.push(month)
        }
         
      }
  }


  // ----------  intervalle journalier. année affichée ------------------------------

  // dernier jour de l'année d'avant celle sélectionnée en front
  var lastDayOfTheYear = new Date ((yearChosen + 1899) + "-12-31T00:00:00.000+00:00") 
  
  if (timeGap == 'journalier' && monthChosen == 12) {

  // vérification des années bissextiles
    if (yearChosen & 3 || !(yearChosen % 25) && yearChosen & 15) {
      joursParAn = 365
    } else {
      joursParAn = 366
    }

    // pour chaque jour de l'année
    for (var j = 0; j < joursParAn; j++) {

      var varieDistance = 0
      var fractionneDistance = 0
      var enduranceDistance = 0
      var competitionDistance = 0
      var varieChrono = 0
      var fractionneChrono = 0
      var enduranceChrono = 0
      var competitionChrono = 0
      var varieSpeed = 0
      var fractionneSpeed = 0
      var enduranceSpeed = 0
      var competitionSpeed = 0
      var variePace = 0
      var fractionnePace = 0
      var endurancePace = 0
      var competitionPace = 0

      for (var i = 0; i < activities.length; i++) {
          // (activities[i].date - lastDayOfTheYear) / 1000 / 60 / 60 / 24 détermine le Nième jour de l'année
          if ((activities[i].date - lastDayOfTheYear) / 1000 / 60 / 60 / 24 == j && activities[i].type === "varié" && activities[i].date.getYear() === yearChosen
          ){ varieDistance = varieDistance + activities[i].distance
            varieChrono = varieChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
          if ((activities[i].date - lastDayOfTheYear) / 1000 / 60 / 60 / 24 == j && activities[i].type === "endurance" && activities[i].date.getYear() === yearChosen
          ){ enduranceDistance = enduranceDistance + activities[i].distance
            enduranceChrono = enduranceChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
          if ((activities[i].date - lastDayOfTheYear) / 1000 / 60 / 60 / 24 == j  && activities[i].type === "fractionné" && activities[i].date.getYear() === yearChosen
          ){ fractionneDistance = fractionneDistance + activities[i].distance
            fractionneChrono = fractionneChrono  + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
          if ((activities[i].date - lastDayOfTheYear) / 1000 / 60 / 60 / 24 == j  && activities[i].type === "compétition" && activities[i].date.getYear() === yearChosen
          ){ competitionDistance = competitionDistance + activities[i].distance 
            competitionChrono = competitionChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
          }
      }

      varieSpeed = varieDistance / varieChrono
      enduranceSpeed = enduranceDistance / enduranceChrono
      fractionneSpeed = fractionneDistance / fractionneChrono
      competitionSpeed = competitionDistance / competitionChrono

      variePace =  (varieChrono * 60) / varieDistance
      endurancePace = (enduranceChrono * 60) / enduranceDistance
      fractionnePace =  (fractionneChrono * 60) / fractionneDistance
      competitionPace = (competitionChrono * 60) / competitionDistance 
        
        if (dataFormat == 'distance') {
          var day = {
            "légende" : j,
            "varié" : varieDistance,
            "fractionné" : fractionneDistance,
            "endurance" : enduranceDistance,
            "compétition" : competitionDistance,
          }
        }

        function toFixedIfNecessary( value, dp ){
          return +parseFloat(value).toFixed( dp );
        }

        if (dataFormat == 'temps') {
          var day = {
            "légende" : j,
            "varié" : toFixedIfNecessary( varieChrono, 2 ) ,
            "fractionné" : toFixedIfNecessary( fractionneChrono, 2 ) , 
            "endurance" : toFixedIfNecessary( enduranceChrono, 2 ) ,
            "compétition" : toFixedIfNecessary( competitionChrono, 2 ) ,
          }
        }

        if (dataFormat == 'vitesse') {
          var day = {
            "légende" : j,
            "varié" : toFixedIfNecessary( varieSpeed, 2 ) ,
            "fractionné" : toFixedIfNecessary( fractionneSpeed, 2 ) , 
            "endurance" : toFixedIfNecessary( enduranceSpeed, 2 ) ,
            "compétition" : toFixedIfNecessary( competitionSpeed, 2 ) ,
          }
        }

        if (dataFormat == 'rythme') {
          var day = {
            "légende" : j,
            "varié" : toFixedIfNecessary( variePace, 2 ) ,
            "fractionné" : toFixedIfNecessary( fractionnePace, 2 ) , 
            "endurance" : toFixedIfNecessary( endurancePace, 2 ) ,
            "compétition" : toFixedIfNecessary( competitionPace, 2 ) ,
          }
        }

      stats.push(day)

    }
  }

  // ----------  intervalle journalier. mois affiché ------------------------------
  if (timeGap == 'journalier' && monthChosen != 12) {

    // vérification des années bissextiles
      if (yearChosen & 3 || !(yearChosen % 25) && yearChosen & 15) {
        joursParAn = 365
      } else {
        joursParAn = 366
      }

      oneDay = 1000 * 60 * 60 * 24;
      FistDayOfTheYear = new Date(yearChosen+1900, 0, 2);
      firstDayMonth = new Date(yearChosen+1900, monthChosen, 2);
      lastDayMonth = new Date(yearChosen+1900, monthChosen+1, 1);
      var nbDaysUntilFirstDayMonth = Math.floor((firstDayMonth - FistDayOfTheYear) / oneDay) 
      var nbDaysUntilLastDayMonth = Math.floor((lastDayMonth - FistDayOfTheYear) / oneDay)

      // pour chaque jour compris entre le 1er et le dernier jour du mois sélectionné en front
      for (var j = nbDaysUntilFirstDayMonth + 1; j <= nbDaysUntilLastDayMonth + 1; j++) {
        
        var varieDistance = 0
        var fractionneDistance = 0
        var enduranceDistance = 0
        var competitionDistance = 0
        var varieChrono = 0
        var fractionneChrono = 0
        var enduranceChrono = 0
        var competitionChrono = 0
        var varieSpeed = 0
        var fractionneSpeed = 0
        var enduranceSpeed = 0
        var competitionSpeed = 0
        var variePace = 0
        var fractionnePace = 0
        var endurancePace = 0
        var competitionPace = 0
        var dayOfTheMonth = 0

        dayOfTheMonth = j - nbDaysUntilFirstDayMonth
  
        for (var i = 0; i < activities.length; i++) {
          
            if ((activities[i].date - lastDayOfTheYear) / 1000 / 60 / 60 / 24 == j && activities[i].type === "varié" && activities[i].date.getYear() === yearChosen && activities[i].date.getMonth() === monthChosen
            ){ varieDistance = varieDistance + activities[i].distance
              varieChrono = varieChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
            }
            if ((activities[i].date - lastDayOfTheYear) / 1000 / 60 / 60 / 24 == j && activities[i].type === "endurance" && activities[i].date.getYear() === yearChosen && activities[i].date.getMonth() === monthChosen
            ){ enduranceDistance = enduranceDistance + activities[i].distance
              enduranceChrono = enduranceChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
            }
            if ((activities[i].date - lastDayOfTheYear) / 1000 / 60 / 60 / 24 == j  && activities[i].type === "fractionné" && activities[i].date.getYear() === yearChosen && activities[i].date.getMonth() === monthChosen
            ){ fractionneDistance = fractionneDistance + activities[i].distance
              fractionneChrono = fractionneChrono  + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
            }
            if ((activities[i].date - lastDayOfTheYear) / 1000 / 60 / 60 / 24 == j  && activities[i].type === "compétition" && activities[i].date.getYear() === yearChosen && activities[i].date.getMonth() === monthChosen
            ){ competitionDistance = competitionDistance + activities[i].distance 
              competitionChrono = competitionChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
            }
        }
  
        varieSpeed = varieDistance / varieChrono
        enduranceSpeed = enduranceDistance / enduranceChrono
        fractionneSpeed = fractionneDistance / fractionneChrono
        competitionSpeed = competitionDistance / competitionChrono
  
        variePace =  (varieChrono * 60) / varieDistance
        endurancePace = (enduranceChrono * 60) / enduranceDistance
        fractionnePace =  (fractionneChrono * 60) / fractionneDistance
        competitionPace = (competitionChrono * 60) / competitionDistance 
          
        
          if (dataFormat == 'distance' ) {
            var day = {
              "légende" : dayOfTheMonth,
              "varié" : varieDistance,
              "fractionné" : fractionneDistance,
              "endurance" : enduranceDistance,
              "compétition" : competitionDistance,
            }
          }
  
          function toFixedIfNecessary( value, dp ){
            return +parseFloat(value).toFixed( dp );
          }
  
          if (dataFormat == 'temps' ) {
            var day = {
              "légende" : dayOfTheMonth,
              "varié" : toFixedIfNecessary( varieChrono, 2 ) ,
              "fractionné" : toFixedIfNecessary( fractionneChrono, 2 ) , 
              "endurance" : toFixedIfNecessary( enduranceChrono, 2 ) ,
              "compétition" : toFixedIfNecessary( competitionChrono, 2 ) ,
            }
          }
  
          if (dataFormat == 'vitesse' ) {
            var day = {
              "légende" : dayOfTheMonth,
              "varié" : toFixedIfNecessary( varieSpeed, 2 ) ,
              "fractionné" : toFixedIfNecessary( fractionneSpeed, 2 ) , 
              "endurance" : toFixedIfNecessary( enduranceSpeed, 2 ) ,
              "compétition" : toFixedIfNecessary( competitionSpeed, 2 ) ,
            }
          }
  
          if (dataFormat == 'rythme' ) {
            var day = {
              "légende" : dayOfTheMonth,
              "varié" : toFixedIfNecessary( variePace, 2 ) ,
              "fractionné" : toFixedIfNecessary( fractionnePace, 2 ) , 
              "endurance" : toFixedIfNecessary( endurancePace, 2 ) ,
              "compétition" : toFixedIfNecessary( competitionPace, 2 ) ,
            }
          }
  
          if (day) {
               stats.push(day)
          }
      }
    }


    // ----------  intervalle hebdomadaire. par année ------------------------------
    if (timeGap == 'hebdomadaire'  && monthChosen == 12) {

    // fonction pour trouver le numéro de la semaine au cours de l'année
    Date.prototype.getWeekNumber = function(){
      var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
      var dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
    };
    
        // pour chaque semaine
        for (var j = 0; j < 54; j++) {
    
          var varieDistance = 0
          var fractionneDistance = 0
          var enduranceDistance = 0
          var competitionDistance = 0
          var varieChrono = 0
          var fractionneChrono = 0
          var enduranceChrono = 0
          var competitionChrono = 0
          var varieSpeed = 0
          var fractionneSpeed = 0
          var enduranceSpeed = 0
          var competitionSpeed = 0
          var variePace = 0
          var fractionnePace = 0
          var endurancePace = 0
          var competitionPace = 0
    
          for (var i = 0; i < activities.length; i++) {
              if (activities[i].date.getWeekNumber() === j && activities[i].type === "varié" && activities[i].date.getYear() === yearChosen
              ){ varieDistance = varieDistance + activities[i].distance
                varieChrono = varieChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
              }
              if (activities[i].date.getWeekNumber() === j && activities[i].type === "endurance" && activities[i].date.getYear() === yearChosen
              ){ enduranceDistance = enduranceDistance + activities[i].distance
                enduranceChrono = enduranceChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
              }
              if (activities[i].date.getWeekNumber() === j  && activities[i].type === "fractionné" && activities[i].date.getYear() === yearChosen
              ){ fractionneDistance = fractionneDistance + activities[i].distance
                fractionneChrono = fractionneChrono  + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
              }
              if (activities[i].date.getWeekNumber() === j  && activities[i].type === "compétition" && activities[i].date.getYear() === yearChosen
              ){ competitionDistance = competitionDistance + activities[i].distance 
                competitionChrono = competitionChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
              }
          }

          varieSpeed = varieDistance / varieChrono
          enduranceSpeed = enduranceDistance / enduranceChrono
          fractionneSpeed = fractionneDistance / fractionneChrono
          competitionSpeed = competitionDistance / competitionChrono
    
          variePace =  (varieChrono * 60) / varieDistance
          endurancePace = (enduranceChrono * 60) / enduranceDistance
          fractionnePace =  (fractionneChrono * 60) / fractionneDistance
          competitionPace = (competitionChrono * 60) / competitionDistance 
            
            if (dataFormat == 'distance') {
              var week = {
                "légende" : j,
                "varié" : varieDistance,
                "fractionné" : fractionneDistance,
                "endurance" : enduranceDistance,
                "compétition" : competitionDistance,
              }
            }
    
            function toFixedIfNecessary( value, dp ){
              return +parseFloat(value).toFixed( dp );
            }
    
            if (dataFormat == 'temps') {
              var week = {
                "légende" : j,
                "varié" : toFixedIfNecessary( varieChrono, 2 ) ,
                "fractionné" : toFixedIfNecessary( fractionneChrono, 2 ) , 
                "endurance" : toFixedIfNecessary( enduranceChrono, 2 ) ,
                "compétition" : toFixedIfNecessary( competitionChrono, 2 ) ,
              }
            }
    
            if (dataFormat == 'vitesse') {
              var week = {
                "légende" : j,
                "varié" : toFixedIfNecessary( varieSpeed, 2 ) ,
                "fractionné" : toFixedIfNecessary( fractionneSpeed, 2 ) , 
                "endurance" : toFixedIfNecessary( enduranceSpeed, 2 ) ,
                "compétition" : toFixedIfNecessary( competitionSpeed, 2 ) ,
              }
            }
    
            if (dataFormat == 'rythme') {
              var week = {
                "légende" : j,
                "varié" : toFixedIfNecessary( variePace, 2 ) ,
                "fractionné" : toFixedIfNecessary( fractionnePace, 2 ) , 
                "endurance" : toFixedIfNecessary( endurancePace, 2 ) ,
                "compétition" : toFixedIfNecessary( competitionPace, 2 ) ,
              }
            }
    
          stats.push(week)
    
        }

      }


    // ----------  intervalle hebdomadaire. par mois ------------------------------
    if (timeGap == 'hebdomadaire' && monthChosen != 12) {

      // fonction pour trouver le numéro de la semaine au cours de l'année
      Date.prototype.getWeekNumber = function(){
        var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
      };
      
      FistDayOfTheYear = new Date(yearChosen+1900, 0, 2);
      firstDayMonth = (new Date(yearChosen+1900, monthChosen, 2));
      lastDayMonth = new Date(yearChosen+1900, monthChosen+1, 1);

      if ((yearChosen == 121 && monthChosen == 0) || (yearChosen == 116 && monthChosen == 0) || (yearChosen == 111 && monthChosen == 0) || (yearChosen == 110 && monthChosen == 0)) {
        weekNbfirstDayMonth = 1
      }   else { 
        weekNbfirstDayMonth = firstDayMonth.getWeekNumber()
      }
      
      weekNblastDayMonth= lastDayMonth.getWeekNumber()

      
          for (var j = weekNbfirstDayMonth; j <= weekNblastDayMonth; j++) {
      
            var varieDistance = 0
            var fractionneDistance = 0
            var enduranceDistance = 0
            var competitionDistance = 0
            var varieChrono = 0
            var fractionneChrono = 0
            var enduranceChrono = 0
            var competitionChrono = 0
            var varieSpeed = 0
            var fractionneSpeed = 0
            var enduranceSpeed = 0
            var competitionSpeed = 0
            var variePace = 0
            var fractionnePace = 0
            var endurancePace = 0
            var competitionPace = 0

            weekOfTheMonth = j - weekNbfirstDayMonth
      
            for (var i = 0; i < activities.length; i++) {
                if (activities[i].date.getWeekNumber() === j && activities[i].type === "varié" && activities[i].date.getYear() === yearChosen 
                ){ varieDistance = varieDistance + activities[i].distance
                  varieChrono = varieChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
                }
                if (activities[i].date.getWeekNumber() === j && activities[i].type === "endurance" && activities[i].date.getYear() === yearChosen
                ){ enduranceDistance = enduranceDistance + activities[i].distance
                  enduranceChrono = enduranceChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
                }
                if (activities[i].date.getWeekNumber() === j  && activities[i].type === "fractionné" && activities[i].date.getYear() === yearChosen
                ){ fractionneDistance = fractionneDistance + activities[i].distance
                  fractionneChrono = fractionneChrono  + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
                }
                if (activities[i].date.getWeekNumber() === j  && activities[i].type === "compétition" && activities[i].date.getYear() === yearChosen
                ){ competitionDistance = competitionDistance + activities[i].distance 
                  competitionChrono = competitionChrono + activities[i].chronoH + activities[i].chronoM / 60 + activities[i].chronoS / 3600
                }
            }
  
            varieSpeed = varieDistance / varieChrono
            enduranceSpeed = enduranceDistance / enduranceChrono
            fractionneSpeed = fractionneDistance / fractionneChrono
            competitionSpeed = competitionDistance / competitionChrono
      
            variePace =  (varieChrono * 60) / varieDistance
            endurancePace = (enduranceChrono * 60) / enduranceDistance
            fractionnePace =  (fractionneChrono * 60) / fractionneDistance
            competitionPace = (competitionChrono * 60) / competitionDistance 
              
              if (dataFormat == 'distance') {
                var week = {
                  "légende" : weekOfTheMonth,
                  "varié" : varieDistance,
                  "fractionné" : fractionneDistance,
                  "endurance" : enduranceDistance,
                  "compétition" : competitionDistance,
                }
              }
      
              function toFixedIfNecessary( value, dp ){
                return +parseFloat(value).toFixed( dp );
              }
      
              if (dataFormat == 'temps') {
                var week = {
                  "légende" : weekOfTheMonth,
                  "varié" : toFixedIfNecessary( varieChrono, 2 ) ,
                  "fractionné" : toFixedIfNecessary( fractionneChrono, 2 ) , 
                  "endurance" : toFixedIfNecessary( enduranceChrono, 2 ) ,
                  "compétition" : toFixedIfNecessary( competitionChrono, 2 ) ,
                }
              }
      
              if (dataFormat == 'vitesse') {
                var week = {
                  "légende" : weekOfTheMonth,
                  "varié" : toFixedIfNecessary( varieSpeed, 2 ) ,
                  "fractionné" : toFixedIfNecessary( fractionneSpeed, 2 ) , 
                  "endurance" : toFixedIfNecessary( enduranceSpeed, 2 ) ,
                  "compétition" : toFixedIfNecessary( competitionSpeed, 2 ) ,
                }
              }
      
              if (dataFormat == 'rythme') {
                var week = {
                  "légende" : weekOfTheMonth,
                  "varié" : toFixedIfNecessary( variePace, 2 ) ,
                  "fractionné" : toFixedIfNecessary( fractionnePace, 2 ) , 
                  "endurance" : toFixedIfNecessary( endurancePace, 2 ) ,
                  "compétition" : toFixedIfNecessary( competitionPace, 2 ) ,
                }
              }
      
            stats.push(week)
      
          }
        }
  
  if (user == null){
      error.push ('Veuillez vous connecter')
    }

  res.json({stats, error})

})


module.exports = router;




















// THE END