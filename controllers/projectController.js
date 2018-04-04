// auth.js metodos de creacion y logear usuarios
var mongoose = require('mongoose');
var User = require('../models/user');
var Project = require('../models/project');
var service = require('../service');
var validator = require('validator');
var Permission = require('../models/permission')
var Role = require('../models/role')
var ObjectId = require('mongoose').Types.ObjectId;


exports.newProject = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)

    var obj = req.body;
    var project = new Project({
        name: req.body.name,
        description: req.body.description,
        repository: req.body.repository,
        start_date: req.body.start_date,
        estimated_end: req.body.estimated_end,
        users: [],
        created_at: new Date(),
        updated_at: new Date()
    });
    //Se comprueba los campos obligatorios

    if (req.body.repository == undefined || req.body.name == undefined) {
        res.status(400).send("Los campos name son obligatorios");
        //Se comprueba que el repositorio es una url
    } else if (!validator.isURL(req.body.repository)) {
        res.status(400).send("El repositorio tiene que ser una url valida")
    } else {
        //Se comprueba que el usuario pasado por parametros existe
        // console.log(req.params.username);
        db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
            if (!doc) {
                res.status(404).send("No existe el usuario.");
            } else {
                db.collection('roles').findOne({ name: "Admin" }, function (err, docRol) {
                    if (!doc) {
                        res.status(404).send("No existe el rol.");
                    } else {
                        db.collection('projects').insertOne(project, function (err, proyectoCreado) {
                            ProjectModel.findOneAndUpdate({ _id: proyectoCreado.ops[0]._id }, { $push: { users: { user: doc, role: docRol } } }).populate("permissions").exec(function (err, probando) {
                                if (err)
                                    res.status(500).send("Error al crear el proyecto");
                                else {
                                    db.collection('users').findOneAndUpdate({ username: req.params.username }, { $push: { projects: proyectoCreado.ops[0] }, $set: { updated_at: new Date() } }, function (err, user) {
                                        if (err)
                                            return res.status(500).send("Error al linkear proyecto a usuario");
                                        res.status(201);
                                        var loc = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + proyectoCreado.ops[0]._id
                                        res.setHeader('location', loc);
                                        res.send(probando.value);
                                    });
                                }
                            });
                        })
                    }
                })
            }
        });
    }
};
exports.getProjects = function (req, res) {
    console.log("probando")
    var ProjectModel = db.model('projects', Project.schema)

    //Se comprueba que el usuario pasado por parametros existe en la base de datos
    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el usuario.");
        } else {
            var proyectosDeUsuario = []
            var otra = [];
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
                "users.user": 1,
                "users.role": 1,
                "description": 1,
                "start_date": 1,
                "end_date": 1
            }
            ProjectModel.find(query).populate(['users.role', 'users.user']).exec(function (err, proyectos) {
                if (err) {
                    res.status(500).send("No se han localizado los proyectos");

                }
                else
                    res.status(200).send(proyectos);
            });
        }
    });

};
exports.getProject = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)

    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el usuario.");
        } else {

            var proyectosDeUsuario = []
            var otra = [];
            var pertenece = false;
            for (var i = 0; i < doc.projects.length; i++) {
                if (doc.projects[i]._id == req.params.idProject && !pertenece)
                    pertenece = true;
            }
            if (pertenece) {
                var query = { _id: new ObjectId(req.params.idProject) };
                ProjectModel.findOne(query).populate(['users.role', 'users.user']).populate('users.role.permissions.permiso').exec(function (err, proyecto) {
                    if (err) {
                        res.status(500).send("Error al conseguir los proyectos.");

                    }
                    else
                        res.status(200).send(proyecto);
                });
            } else {
                return res.status(404).send("El proyecto o no existe o no tiene acceso el usuario conectado")
            }
        }
    });
}

