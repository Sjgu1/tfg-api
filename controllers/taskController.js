var mongoose = require('mongoose');
var User = require('../models/user');
var Project = require('../models/project');
var service = require('../service');
var validator = require('validator');
var Permission = require('../models/permission')
var Role = require('../models/role')
var Sprint = require('../models/sprint')
var ObjectId = require('mongoose').Types.ObjectId;
var Status = require('../models/status');
var Task = require('../models/task');
exports.newTask = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)
    var StatusModel = db.model('status', Status.schema)
    var TaskModel = db.model('task', Status.schema)

    var obj = req.body;
    var task = new Task({
        name: req.body.name,
        description: req.body.description,
        start_date: req.body.start_date,
        estimated_end: req.body.estimated_end,
        color: req.body.color,
        users: [],
        created_at: new Date(),
        updated_at: new Date()
    });

    //Se comprueba los campos obligatorios
    if (req.body.name == undefined) {
        res.status(400).send("El campo name es obligatorio");
        //Se comprueba que el repositorio es una url
    } else {
        db.collection('tasks').insertOne(task, function (err, taskCreada) {
            StatusModel.findOneAndUpdate({ _id: req.params.idStatus }, { $push: { tasks: taskCreada.ops[0]._id } }).exec(function (err, statusActualizado) {
                if (err)
                    res.status(500).send("Error al crear la tarea");
                else {
                    res.status(201).send(statusActualizado)
                }
            });
        })
    }
};
exports.getTasks = function (req, res) {
    var StatusModel = db.model('status', Status.schema)
    StatusModel.find({ _id: req.params.idStatus }).populate('tasks').exec(function (err, tasks) {
        if (err) {
            res.status(500).send("No se han localizado los proyectos");

        } else if (tasks == null) {
            res.status(404).send("No se encuentran los sprints asociados");
        }
        else {
            res.status(200).send(tasks);

        }
    });

};
exports.getTask = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)
    var StatusModel = db.model('status', Status.schema)
    var TaskModel = db.model('tasks', Task.schema)

    StatusModel.findOne({ _id: req.params.idStatus }).exec(function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el estado.");
        } else {

            var tasksStatus = []
            var otra = [];
            var pertenece = false;
            doc.tasks.forEach(task => {
                if (task == req.params.idTask && !pertenece)
                    pertenece = true;
            })
        }
        if (pertenece) {
            var query = { _id: new ObjectId(req.params.idTask) };
            TaskModel.findOne(query).populate('users').exec(function (err, taskEncontrada) {
                if (err) {
                    res.status(500).send("Error al conseguir la tarea.");
                }
                else
                    res.status(200).send(taskEncontrada);
            });
        } else {
            return res.status(404).send("La tarea o no existe o no tiene acceso el usuario conectado")
        }
    })
}

