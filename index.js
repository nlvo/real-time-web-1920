require('dotenv').config();

const express = require('express');
const app = express();
const fetch = require('node-fetch');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const greetings = require('./data/hello.json');
const flagsJson = require('./data/flags.json');
const port = process.env.PORT;

// fetched data and clean it
async function get(url) {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

async function getCountries(msg) {
    const greetingsCountries = greetings.filter(greetings => {
        if (msg == greetings.specialCharacters || msg == greetings.string) { 
            return greetings.country 
        }
    }).map(countries => `flag-${countries.country.replace(/\s+/g, '-').toLowerCase()}`)

    return greetingsCountries
}

async function getLocalFlags(msg) {
    const countries = await getCountries(msg);
    return flagsJson.filter(flag => {
        for(let i = 0; i < countries.length; i++ ){
            if(flag.slug == countries[i]){
                return flag.character
            }
        }
    }).map(flag => flag.character);
}

async function getFlags(msg){
    try {
        const apiFlags = await getApiFlags(msg);
        // return apiFlags;
    } catch(error) {
        const localFlags = await getLocalFlags(msg);
        return localFlags;
    }
}

async function getApiFlags(msg) {
    const countries = await getCountries(msg);
    for(let i = 0; i < countries.length; i++ ){
        if(flag.slug == countries[i]){
            const flags = await get(`https://emoji-api.com/emojis?search=${countries[i]}&access_key=faf6d35ecf5a5e87d3acc2cfb51de3d62e392dd7`)
            return flags.character
        }
    }
    return flags
}

app
	.use(express.static('public'))
	.set('view engine', 'ejs')
	.get('/', function (req, res) {
		res.render('main')
	});

io.on('connection', (socket) => {
    let userName = 'anonymous';
    socket.local.emit('server message', `Welcome ${userName}! Say Hi 👋, in your native language.`);
    socket.broadcast.emit('server message', `A new user with the username ${userName} connected`);

    socket.on('set user', (username) => {
        userName = username;
        socket.local.emit('server message', `Welcome ${userName}!`);
        socket.broadcast.emit('server message', `Anonymous username changed username to ${userName}`);
    })
    
    socket.on('chat', async (msg) => {
        const username = userName;
        console.log('user', username)
        const flags = await getFlags(msg);
		socket.local.emit('chat', { msg, username: 'You', flags })
		socket.broadcast.emit('chat', { msg, username: userName, flags })
	});
});

http.listen(port, function () {
	console.log(`listening on*:${port}`);
})