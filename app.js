var express = require('express');
var parser = require('body-parser');
var port = 2001;

var app = express()

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json())
app.use(express.static("public"));

app.set('view engine', 'pug');

app.get('/', function(req,res)
{
    res.render('index');
});

app.listen(port, function(){console.log('srver started' + port)})