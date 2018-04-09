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


var swaggerize = require('swaggerize-express');
 
app.use(swaggerize({
    api: require('./api.json'),
    docspath: '/api-docs',
    handlers: './handlers'
}));
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

/**************************************************************** User ****************************************************************/ 
//Mostrar usuario
router.get('/users/:username', middleware.ensureAuthenticated, userController.getUser);
//Actualizar datos de usuario
router.put('/users/:username', middleware.ensureAuthenticated, userController.updateUser);
//Borrar usuario
router.delete('/users/:username', middleware.ensureAuthenticated, userController.deleteUser);

//Busqueda de usuarios
router.get('/users/search/:username', userController.searchUser);
/**************************************************************************************************************************************/

/**************************************************************** Project ****************************************************************/ 
//Crear proyecto
router.post('/users/:username/projects', middleware.ensureAuthenticated, projectController.newProject);
//Listar proyectos de usuario. 
router.get('/users/:username/projects', middleware.ensureAuthenticated,  projectController.getProjects);
router.get('/users/:username/projects/:idProject', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoAdmin, projectController.getProject);
//Actualizar información de un proyecto en concreto. 
router.put('/users/:username/projects/:idProject', middleware.ensureAuthenticated, middleware.participaProject,  middleware.comprobarPermisoAdmin, projectController.updateProject);
//Borrar Proyecto
router.delete('/users/:username/projects/:idProject', middleware.ensureAuthenticated, middleware.participaProject,  middleware.comprobarPermisoAdmin, projectController.deleteProject);
/**************************************************************************************************************************************/


/**************************************************************** Permission ****************************************************************/ 
//Create
router.post('/users/:username/permissions', middleware.ensureAuthenticated,middleware.comprobarAdmin, permissionController.newPermission);
//Read
router.get('/users/:username/permissions/:name', middleware.ensureAuthenticated, permissionController.getPermission);
router.get('/users/:username/permissions', middleware.ensureAuthenticated, permissionController.getPermissions);
//Delete
router.delete('/users/:username/permissions/:name', middleware.ensureAuthenticated,middleware.comprobarAdmin, permissionController.deletePermission);
/**************************************************************************************************************************************/


/**************************************************************** Role ****************************************************************/  
//Create
router.post('/users/:username/roles', middleware.ensureAuthenticated,middleware.comprobarAdmin, roleController.newRole);
//Read
router.get('/users/:username/roles/:name', middleware.ensureAuthenticated, roleController.getRole);
router.get('/users/:username/roles', middleware.ensureAuthenticated, roleController.getRoles);
//Delete
router.delete('/users/:username/roles/:name', middleware.ensureAuthenticated,middleware.comprobarAdmin, roleController.deleteRole);
/**************************************************************************************************************************************/


/**************************************************************** Sprint ****************************************************************/ 
//Crear sprint
router.post('/users/:username/projects/:idProject/sprints', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.newSprint);
//Listar sprints de proyecto. 
router.get('/users/:username/projects/:idProject/sprints', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.getSprints);
router.get('/users/:username/projects/:idProject/sprints/:idSprint', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.getSprint);
//Actualizar información de un proyecto en concreto. 
router.put('/users/:username/projects/:idProject/sprints/:idSprint', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.updateSprint);
//Borrar Proyecto
router.delete('/users/:username/projects/:idProject/sprints/:idSprint', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,sprintController.deleteSprint);
/**************************************************************************************************************************************/


/**************************************************************** Status ****************************************************************/ 
//Crear status
router.post('/users/:username/projects/:idProject/sprints/:idSprint/status', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,statusController.newStatus);
//Listar status de sprints. 
router.get('/users/:username/projects/:idProject/sprints/:idSprint/status', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,statusController.getAllStatus);
router.get('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,statusController.getStatus);
//Actualizar información de un status en concreto. 
router.put('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,statusController.updateStatus);
/**************************************************************************************************************************************/


/**************************************************************** Task ****************************************************************/ 
//Crear task
router.post('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,taskController.newTask);
//Listar sprints de proyecto. 
router.get('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/', middleware.ensureAuthenticated, middleware.participaProject,taskController.getTasks);
router.get('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask', middleware.ensureAuthenticated, middleware.participaProject,taskController.getTask);
//Actualizar información de un proyecto en concreto. 
router.put('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask', middleware.ensureAuthenticated, middleware.participaProject,taskController.updateTask);
//Borrar Proyecto
router.delete('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask', middleware.ensureAuthenticated, middleware.participaProject, middleware.comprobarPermisoJefe,taskController.deleteTask);
/**************************************************************************************************************************************/


/**************************************************************** Change ****************************************************************/ 
//Crear change
router.post('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/changes', middleware.ensureAuthenticated, middleware.participaProject,changeController.newChange);
//Listar changes de task. 
router.get('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/changes', middleware.ensureAuthenticated, middleware.participaProject,changeController.getChanges);
/**************************************************************************************************************************************/



/**************************************************************** Poll ****************************************************************/ 
//Crear poll
router.post('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/polls', middleware.ensureAuthenticated, middleware.participaProject,middleware.comprobarPermisoJefe,pollController.newPoll);
//Obtener poll 
router.get('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/polls/:idPoll', middleware.ensureAuthenticated, middleware.participaProject,pollController.getPoll);
router.put('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/polls/:idPoll', middleware.ensureAuthenticated, middleware.participaProject,middleware.comprobarPermisoJefe,pollController.updatePoll);
router.delete('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/polls/:idPoll', middleware.ensureAuthenticated, middleware.participaProject,middleware.comprobarPermisoJefe,pollController.deletePoll);
/**************************************************************************************************************************************/


/**************************************************************** Vote ****************************************************************/ 
//Crear vote
router.post('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/polls/:idPoll/votes', middleware.ensureAuthenticated, middleware.participaProject,voteController.newVote);
//Obtener vote 
router.get('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/polls/:idPoll/votes', middleware.ensureAuthenticated, middleware.participaProject,voteController.getVotes);
router.get('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/polls/:idPoll/votes/:idVote', middleware.ensureAuthenticated, middleware.participaProject,voteController.getVote);
//Update vote
router.put('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/polls/:idPoll/votes/:idVote', middleware.ensureAuthenticated, middleware.participaProject,voteController.updateVote);
//Delete vote
router.delete('/users/:username/projects/:idProject/sprints/:idSprint/status/:idStatus/tasks/:idTask/polls/:idPoll/votes/:idVote', middleware.ensureAuthenticated, middleware.participaProject,voteController.deleteVote);
/**************************************************************************************************************************************/



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
