require('dotenv').config();

const express = require('express');
const api = require('./models/api');
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
    const local = true;
    socket.local.emit('server message', { bot, username, local });
    socket.broadcast.emit('server message', { bot, username });

    socket.on('set user', (name) => {
        username = name;
        socket.local.emit('server user message', { bot, username, local });
        socket.broadcast.emit('server user message', { bot, username });
    })
    
    socket.on('chat', async (msg) => {
        
        const flags = await api.getFlags(msg);
        const command = await api.getCommand(msg);
        // console.log(command)
		socket.local.emit('chat', { msg, username: 'You', flags })
		socket.broadcast.emit('chat', { msg, username, flags })
        // const language = await api.getLanguage(msg);
        // console.log(language);
        console.log(command);
        
        socket.emit('learning bot', {bot, command})
        socket.emit('language bot', {bot, language: command[0]})
	});
});

http.listen(port, function () {
	console.log(`listening on*:${port}`);
})