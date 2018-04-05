var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var Status = require('./status')
var Change = require('./change')
var Poll = require('./poll')
var Vote = require('./vote')


// create a schema
var pollSchema = new Schema({
  end_date: { type: Date, required: true},
  votes: [{type:mongoose.Schema.Types.ObjectId, ref: 'Vote'}],
  created_at: Date,
  updated_at: Date
});

//Crear modelo de Poll
var Poll = mongoose.model('Poll', pollSchema);
//Hacerlo accesible desde la api
module.exports = Poll;