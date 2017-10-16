// server.js
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var auth = require('./controllers/auth');
var middleware = require('./middleware/middleware');
var projectController = require('./controllers/projectController');
var User = require('./models/user');
var Project = require ('./models/project');


// Configuramos Express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

/*****************Proyectos **************/
//Crear proyecto
router.post('/user/:username/project', middleware.ensureAuthenticated, projectController.newProject);
//Listar proyectos de usuario. 
router.get('/user/:username/project', middleware.ensureAuthenticated, projectController.getProjects);
//Ver información de un proyecto en concreto. 
router.get('/user/:username/project/:idProject', middleware.ensureAuthenticated, projectController.getProject);
//Actualizar información de un proyecto en concreto. 
router.put('/user/:username/project/:idProject', middleware.ensureAuthenticated, projectController.updateProject);
//Borrar Proyecto
router.delete('/user/:username/project/:idProject', middleware.ensureAuthenticated, projectController.deleteProject);

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

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://sergiojuliogu:sergiojuliogu@ds117935.mlab.com:17935/adi1718';

MongoClient.connect(MONGO_URL, (err, db) => {  
  if (err) {
    return console.log(err);
  }
  global.db = (global.db ? global.db : mongoose.createConnection(MONGO_URL, { useMongoClient: true })); 


 // global.db = MongoClient.connect(MONGO_URL);
  app.listen(process.env.PORT || 5000, function() {
    console.log("Node server running ");
  });
})
