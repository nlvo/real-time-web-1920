
const querystring = require('querystring');
const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = process.env.REDIRECT_URI; // Your redirect uri
const stateKey = 'spotify_auth_state';
const axios = require('axios');

const generateRandomString = function (length) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

async function callback(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
	  url: 'https://accounts.spotify.com/api/token',
	  method: 'post',
      params: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      }
    };
	const response = await axios(authOptions)
			.catch (error => {
				console.log(error);
			});

	const access_token = response.data.access_token;
	const refresh_token = response.data.refresh_token;
	
	console.log(response);
	
	res.redirect('/chats/?' +
		querystring.stringify({
		access_token: access_token,
		refresh_token: refresh_token
	}));
  }
}

function login(req, res) {
	const state = generateRandomString(16);
	res.cookie(stateKey, state);

	// your application requests authorization
	const scope = 'user-read-private user-read-email user-read-currently-playing';
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		}));
}

module.exports = {
	callback,
	login
};