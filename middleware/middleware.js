// middleware.js
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config');
var User = require('../models/user')
var Project = require('../models/project')

exports.ensureAuthenticated = function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Tu petición no tiene cabecera de autorización" });
  }

  var token = req.headers.authorization;
  try {
    var payload = jwt.decode(token, config.TOKEN_SECRET);
  } catch (e) {
    return res.status(400).send("Token incorrecto");
  }


  if (payload.exp <= moment().unix()) {
    return res
      .status(401)
      .send({ message: "El token ha expirado" });
  }

  req.user = payload.sub;
  next();
}

exports.comprobarToken = function (req, res, next) {
  db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
    if (!doc) {
      res.status(404).send("No existe el usuario.");
      //se comprueba que el token del usuario que hace la peticion es el mismo que los datos del usuario que se piden
    } else if (doc.token != req.headers.authorization) {
      res.status(401).send("El token no corresponde al usuario logeado.");
      next();
    }
  })
}

exports.comprobarPermisoAdmin = function (req, res, next) {
  var UserModel = db.model('users', User.schema)
  var ProjectModel = db.model('projects', Project.schema)

  UserModel.findOne({ username: req.params.username }).populate('projects').exec(function (err, doc) {
    if (doc == null) {
      return res.status(404).send("El usuario no existe")

    }
    var permisos = false;
    doc.projects.forEach(docProject => {
      if (docProject._id == req.params.idProject) {
        ProjectModel.findOne({ _id: docProject._id }).populate(['users.user', 'users.role']).exec(function (err, doc2) {
          if (doc2 == null) {
            return res.status(404).send("El usuario no existe")
          }
          doc2.users.forEach(userProject => {
            if (userProject.user.username == req.params.username) {
              if (userProject.role.name == "Admin") {
                permisos = true;
              }
            }
          });
          if (permisos == true) {
            next()
          } else {
            return res.status(404).send("Tu rol no te permite realizar esta accion")
          }
        })
      }
    })
  })
}
exports.comprobarPermisoJefe = function (req, res, next) {
  var UserModel = db.model('users', User.schema)
  var ProjectModel = db.model('projects', Project.schema)

  UserModel.findOne({ username: req.params.username }).populate('projects').exec(function (err, doc) {
    if (doc == null) {
      return res.status(404).send("El usuario no existe")

    }
    var permisos = false;
    doc.projects.forEach(docProject => {
      if (docProject._id == req.params.idProject) {
        ProjectModel.findOne({ _id: docProject._id }).populate(['users.user', 'users.role']).exec(function (err, doc2) {
          if (doc2 == null) {
            return res.status(404).send("El usuario no existe")
          }
          doc2.users.forEach(userProject => {
            if (userProject.user.username == req.params.username) {
              if (userProject.role.name == "Admin" || userProject.role.name == "Jefe") {
                permisos = true;
              }
            }
          });
          if (permisos == true) {
            next()
          } else {
            return res.status(404).send("Tu rol no te permite realizar esta accion")
          }
        })
      }
    })
  })
}

exports.participaProject = function (req, res, next) {
  db.collection('users').findOne({ username: req.params.username }, function (err, doc) {
    var proyectosDeUsuario = []
    var otra = [];
    var pertenece = false;
    if (doc == null) {
      return res.status(404).send("El usuario no existe")
    }
    for (var i = 0; i < doc.projects.length; i++) {
      if (doc.projects[i]._id == req.params.idProject && !pertenece)
        pertenece = true;
    }
    if (pertenece) {
      next()
    } else {
      return res.status(404).send("El proyecto o no existe o no tiene acceso el usuario conectado")
    }
  })
}