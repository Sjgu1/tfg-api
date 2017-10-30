var assert = require('assert');
var mongoose = require('mongoose');
var request = require('request');
var chai = require('chai');
var expect = chai.expect;

var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

var usuarios = require('./authTests')


describe('Tests de proyectos', function () {
    var projectId1 //usuario1test
    var projectId2 //usuario1test
    var projectId3 //usuario1test
    var projectId4 //usuario1test
    var projectId5 //usuario2test

    var username1 = "user1test"
    var username2 = "user 2 test"
    var nextPage //
    var prevPage //
    describe('Crear proyectos', function () {
        it('Deberia fallar por no tener cabecera Auth', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user1test/project')
                .end(function (err, res) {
                    res.should.have.status(403);
                    done();
                });
        })
        it('Deberia fallar porque la peticion no tiene name', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user1test/project')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        })
        it('Deberia fallar porque la peticion no tiene repository', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user1test/project')
                .set('Authorization', tokenGlobalTests)
                .send({
                    "repository": "www.ua.es"
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        })
        it('Deberia fallar porque la repository no es una url valida', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user1test/project')
                .set('Authorization', tokenGlobalTests)
                .send({
                    "name": "Proyecto test 1",
                    "repository": "uaFAILes"
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        })
        it('Deberia fallar porque el usuario no existe', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user2test/project')
                .set('Authorization', tokenGlobalTests)
                .send({
                    "name": "Proyecto test 1",
                    "repository": "ua.es"
                })
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })

        it('Deberia crear un nuevo proyecto sin problemas', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user1test/project')
                .set('Authorization', tokenGlobalTests)
                .send({
                    "name": "Proyecto test 1",
                    "repository": "ua.es"
                })
                .end(function (err, res) {
                    res.should.have.status(201);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.name.should.equal('Proyecto test 1');
                    res.body.should.have.property('repository');
                    res.body.repository.should.equal('ua.es');
                    res.body.should.have.property('users');
                    done();
                });
        })

    })
    describe('Listado de proyectos del usuario', function () {

        it('Deberia fallar porque no hay cabecera Auth', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/projects')
                .end(function (err, res) {
                    res.should.have.status(403);
                    done();
                });
        })
        it('Deberia fallar porque no existe el usuario', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1testFAIl/projects')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Se crea proyecto 2', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user1test/project')
                .set('Authorization', tokenGlobalTests)
                .send({
                    "name": "Proyecto test 2",
                    "repository": "ua.es"
                })
                .end(function (err, res) {
                    done();
                });
        })
        it('Se crea proyecto 3', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user1test/project')
                .set('Authorization', tokenGlobalTests)
                .send({
                    "name": "Proyecto test 3",
                    "repository": "ua.es"
                })
                .end(function (err, res) {
                    done();
                });
        })
        it('Se crea proyecto 4', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user1test/project')
                .set('Authorization', tokenGlobalTests)
                .send({
                    "name": "Proyecto test 4",
                    "repository": "ua.es"
                })
                .end(function (err, res) {
                    done();
                });
        })
        it('Se van a comprobar los nuevos proyectos del usuario', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/projects')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length(4);
                    res.body[0].should.be.a('object');
                    res.body[0].should.have.property('_id');
                    res.body[0].name.should.equal('Proyecto test 1');
                    projectId1 = res.body[0]._id;
                    res.body[1].name.should.equal('Proyecto test 2');
                    projectId2 = res.body[1]._id;
                    res.body[2].name.should.equal('Proyecto test 3');
                    projectId3 = res.body[2]._id;
                    res.body[3].name.should.equal('Proyecto test 4');
                    projectId4 = res.body[3]._id;
                    done();
                });
        })
    })
    describe('Get de proyecto', function () {
        it('Deberia fallar porque no hay cabecera Auth', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/project/' + projectId1)
                .end(function (err, res) {
                    res.should.have.status(403);
                    done();
                });
        })
        it('Deberia fallar porque no existe el usuario', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1testFAIL/project/' + projectId1)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Deberia fallar porque no existe el project', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/project/projectFAIL')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Se crea proyecto el proyecto 5 por el usuario 2, el 1 no deberia de tener acceso', function (done) {
            chai.request("http://localhost:5000")
                .post('/user/user 2 test/project')
                .set('Authorization', tokenGlobalTests)
                .send({
                    "name": "Proyecto test 5",
                    "repository": "ua.es"
                })
                .end(function (err, res) {
                    projectId5 = res.body._id
                    done();
                });
        })
        it('Deberia fallar porque el usuario no tiene acceso al project', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/project/' + projectId5)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Deberia devolver el proyecto 1, con sus datos.', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/project/' + projectId1)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body._id.should.equal(projectId1);
                    res.body.name.should.equal('Proyecto test 1');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    res.body.users[0].should.have.property('user');
                    done();
                });
        })
    })
    describe('Listado de proyectos del usuario con Paginado', function () {

        it('Deberia fallar porque no hay cabecera Auth', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/projects/items=2&page=0')
                .end(function (err, res) {
                    res.should.have.status(403);
                    done();
                });
        })
        it('Deberia fallar porque no existe el usuario', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1testFAIL/projects/items=2&page=0')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Deberia fallar por el formato de la peticion', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/projects/items2page0')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        })
        it('Se van a comprobar los 2 primeros proyectos del usuario con paginado', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/projects/items=2&page=0')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('projects');
                    res.body.should.have.property('nextPage');
                    nextPage = res.body.nextPage
                    res.body.should.have.property('prevPage');
                    prevPage = res.body.prevPage
                    res.body.projects.should.be.a('array');
                    res.body.projects.should.have.length(2);
                    res.body.projects[0].should.be.a('object');
                    res.body.projects[0].name.should.equal('Proyecto test 1');
                    res.body.projects[1].name.should.equal('Proyecto test 2');
                    done();
                });
        })
        it('Se van a comprobar los 2 siguientes proyectos del usuario con paginado', function (done) {
            var dividir = nextPage.split("5000")[1]
            chai.request("http://localhost:5000")
                .get(dividir)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('projects');
                    res.body.projects.should.be.a('array');
                    res.body.projects.should.have.length(2);
                    res.body.projects[0].should.be.a('object');
                    res.body.projects[0].name.should.equal('Proyecto test 3');
                    res.body.projects[1].name.should.equal('Proyecto test 4');
                    done();
                });
        })
    })
    describe('Delete de proyecto', function () {
        it('Deberia fallar porque no hay cabecera Auth', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user1test/project/' + projectId3)
                .end(function (err, res) {
                    res.should.have.status(403);
                    done();
                });
        })
        it('Deberia fallar porque no existe el usuario', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user1testFAIL/project/' + projectId3)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Deberia fallar porque no existe el project', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user1test/project/projectFAIL')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Deberia fallar porque el usuario no tiene acceso al project', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user1test/project/' + projectId5)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Deberia borrar el proyecto 3.', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user1test/project/' + projectId3)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        })
        describe('Se va a comprobar que se borra el proyecto de los proyecto para los usuarios que participaban', function(done){
            it('Comprobamos que no se puede hacer un get del proyecto.', function (done) {
                chai.request("http://localhost:5000")
                    .get('/user/user1test/project/' + projectId3)
                    .set('Authorization', tokenGlobalTests)
                    .end(function (err, res) {
                        res.should.have.status(404);
                        done();
                    });
            })
            it('Comprobamos que no aparece en el listado de proyectos del usuario.', function (done) {
                chai.request("http://localhost:5000")
                .get('/user/user1test/projects')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length(3);
                    res.body[0].should.be.a('object');
                    res.body[0].should.have.property('_id');
                    res.body[0].name.should.equal('Proyecto test 1');
                    res.body[1].name.should.equal('Proyecto test 2');
                    res.body[2].name.should.equal('Proyecto test 4');
                    done();
                });
            })
        })
        
    })
    describe('Update de proyecto', function () {
        it('Deberia fallar porque no hay cabecera Auth', function (done) {
            chai.request("http://localhost:5000")
                .put('/user/user1test/project/' + projectId1)
                .end(function (err, res) {
                    res.should.have.status(403);
                    done();
                });
        })
        it('Deberia fallar porque no existe el usuario', function (done) {
            chai.request("http://localhost:5000")
                .put('/user/user1testFAIL/project/' + projectId1)
                .set('Authorization', tokenGlobalTests)
                .send({
                    "repository" : "url.es"
                })
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Deberia fallar porque no existe el project', function (done) {
            chai.request("http://localhost:5000")
                .put('/user/user1test/project/projectFAIL')
                .send({
                    "repository" : "url.es"
                })
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Deberia fallar porque el usuario no tiene acceso al project', function (done) {
            chai.request("http://localhost:5000")
                .put('/user/user2test/project/' + projectId1)
                .set('Authorization', tokenGlobalTests)
                .send({
                    "repository" : "url.es"
                })
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        })
        it('Deberia  fallar porque no se ha enviado repository que es obligatorio.', function (done) {
            chai.request("http://localhost:5000")
                .put('/user/user1test/project/' + projectId3)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        })
        it('Deberia fallar porque la url de repository no es valida', function (done) {
            chai.request("http://localhost:5000")
                .put('/user/user2test/project/' + projectId1)
                .set('Authorization', tokenGlobalTests)
                .send({
                    "repository" : "urles"
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        })
        it('Deberia cambiar el name y la url del proyecto 1', function (done) {
            chai.request("http://localhost:5000")
                .put('/user/user1test/project/' + projectId1)
                .set('Authorization', tokenGlobalTests)
                .send({
                    "repository" : "actualizada.es",
                    "name" : "name actualizado Proyecto test 1"
                })
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        })
        it('Deberia devolver el proyecto 1 actualizado.', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user1test/project/' + projectId1)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.name.should.equal('name actualizado Proyecto test 1');
                    res.body.repository.should.equal( "actualizada.es");                    
                    done();
                });
        })       
        
        describe('Actualizado de proyectos invitando a nuevos usuarios', function(){
            
            it('Deberia falla al agregar al usuario 1 en el proyecto 1', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user1test/project/' + projectId1)
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "repository" : "actualizada.es",
                        "name" : "name actualizado Proyecto test 1",
                        "users" : {
                            "user" : username1
                        }
                    })
                    .end(function (err, res) {
                        res.should.have.status(400);
                        done();
                    });
            })
            it('Deberia falla al agregar al usuario X porque no existe', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user1test/project/' + projectId1)
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "repository" : "actualizada.es",
                        "name" : "name actualizado Proyecto test 1",
                        "users" : {
                            "user" : "XFAILX"
                        }
                    })
                    .end(function (err, res) {
                        res.should.have.status(404);
                        done();
                    });
            })
            it('Deberia agregar al usuario 2 al proyecto 1', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user1test/project/' + projectId1)
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "repository" : "actualizada.es",
                        "name" : "name actualizado Proyecto test 1",
                        "users" : {
                            "user" : username2
                        }
                    })
                    .end(function (err, res) {
                        res.should.have.status(204);
                        done();
                    });
            })
            it('Deberia agregar al usuario 2 al proyecto 2', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user1test/project/' + projectId2)
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "repository" : "actualizada.es",
                        "name" : "ingresando usuarios proyecto2",
                        "users" : { 
                            "user" : username2
                        }
                    })
                    .end(function (err, res) {
                        res.should.have.status(204);
                        done();
                    });
            })
            it('Se van a comprobar que el usuario tiene los nuevos proyectos', function (done) {
                chai.request("http://localhost:5000")
                    .get('/user/user 2 test/projects')
                    .set('Authorization', tokenGlobalTests)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('array');
                        res.body.should.have.length(3);
                        done();
                    });
            })
            it('Se va a comprobar que el proyecto tiene 2 usuarios.', function (done) {
                chai.request("http://localhost:5000")
                    .get('/user/user1test/project/' + projectId1)
                    .set('Authorization', tokenGlobalTests)
                    .end(function (err, res) {
                        res.should.have.status(200);      
                        res.body.users.should.have.length(2);
                        done();
                    });
            })
            it('Se va a borrar el proyecto 1.', function (done) {
                chai.request("http://localhost:5000")
                    .delete('/user/user 2 test/project/' + projectId1)
                    .set('Authorization', tokenGlobalTests)
                    .end(function (err, res) {
                        res.should.have.status(204);
                        done();
                    });
            })
            it('Se van a comprobar que el usuario 2 ya no tiene el  proyecto 1', function (done) {
                chai.request("http://localhost:5000")
                    .get('/user/user 2 test/projects')
                    .set('Authorization', tokenGlobalTests)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('array');
                        res.body.should.have.length(2);
                        done();
                    });
            })
            it('Se van a comprobar que el usuario 1 ya no tiene el  proyecto 1', function (done) {
                chai.request("http://localhost:5000")
                    .get('/user/user1test/projects')
                    .set('Authorization', tokenGlobalTests)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('array');
                        res.body.should.have.length(2);
                        done();
                    });
            })
            it('Deberia fallar porque no existe el project', function (done) {
                chai.request("http://localhost:5000")
                    .get('/user/user1test/project/' + projectId1)
                    .set('Authorization', tokenGlobalTests)
                    .end(function (err, res) {
                        res.should.have.status(404);
                        done();
                    });
            })
            
        })
    })
    describe('Borrado de elementos creados', function () {
        it('Se va comprobar que el token es correcto.', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user1test/project/' + projectId2)
                .set('Authorization', "failToken")
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        })
        it('Se va a borrar el proyecto 2.', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user1test/project/' + projectId2)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        })
        it('Se va a borrar el proyecto 4.', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user1test/project/' + projectId4)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        })
        it('Se va a borrar el proyecto 5.', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user 2 test/project/' + projectId5)
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        })
        it('Borra usuario de tests', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user1test')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        })
        it('Borra usuario 2 de tests', function (done) {
            chai.request("http://localhost:5000")
                .delete('/user/user 2 test')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        })

    })
});
