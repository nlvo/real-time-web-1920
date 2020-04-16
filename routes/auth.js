require('dotenv').config();

const axios = require('axios');




const express = require('express');
const app = express();
const api = require('../modules/api.js')

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = process.env.REDIRECT_URI; // Your redirect uri

const cors = require('cors');
const cookieParser = require('cookie-parser');

app   
    .use(cors())
    .use(cookieParser())

    .get('/refresh_token', function(req, res) {

        // requesting access token from refresh token
        const refresh_token = req.query.refresh_token;
        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
          form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
          },
          json: true
        };
      
        request.post(authOptions, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            res.send({
              'access_token': access_token
            });
          }
        });
    })
	.get('/callback', api.callback)
	.get('/login', api.login)
	.get('/profile', async function (req, res) {
		var access_token = req.query.access_token;
		var options = {
			url: 'https://api.spotify.com/v1/me/playlists',
			method: 'get',
			headers: { 'Authorization': 'Bearer ' + access_token }
		  };
  
		  // use the access token to access the Spotify Web API
		  const response = await axios(options)
		  const publicPlaylists = response.data.items.map(playlists => { if(playlists.public) { return playlists }})
		  console.log(publicPlaylists);
		  

		// const data = await api();
		// const authOptions = {
		// 	url: 'https://accounts.spotify.com/api/me/playlists',
		// 	method: 'post',
		// 	headers: {
		// 	  'Authorization': 'Bearer ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
		// 	}
		//   };

		// const response = await axios(authOptions)
		// .catch (error => {
		// 	console.log(error);
		// });

		console.log('hallo', req.query);
		
		res.render('account', { playlists: publicPlaylists })
	});

module.exports = app;