exports.updateTask = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)
    var StatusModel = db.model('status', Status.schema)
    var TaskModel = db.model('tasks', Task.schema)
    var UserModel = db.model('users', User.schema)
    if (req.body.operation == "asignarUsuario") {
        StatusModel.findOne({ _id: req.params.idStatus }).exec(function (err, doc) {
            if (!doc) {
                res.status(404).send("No existe el status.");
            } else {
                var statusTasks = []
                var otra = [];
                var pertenece = false;
                doc.tasks.forEach(task1 => {
                    if (task1 == req.params.idTask && !pertenece)
                        pertenece = true;
                })

                if (pertenece) {
                    UserModel.findOne({ username: req.body.user }).exec(function (err, userEncontrado) {
                        if (err) {
                            res.status(500).send("Error al obtener el usuario")
                        } else if (userEncontrado == null) {
                            res.status(404).send("El usuario asignado no existe")
                        } else {
                            TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, taskEncontrada) {
                                if (err) {
                                    res.status(500).send("Error al obtener la tarea")
                                } else if (taskEncontrada == null) {
                                    res.status(404).send("Tarea no encontrada")
                                } else {
                                    var participa = false;
                                    taskEncontrada.users.forEach(user => {
                                        if (JSON.stringify(user) === JSON.stringify(userEncontrado._id))
                                            participa = true
                                    })

                                    if (!participa) {
                                        TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $push: { users: userEncontrado._id }, $set: { updated_at: new Date() } }).exec(function (err, task) {
                                            if (err) {
                                                res.status(500).send("Error al actualizar la tarea")
                                            } else {
                                                res.status(204).send("")
                                            }
                                        })

                                    } else {
                                        res.status(400).send("El usuario ya está asignado a esta tarea")
                                    }
                                }
                            })
                        }
                    })
                } else {
                    return res.status(404).send("La tarea o no existe o no tiene acceso el usuario conectado")
                }
            }
        });

    } else if (req.body.operation == "eliminarUsuario") {
        StatusModel.findOne({ _id: req.params.idStatus }).exec(function (err, doc) {
            if (!doc) {
                res.status(404).send("No existe el status.");
            } else {
                var statusTasks = []
                var otra = [];
                var pertenece = false;
                doc.tasks.forEach(task1 => {
                    if (task1 == req.params.idTask && !pertenece)
                        pertenece = true;
                })

                if (pertenece) {
                    UserModel.findOne({ username: req.body.user }).exec(function (err, userEncontrado) {
                        if (err) {
                            res.status(500).send("Error al obtener el usuario")
                        } else if (userEncontrado == null) {
                            res.status(404).send("El usuario asignado no existe")
                        } else {
                            TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, taskEncontrada) {
                                if (err) {
                                    res.status(500).send("Error al obtener la tarea")
                                } else if (taskEncontrada == null) {
                                    res.status(404).send("Tarea no encontrada")
                                } else {
                                    var participa = false;

                                    taskEncontrada.users.forEach(user => {
                                        if (JSON.stringify(user) === JSON.stringify(userEncontrado._id) && !participa)
                                            participa = true
                                    })

                                    if (participa) {
                                        TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $pull: { users: userEncontrado._id }, $set: { updated_at: new Date() } }).exec(function (err, task) {
                                            if (err) {
                                                res.status(500).send("Error al actualizar la tarea")
                                            } else {
                                                res.status(204).send("Usuario eliminado usuario")
                                            }
                                        })

                                    } else {
                                        res.status(400).send("El usuario no está asignado a esta tarea")
                                    }
                                }
                            })
                        }
                    })
                } else {
                    return res.status(404).send("La tarea o no existe o no tiene acceso el usuario conectado")
                }
            }
        });

    } else {
        var datos_a_actualizar = {
            $set: {
                name: req.body.name,
                description: req.body.description,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                estimated_end: req.body.estimated_end,
                color: req.body.color,
                updated_at: new Date()
            }
        };
        if (req.body.name == undefined) {
            return res.status(400).send("El nombre es obligatorio")
        } else {
            StatusModel.findOne({ _id: req.params.idStatus }).exec(function (err, doc) {
                if (!doc) {
                    res.status(404).send("No existe el status.");
                } else {
                    var statusTasks = []
                    var otra = [];
                    var pertenece = false;
                    doc.tasks.forEach(task1 => {
                        if (task1 == req.params.idTask && !pertenece)
                            pertenece = true;
                    })

                    if (pertenece) {

                        TaskModel.findOneAndUpdate({ _id: req.params.idTask }, datos_a_actualizar).exec(function (err, taskActualizada) {
                            if (err) {
                                return res.status(500).send("Error al actualizar la tarea.");
                            } else {
                                return res.status(204).send("actualizado")
                            }
                        })
                    } else {
                        return res.status(404).send("La tarea o no existe o no tiene acceso el usuario conectado")
                    }
                }
            });
        }
    }
}

exports.deleteTask = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)
    var TaskModel = db.model('tasks', Task.schema)
    var StatusModel = db.model('status', Status.schema)

    StatusModel.findOne({ _id: req.params.idStatus }).exec(function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el status.");
        } else {

            var tasksStatus = []
            var otra = [];
            var pertenece = false;
            doc.tasks.forEach(task => {
                if (task == req.params.idTask && !pertenece)
                    pertenece = true;
            })
        }
        if (pertenece) {
            var query = { _id: new ObjectId(req.params.idTask) };
            TaskModel.remove(query).exec(function (err, tasks) {
                if (err)
                    return res.status(500).send("Error al conseguir el sprint.");
                else {
                   return res.status(201).send("borrado")
                }
            });
        } else {
            return res.status(404).send("La tarea o no existe o no tiene acceso el usuario conectado")
        }
    });
}