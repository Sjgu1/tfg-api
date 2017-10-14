// auth.js
var mongoose = require('mongoose');
var User = require('../models/user');
var service = require('../service');
//nombrsea"+Math.random()%100000
exports.emailSignup = function (req, res) {

    var obj = req.body;
    var user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email : req.body.email
    });
    db.collection('usuarios').findOne({ username: req.body.username }, function (err, doc) {
        if (doc) {
            res.send("Existe un usuario con el mismo nombre de usuario");
        } else {
            db.collection('usuarios').insert(user, function (err, user) {
                if (err)
                    return res.status(500).send("Error al crear un usuario");
                res.status(200);
                res.send({ token: service.createToken(user) });
            });
        }
    });
};

exports.emailLogin = function (req, res) {
    var obj = req.body;
    console.log(obj)   
    if(req.body.email == null || req.body.password== null || req.body.email == "" || req.body.password == "") {
        return res.status(400).send("mala peticion")
    }
 
    db.collection('usuarios').findOne({ email: req.body.email }, function (err, user) {
        if (err)
            return res.status(500).send("Error al recuperar los obejetos");
        if (!user){
            return res.status(500).send("No existe el usuario en la base de datos");
        }

        if (obj.password == user.password) {
            var token = service.createToken(user);
            
            res.status(200);
            res.send({ token: token });
        } else {
            res.status(400).send("Contrasenya erronea");
        }
    });
};