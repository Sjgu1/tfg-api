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
var Change = require('../models/change');

exports.newChange = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)
    var StatusModel = db.model('status', Status.schema)
    var TaskModel = db.model('tasks', Task.schema)

    var obj = req.body;
    var change = new Change({
        message: req.body.message,
        created_at: new Date()
    });

    //Se comprueba los campos obligatorios
    if (req.body.message == undefined) {
        res.status(400).send("El campo message es obligatorio");
        //Se comprueba que el repositorio es una url
    } else {
        db.collection('changes').insertOne(change, function (err, changeCreado) {
            TaskModel.findOneAndUpdate({ _id: req.params.idTask }, { $push: { changes: changeCreado.ops[0]._id } }).exec(function (err, taskActualizada) {
                if (err)
                    res.status(500).send("Error al crear el cambio");
                else {
                    res.status(201).send(changeCreado.ops[0])
                }
            });
        })
    }
};
exports.getChanges = function (req, res) {
    var TaskModel = db.model('tasks', Task.schema)
    TaskModel.find({ _id: req.params.idTask }).populate('changes').exec(function (err, changes) {
        if (err) {
            res.status(500).send("No se han localizado los cambios");

        } else if (changes == null) {
            res.status(404).send("No se encuentran el estado asociado");
        }
        else {
            res.status(200).send(changes.changes);

        }
    });

};