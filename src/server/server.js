const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
const port = process.env.PORT || 8080;

//Opens up the specified port on the local machine without depending on platform specific commands
open('http://localhost:' + port);

app.get('/', function(req, res) {
    //Sends the index.html file to the client
    res.sendFile('index.html', { root: path.join(__dirname, '../front-end') });
});

//Printing a message in the console when the server is started
app.listen(port);
console.log('Server started at http://localhost:' + port);