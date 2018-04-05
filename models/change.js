var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var changeSchema = new Schema({
  message: { type: String, required: true},
  created_at: Date
});

//Crear modelo de Sprint
var Change = mongoose.model('Change', changeSchema);
//Hacerlo accesible desde la api
module.exports = Change;