var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = require('./task')

// create a schema
var statusSchema = new Schema({
  name: { type: String, required: true},
  open: Boolean, 
  tasks: [{type:mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

//Crear modelo de Sprint
var Status = mongoose.model('Status', statusSchema);
//Hacerlo accesible desde la api
module.exports = Status;