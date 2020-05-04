const fetch = require('node-fetch')

function headers(req, res) {
    let access_token = req.cookies.access_token;
    const headers = {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };
    return headers;
}

async function currentPlaying(req, res) {
    // console.log(req.cookies.access_token);
    let access_token = req.cookies.access_token;
    const headers = {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', headers)
        const data = await response.json().catch(()=>{
            console.log('not playing');
        });        
        return data;
    } catch (error) {
        console.log('error ', error);
        let access_token = req.cookies.refresh_token;
    }
}

async function getSongs(cookie, input) {
    // console.log(req.cookies.access_token);
    let access_token = cookie.access_token;
    const headers = {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${input}&type=track&limit=4`, headers)
        const data = await response.json().catch(()=>{
            console.log('not playing');
        });
        const songs = await data.tracks.items;
        console.log(data);
        return songs ;
    } catch (error) {
        console.log('error ', error);
        let access_token = req.cookies.refresh_token;
    }
}

async function addToQueu(cookie, song) {
    // console.log(req.cookies.access_token);
    console.log('cookiesSong', song);
    
    let access_token = cookie.access_token;
    const headers = {
        method: 'post',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/3g2cgcgceQzWAjwNPUqBbp/tracks?uris=spotify%3Atrack%3A${song}`, headers)
        const data = await response.json().catch(()=>{
            console.log('not added');
        });
        const songs = await data;
        console.log('songiia',songs);
        return songs;
    } catch (error) {
        console.log('error ', error);
        let access_token = req.cookies.refresh_token;
    }
}

async function getOneSong(cookie, songId) {
    // console.log(req.cookies.access_token);
    console.log('cookiesSong', songId);
    
    let access_token = cookie.access_token;
    const headers = {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, headers)
        const data = await response.json().catch(()=>{
            console.log('not added');
        });
        const songs = await data;
        console.log('songiia',songs);
        return songs;
    } catch (error) {
        console.log('error ', error);
        let access_token = req.cookies.refresh_token;
    }
}

module.exports = {
    currentPlaying,
    getSongs,
    getOneSong,
    addToQueu
}
