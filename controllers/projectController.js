// auth.js metodos de creacion y logear usuarios
var mongoose = require('mongoose');
var User = require('../models/user');
var Project = require('../models/project');
var service = require('../service');
var validator = require('validator');

exports.crearTablero = function (req, res) {

    var obj = req.body;
    var project = new Project({
        name: req.body.name,
        description: req.body.description,
        repository: req.body.repository,
        init_date: req.body.init_date,
        end_date: req.body.end_date,
        created_at: new Date(),
        updated_at: new Date()
    });
    //Se comprueba los campos obligatorios
    if (validator.isEmpty(project.name)) {
        res.status(500).send("Los campos name son obligatorios");
        //Se comprueba que el repositorio es una url
    } else if (!validator.isEmpty(project.repository) && !validator.isURL(project.repository)) {
        res.status(500).send("El repositorio tiene que ser una url valida")
    } else {
        //Se comprueba que el usuario pasado por parametros existe
       // console.log(req.params.username);
        db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
            if (!doc) {
                res.status(500).send("No existe el usuario.");
                //Se comprueba que el email no se repite
            } else if (doc.token != req.headers.authorization) {
                res.status(500).send("El token no corresponde al usuario logeado.");
            } else {
                db.collection('projects').insertOne(project, function (err, projectoCreado) {
                    if (err)
                        res.status(500).send("Error al crear el proyecto"); //Error al crear el usuario en la base de datos
                    else {
                        db.collection('users').findOneAndUpdate({ username: req.params.username }, { $push: { projects: projectoCreado.ops }, $set: { updated_at: new Date() } }, function (err, user) {
                            if (err)
                                return res.status(500).send("Error al linkear proyecto a usuario");
                            res.status(200);
                            res.send( {project: projectoCreado.ops, mensaje: "Se ha creado el projecto"});
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

            res.status(200);
            res.send({ token: token });
        } else {
            res.status(400).send("Contrasenya erronea");
        }
    });
};