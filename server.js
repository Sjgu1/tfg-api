// server.js
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var auth = require('./auth/auth');
var middleware = require('./middleware/middleware');
var User = require('./models/user');



// Configuramos Express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('port', 3000);

// Importamos nuestros modelos, 
// en este ejemplo nuestro modelo de usuario
require('./models/user');

// Iniciamos las rutas de nuestro servidor/API
var router = express.Router();
app.use(router);


router.get('/api/users', middleware.ensureAuthenticated, function (pet, resp) {
  resp.status(200)
  var array = []

  resp.send(array)
})



// Rutas de autenticación y login
router.post('/auth/signup', auth.emailSignup);
router.post('/auth/login', auth.emailLogin);

router.route('/bears')



  // get all the bears (accessed at GET http://localhost:8080/api/bears)
  .get(function (req, res) {
    User.find(function (err, bears) {
      if (err)
        res.send(err);

      res.json(bears);
    });
  });

// Ruta solo accesible si estás autenticado
router.get('/private', middleware.ensureAuthenticated, function (req, res) { res.send("Todo bien") });
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://sergiojuliogu:sergiojuliogu@ds117935.mlab.com:17935/adi1718';

MongoClient.connect(MONGO_URL, (err, db) => {  
  if (err) {
    return console.log(err);
  }
  global.db = (global.db ? global.db : mongoose.createConnection(MONGO_URL)); 


 // global.db = MongoClient.connect(MONGO_URL);
  app.connect( function() {
    console.log("Node server running on http://localhost:3000");
  });
})
