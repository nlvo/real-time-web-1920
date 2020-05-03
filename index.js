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

const rooms = server.of('/chats');

app
	.use(express.static('public'))

	.use(cors())
	.use(cookieParser())

	.use(auth)
	.set('server', server)
	.set('view engine', 'ejs')
	.get('/', function (req, res) {
		res.render('main')
	})
	.get('/chats', function (req, res) {
		res.render('chats')
	})
	.get('/chats/:id', async function (req, res) {
		console.log();
		const roomId = req.params.id;
		// console.log(req.cookies);
		// console.log(req.params.id);
		// const roomId = server.of(`/chats/${req.params.id}`);
		// room.emit('user message', 'ee')

		// console.log(res.io);
		// console.log(req);
		
		// let song = await api(req,res);
		// console.log(song.item);
		
		// rooms.on('connection', (socket) => {
		// 	setInterval( async function () {
		// 		try {
		// 			const newSong = await api(req,res);
					
		// 			if (song && song.item.id !== newSong.item.id) {
		// 				song = newSong

		// 				rooms.emit('music player', {
		// 					song
		// 				});
		// 			} else {
		// 				rooms.emit('music player', {
		// 					song: 'not playing'
		// 				});
		// 			}
		// 		} catch(error){
		// 			console.log(error, 'no song');
		// 		}
		// 	}, 5000)
		// rooms.emit('music player', {
		// 	song
		// });		
		// }); 

		res.render('chat', { roomId })
	})
	.get('/join', function(req,res){
		res.redirect('/chats/' + req.query.code)
	});

	rooms.on('connection', (socket) => {
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

		socket.on('room', (roomId) => {
			socket.join(roomId);
			socket.to(roomId).emit('join room', {
				bot,
				username
			})
		})

		socket.on('chat', (msg) => {
			console.log('id?',msg);
			
			// const command = await api.getCommand(msg);
			// const command = await api(req,res);
	
			socket.local.emit('user message', {
				msg: msg.message,
				username: 'You'
			})
			
			socket.to(msg.roomId).emit('user message', {
				msg: msg.message,
				username
			})

		});
	})

// server.on('connection', (socket) => {

// 	let username = 'anonymous';
// 	const bot = 'Luna 🌙';
// 	socket.local.emit('server local message', {
// 		bot,
// 		username
// 	});
// 	socket.broadcast.emit('server message', {
// 		bot,
// 		username
// 	});

// 	// console.log(socket.adapter.rooms);
// 	// // const rooms = socket.of('/chats');
// 	// socket.on('room', (room) => {
// 	// 	console.log(socket.rooms);
// 	// 	console.log(socket.id);
// 	// 	socket.join(room, () => {
// 	// 		socket.to(room).emit('alalalooo')
// 	// 	});
		
// 	// 	const rooms = socket.adapter.rooms;
// 	// 	socket.emit('rooms', rooms)

// 	// })

// 	socket.on('set user', (name) => {
// 		username = name;
// 		socket.local.emit('server user message', {
// 			bot,
// 			username
// 		});
// 		socket.broadcast.emit('server user message', {
// 			bot,
// 			username
// 		});
// 	})

// 	socket.on('disconnect', function() {
// 		server.emit('server message', `${username} left`)
// 	})

// 	socket.on('chat', async (msg) => {

// 		// const command = await api.getCommand(msg);
// 		// const command = await api(req,res);

// 		socket.local.emit('user message', {
// 			msg,
// 			username: 'You'
// 		})
// 		socket.broadcast.emit('user message', {
// 			msg,
// 			username
// 		})

// 		socket.local.emit('learning bot', {
// 			bot,
// 			msg
// 		})
// 	});
// });

http.listen(port, function () {
	console.log(`listening on*:${port}`);
})