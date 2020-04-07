const fetch = require('node-fetch');
const greetings = require('../data/hello.json');
const flagsJson = require('../data/flags.json');

// fetched data and clean it
async function get(url) {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

async function getCountries(msg) {
    const greetingsCountries = greetings.filter(greetings => {
        if(msg.match(new RegExp(greetings.string, 'i'))|| msg.match(new RegExp(greetings.specialCharacters, 'i'))){
            return greetings.country 
        }
    }).map(countries => countries.country.replace(/\s+/g, '-'))
    return greetingsCountries
}

async function getLocalFlags(msg) {
    const countries = await getCountries(msg);
    return flagsJson.filter(flag => {
        for(let i = 0; i < countries.length; i++ ){
            if(flag.slug.match(new RegExp(countries[i], 'i'))){
                return flag.character
            }
        }
    }).map(flag => flag.character);
}

async function getApiFlags(msg) {
    const countries = await getCountries(msg);
    for(let i = 0; i < countries.length; i++ ){
        if(flag.slug.match(new RegExp(countries[i], 'i'))){
            const flags = await get(`https://emoji-api.com/emojis?search=${countries[i]}&access_key=faf6d35ecf5a5e87d3acc2cfb51de3d62e392dd7`)
            return flags.character
        }
    }
    return flags
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

module.exports = getFlags;