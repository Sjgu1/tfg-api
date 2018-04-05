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

exports.newVote = function (req, res) {
    var PollModel = db.model('polls', Poll.schema)
    var UserModel = db.model('users', User.schema)
    var VoteModel = db.model('votes', Vote.schema)

    var vote = new Vote({
        value: req.body.value,
        user: null,
        created_at: new Date(),
        updated_at: new Date()
    });

    //Se comprueba los campos obligatorios
    if (req.body.value== undefined|| validator.isInt(req.body.value) == false) {
        res.status(400).send("El campo value es obligatorio y ha de ser un entero");
        //Se comprueba que el repositorio es una url
    } else {
        PollModel.findOne({ _id: req.params.idPoll }).populate('votes').exec(function (err, pollEncontrada) {
            if (err) {
                res.status(500).send("Error al encontrar la votación")
            } else if (pollEncontrada == null) {
                res.status(404).send("No existe la votación")
            }  else {
                UserModel.findOne({username: req.params.username}).exec(function(err, userEncontrado){
                    if (err) {
                        res.status(500).send("Error al encontrar el usuario")
                    } else if (userEncontrado == null) {
                        res.status(404).send("No existe el usuario")
                    }  else {
                        var participa = false;
                        pollEncontrada.votes.forEach(voto => {
                            if(JSON.stringify(voto.user) === JSON.stringify(userEncontrado._id) && !participa)
                                participa = true                     
                        });
                        if(!participa){
                            vote.user = userEncontrado._id
                            db.collection('votes').insertOne(vote, function (err, voteCreado) {
                                PollModel.findOneAndUpdate({ _id: req.params.idPoll }, { $push: { votes: voteCreado.ops[0]._id } }).exec(function (err, pollActualizada) {
                                    if (err)
                                        res.status(500).send("Error al crear el voto");
                                    else {
                                        res.status(201).send(pollActualizada)
                                    }
                                });
                            })
                        }else{
                            res.status(400).send("El usuario ya ha votado")
                        }
                    }
                      
                })
            }
        })

    }
};
exports.getVotes = function (req, res) {
    var TaskModel = db.model('tasks', Task.schema)

    TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, doc) {
        if (err) {
            res.status(500).send("Error al encontrar la tarea")
        } else if (doc == null) {
            res.status(404).send("No existe la tarea")
        } else {
            var query = { _id: new ObjectId(req.params.idTask) };
            TaskModel.findOne(query).populate(['poll']).exec(function (err, pollEncontrada) {
                if (err) {
                    res.status(500).send("Error al conseguir la votación.");
                }else if(pollEncontrada == null){
                    res.status(404).send("No se ha encontrado la votación");
                }
                else
                    res.status(200).send(pollEncontrada);
            });
        }
    })

}

exports.getVote = function (req, res) {
    var TaskModel = db.model('tasks', Task.schema)



    TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, doc) {
        if (err) {
            res.status(500).send("Error al encontrar la tarea")
        } else if (doc == null) {
            res.status(404).send("No existe la tarea")
        } else {
            var query = { _id: new ObjectId(req.params.idTask) };
            TaskModel.findOne(query).populate(['poll']).exec(function (err, pollEncontrada) {
                if (err) {
                    res.status(500).send("Error al conseguir la votación.");
                }else if(pollEncontrada == null){
                    res.status(404).send("No se ha encontrado la votación");
                }
                else
                    res.status(200).send(pollEncontrada);
            });
        }
    })

}

exports.updateVote = function (req, res) {
    var TaskModel = db.model('tasks', Task.schema)
    var PollModel = db.model('polls', Poll.schema)

    TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, doc) {
        if (err) {
            res.status(500).send("Error al encontrar la tarea")
        } else if (doc == null) {
            res.status(404).send("No existe la tarea")
        } else {
            var query = { _id: new ObjectId(req.params.idPoll) };
            PollModel.remove(query , function (err, pollActualizada) {
                if (err) {
                    res.status(500).send("Error al conseguir la votación.");
                }else{
                    TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $set: { poll: null, updated_at: new Date() } }).exec(function (err, taskActualizada) {
                        if (err)
                            res.status(500).send("Error al actualizar la tarea");
                        else {
                            res.status(201).send("Borrado");
                        }
                    });
                }
            });
        }
    })
}

exports.deleteVote = function (req, res) {
    var TaskModel = db.model('tasks', Task.schema)
    var PollModel = db.model('polls', Poll.schema)

    TaskModel.findOne({ _id: req.params.idTask }).exec(function (err, doc) {
        if (err) {
            res.status(500).send("Error al encontrar la tarea")
        } else if (doc == null) {
            res.status(404).send("No existe la tarea")
        } else {
            var query = { _id: new ObjectId(req.params.idPoll) };
            PollModel.remove(query , function (err, pollActualizada) {
                if (err) {
                    res.status(500).send("Error al conseguir la votación.");
                }else{
                    TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $set: { poll: null, updated_at: new Date() } }).exec(function (err, taskActualizada) {
                        if (err)
                            res.status(500).send("Error al actualizar la tarea");
                        else {
                            res.status(201).send("Borrado");
                        }
                    });
                }
            });
        }
    })
}