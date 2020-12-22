## ~On Hiatus~
# PPG-Askbot
A bot that helps collect, organize, and ask questions for #askppg

## Requirements
- nodejs must be >= v12.0.0
- npm
- discord.js
- the bot token

## Get Started
Navigate to your working directory and run
```bash
npm install googleapis
npm install discord.js
npm install server-destroy
npm install open
npm install dotenv
```
Next, make a `.env` file and add the following with your bot's token replacing the `YOUR_TOKEN_ID` field (put it in between the quotation marks). Also replace `YOUR_ASK_CHANNEL_ID` with the respective ID of the askppg channel, `YOUR_CLIENT_ID`  and `YOUR_API_KEY` with the Client ID and API key you get by following the instructions on this [page](https://github.com/googleapis/google-api-nodejs-client#oauth2-client), and `YOUR_SS_ID` from the google spreadsheets link (the string after /d in the URL), and `YOUR_SECRET` which can be obtained from the [API console](https://console.developers.google.com).

In your spreadsheet, make two pages. One should be titled `general` and the other should be titled `serious`.

``` javascript
TOKEN=YOUR_TOKEN_ID
PERMINT=84992
ASKID=YOUR_ASK_CHANNEL_ID
CLIENTID=YOUR_CLIENT_ID
APIKEY=YOUR_API_KEY
SPREADSHEETID=YOUR_SS_ID
CLIENTSECRET=YOUR_SECRET
REDIRECTURI=http://localhost:3000/oauth2callback
REFRESHTOKEN=
````

## Run Code
For testing, go to your working directory and run the bot with
```bash
node PPG-Askbot.js
```

## Future Plans
- Use a db instead of Google Sheets
- Create a frontend web app for admins to have better management and PPGs to view queued questions
