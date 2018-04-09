//roleController.js
var mongoose = require('mongoose');
var Role = require('../models/role');
var service = require('../service');
var validator = require('validator');
var Permission = require('../models/permission');
var ObjectId = require('mongoose').Types.ObjectId;


exports.newRole = function (req, res) {
    var obj = req.body;
    var role = new Role({
        name: req.body.name,
        description: req.body.description,
        permissions: []
    });
    //Se comprueba los campos obligatorio

    if (req.body.name == undefined) {
        return res.status(400).send("El campo name es obligatorio")
    } else if (req.body.permissions == undefined) {
        return res.status(400).send("Se necesitan permisos asociados al rol ")
    } else {
        //Se comprueba que el rol  no se repite
        //console.log(role)
        db.collection('roles').findOne({ name: role.name }, function (err, doc) {
            if (doc) {
                return res.status(409).send("Existe un rol con el mismo nombre, debe ser único");
            } else {
                db.collection('permissions').find().toArray(function (err, permissionsTodos) {

                    var existen = false;
                    req.body.permissions.forEach(permiso => {
                        permissionsTodos.forEach(permisoLeido => {
                            if (permiso.name == permisoLeido.name) {
                                role.permissions.push({permiso: permisoLeido})
                            }

                        })
                    });
                    //console.log(role.permissions)
                    if (role.permissions.length <= 0) {
                        return res.status(400).send("No existe ninguno de los permisos enviados.")
                    } else {
                        db.collection('roles').insertOne(role, function (err, roleCreado) {
                            if (err)
                                return res.status(500).send("Error al crear el rol"); //Error al crear el permiso en la base de datos

                            return res.status(201).send({ role: role }); //Todo ha ido bien, se agrega el usuario
                        });
                    }
                })
            }
        });
    }
};

exports.getRole = function (req, res) {
    var RoleModel = db.model('roles', Role.schema)
    db.collection('roles').findOne({ name: req.params.name }, function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el rol.");
        } else {
            RoleModel.findOne({ name: req.params.name }).populate('permissions').exec(function (err2, role) {
                if (err2)
                    res.status(500).send("Erro al conseguir el rol")
                res.status(200).send(role);
            })
        }
    });
}

exports.getRoles = function (req, res){
    var RoleModel = db.model('roles', Role.schema)
    RoleModel.find().populate('permissions.permiso').exec(function (err, roles) {
        if (err)
            res.status(500).send("Error al conseguir los roles.");
        else
            res.status(200).send(roles);
    });
}


exports.deleteRole = function (req, res) {
    var RoleModel = db.model('roles', Role.schema)
    RoleModel.findOne({ name: req.params.name }, function (err, doc) {
        if (!doc) {
            res.status(404).send("No existe el rol.");
        } else {
            RoleModel.remove({ name: req.params.name }, function (err2, role) {
                if (err2)
                    res.status(500).send("Error al borrar el rol")
                res.status(204).send("Se ha borrado el rol");
            })
        }
    });
}
