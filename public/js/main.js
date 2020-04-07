const socket = io();
const form = document.querySelector('#message-form');
const formUser = document.querySelector('#user-form');
const message = document.querySelector('#message');
const username = document.querySelector('#username');
const messageList = document.querySelector('ul');

form.addEventListener('submit', function (event) {
	event.preventDefault();
	socket.emit('chat', message.value)
	message.value = '';
	return false;
});

formUser.addEventListener('submit', function (event) {
	event.preventDefault();
	socket.emit('set user', username.value)
	this.style.opacity = '0';
	return false;
});

function getFlags (character) {
	console.log(character)
	for(let i = 0; i < character.length; i++){
		console.log(character)
		return character[i];
	}
}

socket.on('server message', (server) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');


	username.append(server.username)
	span.append(server.bot)
	console.log(username)
	li.append(span, 'Welcome ', username, '! Say Hi 👋, in your native language.');
	messageList.append(li);
});

socket.on('chat', (msg) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	// const flags = getFlags(msg.flags);
	const flags = msg.flags;
	const message = msg.msg;
	const username = msg.username;
	if(username == 'You') {
		li.classList.add('me');	
	}
	// console.log(username)
	span.append(`${username} ${flags}`)
	li.append(span, `${message}`);
	messageList.append(li);
});