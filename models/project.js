// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var projectSchema = new Schema({
  name: String,
  description: String,
  repository: String,
  init_date: Date,
  end_date: Date,
  stimated_end_date: Date,
  created_at: Date,
  updated_at: Date
});

//Crear modelo de Proyecto
var User = mongoose.model('Project', userSchema);
//Hacerlo accesible desde la api
module.exports = Project;