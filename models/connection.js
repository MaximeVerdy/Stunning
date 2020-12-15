var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect('mongodb+srv://admin:mongoPWverdy80@cluster0.oimhm.mongodb.net/stunning?retryWrites=true&w=majority',
    options,
    function(err){
        console.log(err);
    }
)

module.exports = mongoose;


// nv mot de passe admin:mongoPWverdy80
// ancien mot de passe admin:MongoPassW
// mdp de DJ admin:30094561
// david david:hgm4lRQq8QM1p3P8

// mongodb+srv://admin:<password>@cluster0.oimhm.mongodb.net/<dbname>?retryWrites=true&w=majority