require('dotenv').config();
const fetch = require('node-fetch');
const greetings = require('../data/hello.json');
const flagsJson = require('../data/flags.json');

// fetched data and clean it
async function get(url) {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

async function getLanguage(msg) {
    const greetingsLanguage = greetings.filter(greetings => {
        if(msg.match(new RegExp(greetings.string, 'g'))|| msg.match(new RegExp(greetings.specialCharacters, 'i'))){
            return greetings.country 
        }
    }).map(countries => countries.language)
    return greetingsLanguage
}

async function getCountries(msg) {
    const greetingsCountries = greetings.filter(greetings => {
        if(msg.match(new RegExp(greetings.string, 'g'))|| msg.match(new RegExp(greetings.specialCharacters, 'i'))){
            return greetings.country 
        }
    }).map(countries => countries.country)
    return greetingsCountries
}

async function getGreetings(msg) {
    const countriesGreetings = greetings.filter(greetings => {
        if(msg.match(new RegExp(greetings.language, 'i'))){
            return greetings.specialCharacters 
        }
    })
    return countriesGreetings
}

// .replace(/\s+/g, '-')
async function getLocalFlags(msg) {
    const countries = await getCountries(msg);
    
    return flagsJson.filter(flag => {
        for(let i = 0; i < countries.length; i++ ){
            console.log('flag', countries[i], flag.slug );
            if(flag.slug.match(new RegExp(countries[i].replace(/\s+/g, '-'), 'i'))){
                return flag.character
            }
        }
    }).map(flag => flag.character);
}

async function getApiFlags(msg) {
    const countries = await getCountries(msg);
    // console.log(countries)
    for(let i = 0; i < countries.length; i++ ){
        if(flag.slug.match(new RegExp(countries[i], 'g'))){
            const flags = await get(`https://emoji-api.com/emojis?search=${countries[i]}&access_key=${process.env.API_KEY}`)
            return flags.character
        }
    }
    return flags
}

async function getFlags(msg){
    // try {
        // const apiFlags = await getApiFlags(msg);
        // console.log(apiFlags)
        // return apiFlags;
    // } catch(error) {
        const localFlags = await getLocalFlags(msg);
        return localFlags;
    // }
}

async function getCommand(command) {
    if(command.match(/[/](\w+)/ig)) {
        const n = command.split('/')
        console.log(n[1]);
        
        const greeting = await getGreetings(n[1]);
        console.log(greeting[0]);
        
        return greeting[0]
    } else {
        const flag = await getFlags(command)
        // const language = await getLanguage(command)
        const country = await getCountries(command);
        
        return { content: command, country, flag }
    }
}

module.exports = { getFlags, getCommand };