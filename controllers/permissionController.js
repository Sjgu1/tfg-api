// auth.js metodos de creacion y logear usuarios
var mongoose = require('mongoose');
var Permission = require('../models/permission');
var service = require('../service');
var validator = require('validator');
var ObjectId = require('mongoose').Types.ObjectId;



exports.newPermission = function (req, res) {
    var obj = req.body;
    var permission = new Permission({
        name: req.body.name,
        description: req.body.description
    });
    //Se comprueba los campos obligatorio

    if (req.body.name == undefined) {
        return res.status(400).send("El campo name es obligatorio")
        //Se comprueba que el email sea válido
    } else {
        //Se comprueba que el name no se repite
        db.collection('permissions').findOne({ name: permission.name }, function (err, doc) {
            if (doc) {
                return res.status(409).send("Existe un permiso con el mismo nombre, debe ser único");
                //Se comprueba que el email no se repite
            } else {
                db.collection('permissions').insertOne(permission, function (err, permissionCreado) {
                    if (err)
                        return res.status(500).send("Error al crear el permiso"); //Error al crear el permiso en la base de datos
                                                  
                    return res.status(201).send({ permission: permissionCreado }); //Todo ha ido bien, se agrega el usuario
                });
            }
        });
    }
};

exports.getPermission = function (req, res) {
    db.collection('permissions').findOne({ name: req.params.name }, function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el permiso.");
        } else {
            db.collection('permissions').findOne({ name: req.params.name }, function (err2, permission) {
                if (err2)
                    res.status(500).send(err2)
                res.status(200).send(permission);
            })
        }
    });
}

exports.getPermissions = function (req, res){
    db.collection('permissions').find().toArray(function (err, permissions) {
        if (err)
            res.status(500).send("Error al conseguir los permisos.");
        else
            res.status(200).send(permissions);
    });
}


exports.deletePermission = function (req, res) {
    db.collection('permissions').findOne({ name: req.params.name }, function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el permiso.");
        } else {
            db.collection('permissions').remove({ name: req.params.name }, function (err2, permission) {
                if (err2)
                    res.status(500).send(err2)
                res.status(204).send("Se ha borrado el permiso");
            })
        }
    });
}
