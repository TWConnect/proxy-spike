var express = require('express');
var requestUtil = require('request-promise');
var btoa = require('btoa');

let jiveApiUrl = 'https://thoughtworks-preview.jiveon.com/api/core/v3';
let serverUrl = 'http://localhost:3000';
let basicAuth = 'Basic ' + btoa('username:password')

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.get('/contents', function(req, res, next){
  requestJive(req.originalUrl, res);
});

var defineResource = function(prefix, app){
  app.get(prefix, function(req, res){
    requestJive(req.originalUrl, res);
  });

  app.get(prefix + '/*', function(req, res){
    requestJive(req.originalUrl, res);
  });

};

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

var requestJive = function(originUrl, res){
  requestUtil({
    uri: jiveApiUrl + originUrl,
    headers: {
      'Authorization': basicAuth
    }
  }).then((response)=>{
      res.send(response.replaceAll(jiveApiUrl, serverUrl));
    }, (err)=>{
      res.send(err);
    });
};

defineResource('/contents', app); 
defineResource('/people', app);

app.listen(3000);