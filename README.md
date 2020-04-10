# Real time web application with Emoji API
A chat app where you can learn with and from other users. Users can say *Hello* in their native language to let others know, what language they speak. So those who would like to learn the language, can learn from the native speakers themself.

But to get a little closer with those native speakers, they could ask the *language bot* how to say *Hello* in a specific language.

![mockup from Real time web application with Emoji API](https://user-images.githubusercontent.com/8554238/78983242-1fc0f580-7b24-11ea-854c-c91594c42acc.png)
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
create .env file with PORT and API_KEY

# Open localhost:3000
```
## API
To use the Emoji API you'll need an **API key**

The Emoji API’s base endpoint is `https://emoji-api.com/`. The API has a few endpoints to choose from. We will be using the search endpoint.

- All emojis
- Search
- A single emoji
- Categories
- Emojis in a category

### Search
This is an example endpoint to query emojis by a searchstring

`https://emoji-api.com/emojis?search=vietnam&access_key=yourApiKey`

#### Data example
```
[
    {
        "slug": "flag-vietnam",
        "character": "🇻🇳",
        "unicodeName": "flag: Vietnam",
        "codePoint": "1F1FB 1F1F3",
        "group": "flags",
        "subGroup": "country-flag"
    }
]
```
More about the [api](https://emoji-api.com/) in the Emoji API documentation.

### Rate Limit
Since the api is under development it is unknown what the exact limit is. From what I can tell it isn't much, which is why I created a fallback for.

For more information you can refer to the [Emoji API documentation](https://emoji-api.com/).

## Message types
### Client
- `set user` - Set your username
- `chat message` - Send a chat message to other people in the chat

### Server
- `server message` - Send a server notification to clients
- `learning bot` - Send answers/translation/tips to user/client

## ToDo
Things/features I would like to add. For more info see [project emoji](https://github.com/nlvo/real-time-web-1920/projects/1)
- [x] chat
    - [x] commands
        - [x] hello
        - [ ] words (dictonary/images)
    - [ ] personal flag
    - [ ] save language
- [x] api

## Shoutout
- Guido for the code example/explanation to set users. And the example readme about what's expected from us.
- Maikel for explaining how to use regex.

## Sources
- [Tailwind colors](https://tailwindcss.com/)
- [App to translate a word to multiple languages](https://translatr.varunmalhotra.xyz/)
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
