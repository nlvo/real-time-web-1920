require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT;

app  
    .use(express.static('public'))
    .get('/', function(req, res){
        res.sendFile(__dirname + '/index.html')
    });

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat', msg)
    });
});

http.listen(port, function(){
    console.log(`listening on*:${port}`);
})