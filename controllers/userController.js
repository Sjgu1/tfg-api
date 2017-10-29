// auth.js metodos de creacion y logear usuarios
var mongoose = require('mongoose');
var User = require('../models/user');
var service = require('../service');
var validator = require('validator');
var ObjectId = require('mongoose').Types.ObjectId;


exports.getUser = function (req, res) {
    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el usuario.");
        } else {
            db.collection('users').findOne({ username: req.params.username }, { projects: 0, password: 0, admin: 0, token: 0 }, function (err2, user) {
                if (err2)
                    res.status(500).send(err2)
                res.status(200).send(user);
            })
        }
    });
}

exports.deleteUser = function (req, res) {
    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el usuario.");
        } else {
            db.collection('users').remove({ username: req.params.username }, function (err2, user) {
                if (err2)
                    res.status(500).send(err2)
                res.status(204).send("Se ha borrado el usuario");
            })
        }
    });
}

exports.updateUser = function (req, res) {
    db.collection('users').findOne({ username: req.params.username }, function (err, usuarioActual) {
        if (!usuarioActual) {
            res.status(404).send("No existe el usuario.");
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
            if (req.body.username == null || req.body.email == null) {
                return res.status(400).send("El cuerpo de la peticion debe de incluir username y password")
            }

            if (validator.isEmpty(user.email) || validator.isEmpty(user.username)) {
                res.status(400).send("Los campos username y email son obligatorios")
                //Se comprueba que el email sea válido
            } else if (!validator.isEmail(user.email)) {
                res.status(400).send("Email incorrecto")
            } else {
                if (req.params.username != user.username || req.params.email != user.email) {
                    //Se comprueba que el username no se repite
                    db.collection('users').findOne({ username: user.username }, function (err, user1) {
                        if (user1 && user1.name != usuarioActual.name) {
                            res.status(409).send("Existe un usuario con el mismo nombre de usuario");
                            //Se comprueba que el email no se repite
                        } else {
                            db.collection('users').findOne({ email: user.email }, function (err, user2) {
                                //console.log(user2)
                                if (user2 && user2.email != usuarioActual.email) {
                                    res.status(409).send("El email ya existe en la base de datos");
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
                                            //console.log(user);
                                        return res.status(204).send({user: user});
                                    })
                                }
                            });
                        }
                    })
                }
            }
        }
    })
}