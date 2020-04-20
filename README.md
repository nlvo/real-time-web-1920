# Real time web application with the Spotify API
A chat app where you can listen to songs with others. Users could request a song.

## Concept design
![concept-luna](https://user-images.githubusercontent.com/8554238/79564611-498f9480-80af-11ea-9426-247e531a5f44.png)
[live demo link](https://chat-nlvo.herokuapp.com/)

## Installation
```
# Clone or download the repository
$ git clone https://github.com/nlvo/real-time-web-1920.git

# Install dependencies
npm install

# Dev
npm run dev

# Production
npm start

# Enviroment
create .env file which for example consist of the following
PORT = your port
CLIENT_ID = your client id
CLIENT_SECRET = your client secret
REDIRECT_URI = http://localhost:3000/callback/

# Open localhost:3000
```
## API
The spotify API uses OAUTH. In order for you to use the Spotify API you'll need a few things
- Client Id
- Client Secret
- Redirect uri

The Spotify API’s base endpoint is `https://api.spotify.com/`. The API has a few endpoints to choose from. We will be using the player endpoint.

### Player
This is an example endpoint get a list of the user's current playing song

`/v1/me/player/currently-playing`

#### Data example
```
{
  "timestamp": 1587307658716,
  "context": {
    "external_urls": {
      "spotify": "https://open.spotify.com/playlist/playlist_id"
    },
    "href": "https://api.spotify.com/v1/playlists/playlist_id",
    "type": "playlist",
    "uri": "spotify:user:user_id:playlist:playlist_id"
  },
  "progress_ms": 71614,
  "item": {}
  "currently_playing_type": "track",
  "actions": {
    "disallows": {
      "resuming": true
    }
  },
  "is_playing": true
}
```
More about the [api](https://developer.spotify.com/documentation/web-api/) in the Spotify API documentation.

### Rate Limit
Spotify API has quite vage rate limits, atleast I couldn't find it in the documentation so it's unknown at the moment. I did a little research and found this [article](http://jmeyers44.github.io/blog/2015/04/26/builder-beware-the-limitations-of-popular-apis/) which basically describes what I wrote at the beginning. It is an older article but it still applies to the current situation. 

For more information you can refer to the [Spotify API documentation](https://developer.spotify.com/documentation/web-api/).

## Data life cycle
![data-life-cycle](https://user-images.githubusercontent.com/8554238/79737066-0e81a100-82fb-11ea-9fa3-424ed0d6d811.png)

## Message types (will update asap)
### Client
- `set user` - Set your username
- `chat message` - Send a chat message to other people in the chat

### Server
- `server message` - Send a server notification to clients
- `learning bot` - Send answers/translation/tips to user/client

## ToDo
Things/features I would like to add. For more info see [project spotify](https://github.com/nlvo/real-time-web-1920/projects/1)
- [x] chat
    - [x] commands
        - [ ]  recognize '/' in order to search for songs
    - [ ]  chats/rooms
- [ ] api
    - [ ]  current song playing (host)


## Shoutout


## Sources
- [Tailwind colors](https://tailwindcss.com/)
- [App to translate a word to multiple languages](https://translatr.constunmalhotra.xyz/)
- [Socket IO](https://socket.io/get-started/chat/)

### License
Copyright © 2020, [Lien Vo](https://github.com/nlvo) . Released under the [MIT license](https://github.com/nlvo/web-app-from-scratch-1920/blob/master/LICENSE).

<!-- Add a link to your live demo in Github Pages 🌐-->

<!-- ☝️ replace this description with a description of your own work -->

<!-- replace the code in the /docs folder with your own, so you can showcase your work with GitHub Pages 🌍 -->

<!-- Add a nice poster image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- Maybe a table of contents here? 📚 -->

<!-- How about a section that describes how to install this project? 🤓 -->

<!-- ...but how does one use this project? What are its features 🤔 -->

<!-- What external data source is featured in your project and what are its properties 🌠 -->

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

<!-- How about a license here? 📜 (or is it a licence?) 🤷 -->
