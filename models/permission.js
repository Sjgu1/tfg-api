//Importar lo que necesitamos
'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//  Creacion del schema
var permissionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String
});


//Crear modelo de usuario
var Permission = mongoose.model('Permission', permissionSchema);
//Hacerlo accesible desde la api
module.exports = Permission;