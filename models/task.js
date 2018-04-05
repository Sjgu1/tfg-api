var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var Status = require('./status')
var Change = require('./change')
var Poll = require('./poll')


// create a schema
var taskSchema = new Schema({
  name: { type: String, required: true},
  description: String,
  start_date: Date,
  end_date: Date,
  estimated_end: Date,
  users: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
  status: {type:mongoose.Schema.Types.ObjectId, ref: 'Status'},
  color: String,
  changes: [{type:mongoose.Schema.Types.ObjectId, ref: 'Change'}],
  poll: {type:mongoose.Schema.Types.ObjectId, ref: 'Poll'},
  created_at: Date,
  updated_at: Date
});

//Crear modelo de Task
var Task = mongoose.model('Task', taskSchema);
//Hacerlo accesible desde la api
module.exports = Task;