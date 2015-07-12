var React = require('react');
var express = require('express');
var s = require("swig");
var path = require('path');
var fs = require('fs');
var bcrypt = require('bcrypt');
var cps = require('cps-api');
var conn = new cps.Connection('tcp://cloud-eu-0.clusterpoint.com:9007', 'login', 'akhilhector.1@gmail.com', 'eatsleepcode123!@#', 'document', 'document/id', {account: 1320});
var conn1 = new cps.Connection('tcp://cloud-eu-0.clusterpoint.com:9007', 'bucket', 'akhilhector.1@gmail.com', 'eatsleepcode123!@#', 'document', 'document/id', {account: 1320});
var app = require('./app');
var errorPage = fs.readFileSync("./404.html");
require('node-jsx').install();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var port = process.env.PORT || 5000; 
var tmpl = s.compileFile('views/finalOutput.html');
var app = express();
var r = express.Router();
var salt = bcrypt.genSaltSync(10);

app.use(express.static('assets'));
app.set('title', "Bucket Sharing");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

r.get('/', function(req, res) {
        var data = fs.readFileSync("views/finalOutput.html", "utf-8");
        res.send(data.toString());
});

r.get('/about', function(req, res) {
        var data = fs.readFileSync("views/about.html", "utf-8");
        res.send(data.toString());
});

r.get('/signup', function(req, res) {
        var data = fs.readFileSync("signup.html", "utf-8");
        res.send(data.toString());
});

r.post('/controller/login', function(req, res) {
        var username = req.body.email;
        var password = req.body.password;
        var hash = bcrypt.compareSync(password, salt);
        var html = 'Hello: ' + username + '.<br>' +
                   'Your Password' + password  + '.<br>' +                                         '<a href="/">Try again.</a>';
        res.send(html);
});

r.post('/controller/signup', function(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var pwd = req.body.password;
        var confirm_pwd = req.body.password_confirm;
        var hash = bcrypt.hashSync(pwd, salt);
        var obj = {
           id: 1,
           uname: username,
           emailid: email,
           password: pwd,
           hashsum: hash 
        };
        var obj1 = {
            uname: username,
            emailid: email,
            data: [{
                "url" : "http://www.google.com",
                "meta" : "metaaaa",
                }],
            title : "qwerty",
            id : "qwerty"
        };
        conn.sendRequest(new cps.InsertRequest(obj), function (err, resp) {
           if (err) return console.error(err); 
        });

        conn1.sendRequest(new cps.InsertRequest(obj1), function(err, resp) {
           if (err) return console.error(err); 
        });
        var html = 'Thankyou';
        res.send(html);
});

r.get('*', function(req, res) {
        var match = '/' + req.params[0]+ ".html";
        fs.exists(match, function(exists) {
                if(exists) {
                        fs.readFile(match, function(err, d) {
                                if(err)
                                   res.end(errorPage.toString(), 'utf-8');
                                else
                                   res.end(d, 'utf-8');
                        });
                }
                else {
                        res.end(errorPage.toString(), 'utf-8');
                }
        });
});

app.use('/', r);

app.listen(port, function() { 
        console.log("Listening on port 5000");
});
