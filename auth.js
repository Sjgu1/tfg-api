// auth.js
var mongoose = require('mongoose');
var User = require('./models/user');
var service = require('./service');
//nombrsea"+Math.random()%100000
exports.emailSignup = function (req, res) {

    var obj = req.body;
    var user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });
    console.log(db.collection('usuarios').count());
    //db.collection('usuarios').find({"username": user.username}).count() == 

    db.collection('usuarios').findOne({ username: req.body.username }, function (err, doc) {
        if (doc) {
            res.send("Existe un usuario con el mismo nombre de usuario");
        } else {
            db.collection('usuarios').insert(user, function (err, user) {
                if (err) return res.status(500).send("Error al crear un usuario");
                res.status(200).jsonp(user);
            });
        }
    });


};

exports.emailLogin = function (req, res) {
    var obj = req.body;
    console.log(req.body);
    console.log("Peticion recibida: " + obj.user);
    //console.log(User.findOne({username: obj.user}));
    User.find(function (err, kittens) {
        if (err) return console.error(err);
        console.log(kittens);
    })
    User.findOne({ username: obj.user }, function (err, user) {

        return res
            .status(200)
            .send({ token: service.createToken(user) });
    });
};