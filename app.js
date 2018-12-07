var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

var port = process.env.PORT;
app.set('port', port);

var server = http.createServer(app);
server.listen(port, () => {
  console.log('Server is running at port ' + port)
});

var io = require('socket.io')(server);
var socket = require('./socket');
io.on('connection', socket)