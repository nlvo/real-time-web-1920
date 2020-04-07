require('dotenv').config();

const express = require('express');
const getFlags = require('./models/api');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT;

app
	.use(express.static('public'))
	.set('view engine', 'ejs')
	.get('/', function (req, res) {
		res.render('main')
	});

io.on('connection', (socket) => {
    let userName = 'anonymous';
    socket.local.emit('server message', `🤖:Welcome ${userName}! Say Hi 👋, in your native language.`);
    socket.broadcast.emit('server message', `A new user with the username ${userName} connected`);

    socket.on('set user', (username) => {
        userName = username;
        socket.local.emit('server message', `Welcome ${userName}!`);
        socket.broadcast.emit('server message', `Anonymous username changed username to ${userName}`);
    })
    
    socket.on('chat', async (msg) => {
        const username = userName;
        const flags = await getFlags(msg);
		socket.local.emit('chat', { msg, username: 'You', flags })
		socket.broadcast.emit('chat', { msg, username: username, flags })
	});
});

http.listen(port, function () {
	console.log(`listening on*:${port}`);
})