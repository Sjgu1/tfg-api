// auth.js metodos de creacion y logear usuarios
var mongoose = require('mongoose');
var User = require('../models/user');
var service = require('../service');
var validator = require('validator');
var ObjectId = require('mongoose').Types.ObjectId;


exports.getUser = function (req, res) {
    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(500).send("No existe el usuario.");
            //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
        /*} else if (doc.token != req.headers.authorization) {
            res.status(500).send("El token no corresponde al usuario logeado.");*/
        } else {
            db.collection('users').findOne({ username: req.params.username }, { _id: 0, projects: 0, password: 0, admin: 0, token: 0 }, function (err2, user) {
                if (err2)
                    res.status(500).send(err2)
                res.status(200).send(user);
            })
        }
    });
}

exports.updateUser = function (req, res) {
    console.log(req.body);
    db.collection('users').findOne({ username: req.params.username }, function (err, usuarioActual) {
        if (!usuarioActual) {
            res.status(500).send("No existe el usuario.");
            //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
         /*} else if (doc.token != req.headers.authorization) {
            res.status(500).send("El token no corresponde al usuario logeado.");*/
        } else {
            
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
            if(req.body.username ==null || req.body.email == null){
                return res.status(500).send("El cuerpo de la peticion debe de incluir username y password")
            }

            if (validator.isEmpty(user.email) || validator.isEmpty(user.username)) {
                res.status(500).send("Los campos username y email son obligatorios")
                //Se comprueba que el email sea válido
            } else if (!validator.isEmail(user.email)) {
                res.status(500).send("Email incorrecto")
            } else {
                if (req.params.username != user.username || req.params.email != user.email  ) {
                    //Se comprueba que el username no se repite
                    db.collection('users').findOne({ username: user.username }, function (err, user1) {
                        if (user1 && user1.name != usuarioActual.name ) {
                            res.status(500).send("Existe un usuario con el mismo nombre de usuario");
                            //Se comprueba que el email no se repite
                        } else {
                            db.collection('users').findOne({ email: user.email }, function (err, user2) {
                                console.log(user2)
                                if (user2 && user2.email != usuarioActual.email) {
                                    res.status(500).send("El email ya existe en la base de datos");
                                    //Se comprueba que el email no se repite
                                } else {
                                    var datos_a_actualizar = {
                                        $set: {
                                            name: user.name,
                                            surname: user.surname,
                                            username: user.username,
                                            email: user.email,
                                            updated_at: new Date()
                                        }
                                    }                                  
                                    db.collection('users').findOneAndUpdate({ username: req.params.username }, datos_a_actualizar, function (err2, user) {
                                        if (err2)
                                            res.status(500).send(err2)
                                        res.status(200).send("usuarioActualizado");
                                    })

                                }
                            });
                        }
                    })
                }
            }
            return res.status(400);
        }

    })
}