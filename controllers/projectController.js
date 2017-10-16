// auth.js metodos de creacion y logear usuarios
var mongoose = require('mongoose');
var User = require('../models/user');
var Project = require('../models/project');
var service = require('../service');
var validator = require('validator');
var ObjectId = require('mongoose').Types.ObjectId;


exports.newProject = function (req, res) {

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
                        db.collection('users').findOneAndUpdate({ username: req.params.username }, { $push: { projects: projectoCreado.ops[0] }, $set: { updated_at: new Date() } }, function (err, user) {
                            if (err)
                                return res.status(500).send("Error al linkear proyecto a usuario");
                            res.status(200);
                            res.send({ project: projectoCreado.ops, mensaje: "Se ha creado el projecto" });
                        });
                    }
                });
            }
        });
    }
};


exports.getProjects = function (req, res) {
    //Se comprueba los campos obligatorios
    if (!req.params.username) {
        res.status(500).send("Falta usuario");
    } else {
        //Se comprueba que el usuario pasado por parametros existe en la base de datos

        db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
            if (!doc) {
                res.status(500).send("No existe el usuario.");
                //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
            } else if (doc.token != req.headers.authorization) {
                res.status(500).send("El token no corresponde al usuario logeado.");
            } else {
                //console.log(doc.projects)
                var proyectosDeUsuario = []
                var otra = [];
                //console.log(doc.projects.length)
                for (var i = 0; i < doc.projects.length; i++) {
                    proyectosDeUsuario.push(doc.projects[i]._id)
                    otra[i] = new ObjectId(doc.projects[i]._id)
                }
                var query = { _id: { $in: proyectosDeUsuario } };
                //var ITEM_PER_PAGE = 5; .skip(skip).limit(ITEM_PER_PAGE)

                db.collection('projects').find(query).toArray(function (err, proyectos) {
                    //console.log(proyectos)
                    if (err)
                        res.status(500).send("Error al conseguir los proyectos.");
                    else
                        res.status(200).send(proyectos);
                });
            }
        });
    }
};
exports.getProject = function (req, res) {

    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(500).send("No existe el usuario.");
            //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
        } else if (doc.token != req.headers.authorization) {
            res.status(500).send("El token no corresponde al usuario logeado.");
        } else {

            var proyectosDeUsuario = []
            var otra = [];
            var pertenece = false;
            //Se comprueba que el project pedido pertenece al usuario conectado
            for (var i = 0; i < doc.projects.length; i++) {
                if (doc.projects[i]._id == req.params.idProject && !pertenece)
                    pertenece = true;
            }
            if (pertenece) {
                var query = { _id: new ObjectId(req.params.idProject) };
                db.collection('projects').findOne(query, function (err, proyectos) {
                    if (err)
                        res.status(500).send("Error al conseguir los proyectos.");
                    else
                        res.status(200).send(proyectos);
                });
            } else {
                return res.status(200).send("El proyecto o no existe o no tiene acceso el usuario conectado")
            }
        }
    });
}

exports.deleteProject = function (req, res) {

    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(500).send("No existe el usuario.");
            //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
        } else if (doc.token != req.headers.authorization) {
            res.status(500).send("El token no corresponde al usuario logeado.");
        } else {

            var proyectosDeUsuario = []
            var otra = [];
            var pertenece = false;
            //Se comprueba que el project pedido pertenece al usuario conectado
            for (var i = 0; i < doc.projects.length; i++) {
                if (doc.projects[i]._id == req.params.idProject && !pertenece)
                    pertenece = true;
            }
            if (pertenece) {
                var query = { _id: new ObjectId(req.params.idProject) };
                db.collection('projects').findOneAndDelete(query, function (err, proyectos) {
                    if (err)
                        res.status(500).send("Error al conseguir los proyectos.");
                    else
                        res.status(200).send(proyectos);
                });
            } else {
                return res.status(200).send("El proyecto o no existe o no tiene acceso el usuario conectado")
            }
        }
    });
}

exports.updateProject = function (req, res) {
    var project = {
        name: req.body.name,
        description: req.body.description,
        repository: req.body.repository,
        init_date: req.body.init_date,
        end_date: req.body.end_date,
        updated_at: new Date()
    };
    if (!validator.isEmpty(project.repository) && !validator.isURL(project.repository)) {
        res.status(500).send("El repositorio tiene que ser una url valida")
    } else {
        db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
            if (!doc) {
                res.status(500).send("No existe el usuario.");
                //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
            } else if (doc.token != req.headers.authorization) {
                res.status(500).send("El token no corresponde al usuario logeado.");
            } else {

                var proyectosDeUsuario = []
                var otra = [];
                var pertenece = false;
                //Se comprueba que el project pedido pertenece al usuario conectado
                for (var i = 0; i < doc.projects.length; i++) {
                    if (doc.projects[i]._id == req.params.idProject && !pertenece)
                        pertenece = true;
                }
                        
                if (pertenece) {
                    var datos_a_actualizar = {
                        $set: {
                            name: project.name,
                            description: project.description,
                            repository: project.repository,
                            init_date: project.init_date,
                            end_date: project.end_date,
                            updated_at: new Date()
                        }
                    }
                    var query = { _id: new ObjectId(req.params.idProject) };
                    db.collection('projects').findOneAndUpdate(query, datos_a_actualizar, function (err, proyecto) {
                        if (err) {
                            res.status(500).send("Error al conseguir los proyectos.");
                        } else {
                            if (err)
                                return res.status(500).send("Error al guardar el token");
                            res.status(200);
                            res.send(proyecto);
                        }
                    }
                    );
                } else {
                    return res.status(200).send("El proyecto o no existe o no tiene acceso el usuario conectado")
                }
            }
        });
    }
}