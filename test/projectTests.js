var assert = require('assert');
var mongoose = require('mongoose');
var request = require('request');
var chai = require('chai');
var expect = chai.expect;

var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('Tests de proyectos', function () {
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
                    "repository" : "www.ua.es"
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
                    "name" : "Proyecto test 1",
                    "repository" : "uaFAILes"
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
                    "name" : "Proyecto test 1",
                    "repository" : "ua.es"
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
                    "name" : "Proyecto test 1",
                    "repository" : "ua.es"
                })
                .end(function (err, res) {
                    res.should.have.status(201);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.name.should.equal('Proyecto test 1');
                    res.body.should.have.property('repository');
                    res.body.repository.should.equal('ua.es');
                    res.body.should.have.property('users');
                    res.body.users[0].user.should.equal(userIdTest);
                    done();
                });
        })

    })


    describe('Borrado de elementos creados', function () {
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