exports.deleteProject = function (req, res) {

    db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el usuario.");
        } else {

            var proyectosDeUsuario = []
            var otra = [];
            var pertenece = false;
            for (var i = 0; i < doc.projects.length; i++) {
                if (doc.projects[i]._id == req.params.idProject && !pertenece)
                    pertenece = true;
            }

            if (pertenece) {
                var query = { _id: new ObjectId(req.params.idProject) };
                db.collection('projects').findOne(query, function (err, pro) {
                    var participantes = []
                    for (var i = 0; i < pro.users.length; i++) {
                        participantes[i] = pro.users[i].user._id
                    }

                    db.collection('projects').findOneAndDelete(query, function (err, proyectos) {
                        if (err)
                            return res.status(500).send("Error al conseguir los proyectos.");
                        else {
                            for (var i = 0; i < participantes.length; i++) {
                                var id = participantes[i]
                                db.collection('users').findOneAndUpdate({ _id: id }, { $pull: { 'projects': { _id: new ObjectId(req.params.idProject) } }, $set: { updated_at: new Date() } }, function (err, doc) {
                                    if (err)
                                        return res.status(500).send("Error al conseguir los proyectos.");
                                })
                                db.collection('users').findOneAndUpdate({ username: req.params.username }, { $pull: { 'projects': { _id: new ObjectId(req.params.idProject) } }, $set: { updated_at: new Date() } }, function (err, doc) {
                                    if (err)
                                        return res.status(500).send("Error al conseguir los proyectos.");
                                })
                            }
                            return res.status(204).send("Se ha borrado el proyecto");

                        }
                    });
                })
            } else {
                return res.status(404).send("El proyecto o no existe o no tiene acceso el usuario conectado")
            }
        }
    });
}
exports.updateProject = function (req, res) {
    var agregarUsuario = true;
    if (req.body.operation == "UpdateRole") {
        var UserModel = db.model('users', User.schema);
        var ProjectModel = db.model('projects', Project.schema);
        var RoleModel = db.model('roles', Role.schema)

        UserModel.findOne({ username: req.body.username }).populate(['projects', 'projects.users', 'projects.users.projects']).exec(function (error, user) {
            if (user == null) {
                res.status(404).send("No existe el usuario")
            } else {
                var participa = false;
                var proje = null
                var count = 0
                var elegir = 0
                user.projects.forEach(proj => {
                    if (proj._id == req.params.idProject) {
                        participa = true
                        proje = proj
                        elegir = count
                    }
                    count += 1
                })

                if (participa == true) {
                    RoleModel.findOne({ name: req.body.role }).exec(function (err3, role) {
                        if (role == null) {
                            res.status(404).send("No existe el Rol solicitado a modificar")
                            // return null
                        } else {
                            var dir = 'users.' + elegir + '.role'

                            ProjectModel.updateOne({ '_id': req.params.idProject, 'users': { $elemMatch: { user: ObjectId(user._id) } } }, { $set: { 'users.$.role': ObjectId(role._id) } }).exec(function (err, projectUpdated) {
                                if (err)
                                    return res.status(500).send("Error de la base de datos")
                                else {
                                    return res.status(204).send(projectUpdated)

                                }
                            })
                        }
                    })
                } else {
                    return res.status(404).send("El usuario no participa")
                }
            }

        })

    } else if (req.body.operation == "DeleteUser") {

        var UserModel = db.model('users', User.schema);
        var ProjectModel = db.model('projects', Project.schema);
        var RoleModel = db.model('roles', Role.schema)

        UserModel.findOne({ username: req.body.username }).populate(['projects', 'projects.users', 'projects.users.projects']).exec(function (error, user) {
            if (user == null) {
                res.status(404).send("No existe el usuario")
            } else {
                var participa = false;
                var proje = null
                var count = 0
                var elegir = 0
                user.projects.forEach(proj => {
                    if (proj._id == req.params.idProject) {
                        participa = true
                        proje = proj
                        elegir = count
                    }
                    count += 1
                })
                if (participa == true) {
                    ProjectModel.updateOne({ '_id': req.params.idProject }, { $pull: { 'users': { $elemMatch: { user: ObjectId(user._id) } } } }).exec(function (err, projectUpdated) {
                        if (err)
                            return res.status(500).send("Error de la base de datos")
                        else {
                            return res.status(204).send(projectUpdated)

                        }
                    })

                } else {
                    return res.status(404).send("El usuario no participa")
                }
            }

        })

    } else {

        if (req.body.users) {
            var project = {
                name: req.body.name,
                description: req.body.description,
                repository: req.body.repository,
                start_date: req.body.start_date,
                estimated_end: req.body.estimated_end,
                end_date: req.body.end_date,
                updated_at: new Date(),
                users: {
                    user: req.body.users.user,
                    role: req.body.users.role
                }
            };
        } else {
            var agregarUsuario = false;
            var project = {
                name: req.body.name,
                description: req.body.description,
                repository: req.body.repository,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                estimated_end: req.body.estimated_end,
                updated_at: new Date(),
                users: {
                    user: ""
                }

            };
        }
        if (req.body.repository == undefined) {
            return res.status(400).send("El repositorio es obligatorio")
        } else if (!validator.isURL(req.body.repository)) {
            res.status(400).send("El repositorio tiene que ser una url valida")
        } else {
            db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
                if (!doc) {
                    res.status(404).send("No existe el usuario.");
                } else {
                    var proyectosDeUsuario = []
                    var otra = [];
                    var pertenece = false;
                    //Se comprueba que el project pedido pertenece al usuario conectado
                    for (var i = 0; i < doc.projects.length; i++) {
                        if (doc.projects[i]._id == req.params.idProject && !pertenece) {
                            pertenece = true;
                        }
                    }
                    if (pertenece) {
                        //comprobar si se quiere agregar usuario y si existe ese usuario
                        db.collection('users').findOne({ username: project.users.user }, function (err, usuarioInvitado) {
                            if (!usuarioInvitado && agregarUsuario) {
                                res.status(404).send("No existe el usuario invitado.");
                            }
                            db.collection('roles').findOne({ name: req.body.users.role }, function (err, role1) {
                                if (err) {
                                    return res.status(404).send("No existe el rol asignado");
                                }
                                if (role1 == null) {
                                    return res.status(404).send("No existe el rol asignado");
                                }
                                else {
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
                                                        user: new ObjectId(usuarioInvitado._id),
                                                        role: new ObjectId(role1._id),
                                                        _id: ObjectId()
                                                    }
                                                },
                                                $set: {
                                                    name: project.name,
                                                    description: project.description,
                                                    repository: project.repository,
                                                    start_date: project.start_date,
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
                                                    start_date: project.start_date,
                                                    end_date: project.end_date,
                                                    updated_at: new Date()
                                                }
                                            }
                                        }

                                        var query = { _id: new ObjectId(req.params.idProject) };
                                        console.log(query)


                                        db.collection('projects').findOneAndUpdate(query, datos_a_actualizar, function (err, proyecto) {
                                            if (err) {
                                                res.status(500).send("Error al conseguir los proyectos.");
                                            } else if (proyecto == null) {
                                                res.status(500).send("No existe el proyecto");
                                            } else {

                                                if (agregarUsuario) {
                                                    db.collection('users').findOneAndUpdate({ username: usuarioInvitado.username }, { $push: { projects: proyecto.value }, $set: { updated_at: new Date() } }, function (err, user) {
                                                        if (err)
                                                            return res.status(500).send("Error al linkear proyecto a usuario");
                                                        res.status(204);
                                                        res.send(proyecto);
                                                    });
                                                } else {
                                                    res.status(204);
                                                    res.send(proyecto);
                                                }
                                            }
                                        })


                                    } else {
                                        return res.status(400).send("El usuario a agregar ya participa en el proyecto")
                                    }

                                }
                            });
                        })
                    } else {
                        return res.status(404).send("El proyecto o no existe o no tiene acceso el usuario conectado")
                    }
                }
            });
        }
    }
}