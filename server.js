'use strict';

var express = require('express');
var bodyParser=require('body-parser');
var dns=require('dns');
var URLParser = require('url');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

var URL = require("./url.js");

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", function (req, res) {
  var fullURL = req.body.url;

  dns.lookup(URLParser.parse(fullURL).hostname, function (err, address, family) {
    if (err) {
      res.status(400);
      res.json({ "error": "invalid URL" });
    }
    else {
      URL.findOne({ url: fullURL }, function (err, result) {
        if (result) {
          res.status(200);
          res.json({ "original_url": result.url, "short_url": result.id });
        }
        else {
          URL.estimatedDocumentCount(function (err, count) {
            if (err)
            {
              res.status(500);
              res.json({ error: err })
            }
            else {
              var urlEntry = new URL({
                url: fullURL,
                id: count
              });
    
              urlEntry.save(function (err) {
                if (err) {
                  res.status(500);
                  res.json({ error: err })
                }
                else {
                  res.status(200);
                  res.json({ "original_url": urlEntry.url, "short_url": urlEntry.id });
                }
              });
            }
          });
        }
      });
    }
  });
}); 

app.get("/api/shorturl/:id", function (req, res) {
  var id = req.params.id;
  URL.findOne({ id: id }, function (err, result) {
    if (result) {
      res.redirect(result.url);
    }
    else {
      res.status(400);
      res.json({error: "invalid short url"});
    }
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});