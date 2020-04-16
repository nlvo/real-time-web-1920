require('dotenv').config();

const express = require('express');
const api = require('./modules/api');
const auth = require('./routes/auth')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT;

const cors = require('cors');
const cookieParser = require('cookie-parser');

app
    .use(express.static('public'))
    
    .use(cors())
    .use(cookieParser())
    
    .use(auth)

	.set('view engine', 'ejs')
	.get('/', function (req, res) {
		res.render('main')
    });

io.on('connection', (socket) => {
	let username = 'anonymous';
	const bot = 'robot 🤖';
	socket.local.emit('server local message', {
		bot,
		username
	});
	socket.broadcast.emit('server message', {
		bot,
		username
	});

	socket.on('set user', (name) => {
		username = name;
		socket.local.emit('server user message', {
			bot,
			username
		});
		socket.broadcast.emit('server user message', {
			bot,
			username
		});
	})

	socket.on('chat', async (msg) => {
		const flags = await api.getFlags(msg);
		const command = await api.getCommand(msg);

		socket.local.emit('user message', {
			msg: command,
			username: 'You',
			flags
		})
		socket.broadcast.emit('user message', {
			msg: command,
			username,
			flags
		})

		socket.local.emit('learning bot', {
			bot,
			command
		})
	});
});

http.listen(port, function () {
	console.log(`listening on*:${port}`);
})