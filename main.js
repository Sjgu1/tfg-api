//Cargamos el módulo express
var jwt = require('jwt-simple');
var payload = { foo: 'bar' };
var secret = 'xxx';
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var authCtrl = require('./auth');
var middleware = require('./middleware');
var app = express();
app.use(bp.json());

// HS256 secrets are typically 128-bit random strings, for example hex-encoded: 
// var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex) 
 
// encode 
var token = jwt.encode(payload, secret);
console.log(token);

// decode 
var decoded = jwt.decode(token, secret);
console.log(decoded);

/*
 * jwt.decode(token, key, noVerify, algorithm)
 */
 
// decode, by default the signature of the token is verified 
var decoded = jwt.decode(token, secret);
console.log(decoded); //=> { foo: 'bar' } 
 
// decode without verify the signature of the token, 
// be sure to KNOW WHAT ARE YOU DOING because not verify the signature 
// means you can't be sure that someone hasn't modified the token payload 
var decoded = jwt.decode(token, secret, true);
console.log(decoded); //=> { foo: 'bar' } 
 
// decode with a specific algorithm (not using the algorithm described in the token payload) 
var decoded = jwt.decode(token, secret, false, 'HS256');
console.log(decoded); //=> { foo: 'bar' } 

var users;
var idActual;


app.get('/api/users', function(pet, resp){
    resp.status(200)
    var array = []
    users.forEach(function(valor) {
       array.push(valor)
    })  
    resp.send(array)
 })
 
 app.get('/api/users/:id', function(pet, resp){
    var id = parseInt(pet.params.id)
    if (isNaN(id)) {
     resp.status(400)
     resp.send("El id debe ser numérico")
    }
    else {
     var resultado = users.get(id)
     if (resultado) {
         resp.status(200)
         resp.send(resultado) 
     }
     else {
         resp.status(404)
         resp.send({userMessage:"El user no se ha encontrado",devMessage:""})   
     }
    }
 })
 
 app.post('/api/users', function(pet, resp){
   var obj = pet.body;
   if (obj.nombre && obj.apellidos) {
       idActual++
       var nuevoObj = {id: idActual, nombre:obj.nombre, apellidos:obj.apellidos}
       users.set(idActual, nuevoObj)
       resp.status(201)
       resp.header('Location', 'http://localhost:3000/api/users/' + nuevoObj.id)
       resp.send(nuevoObj)
   }
   else {
       resp.status(400)
       resp.send({error: "faltan parámetros"})
   }
 
 })
 
 
 app.delete('/api/users/:id', function(pet, resp){
    //intentamos convertir el id a número 
    var idBorrar = parseInt(pet.params.id)
    //si es un número, lo intentamos borrar
    if (!isNaN(idBorrar)) {
       //si el delete del map devuelve true es que estaba 
       if (users.delete(idBorrar)) {
           resp.status(204)
           resp.end()
       }
       else {
           resp.status(404)
           resp.send("El user con id " + idBorrar + " no existe")
       }
    } else {
       resp.status(400)
       resp.send({error: "El parámetro id debería ser numérico"}) 
    }
 })
 
 
//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
   console.log("El servidor express está en el puerto 3000");

   users = new Map() 
   users.set(1, {id:1, nombre:"Sergio", apellidos:"garcia"})
   users.set(2, {id:2, nombre:"Cristina", apellidos:"Garcia"})
   idActual = users.size;
   console.log("Servidor arrancado") 
});