const socket = io();
const form = document.querySelector('#message-form');
const formUser = document.querySelector('#user-form');
const formSearch = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-form input');
const message = document.querySelector('#message');
const username = document.querySelector('#username');
const chatsList = document.querySelector('.chats');
const messageList = document.querySelector('.chat ul');
const songLists = document.querySelector('.search ul');
const playlist = document.querySelector('.playlist ul');

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

if(formSearch) {
	formSearch.addEventListener('submit', function (event) {
		event.preventDefault();		
		socket.emit('search songs', {value: searchInput.value, roomId})
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
	messageList.append(li);
});

socket.on('server message', (server) => {
	console.log(server);
	
	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');

	username.append(server.username)
	li.append(span, username, ' joined');
	messageList.append(li);
});

socket.on('server user left', (server) => {
	console.log(server);
	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');

	username.append(server.username)
	li.append(span, username, ' left');
	messageList.append(li);
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

// socket.on('music player', (playing) => {

// 	// const currentSong = playing.song;
// 	// console.log(playing.song);
// 	// console.log(playing);
// 	// console.log(Object.keys(playing).length);
// 	if(Object.keys(playing).length !== 0 && playing.song !== 'not playing') {
// 		const tbn = document.querySelector('.player__tbn');
// 		const playingIcon = document.querySelector('.player__is-playing');
// 		const link = document.querySelector('h3 a');
// 		const songLink = playing.song.context ? playing.song.context.external_urls.spotify : playing.song.item.external_urls.spotify;
// 		const songTitle = playing.song.item.name;
// 		const songArtist = playing.song.item.artists ? `- ${playing.song.item.artists[0].name}` : '';
// 		const isPlaying = playing.song.is_playing ? 'playing' : 'not-playing'
// 		playing.song.item.album.images.forEach(a => {
// 			if (a.height == 64) {
// 				tbn.src = a.url;
// 			}
// 		})
// 		link.textContent = `${songTitle} ${songArtist}`;
// 		link.href = songLink;
// 		playingIcon.src = `/img/${isPlaying}.svg`;
// 	}
// })

const roomId = `${location.pathname.split('/')[2]}`;
socket.emit('room', roomId)

socket.on('join room', (server) => {
	console.log('Connected to room', server);
	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');

	username.append(server.username)
	li.append(span, username, ' joined');
	messageList.append(li);
});

socket.on('rooms', (rooms) =>{
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

socket.on('user message', (user) => {
	console.log(user);

	const li = document.createElement('li');
	const span = document.createElement('span');
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

socket.on('user request', (song) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const link = document.createElement('a');

	const username = song.username;
	const songName = song.name;
	const songId = song.id;

	// alert(message)
	if(username == 'You') {
		li.classList.add('me');	
	}

	if(songName) {
		link.classList.add(songId);		
		link.textContent = 'add to playlist';
	}

	span.append(`${username}`)
	li.append(span, `${songName}`, link);

	messageList.append(li);
})

if(form) {
	form.addEventListener('submit', function (event) {
		
		event.preventDefault();

		const roomId = `${location.pathname.split('/')[2]}`
		
		socket.emit('chat', { roomId, message: message.value })
		formUser.style.display = 'none';
		// commandList.classList.remove('active');
		message.value = '';
	});
}

socket.on('search results', (lists) => {

	if(songLists.childNodes.length > 0){
		while(songLists.firstChild) {
			songLists.removeChild(songLists.firstChild);
			// https://stackoverflow.com/questions/48310643/removing-childnodes-using-node-childnodes-foreach
		}
	}
	lists.songs.forEach(songs => {
		const tbn = document.createElement('img');
		const li = document.createElement('li');
		const span = document.createElement('span');
		li.classList.add(songs.id)
		console.log(songs.name);
		songs.artists.forEach(artist => {
			span.append(artist.name)
		})

		songs.album.images.forEach(a => {
			
			if (a.height == 64) {
				tbn.src = a.url;
			}
		})

		li.append(tbn, songs.name, ' - ' ,span)
		songLists.append(li);
	})
})

// socket.on('song requests added', (requests) => {
// 	console.log('rrrr',requests);
// 	const li = document.createElement('li');
// 	const span = document.createElement('span');

// 	const songId = requests.song.id;
// 	console.log(songId);
// 	li.append(span, `${requests.song.name} `);

// 	messageList.append(li);
// })

songLists.addEventListener('click', function(event){
	const songId = event.target.tagName === 'LI' ?  event.target.classList.value :  event.target.parentElement.classList.value;
	const songName = event.target.textContent;
	const searchResults = event.target.tagName === 'LI' ? event.target.parentElement : event.target.parentElement.parentElement

	console.log(event.target.tagName);

	if(searchResults.childNodes.length > 0){
		while(searchResults.firstChild) {
			searchResults.removeChild(searchResults.firstChild);
		}
	}

	socket.emit('song request', { roomId, message: songName, song: songId })
})

messageList.addEventListener('click', function(event){
	const songId = event.target.classList.value;
	socket.emit('add to radio', { roomId, songId })
})

socket.on('radio queue', (queue) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const tbn = document.createElement('img');
	console.log('queueee', Object.keys(queue.songs).length);
	
	if(Object.keys(queue.songs).length > 0) {
		queue.songs.forEach(song => {
			console.log(song);
			song.album.images.forEach(a => {
				
				if (a.height == 64) {
					tbn.src = a.url;
				}
			})

			const songName = song.name;
			song.artists.forEach(artist => {
				span.append(artist.name)
			})

			li.append(tbn, `${songName} - `, span)
			playlist.append(li);	
		});
	}
})

socket.on('add to queue', (queue) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const tbn = document.createElement('img');
	console.log('queueee', queue);
	
	queue.songs.album.images.forEach(a => {
		
		if (a.height == 64) {
			tbn.src = a.url;
		}
	})

	const songName = queue.songs.name;
	queue.songs.artists.forEach(artist => {
		span.append(artist.name)
	})

	li.append(tbn, `${songName} - `, span)
	playlist.append(li);	

})

const play = document.querySelector('.play')
const audio = document.querySelector('audio')
const source = document.querySelector('source')
const h3 = document.querySelector('.player h3')

play.addEventListener('click', function(){
	if(audio.paused){
		socket.emit('start radio', {roomId, isPlaying: true})
	} else {
		socket.emit('start radio', {roomId, isPlaying: false})
	}
})

socket.on('play music', (queue) => {
	console.log(queue);
	const tbn = document.querySelector('.player__tbn');
	const playingIcon = document.querySelector('.player__is-playing');
	const link = document.querySelector('h3 a');

	// if there is a queue and if radio has started
	if(queue.song){
		console.log(queue.song.name);
		
		const songTitle = queue.song.name;
		const songArtist = queue.song.artists ? `- ${queue.song.artists[0].name}` : '';

		// get album cover
		queue.song.album.images.forEach(a => {
			if (a.height == 64) {
				tbn.src = a.url;
			}
		})

		link.textContent = `${songTitle} ${songArtist}`;

		// if song has a preview
		if(queue.song.preview_url){
			source.src = queue.song.preview_url;
		} else {
			socket.emit('song finished', roomId)
		}
		console.log('uahuh' ,queue.isPlaying);
		audio.load();

		if(queue.isPlaying){
			audio.play();
			playingIcon.src = `/img/playing.svg`;
		} else {
			audio.pause();
			playingIcon.src = `/img/not-playing.svg`;
		}
	}
})

audio.addEventListener('ended', songEnded)

function songEnded () {
	const tbn = document.querySelector('.player__tbn')
	console.log('oh noh NEXT');
	socket.emit('song finished', roomId)
	console.log(playlist.childNodes.length);
	playlist.removeChild(playlist.childNodes[0])
	if(playlist.childNodes.length == 0) {
		tbn.src = ''
		h3.textContent = 'No song'
		audio.src = ''
		audio.load();
	}
}