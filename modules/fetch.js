require('dotenv').config();
const fetch = require('node-fetch');

// fetched data and clean it
async function get(url) {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

module.exports = get;