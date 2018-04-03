// middleware.js
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config');

exports.ensureAuthenticated = function(req, res, next) {
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({message: "Tu petición no tiene cabecera de autorización"});
  }
  
  var token = req.headers.authorization;
  try{
    var payload = jwt.decode(token, config.TOKEN_SECRET);
  }catch(e){
    return res.status(400).send("Token incorrecto");
  }
 

  if(payload.exp <= moment().unix()) {
     return res
     	.status(401)
        .send({message: "El token ha expirado"});
  }
  
  req.user = payload.sub;
  next();
}

exports.comprobarToken = function(req, res, next){
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