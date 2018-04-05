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


exports.newSprint = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)


    var obj = req.body;
    var sprint = new Sprint({
        name: req.body.name,
        description: req.body.description,
        start_date: req.body.start_date,
        estimated_end: req.body.estimated_end,
        project: ObjectId(req.params.idProject),
        status: [],
        created_at: new Date(),
        updated_at: new Date()
    });

    //Se comprueba los campos obligatorios
    if (req.body.name == undefined) {
        res.status(400).send("el campo name es obligatorio");
        //Se comprueba que el repositorio es una url
    } else {
        db.collection('sprints').insertOne(sprint, function (err, sprintCreado) {
            ProjectModel.findOneAndUpdate({ _id: sprint.project }, { $push: { sprints: sprintCreado.ops[0]._id } }).exec(function (err, projActualizado) {
                if (err)
                    res.status(500).send("Error al crear el sprint");
                else {
                    res.status(201).send(projActualizado)
                }
            });
        })
    }
};
exports.getSprints = function (req, res) {
    var SprintModel = db.model('sprints', Sprint.schema)
    SprintModel.find({ project: req.params.idProject }).populate(['project.name', 'status']).exec(function (err, sprints) {
        if (err) {
            res.status(500).send("No se han localizado los proyectos");

        } else if (sprints == null) {
            res.status(404).send("No se encuentran los sprints asociados");
        }
        else
            res.status(200).send(sprints);
    });

};
exports.getSprint = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)


    ProjectModel.findOne({ _id: req.params.idProject }).exec(function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el proyecto.");
        } else {

            var sprintsProyectos = []
            var otra = [];
            var pertenece = false;
            doc.sprints.forEach(sprint => {
                if (sprint == req.params.idSprint && !pertenece)
                    pertenece = true;
            })
        }
        if (pertenece) {
            var query = { _id: new ObjectId(req.params.idSprint) };
            SprintModel.findOne(query).populate(['project.name', 'status']).exec(function (err, sprint) {
                if (err) {
                    res.status(500).send("Error al conseguir los Sprints.");

                }
                else
                    res.status(200).send(sprint);
            });
        } else {
            return res.status(404).send("El sprint o no existe o no tiene acceso el usuario conectado")
        }
    })
}

exports.deleteSprint = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)

    ProjectModel.findOne({ _id: req.params.idProject }).exec(function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el proyecto.");
        } else {

            var sprintsProyectos = []
            var otra = [];
            var pertenece = false;
            doc.sprints.forEach(sprint => {
                if (sprint == req.params.idSprint && !pertenece)
                    pertenece = true;
            })
        }
        if (pertenece) {
            var query = { _id: new ObjectId(req.params.idSprint) };
            SprintModel.remove(query).exec(function (err, sprints) {
                if (err)
                    return res.status(500).send("Error al conseguir el sprint.");
                else {
                    ProjectModel.findOneAndUpdate({ _id: req.params.idProject }, { $pull: { 'sprints': ObjectId(req.params.idSprint) }, $set: { updated_at: new Date() } }).exec(function (err, doc) {
                        if (err)
                            return res.status(500).send("Error al actualizar los proyectos.");
                        else
                            return res.status(204).send("Se ha borrado el sprint");
                    })
                }
            });
        } else {
            return res.status(404).send("El proyecto o no existe o no tiene acceso el usuario conectado")
        }
    });
}
exports.updateSprint = function (req, res) {
    var ProjectModel = db.model('projects', Project.schema)
    var SprintModel = db.model('sprints', Sprint.schema)

    var datos_a_actualizar = {
        $set: {
            name: req.body.name,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            estimated_end: req.body.estimated_end,
            updated_at: new Date()
        }
    };

    if (req.body.name == undefined) {
        return res.status(400).send("El nombre es obligatorio")
    } else {
        ProjectModel.findOne({ _id: req.params.idProject }).exec(function (err, doc) {
            if (!doc) {
                res.status(404).send("No existe el proyecto.");
            } else {
                var sprintsProyectos = []
                var otra = [];
                var pertenece = false;
                doc.sprints.forEach(sprint => {
                    if (sprint == req.params.idSprint && !pertenece)
                        pertenece = true;
                })

                if (pertenece) {

                    SprintModel.findOneAndUpdate({ _id: req.params.idSprint }, datos_a_actualizar).exec(function (err, sprintActualizado) {
                        if (err) {
                            return res.status(500).send("Error al actualizar el sprint.");
                        } else {
                            return res.status(204).send("actualizado")
                        }
                    })

                } else {
                    return res.status(404).send("El sprint o no existe o no tiene acceso el usuario conectado")
                }
            }
        });
    }
}
