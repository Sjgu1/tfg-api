// grab the things we need
var mongoose = require('mongoose');
var User = require('./user');
var Schema = mongoose.Schema;

// create a schema
var projectSchema = new Schema({
  name: { type: String, required: true},
  description: String,
  repository: String,
  init_date: Date,
  end_date: Date,
  stimated_end_date: Date,
  users: [{
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
  }],
  created_at: Date,
  updated_at: Date
});

//Crear modelo de Proyecto
var Project = mongoose.model('Project', projectSchema);
//Hacerlo accesible desde la api
module.exports = Project;