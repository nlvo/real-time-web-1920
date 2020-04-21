require('dotenv').config();

const express = require('express');
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

		let song = await api(req,res);
		console.log(song);
		
		server.on('connection', (socket) => {
				setInterval( async function () {
					const newSong = await api(req,res);
					if (song.item.id !== newSong.item.id) {
						song = newSong
						socket.emit('music player', {
							song
						});
					}
				}, 5000)
			socket.emit('music player', {
				song
			});
		}); 
		res.render('chat')
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

	socket.on('disconnect', function() {
		server.emit('server message', `${username} left`)
	})

	socket.on('chat', async (msg) => {

		// const command = await api.getCommand(msg);
		// const command = await api(req,res);

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