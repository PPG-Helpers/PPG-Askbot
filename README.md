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
```
Next, make a `config.json` file and add the following with your bot's token replacing the `YOUR_TOKEN_ID` field (put it in between the quotation marks). Also replace `YOUR_ASK_CHANNEL_ID` with the respective ID of the askppg channel, `YOUR_CLIENT_ID`  and `YOUR_API_KEY` with the Client ID and API key you get from clicking the "Enable Google Sheets API" and "Create API Key" buttons on this [page](https://developers.google.com/sheets/api/quickstart/js), and `YOUR_SS_ID` from the google spreadsheets link (the string after /d in the URL), and `YOUR_SECRET` which can be obtained from the [API console](https://console.developers.google.com).

In your spreadsheet, make two pages. One should be titled `general` and the other should be titled `serious`.

``` javascript
{
	"token": "YOUR_TOKEN_ID",
	"permInt": 84992,
	"askId": "YOUR_ASK_CHANNEL_ID",
	"clientId": "YOUR_CLIENT_ID",
	"apiKey": "YOUR_API_KEY",
	"spreadsheetId":"YOUR_SS_ID",
	"clientSecret":"YOUR_SECRET",
	"redirectURI":"",
	"refreshToken":""
}
````

## Run Code
For testing, go to your working directory and run the bot with
```bash
node PPG-Askbot.js
```
