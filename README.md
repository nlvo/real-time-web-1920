# Real time web application with the Spotify API
Stay close while still apart with Radio Luna. Listen to music from home with friends and familly. Or suggest a nice song to listen to, together.

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

The Spotify API’s base endpoint is `https://api.spotify.com/`. The API has a few endpoints to choose from. We will be using the track and search endpoint.

- `/v1/search`
- `/v1/tracks/{id}`

### Player
This is an example endpoint to get a list of the user's current playing song

`/v1/tracks/{id}`

#### Data example
```
{
  "album": {...},
  "artists": [{...}],
  "available_markets": [...],
  "disc_number": 1,
  "duration_ms": 295502,
  "explicit": false,
  "external_ids": {},
  "external_urls": {},
  "href": "https://api.spotify.com/v1/tracks/id",
  "id": "4aebBr4JAihzJQR0CiIZJv",
  "is_local": false,
  "name": "Hello",
  "popularity": 73,
  "preview_url": "https://p.scdn.co/mp3-preview/song_id",
  "track_number": 1,
  "type": "track",
  "uri": "spotify:track:id"
}
```
More about the [api](https://developer.spotify.com/documentation/web-api/) in the Spotify API documentation.

### Rate Limit
Spotify API has quite vage rate limits, atleast I couldn't find it in the documentation so it's unknown at the moment. I did a little research and found this [article](http://jmeyers44.github.io/blog/2015/04/26/builder-beware-the-limitations-of-popular-apis/) which basically describes what I wrote at the beginning. It is an older article but it still applies to the current situation. 

For more information you can refer to the [Spotify API documentation](https://developer.spotify.com/documentation/web-api/).

## Data life cycle

### Join or host a radio
![data-life-cycle-host-join](https://user-images.githubusercontent.com/8554238/81148169-1177c500-8f7c-11ea-907a-43a37a92177d.png)

### Add song to queue
![data-life-cycle-add-que](https://user-images.githubusercontent.com/8554238/81148173-13da1f00-8f7c-11ea-934e-42d47d1f0e02.png)

### Request a song
![data-life-cycle-song-request](https://user-images.githubusercontent.com/8554238/81110501-e78eb600-8f1b-11ea-8797-ae1164032845.png)

## Message types
### Client to server
- `set user` - Set your username
- `chat message` - Send a _chat message_ to other people in the chat

- `song request` - Send a _song request_ to other people in the chat
- `search songs` - Send a search request to find songs

- `add to radio` - Send _song_ that is added to the queue
- `play song` - Send first song from queue to other people in the chat
- `song finished` - Send a message if song finished to server

### Server to client
- `server message` - Send a server notification to clients
- `join room` - Send a server notification to clients that someone joined

- `user message` - Send a chat message to other people in the chat
- `user song request` - Send the _song request_ to other people in the chat

- `add to queue` - Send added song to queue to other people in the chat
- `radio queue` - Send queue to others/new clients

- `search results` - Send search results to client

## ToDo
Things/features I would like to add. For more info see [project spotify](https://github.com/nlvo/real-time-web-1920/projects/1)
- [x] chat
    - [x] commands
        - [ ]  recognize '/' in order to search for songs
    - [x]  chats/rooms (semi)
    - [ ]  roles
      - [ ] host
      - [ ] users
- [ ] api
    - [x]  current song playing (removed)
    - [x]  add song to queue
    - [x]  request a song
    - [x]  search for songs
    - [x]  play songs (preview)

## Known bug/not completely working features
- When adding song to playlist, it will be added to an already chosen one.
- Currently playing only works when 'host' is playing song

## Shoutout
Guido for the code example/explanation to set users. And the example readme about what's expected from us.
Kris for the login example in slack group

## Sources
- [Tailwind colors](https://tailwindcss.com/)
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
