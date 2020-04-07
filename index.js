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
    // console.log(msg)
    const greetingsCountries = greetings.filter(greetings => {
        if (msg == greetings.string) { 
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
    const api = await get('https://emoji-api.com/emojis?search=tulp')
    try {
        console.log('hi');
        // console.log(api.status);
        const localFlags = await getLocalFlags(msg);
        return localFlags;
    } catch(error) {
        const apiFlags = await getApiFlags(msg);
        return apiFlags;
    }
}

async function getApiFlags(msg) {
    const countries = await getCountries(msg);
    const flags = await get(`https://emoji-api.com/emojis?search=${countries}&access_key=faf6d35ecf5a5e87d3acc2cfb51de3d62e392dd7`)
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
    socket.emit('server message', 'Welcome! Say Hi 👋, in your native language.');
    socket.broadcast.emit('server message', `A new user with the username ${userName} connected`);

    socket.on('set user', (id) => {
        userName = id;
        socket.emit('server message', `Server welcome ${userName}`);
        socket.broadcast.emit('server message', `Server User with username ${userName} connected`);
    })
    
    socket.on('chat', async (msg) => {
        const flags = await getFlags(msg);
		io.emit('chat', { msg, flags })
	});
});

http.listen(port, function () {
	console.log(`listening on*:${port}`);
})