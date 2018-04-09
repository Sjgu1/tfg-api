// sprint.js
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

exports.newStatus = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)
    var StatusModel = db.model('status', Status.schema)

    var obj = req.body;
    var estado = new Status({
        name: req.body.name, 
        open: true, 
        tasks: []
    });

    //Se comprueba los campos obligatorios
    if (req.body.name == undefined) {
        res.status(400).send("El campo name es obligatorio");
        //Se comprueba que el repositorio es una url
    } else {
        db.collection('status').insertOne(estado, function (err, estadoCreado) {
            SprintModel.findOneAndUpdate({ _id: req.params.idSprint }, { $push: { status: estadoCreado.ops[0]._id } }).exec(function (err, sprintActualizado) {
                if (err)
                    res.status(500).send("Error al crear el estado");
                else {
                    res.status(201).send(estadoCreado.ops[0])
                }
            });
        })
    }
};
exports.getAllStatus = function (req, res) {
    var SprintModel = db.model('sprints', Sprint.schema)
    SprintModel.find({ _id: req.params.idSprint }).populate(['status']).exec(function (err, sprints) {
        if (err) {
            res.status(500).send("Error al buscar los estados");

        } else if (sprints == null) {
            res.status(404).send("No se encuentran los estados asociados");
        }
        else
            res.status(200).send(sprints);
    });

};
exports.getStatus = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)
    var StatusModel = db.model('status', Status.schema)

    SprintModel.findOne({ _id: req.params.idSprint }).exec(function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el sprint.");
        } else {

            var statusSprints = []
            var otra = [];
            var pertenece = false;
            doc.status.forEach(estado => {
                if (estado == req.params.idStatus && !pertenece)
                    pertenece = true;
            })
        }
        if (pertenece) {
            var query = { _id: new ObjectId(req.params.idStatus) };
            StatusModel.findOne(query).populate(['status','tasks']).exec(function (err, estadoEncontrado) {
                if (err) {
                    res.status(500).send("Error al conseguir los estados.");
                }
                else
                    res.status(200).send(estadoEncontrado);
            });
        } else {
            return res.status(404).send("El estado o no existe o no tiene acceso el usuario conectado")
        }
    })
}

exports.updateStatus = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)
    var StatusModel = db.model('status', Status.schema)

    var datos_a_actualizar = {
        $set: {
            name: req.body.name,
            open: req.body.open
        }
    };

    if (req.body.name == undefined ||req.body.open == undefined ) {
        return res.status(400).send("El nombre y el estado es obligatorio")
    } else {
        SprintModel.findOne({ _id: req.params.idSprint }).exec(function (err, doc) {
            if (!doc) {
                res.status(404).send("No existe el sprint.");
            } else {
                var statusSprints = []
                var otra = [];
                var pertenece = false;
                doc.status.forEach(estado => {
                    if (estado == req.params.idStatus && !pertenece)
                        pertenece = true;
                })

                if (pertenece) {
                    StatusModel.findOneAndUpdate({ _id: req.params.idStatus }, datos_a_actualizar).exec(function (err, statusActualizado){
                        if(err){
                            return res.status(500).send("Error al actualizar el status.");
                        }else{
                            return res.status(204).send("actualizado")
                        }
                    })

                } else {
                    return res.status(404).send("El status o no existe o no tiene acceso el usuario conectado")
                }
            }
        });
    }
}
