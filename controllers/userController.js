// auth.js metodos de creacion y logear usuarios
var mongoose = require('mongoose');
var User = require('../models/user');
var Project = require('../models/project');
var service = require('../service');
var validator = require('validator');
var ObjectId = require('mongoose').Types.ObjectId;


exports.getUser = function (req, res) {
    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(500).send("No existe el usuario.");
            //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
        } else if (doc.token != req.headers.authorization) {
            res.status(500).send("El token no corresponde al usuario logeado.");
        } else {
            db.collection('users').findOne({ username: req.params.username },{_id: 0, projects: 0, password: 0, admin: 0, token: 0}, function (err2, user) {
                if(err2)
                    res.status(500).send(err2)
                res.status(200).send(user);
            })
        }
    });
}
