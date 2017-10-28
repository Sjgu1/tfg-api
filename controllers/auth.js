// auth.js metodos de creacion y logear usuarios
var mongoose = require('mongoose');
var User = require('../models/user');
var service = require('../service');
var validator = require('validator');

exports.emailSignup = function (req, res) {

    var obj = req.body;
    var user = new User({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        admin: false,
        created_at: new Date(),
        updated_at: new Date()
    });
    //Se comprueba los campos obligatorios
    if (validator.isEmpty(user.email) || validator.isEmpty(user.password) || validator.isEmpty(user.username)) {
        res.status(500).send("Los campos username, password y email son obligatorios")
        //Se comprueba que el email sea válido
    } else if (!validator.isEmail(user.email)) {
        res.status(500).send("Email incorrecto")
    } else {
        //Se comprueba que el username no se repite
        db.collection('users').findOne({ username: user.username }, function (err, doc) {
            if (doc) {
                res.status(500).send("Existe un usuario con el mismo nombre de usuario");
                //Se comprueba que el email no se repite
            } else {
                db.collection('users').findOne({ email: user.email }, function (err, doc) {
                    if (doc) {
                        res.status(500).send("El email ya existe en la base de datos");
                        //Se comprueba que el email no se repite
                    } else {
                        db.collection('users').insertOne(user, function (err, userCreado) {
                            if (err)
                                res.status(500).send("Error al crear un usuario"); //Error al crear el usuario en la base de datos
                            return res.status(200).send({ user: user }); //Todo ha ido bien, se agrega el usuario
                        });
                    }
                });
            }
        });
    }
};


exports.emailLogin = function (req, res) {
    var obj = req.body;
    console.log(obj)
    if (req.body.email == null || req.body.password == null || req.body.email == "" || req.body.password == "") {
        return res.status(400).send("mala peticion")
    }

    db.collection('users').findOne({ email: req.body.email }, function (err, user) {
        if (err)
            return res.status(500).send("Error al recuperar los obejetos");
        if (!user) {
            return res.status(500).send("No existe el usuario en la base de datos");
        }

        if (obj.password == user.password) {
            var token = service.createToken(user);
            db.collection('users').findOneAndUpdate( { email: req.body.email },  {$set :{ token: token , updated_at: new Date()}} , function (err, user) {
                if (err)
                    return res.status(500).send("Error al guardar el token");
                res.status(200);
                res.send({ token: token });
            });
        } else {
            res.status(400).send("Contrasenya erronea");
        }
    });
};