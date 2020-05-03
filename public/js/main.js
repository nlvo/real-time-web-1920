const socket = io();
const form = document.querySelector('#message-form');
const formUser = document.querySelector('#user-form');
const message = document.querySelector('#message');
const username = document.querySelector('#username');
const chatsList = document.querySelector('.chats');
const messageList = document.querySelector('section ul');

// const commandList = document.querySelector('.commands');
// const command = document.querySelector('.command');

// command.addEventListener('click', function () {
// 	if(commandList.classList.contains('active')) {
// 		commandList.classList.remove('active');
// 	} else {
// 		commandList.classList.add('active');
// 	}
// })

if(formUser) {
	formUser.addEventListener('submit', function (event) {
		event.preventDefault();
		socket.emit('set user', username.value)
		this.style.opacity = '0';
	});
}

function getFlags (character) {
	for(let i = 0; i < character.length; i++){
		return character[i];
	}
}

socket.on('server local message', (server) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');

	username.append(server.username)
	span.append(server.bot)
	li.append(span, 'Welcome ', username, '! Log in to listen to music together, by becoming a host.');
	// messageList.append(li);
});

socket.on('server message', (server) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');

	username.append(server.username)
	li.append(span, username, ' joined');
	// messageList.append(li);
});

socket.on('server user left', (server) => {
	console.log(server);
	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');

	username.append(server.username)
	li.append(span, username, ' left');
	// messageList.append(li);
});

socket.on('server user message', (server) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');

	if (server.local) {
		li.append(span, 'Welcome ', username);
	} else {
		li.append(span, 'Anonymous username changed username to ' , username);
	}

	username.append(server.username)
	span.append(server.bot)
	// messageList.append(li);
});

// socket.on('learning bot', (chat) => {
// 	console.log('learning bot: ', chat)
// 	const li = document.createElement('li');
// 	const span = document.createElement('span');
// 	const spana = document.createElement('span');
// 	const spanTip = document.createElement('span');

// 	if(chat.command.language) {
// 		span.append(`🧠 Learning`)
// 		spana.append(`Roman: ${chat.command.string}`)
// 		li.append(span, `${chat.command.language}: ${chat.command.specialCharacters}`, spana)	
// 	} else if (chat.command.country.length > 0){
// 		span.append(`Robot ${chat.command.flag}`)
// 		// li.append(span, `Means Hello in: ${chat.command[0]}.`)	
// 		li.append(span, `Hi to ${chat.command.country}.`)
// 	} else {
// 		spanTip.append(`🚨Tip`)
// 		li.append(spanTip, `Want to learn a new language? use the command /hellokorean`)
// 		li.classList.add('learn');
// 	}

// 	messageList.append(li);
// });

// chats.on('your message', (user) => {
// 	console.log(user);
// 	const li = document.createElement('li');
// 	const span = document.createElement('span');
// 	// const flags = user.flags;

// 	const message = user.msg;
// 	const username = user.username;

// 	li.classList.add('me');	
// 	span.append(`${username}`)
// 	li.append(span, `${message}`);

// 	messageList.append(li);

// });
const chats = io('/chats');

chats.on('music player', (playing) => {
	
	// const currentSong = playing.song;
	console.log(playing.song);
	console.log(playing);
	console.log(Object.keys(playing).length);
	if(Object.keys(playing).length !== 0 && playing.song !== 'not playing') {
		const tbn = document.querySelector('.player__tbn');
		const playingIcon = document.querySelector('.player__is-playing');
		const link = document.querySelector('h3 a');
		const songLink = playing.song.context ? playing.song.context.external_urls.spotify : playing.song.item.external_urls.spotify;
		const songTitle = playing.song.item.name;
		const songArtist = playing.song.item.artists ? `- ${playing.song.item.artists[0].name}` : '';
		const isPlaying = playing.song.is_playing ? 'playing' : 'not-playing'
		playing.song.item.album.images.forEach(a => {
			if (a.height == 64) {
				tbn.src = a.url;
			}
		})
		link.textContent = `${songTitle} ${songArtist}`;
		link.href = songLink;
		playingIcon.src = `/img/${isPlaying}.svg`;
	}
})

const roomId = `/chats#${location.pathname.split('/')[2]}`;
chats.emit('room', roomId)

chats.on('join room', (server) => {
	console.log('Connected to room', server);

	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');

	username.append(server.username)
	li.append(span, username, ' joined');
	messageList.append(li);
});

chats.on('rooms', (rooms) =>{
	const chatRooms = Object.entries(rooms);
	// https://zellwk.com/blog/looping-through-js-objects/
	chatRooms.forEach(chat => {
		const li = document.createElement('li');
		const link = document.createElement('a');
		const chatName = chat[0].length > 4 ? chat[0].split('#')[1] : chat[0];
		const chatLength = chat[1].length;
		
		link.href = `/chats/${chatName}`
		link.append(`${chatName} (${chatLength})`)
		li.append(link)
		if(chatsList){
			chatsList.append(li);
		}
	})
	console.log(chatRooms);
})

chats.on('user message', (user) => {
	console.log(user);
	const li = document.createElement('li');
	const span = document.createElement('span');
	// const flags = user.flags;
	// alert(user)
	const message = user.msg;
	const username = user.username;
	
	// alert(message)
	if(username == 'You') {
		li.classList.add('me');	
	}

	span.append(`${username}`)
	li.append(span, `${message}`);

	messageList.append(li);

});

if(form) {
	form.addEventListener('submit', function (event) {
		
		event.preventDefault();

		const roomId = `/chats#${location.pathname.split('/')[2]}`
		
		chats.emit('chat', { roomId, message: message.value })
		formUser.style.display = 'none';
		// commandList.classList.remove('active');
		message.value = '';
	});
}
