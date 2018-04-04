// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Project = require('./project');
var Status = require('./status')


// create a schema
var sprintSchema = new Schema({
  name: { type: String, required: true},
  description: String,
  repository: String,
  start_date: Date,
  end_date: Date,
  estimated_end: Date,
  project:  {type:mongoose.Schema.Types.ObjectId, ref: 'Project'},
  status:[{type:mongoose.Schema.Types.ObjectId, ref: 'Status'}],
  created_at: Date,
  updated_at: Date
});

//Crear modelo de Sprint
var Sprint = mongoose.model('Sprint', sprintSchema);
//Hacerlo accesible desde la api
module.exports = Sprint;