require('dotenv').config();

const express = require('express');
const api = require('./modules/api');
const auth = require('./routes/auth')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT;
const cookie = require('cookie');

const cors = require('cors');
const cookieParser = require('cookie-parser');

// const rooms = io.of('/chats');

app
	.use(express.static('public'))

	.use(cors())
	.use(cookieParser())

	.use(auth)
	.set('io', io)
	.set('view engine', 'ejs')
	.get('/', function (req, res) {
		res.render('main')
	})
	.get('/chats', function (req, res) {
		res.render('chats')
	})
	.get('/chats/:id', async function (req, res) {

		const roomId = req.params.id;
		// console.log(req.cookies);
		// console.log(req.params.id);
		// const roomId = io.of(`/chats/${req.params.id}`);

		// console.log(res.io);
		
		// let song = await api.currentPlaying(req,res);
		// console.log(song.item);	
		
		// setInterval( async function () {
		// 	try {
		// 		const newSong = await api.currentPlaying(req,res);
				
		// 		if (song && song.item.id !== newSong.item.id) {
		// 			song = newSong

		// 			io.emit('music player', {
		// 				song
		// 			});
		// 		} else {
		// 			// console.log(roomId);

		// 			io.emit('music player', {
		// 				song
		// 			});
		// 		}
		// 	} catch(error){
		// 		console.log(error, 'no song');
		// 	}
		// }, 1000)

		res.render('chat', { roomId })
	})
	.get('/join', function(req,res){
		res.redirect('/chats/' + req.query.code)
	});

	let radioQueue = [];

	io.on('connection', (socket) => {
		const rooms = socket.adapter.rooms;
		let username = 'anonymous';
		const bot = 'Luna 🌙';

		socket.emit('rooms', rooms)

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

		socket.on('room', (roomId) => {
			socket.join(roomId);
			socket.to(roomId).emit('join room', {
				bot,
				username
			})
		})

		socket.on('search songs', async (input) => {
			// console.log('song?',input);
			socket.cookie = socket.handshake.headers.cookie || socket.request.headers.cookie
			const socketCookie = cookie.parse(socket.cookie);
			const access_token = socketCookie.access_token;
			// console.log('cookie', access_token);

			const songs = await api.getSongs(socketCookie, input.value);
			// console.log('wooah?', songs);
			
			// socket.join(roomId);
			socket.local.emit('search results', {
				songs
			})
		})

		// emit radio queue to new person
		socket.local.emit('radio queue', {
			songs: radioQueue
		})

		socket.on('add to radio', async (song) => {
			socket.cookie = socket.handshake.headers.cookie || socket.request.headers.cookie
			const socketCookie = cookie.parse(socket.cookie);
			const access_token = socketCookie.access_token;
			
			const songInfo = await api.getOneSong(socketCookie, song.songId);
			radioQueue.push(songInfo)
			
			socket.local.emit('song requests added', {
				song: songInfo
			})
			
			socket.to(song.roomId).emit('song requests added', {
				song: songInfo
			})
			
			socket.local.emit('add to queue', {
				songs: songInfo
			})

			socket.to(song.roomId).emit('add to queue', {
				songs: songInfo
			})
			
		})

		socket.on('start radio', (radio) => {

			socket.emit('play song', {
				song: Object.values(radioQueue)[0],
				isPlaying: radio.isPlaying
			})
			
			socket.to(radio.roomId).emit('play song', {
				song: Object.values(radioQueue)[0],
				isPlaying: radio.isPlaying
			})
			
		})
		
		socket.on('song finished', (room) => {
			console.log('queue', radioQueue);

			radioQueue = radioQueue.filter(song => Object.values(radioQueue)[0] !== song)
			console.log('iieeeck', radioQueue);

			socket.emit('play song', {
				song: Object.values(radioQueue)[0],
				isPlaying: true
			})
			
			socket.to(room).emit('play song', {
				song: Object.values(radioQueue)[0],
				isPlaying: true
			})
		});

		socket.on('song request', (song) => {			
			// song request emits
			socket.local.emit('user song request', {
				name: song.message,
				id: song.song,
				username
			})
			
			socket.to(song.roomId).emit('user song request', {
				name: song.message,
				id: song.song,
				username
			})
		})

		socket.on('chat', (msg) => {
			// user chat messages
			socket.emit('user message', {
				msg: msg.message,
				username: 'You'
			})
			
			socket.to(msg.roomId).emit('user message', {
				msg: msg.message,
				username
			})

		});

	})

http.listen(port, function () {
	console.log(`listening on*:${port}`);
})