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
    let username = 'anonymous';
    const bot = 'robot 🤖';
    // const message = `Welcome ${userName}! Say Hi 👋, in your native language.`;
    // const newUserMessage = `A new user with the username ${userName} connected`;
    socket.local.emit('server message', { bot, username });
    socket.broadcast.emit('server message', { bot, username});

    socket.on('set user', (name) => {
        username = name;
        const welcomeMessage = `Welcome ${name}!`;
        const usernameMessage = `Anonymous username changed username to ${name}`;
        socket.local.emit('server message', { bot, username });
        socket.broadcast.emit('server message', { bot, username  });
    })
    
    socket.on('chat', async (msg) => {
        // const username = username;
        const flags = await getFlags(msg);
		socket.local.emit('chat', { msg, username: 'You', flags })
		socket.broadcast.emit('chat', { msg, username, flags })
	});
});

http.listen(port, function () {
	console.log(`listening on*:${port}`);
})