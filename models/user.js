//Importar lo que necesitamos
'use strict';
var mongoose = require('mongoose');
var Project = require('./project');
mongoose.model('Project');

var Schema = mongoose.Schema;

//  Creacion del schema
var userSchema = new Schema({
  name: String,
  surname: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  admin: Boolean,
  projects: [{type:mongoose.Schema.Types.ObjectId, ref: 'Project'}],
  token: String,
  created_at: Date,
  updated_at: Date,
});


//Crear modelo de usuario
var User = mongoose.model('User', userSchema);
//Hacerlo accesible desde la api
module.exports = User;