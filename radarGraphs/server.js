/*jshint node:true */

var PORT = process.env.PORT || process.argv[2] || 80,
    HOST = process.env.IP;

var http = require('http'),
    express = require('express'),
    fs = require('fs');

var app = express(),
    server = http.createServer(app);

var indexServices = require('./serverFiles/indexServices')();

app.configure(function () {
    app.use(express.logger({format: ":method :status :url"}));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + "/public"));
    app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

server.listen(PORT, HOST);
console.log("Server running on " + HOST + ":" + PORT);

// REST Call Routing Registry
app.get('/stopServer', indexServices.stopServer);
