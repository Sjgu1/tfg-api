// server.js
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var auth = require('./controllers/auth');
var middleware = require('./middleware/middleware');
var projectController = require('./controllers/projectController');
var userController = require('./controllers/userController');
var permissionController = require('./controllers/permissionController');
var roleController = require('./controllers/roleController');
var User = require('./models/user');
var Project = require ('./models/project');
var Role = require('./models/role');
var Permission = require('./models/permission');

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

/***************** User **************/
//Mostrar usuario
router.get('/user/:username', middleware.ensureAuthenticated, userController.getUser);
//Actualizar datos de usuario
router.put('/user/:username', middleware.ensureAuthenticated, userController.updateUser);
//Borrar usuario
router.delete('/user/:username', middleware.ensureAuthenticated, userController.deleteUser);


/***************** Project **************/
//Crear proyecto
router.post('/user/:username/project', middleware.ensureAuthenticated, projectController.newProject);
//Listar proyectos de usuario. 
router.get('/user/:username/project', middleware.ensureAuthenticated,  projectController.getProjects);

//Ver información de un proyecto en concreto. 
router.get('/user/:username/project/:idProject', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoAdmin, projectController.getProject);
//Actualizar información de un proyecto en concreto. 
router.put('/user/:username/project/:idProject', middleware.ensureAuthenticated, middleware.participaProject,  middleware.comprobarPermisoAdmin, projectController.updateProject);
//Borrar Proyecto
router.delete('/user/:username/project/:idProject', middleware.ensureAuthenticated, middleware.participaProject,  middleware.comprobarPermisoAdmin, projectController.deleteProject);



/***************** Permission **************/
//Create
router.post('/permission', middleware.ensureAuthenticated, permissionController.newPermission);
//Read
router.get('/permission/:name', middleware.ensureAuthenticated, permissionController.getPermission);
router.get('/permission', middleware.ensureAuthenticated, permissionController.getPermissions);
//Delete
router.delete('/permission/:name', middleware.ensureAuthenticated, permissionController.deletePermission);



/***************** Role **************/
//Create
router.post('/role', middleware.ensureAuthenticated, roleController.newRole);
//Read
router.get('/role/:name', middleware.ensureAuthenticated, roleController.getRole);
router.get('/role', middleware.ensureAuthenticated, roleController.getRoles);
//Delete
router.delete('/role/:name', middleware.ensureAuthenticated, roleController.deleteRole);


/***************** **************/
/***************** **************/
/***************** **************/
/***************** **************/
/***************** **************/
/***************** **************/
/***************** **************/
/***************** **************/


const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://sergiojuliogu:sergiojuliogu@ds117935.mlab.com:17935/adi1718';

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, (err, db) => {  
  if (err) {
    return console.log(err);
  }
  global.db = (global.db ? global.db : mongoose.createConnection(MONGO_URL)); 


 // global.db = MongoClient.connect(MONGO_URL);
  app.listen(process.env.PORT || 5000, function() {
    console.log("Node server running in port 5000");
  });
})
