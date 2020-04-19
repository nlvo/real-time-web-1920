require('dotenv').config();

const express = require('express');
const axios = require('axios');
const api = require('./modules/api');
const auth = require('./routes/auth')
const app = express();
const http = require('http').createServer(app);
const server = require('socket.io')(http);
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
	})
	.get('/chats', async function (req, res) {
		const access_token = req.query.access_token;
		const options = {
			url: 'https://api.spotify.com/v1/me/player/currently-playing',
			method: 'get',
			headers: {
				'Authorization': 'Bearer ' + access_token
			}
		};

		const response = await axios(options)

		console.log(response);

		res.render('chat', { data: response.data })
	});

server.on('connection', (socket) => {
	let username = 'anonymous';
	const bot = 'Luna 🌙';
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

		// const command = await api.getCommand(msg);

		socket.local.emit('user message', {
			msg,
			username: 'You'
		})
		socket.broadcast.emit('user message', {
			msg,
			username
		})

		socket.local.emit('learning bot', {
			bot,
			msg
		})
	});
});

http.listen(port, function () {
	console.log(`listening on*:${port}`);
})