const socket = io();
const form = document.querySelector('#message-form');
const formUser = document.querySelector('#user-form');
const message = document.querySelector('#message');
const username = document.querySelector('#username');
const messageList = document.querySelector('section ul');
const commandList = document.querySelector('.commands');
const command = document.querySelector('.command');

command.addEventListener('click', function () {
	if(commandList.classList.contains('active')) {
		commandList.classList.remove('active');
	} else {
		commandList.classList.add('active');
	}
})

form.addEventListener('submit', function (event) {
	event.preventDefault();
	socket.emit('chat', message.value)
	formUser.style.display = 'none';
	commandList.classList.remove('active');
	message.value = '';
});


formUser.addEventListener('submit', function (event) {
	event.preventDefault();
	socket.emit('set user', username.value)
	this.style.opacity = '0';
});

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
	li.append(span, 'Welcome ', username, '! Say Hi 👋, in your native language.');
	messageList.append(li);
});

socket.on('server message', (server) => {
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
	messageList.append(li);
});

socket.on('learning bot', (chat) => {
	console.log('learning bot: ', chat)
	const li = document.createElement('li');
	const span = document.createElement('span');
	const spana = document.createElement('span');
	const spanTip = document.createElement('span');

	if(chat.command.language) {
		span.append(`🧠 Learning`)
		spana.append(`Roman: ${chat.command.string}`)
		li.append(span, `${chat.command.language}: ${chat.command.specialCharacters}`, spana)	
	} else if (chat.command.country.length > 0){
		span.append(`Robot ${chat.command.flag}`)
		// li.append(span, `Means Hello in: ${chat.command[0]}.`)	
		li.append(span, `Hi to ${chat.command.country}.`)
	} else {
		spanTip.append(`🚨Tip`)
		li.append(spanTip, `Want to learn a new language? use the command /hellokorean`)
		li.classList.add('learn');
	}

	messageList.append(li);
});

socket.on('user message', (user) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const flags = user.flags;

	const message = user.msg.specialCharacters || user.msg.content;
	const username = user.username;
	if(username == 'You') {
		li.classList.add('me');	
	}
	span.append(`${username} ${flags}`)
	li.append(span, `${message}`);
	messageList.append(li);
});