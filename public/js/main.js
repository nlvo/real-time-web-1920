const socket = io();
const form = document.querySelector('#message-form');
const formUser = document.querySelector('#user-form');
const message = document.querySelector('#message');
const username = document.querySelector('#username');
const messageList = document.querySelector('ul');

form.addEventListener('submit', function (event) {
	event.preventDefault();
	socket.emit('chat', message.value)
	formUser.style.display = 'none';
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

socket.on('server message', (server) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const username = document.createElement('span');
	li.classList.add('server');

	username.append(server.username)
	span.append(server.bot)
	if (server.local) {
		li.append(span, 'Welcome ', username, '! Say Hi 👋, in your native language.');
	} else {
		li.append(span, 'A new user with the username ', username, ' connected');
	}
	messageList.append(li);
});

// function createCheckboxes (value) {

// 	for(let i = 0; i < value.length; i++) {
// 		li.append(`<label for="">
// 				${value[i]}
// 			<input type="checkbox" id="${value[i]}">		
// 		</label>`)
// 	}
// }

// socket.on('language bot', (chat) => {
// 	console.log('language bot', chat.language)
// 	const li = document.createElement('li');
// 	const tip = document.createElement('li');
// 	const span = document.createElement('span');
// 	const spanTip = document.createElement('span');
// 	tip.classList.add('learn');

// 	span.append(chat.bot)
// 	li.append(span, `Means Hello in: ${chat.language}.`)
	
// 	spanTip.append(`🚨`)
// 	tip.append(spanTip, ` Tip: want to learn a new language? use the command /hellokorean`)
// 	messageList.append(li);
// 	messageList.append(tip);
// });

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
		li.append(span, `Shout out to ${chat.command.country[0]}.`)	
	} else {
		spanTip.append(`🚨Tip`)
		li.append(spanTip, `Want to learn a new language? use the command /hellokorean`)
		li.classList.add('learn');
	}

	messageList.append(li);
});

socket.on('chat', (user) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const flags = user.flags;
	console.log('flaggah', user);
	

	const message = user.msg.specialCharacters || user.msg.content;
	
	const username = user.username;
	if(username == 'You') {
		li.classList.add('me');	
	}
	span.append(`${username} ${flags}`)
	li.append(span, `${message}`);
	messageList.append(li);
});