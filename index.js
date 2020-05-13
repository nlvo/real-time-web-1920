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

		socket.local.emit('radio queue', {
			songs: radioQueue
		})

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
			// console.log('roomie?',radioQueue);

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

		socket.on('add to radio', async (song) => {
			// console.log('songIddddd', song.songId);
			socket.cookie = socket.handshake.headers.cookie || socket.request.headers.cookie
			const socketCookie = cookie.parse(socket.cookie);
			const access_token = socketCookie.access_token;
			// console.log('cookie', access_token);

			const songRequest = await api.addToQueu(song.songId);
			// console.log(songRequest, ' added');
			
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
			
			// radioQueue.forEach(songs => {
			// 	console.log('a',songs);
			// })
			// console.log('whuh',Object.values(radioQueue)[0]);
			

			socket.emit('play music', {
				song: Object.values(radioQueue)[0],
				isPlaying: radio.isPlaying
			})
			
			socket.to(radio.roomId).emit('play music', {
				song: Object.values(radioQueue)[0],
				isPlaying: radio.isPlaying
			})
		})
		
		socket.on('song finished', (room) => {
			console.log('queue', radioQueue);

			radioQueue = radioQueue.filter(song => Object.values(radioQueue)[0] !== song)
			console.log('iieeeck', radioQueue);
			// console.log('whaaa', a);

			socket.emit('play music', {
				song: Object.values(radioQueue)[0]
			})
			
			socket.to(room).emit('play music', {
				song: Object.values(radioQueue)[0]
			})
		});

		socket.on('song request', (song) => {
			// console.log(song);
			
			// song request emits
			socket.local.emit('user request', {
				name: song.message,
				id: song.song,
				username
			})
			
			socket.to(song.roomId).emit('user request', {
				name: song.message,
				id: song.song,
				username
			})
		})

		socket.on('chat', (msg) => {
			// console.log('id?',msg);

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