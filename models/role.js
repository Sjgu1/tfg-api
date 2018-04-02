//Importar lo que necesitamos
'use strict';
var mongoose = require('mongoose');
var Permission = require('./permission');

var Schema = mongoose.Schema;

//  Creacion del schema
var roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  permissions: [{type:mongoose.Schema.Types.ObjectId, ref: 'Permission'}]
});


//Crear modelo de usuario
var Role = mongoose.model('Role', roleSchema);
//Hacerlo accesible desde la api
module.exports = Role;