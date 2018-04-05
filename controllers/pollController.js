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
var Poll = require('../models/poll');
var Vote = require('../models/vote');
var Change = require('../models/change');

exports.newPoll = function (req, res) {
    var TaskModel = db.model('tasks', Task.schema)

    var obj = req.body;
    var poll = new Poll({
        end_date: req.body.end_date,
        votes: [],
        changes: [],
        created_at: new Date(),
        updated_at: new Date()
    });

    //Se comprueba los campos obligatorios
    if (req.body.end_date == undefined) {
        res.status(400).send("El campo end_date es obligatorio");
        //Se comprueba que el repositorio es una url
    } else {
        TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, taskEncontrada) {
            if (err) {
                res.status(500).send("Error al encontrar la tarea")
            } else if (taskEncontrada == null) {
                res.status(404).send("No existe la tarea")
            } else if (taskEncontrada.poll != null || taskEncontrada.poll != undefined) {
                res.status(404).send("Ya existe una votación")
            } else {
                db.collection('polls').insertOne(poll, function (err, pollCreada) {
                    TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $set: { poll: pollCreada.ops[0]._id } }).exec(function (err, taskActualizada) {
                        if (err)
                            res.status(500).send("Error al crear la votación");
                        else {
                            var change = new Change({
                                message: "El usuario " + req.params.username + " ha comenzado una votación que finaliza en " + req.body.end_date + ".",
                                created_at: new Date()
                            });
                            db.collection('changes').insertOne(change, function (err, changeCreado) {
                                TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $push: { changes: changeCreado.ops[0]._id } }).exec(function (err, taskActualizada) {
                                    if (err)
                                        res.status(500).send("Error al crear la tarea");
                                    else {
                                        res.status(201).send(pollCreada.ops[0]._id)
                                    }
                                });
                            })
                        }
                    });
                })
            }
        })

    }
};

exports.getPoll = function (req, res) {
    var TaskModel = db.model('tasks', Task.schema)
    var PollModel = db.model('polls', Poll.schema)

    TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, doc) {
        if (err) {
            res.status(500).send("Error al encontrar la tarea")
        } else if (doc == null) {
            res.status(404).send("No existe la tarea")
        } else {
            var query = { _id: new ObjectId(req.params.idPoll) };
            PollModel.findOne(query).populate('votes').exec(function (err, pollEncontrada) {
                if (err) {
                    res.status(500).send("Error al conseguir la votación.");
                } else if (pollEncontrada == null) {
                    res.status(404).send("No se ha encontrado la votación");
                }
                else
                    res.status(200).send(pollEncontrada);
            });
        }
    })

}

exports.updatePoll = function (req, res) {
    var TaskModel = db.model('tasks', Task.schema)
    var PollModel = db.model('polls', Poll.schema)


    if (req.body.end_date == undefined) {
        res.status(400).send("El campo end_date es obligatorio");
    } else {
        TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, doc) {
            if (err) {
                res.status(500).send("Error al encontrar la tarea")
            } else if (doc == null) {
                res.status(404).send("No existe la tarea")
            } else {
                var query = { _id: new ObjectId(req.params.idPoll) };
                PollModel.findOneAndUpdate(query, { $set: { updated_at: new Date(), end_date: req.body.end_date } }, function (err, pollActualizada) {
                    if (err) {
                        res.status(500).send("Error al conseguir la votación.");
                    } else if (pollActualizada == null) {
                        res.status(404).send("No se ha encontrado la votación");
                    } else {
                        var change = new Change({
                            message: "El usuario " + req.params.username + " ha cambiado la fecha de fin de la votación de " + pollActualizada.end_date + " a " + req.body.end_date + ".",
                            created_at: new Date()
                        });
                        db.collection('changes').insertOne(change, function (err, changeCreado) {
                            TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $push: { changes: changeCreado.ops[0]._id } }).exec(function (err, taskActualizada) {
                                if (err)
                                    res.status(500).send("Error al crear la tarea");
                                else {
                                    res.status(204).send(pollActualizada);
                                }
                            });
                        })
                    }
                });
            }
        })
    }
}

exports.deletePoll = function (req, res) {
    var TaskModel = db.model('tasks', Task.schema)
    var PollModel = db.model('polls', Poll.schema)

    TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, doc) {
        if (err) {
            res.status(500).send("Error al encontrar la tarea")
        } else if (doc == null) {
            res.status(404).send("No existe la tarea")
        } else {
            var query = { _id: new ObjectId(req.params.idPoll) };
            PollModel.remove(query, function (err, pollActualizada) {
                if (err) {
                    res.status(500).send("Error al conseguir la votación.");
                } else {
                    TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $set: { poll: null, updated_at: new Date() } }).exec(function (err, taskActualizada) {
                        if (err)
                            res.status(500).send("Error al actualizar la tarea");
                        else {
                            var change = new Change({
                                message: "El usuario " + req.params.username + " ha eliminado la votación.",
                                created_at: new Date()
                            });
                            db.collection('changes').insertOne(change, function (err, changeCreado) {
                                TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $push: { changes: changeCreado.ops[0]._id } }).exec(function (err, taskActualizada) {
                                    if (err)
                                        res.status(500).send("Error al crear la tarea");
                                    else {
                                        res.status(201).send("Borrado");
                                    }
                                });
                            })
                        }
                    });
                }
            });
        }
    })
}