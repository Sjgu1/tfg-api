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
var sprintController = require('./controllers/sprintController');
var statusController = require('./controllers/statusController');
var taskController = require('./controllers/taskController');
var changeController = require('./controllers/changeController');
var pollController = require('./controllers/pollController')
var voteController = require('./controllers/voteController')

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


/***************** Sprint **************/
//Crear sprint
router.post('/user/:username/project/:idProject/sprint', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.newSprint);
//Listar sprints de proyecto. 
router.get('/user/:username/project/:idProject/sprint', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.getSprints);
router.get('/user/:username/project/:idProject/sprint/:idSprint', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.getSprint);
//Actualizar información de un proyecto en concreto. 
router.put('/user/:username/project/:idProject/sprint/:idSprint', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.updateSprint);
//Borrar Proyecto
router.delete('/user/:username/project/:idProject/sprint/:idSprint', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.deleteSprint);


/***************** Status **************/
//Crear status
router.post('/user/:username/project/:idProject/sprint/:idSprint/status', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,statusController.newStatus);
//Listar status de sprints. 
router.get('/user/:username/project/:idProject/sprint/:idSprint/status', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,statusController.getAllStatus);
router.get('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,statusController.getStatus);
//Actualizar información de un status en concreto. 
router.put('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,statusController.updateStatus);

/***************** Task **************/
//Crear task
router.post('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,taskController.newTask);
//Listar sprints de proyecto. 
router.get('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/', middleware.ensureAuthenticated, middleware.participaProject,taskController.getTasks);
router.get('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask', middleware.ensureAuthenticated, middleware.participaProject,taskController.getTask);
//Actualizar información de un proyecto en concreto. 
router.put('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask', middleware.ensureAuthenticated, middleware.participaProject,taskController.updateTask);
//Borrar Proyecto
router.delete('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,taskController.deleteTask);

/***************** Change **************/
//Crear change
router.post('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask/change', middleware.ensureAuthenticated, middleware.participaProject,changeController.newChange);
//Listar changes de task. 
router.get('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask/change', middleware.ensureAuthenticated, middleware.participaProject,changeController.getChanges);
//router.get('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask/change', middleware.ensureAuthenticated, middleware.participaProject,taskController.getTask);


/***************** Poll **************/
//Crear poll
router.post('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask/poll', middleware.ensureAuthenticated, middleware.participaProject,middleware.comprobarPermisoJefe,pollController.newPoll);
//Obtener poll 
router.get('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask/poll', middleware.ensureAuthenticated, middleware.participaProject,pollController.getPoll);
router.put('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask/poll/:idPoll', middleware.ensureAuthenticated, middleware.participaProject,middleware.comprobarPermisoJefe,pollController.updatePoll);
router.delete('/user/:username/project/:idProject/sprint/:idSprint/status/:idStatus/task/:idTask/poll/:idPoll', middleware.ensureAuthenticated, middleware.participaProject,middleware.comprobarPermisoJefe,pollController.deletePoll);

/***************** Vote **************/
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
