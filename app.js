var http = require('http')
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var errorHandler = require('errorhandler')
var cookie = require('cookie-parser')
var cps = require('cps-api')

var conn = new cps.Connection('tcp://cloud-eu-0.clusterpoint.com:9007', 'bucket', 'akhilhector.1@gmail.com', 'eatsleepcode123!@#', 'document', 'document/id', {account: 1329});

exports.signup = function(username,password) {
        var req = new cps.InsertRequest('<document><username>'+username+'</username>'+cps.Term(password, "password")+'</document>');               
        conn.sendRequest(req, function(err, res) {
                if(err) 
                        return console.log(err);
                console.log("User logged in");
        });
}

exports.insert = function(foo, bar) {
        var firstly = foo;
        var secondly = bar;
        var req = new cps.InsertRequest('<document><firstly>'+firstly+'</firstly>'+cps.Term(secondly, "secondly")+'</document>');
        conn.sendRequest(req, function(err, res) {
                if(err) 
                        return console.log(err);
                console.log("New entry filed")
        });
}

exports.remove = function(data) {
        var id = { id: data};
        conn.sendRequest(new cps.DeleteRequest(id), function(err, res) {
                if(err)
                        return console.log(err);
        });
}

