// grab the things we need
var mongoose = require('mongoose');
var User = require('./user');
var Role = require('./role')
var Schema = mongoose.Schema;

// create a schema
var projectSchema = new Schema({
  name: { type: String, required: true},
  description: String,
  repository: String,
  start_date: Date,
  end_date: Date,
  estimated_end: Date,
  users: [{
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    role: {type:mongoose.Schema.Types.ObjectId, ref: 'Role'},
  }],
  created_at: Date,
  updated_at: Date
});

//Crear modelo de Proyecto
var Project = mongoose.model('Project', projectSchema);
//Hacerlo accesible desde la api
module.exports = Project;