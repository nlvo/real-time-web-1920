const fetch = require('node-fetch')

async function currentPlaying(req, res) {
    let access_token = req.query.access_token;
    const headers = {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', headers)
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error ', error);
        let access_token = req.query.refresh_token;
    }
}

module.exports = currentPlaying