// appel du module mongoose
var mongoose = require('mongoose')

// création du modèle activity
const activitySchema = mongoose.Schema({
    token: String,
    activityID: String,
    distance: Number,
    date: Date,
    chronoH: Number,
    chronoM: Number,
    chronoS: Number,
    type: String,

})

var activityModel = mongoose.model('activities', activitySchema)

module.exports = activityModel;