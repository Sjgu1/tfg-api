var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var Poll = require('./poll')


// create a schema
var voteSchema = new Schema({
  value: { type: Number, required: true},
  user: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
  created_at: Date,
  updated_at: Date
});

//Crear modelo de Vote
var Vote = mongoose.model('Vote', voteSchema);
//Hacerlo accesible desde la api
module.exports = Vote;