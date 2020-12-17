var mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    token: String,
    salt: String, 
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;