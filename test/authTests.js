var assert = require('assert');
var mongoose = require('mongoose');
var request = require('request');
var chai = require('chai');
var expect = chai.expect;

var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('Tests Registro y Login', function () {
    describe('Registrar usuario', function () {
        it('Deberia fallar por los argumentos', function (done) {
            chai.request("http://localhost:5000")
                .post('/auth/signup')
                .send({
                    "name": "Nombre 1 test",
                    "surname": "apellido 1 test",
                    "username": "user 1 test"
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Deberia fallar por formato de email incorrecto', function (done) {
            chai.request("http://localhost:5000")
                .post('/auth/signup')
                .send({
                    "name": "Nombre 1 test",
                    "surname": "apellido 1 test",
                    "username": "user 1 test",
                    "password": "password 1 test",
                    "email": "user1testgmail.com"
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Deberia crear el usuario', function (done) {
            chai.request("http://localhost:5000")
                .post('/auth/signup')
                .send({
                    "name": "Nombre 1 test",
                    "surname": "apellido 1 test",
                    "username": "user 1 test",
                    "password": "password 1 test",
                    "email": "user1test@gmail.com"
                })
                .end(function (err, res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.have.property('user');
                    res.body.user.name.should.equal('Nombre 1 test');
                    res.body.user.surname.should.equal('apellido 1 test');
                    res.body.user.username.should.equal('user 1 test');
                    res.body.user.password.should.equal('password 1 test');
                    res.body.user.email.should.equal('user1test@gmail.com');
                    done();
                });
        });

        it('Deberia crear el usuario', function (done) {
            chai.request("http://localhost:5000")
                .post('/auth/signup')
                .send({
                    "name": "Nombre 2 test",
                    "surname": "apellido 2 test",
                    "username": "user 2 test",
                    "password": "password 2 test",
                    "email": "user2test@gmail.com"
                })
                .end(function (err, res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.have.property('user');
                    res.body.user.name.should.equal('Nombre 2 test');
                    res.body.user.surname.should.equal('apellido 2 test');
                    res.body.user.username.should.equal('user 2 test');
                    res.body.user.password.should.equal('password 2 test');
                    res.body.user.email.should.equal('user2test@gmail.com');
                    done();
                });
        });
    });
    describe(' Logear al usuario', function () {
        it('Deberia fallar por los argumentos', function (done) {
            chai.request("http://localhost:5000")
                .post('/auth/login')
                .send({
                    "email": "user1test@gmail.com"
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Deberia fallar por los argumentos 2', function (done) {
            chai.request("http://localhost:5000")
                .post('/auth/login')
                .send({
                    "password": "password 1 test"
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Deberia fallar por email incorrecto', function (done) {
            chai.request("http://localhost:5000")
                .post('/auth/login')
                .send({
                    "email": "user1testFAIL@gmail.com",
                    "password": "password 1 test"
                })
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });
        it('Deberia fallar por password incorrecto', function (done) {
            chai.request("http://localhost:5000")
                .post('/auth/login')
                .send({
                    "email": "user1test@gmail.com",
                    "password": "password 1 test FAIL"
                })
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });
        it('Deberia logear al usuario', function (done) {
            chai.request("http://localhost:5000")
                .post('/auth/login')
                .send({
                    "password": "password 1 test",
                    "email": "user1test@gmail.com"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    global.tokenGlobalTests = res.body.token;
                    done();
                });
        });
    });

});