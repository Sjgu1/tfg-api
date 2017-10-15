// grab the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


// create a schema
var userSchema = new Schema({
  name: String,
  surname: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  admin: Boolean,
  created_at: Date,
  updated_at: Date,
});


//Crear modelo de usuario
var User = mongoose.model('User', userSchema);
//Hacerlo accesible desde la api
module.exports = User;