var assert = require('assert');
var mongoose = require('mongoose');
var request = require('request');
var chai = require('chai');
var expect = chai.expect;

var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

var assert = require('assert');
var mongoose = require('mongoose');
var request = require('request');
var chai = require('chai');
var expect = chai.expect;

var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('Tests de usuarios', function () {
    describe('Get usuarios', function () {
        it('Deberia fallar por no tener cabecera de auth', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user 1 test')
                .end(function (err, res) {
                    res.should.have.status(403);
                    done();
                });
        });
        it('Deberia fallar por item no existente', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user 1 test FAIL')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        });
        it('Deberia devolver el usuario', function (done) {
            chai.request("http://localhost:5000")
                .get('/user/user 1 test')
                .set('Authorization', tokenGlobalTests)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.name.should.equal('Nombre 1 test');
                    res.body.surname.should.equal('apellido 1 test');
                    res.body.username.should.equal('user 1 test');
                    res.body.email.should.equal('user1test@gmail.com');
                    global.userIdTest = res.body._id;
                    done();
                });
        });
        describe('Update usuarios', function () {
            it('Deberia fallar por no tener cabecera de auth', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user 1 test')
                    .end(function (err, res) {
                        res.should.have.status(403);
                        done();
                    });
            });
            it('Deberia fallar por que el usuario no existe', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user 3 test')
                    .set('Authorization', tokenGlobalTests)
                    .end(function (err, res) {
                        res.should.have.status(404);
                        done();
                    });
            });
            it('Deberia fallar porque no se ha enviado email', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user 1 test')
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "username": "user 1 test"
                    })
                    .end(function (err, res) {
                        res.should.have.status(400);
                        done();
                    });
            });
            it('Deberia fallar porque no se ha enviado username', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user 1 test')
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "email": "user1test@gmail.com"
                    })
                    .end(function (err, res) {
                        res.should.have.status(400);
                        done();
                    });
            });
            it('Deberia fallar porque el formato email es incorrecto', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user 1 test')
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "email": "emailFAIL",
                        "username": "user 1 test"
                    })
                    .end(function (err, res) {
                        res.should.have.status(400);
                        done();
                    });
            });
            it('Deberia fallar porque email ya existe en BBDD', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user 1 test')
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "email": "user2test@gmail.com",
                        "username": "user 1 test"
                    })
                    .end(function (err, res) {
                        res.should.have.status(409);
                        done();
                    });
            });
            it('Deberia fallar porque username ya existe en la BBDD', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user 1 test')
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "email": "user1test@gmail.com",
                        "username": "user 2 test"
                    })
                    .end(function (err, res) {
                        res.should.have.status(409);
                        done();
                    });
            });
            it('Deberia actualizar los datos del usuario 1', function (done) {
                chai.request("http://localhost:5000")
                    .put('/user/user 1 test')
                    .set('Authorization', tokenGlobalTests)
                    .send({
                        "email": "user1test@gmail.com",
                        "username": "user1test",
                        "name": "name user1test actualizado",
                        "surname": "surname user1test actualizado"
                    })
                    .end(function (err, res) {
                        res.should.have.status(204);
                        it('Deberia devolver el usuario 1 actualizados', function (done) {
                            chai.request("http://localhost:5000")
                                .get('/user/user 1 test')
                                .set('Authorization', tokenGlobalTests)
                                .end(function (err, res) {
                                    res.should.have.status(200);
                                    res.should.be.json;
                                    res.body.name.should.equal('name user1test actualizado');
                                    res.body.surname.should.equal('surname user1test actualizado');
                                    res.body.username.should.equal('user1test');
                                    res.body.email.should.equal('user1test@gmail.com');
                                    done();
                                });
                        });
                        done();
                    });
            });
        });
    });
});
