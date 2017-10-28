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
        users: [],
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

                /* } else if (doc.token != req.headers.authorization) {
                     res.status(500).send("El token no corresponde al usuario logeado."); */
            } else {
                //console.log(doc);
                var admin = {
                    user: doc._id
                }
                project.users.push(admin);
                //console.log(project)
                //project.users[0].permission= 0;
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
                /* } else if (doc.token != req.headers.authorization) {
                    res.status(500).send("El token no corresponde al usuario logeado."); */
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
                var datoAmostrar = {
                    "_id": 1,
                    "name": 1,
                    "repository": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "users.user.username": 1,
                    "users._id": 1,
                    "description": 1,
                    "init_date": 1,
                    "end_date": 1
                }

                //var ITEM_PER_PAGE = 5; .skip(skip).limit(ITEM_PER_PAGE)

                db.collection('projects').find(query, datoAmostrar).toArray(function (err, proyectos) {
                    var proyectosHypermedia;
                    //console.log(req)
                    for (var i = 0; i < proyectos.length; i++) {
                        proyectos[i].linkHypermedia = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + proyectos[i]._id;
                    }
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
            /* } else if (doc.token != req.headers.authorization) {
                    res.status(500).send("El token no corresponde al usuario logeado."); */
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

exports.getPaginatedProjects = function (req, res) {
    //Se comprueba los campos obligatorios
    if (!req.params.username) {
        res.status(500).send("Falta usuario");
    } else {
        //Se comprueba que el usuario pasado por parametros existe en la base de datos

        db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
            if (!doc) {
                res.status(500).send("No existe el usuario.");
                //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
                /* } else if (doc.token != req.headers.authorization) {
                    res.status(500).send("El token no corresponde al usuario logeado."); */
            } else {
                //console.log(doc.projects)
                var proyectosDeUsuario = []
                var otra = [];
                //console.log(doc.projects.length)
                for (var i = 0; i < doc.projects.length; i++) {
                    proyectosDeUsuario.push(doc.projects[i]._id)
                    otra[i] = new ObjectId(doc.projects[i]._id)
                }


                var pagination = req.params.paginate.split("&");
                var itemsPage = pagination[0].split("=");
                var page = pagination[1].split("=");
                if (itemsPage[0] != "items" || page[0] != "page") {

                    return res.status(200).send("mal formato")
                }
                var itemsPage = parseInt(itemsPage[1]);
                var page = parseInt(page[1]);

                var saltar = itemsPage * page;

                //console.log(otra.length)
                var nextPage = "items=" + itemsPage + "&page=" + (page + 1);
                var prevPage = "items=" + itemsPage + "&page=" + (page - 1);

                if (page == 0)
                    prevPage = ""


                if (saltar >= otra.length) {
                    nextPage = ""
                    saltar = otra.length - itemsPage
                }

                var query = { _id: { $in: proyectosDeUsuario } };
                var datoAmostrar = {
                    "_id": 1,
                    "name": 1,
                    "repository": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "users.user.username": 1,
                    "users._id": 1,
                    "description": 1,
                    "init_date": 1,
                    "end_date": 1
                }

                //var ITEM_PER_PAGE = 5; .skip(skip).limit(ITEM_PER_PAGE)

                db.collection('projects').find(query, datoAmostrar).skip(saltar).limit(itemsPage).toArray(function (err, proyectos) {
                    //console.log(proyectos)

                    if (err)
                        res.status(500).send("Error al conseguir los proyectos.");
                    else {
                        for (var i = 0; i < proyectos.length; i++) {
                            proyectos[i].linkHypermedia = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + proyectos[i]._id;
                        }
                        //console.log( nextPage)
                        if (nextPage != "")
                            nextPage = req.protocol + '://' + req.get('host') + "/" + req.params.username + "/projects/" + nextPage;
                        if (prevPage != "")
                            prevPage = req.protocol + '://' + req.get('host') + req.params.username + "/projects/" + prevPage;
                        console.log(nextPage)
                        res.status(200).send({ proyectos: proyectos, nextPage: nextPage, prevPage: prevPage });
                    }
                });
            }
        });
    }
};
exports.deleteProject = function (req, res) {

    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(500).send("No existe el usuario.");
            //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
            /* } else if (doc.token != req.headers.authorization) {
                     res.status(500).send("El token no corresponde al usuario logeado."); */
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
    var agregarUsuario = true;
    if (req.body.users) {
        var project = {
            name: req.body.name,
            description: req.body.description,
            repository: req.body.repository,
            init_date: req.body.init_date,
            end_date: req.body.end_date,
            updated_at: new Date(),
            users: {
                user: req.body.users.user
            }
        };
    } else {
        var agregarUsuario = false;
        var project = {
            name: req.body.name,
            description: req.body.description,
            repository: req.body.repository,
            init_date: req.body.init_date,
            end_date: req.body.end_date,
            updated_at: new Date(),
            users: {
                user: ""
            }

        };
    }

    if (!validator.isEmpty(project.repository) && !validator.isURL(project.repository)) {
        res.status(500).send("El repositorio tiene que ser una url valida")
    } else {
        db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
            if (!doc) {
                res.status(500).send("No existe el usuario.");
                //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
                /* } else if (doc.token != req.headers.authorization) {
                    res.status(500).send("El token no corresponde al usuario logeado."); */
            } else {

                var proyectosDeUsuario = []
                var otra = [];
                var pertenece = false;
                //Se comprueba que el project pedido pertenece al usuario conectado
                for (var i = 0; i < doc.projects.length; i++) {
                    if (doc.projects[i]._id == req.params.idProject && !pertenece) {
                        pertenece = true;
                        //console.log(doc.projects[i]._id)
                    }

                }

                if (pertenece) {
                    //comprobar si se quiere agregar usuario y si existe ese usuario
                    db.collection('users').findOne({ username: project.users.user }, function (err, usuarioInvitado) {
                        if (!usuarioInvitado && agregarUsuario) {
                            res.status(500).send("No existe el usuario invitado.");
                        } else {
                            var participa = false;
                            if (agregarUsuario) {
                                for (var j = 0; j < usuarioInvitado.projects.length; j++) {
                                    if (usuarioInvitado.projects[j]._id == req.params.idProject)
                                        participa = true;
                                }
                            }
                            if (!participa) {
                                if (agregarUsuario) {
                                    var datos_a_actualizar = {
                                        $push: {
                                            users: {
                                                user: usuarioInvitado
                                            }
                                        },
                                        $set: {
                                            name: project.name,
                                            description: project.description,
                                            repository: project.repository,
                                            init_date: project.init_date,
                                            end_date: project.end_date,
                                            updated_at: new Date()
                                        }
                                    }
                                } else {
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
                                }

                                var query = { _id: new ObjectId(req.params.idProject) };
                                //console.log(usuarioInvitado);
                                //console.log(datos_a_actualizar)
                                db.collection('projects').findOneAndUpdate(query, datos_a_actualizar, function (err, proyecto) {
                                    if (err) {
                                        //console.log(err)
                                        res.status(500).send("Error al conseguir los proyectos.");
                                    } else {
                                        console.log(proyecto)
                                        if (agregarUsuario) {
                                            db.collection('users').findOneAndUpdate({ username: usuarioInvitado.username }, { $push: { projects: proyecto.value }, $set: { updated_at: new Date() } }, function (err, user) {
                                                if (err)
                                                    return res.status(500).send("Error al linkear proyecto a usuario");
                                                res.status(200);
                                                res.send(proyecto);
                                            });
                                        } else {
                                            res.status(200);
                                            res.send(proyecto);
                                        }

                                    }
                                }
                                );
                            } else {
                                return res.status(200).send("El usuario a agregar ya participa en el proyecto")
                            }
                        }
                    })
                } else {
                    return res.status(200).send("El proyecto o no existe o no tiene acceso el usuario conectado")
                }
            }

        }
        );
    }
}