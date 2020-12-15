var mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: String,
    password: String
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;