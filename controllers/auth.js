// auth.js metodos de creacion y logear usuarios
var mongoose = require('mongoose');
var User = require('../models/user');
var service = require('../service');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs')

exports.emailSignup = function (req, res) {
    var obj = req.body;
    var user = new User({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        admin: false,
        avatar: "avatar_051",
        created_at: new Date(),
        updated_at: new Date()
    });
    //Se comprueba los campos obligatorio
    //console.log(user.body.email)
    if (req.body.email == undefined || req.body.password == undefined || req.body.username == undefined) {
        return res.status(400).send("Los campos username, password y email son obligatorios")
        //Se comprueba que el email sea válido
    } else if (!validator.isEmail(user.email)) {
        return res.status(400).send("Email incorrecto")
    } else {
        //Se comprueba que el username no se repite
        db.collection('users').findOne({ username: user.username }, function (err, doc) {
            if (doc) {
                return res.status(409).send("Existe un usuario con el mismo nombre de usuario");
                //Se comprueba que el email no se repite
            } else {
                db.collection('users').findOne({ email: user.email }, function (err, doc) {
                    if (doc) {
                        return res.status(409).send("El email ya existe en la base de datos");
                        //Se comprueba que el email no se repite
                    } else {

                        bcrypt.hash(user.password, null, null, function (errHash, hash) {
                            if (errHash) {
                                return res.status(500).send("Error al crear el usuario por parte del servidor"); //Error al crear el usuario en la base de datos

                            } else {
                                user.password = hash
                                db.collection('users').insertOne(user, function (err, userCreado) {
                                    if (err)
                                        return res.status(500).send("Error al crear el usuario por parte del servidor"); //Error al crear el usuario en la base de datos
                                    else
                                        return res.status(201).send({ username: user }); //Todo ha ido bien, se agrega el usuario
                                });
                            }

                        })
                    }
                });
            }
        });
    }
};


exports.emailLogin = function (req, res) {
    var obj = req.body;
    if (req.body.username == null || req.body.password == null || req.body.username == "" || req.body.password == "") {
        return res.status(400).send("Los campos username y password son obligatorios")
    }

    db.collection('users').findOne({ username: req.body.username }, function (err, user) {
        if (err)
            return res.status(500).send("Error al recuperar los obejetos");
        if (!user) {
            return res.status(401).send("No existe el usuario en la base de datos");
        }

        bcrypt.compare(obj.password, user.password, function (errHash, coinciden) {
            if (!coinciden) {
                return res.status(500).send("Contraseña errónea"); //Error al crear el usuario en la base de datos

            } else {

                var token = service.createToken(user);
                db.collection('users').findOneAndUpdate({ username: req.body.username }, { $set: { token: token, updated_at: new Date() } }, function (err, user) {
                    if (err)
                        return res.status(500).send("Error al guardar el token");
                    return res.status(200).send({ token: token });
                });

            }
        });

    });
};