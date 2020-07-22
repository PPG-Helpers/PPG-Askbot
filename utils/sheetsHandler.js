const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

const {google} = require('googleapis');
const sheets = google.sheets('v4');

const config = require('../config.json');
const askQ = require('../events/askQ.js');

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

const authClient = new google.auth.OAuth2(
	config.clientId,
	config.clientSecret,
	config.redirectURI
);

const sheetRange = new Date().getDay() == 6?'serious!A1:A1':'general!A1:A1';


google.options({auth: authClient});

module.exports = {
	name: 'sheetsHandler',
	description: 'manages interaction between discord bot and google sheets',
	async authenticate(scopes){
		// function from google api docs
		return new Promise((resolve, reject) => {
	    // grab the url that will be used for authorization
	    const authorizeUrl = authClient.generateAuthUrl({
	      access_type: 'offline',
	      scope: scopes,
	    });
	    const server = http
	      .createServer(async (req, res) => {
	        try {
	          if (req.url.indexOf('/oauth2callback') > -1) {
	            const qs = new url.URL(req.url, 'http://localhost:3000')
	              .searchParams;
	            res.end('Authentication successful! Please return to the console.');
	            server.destroy();
	            const {tokens} = await authClient.getToken(qs.get('code'));
	            authClient.credentials = tokens; // eslint-disable-line require-atomic-updates
	            resolve(authClient);
	          }
	        } catch (e) {
	          reject(e);
	        }
	      })
	      .listen(3000, () => {
	        // open the browser to the authorize url to start the workflow
	        opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
	      });
	    destroyer(server);
	  	});
	},
	async readQuestion(auth, client){
		console.log("in read question");
		sheets.spreadsheets.values.get(
		{
			auth: auth,
			spreadsheetId: config.spreadsheetId,
			range: sheetRange
		}, (err, res) => {
			if(err) { 
				console.error('API threw an error');
				askQ.ask(client, config.askId, "Problem with retrieving question of the day");
				throw error;
			}
			var question = res.data.values[0];
			// every interval, read, delete, and post
			askQ.ask(client, config.askId, question);
		});
	},
	async removeQuestion(client){
		console.log("starting to remove a question");
		sheets.spreadsheets.values.batchUpdate(
		{
			auth: client,
			spreadsheetId: config.spreadsheetId,
			range: sheetRange,
			requestBody:{
				requests: [{
					"deleteDimension" : {
						"range":{
							"sheetId": spreadsheetId,
							"dimension": "ROWS",
							"startIndex": 0,
							"endIndex": 1
						}
					},
				}],
			}

		}, (err, res) => {
			if(err){
				console.error('Unable to delete');
				throw error;
			}
			console.log("question successfully removed");
		});
	},
	async askingFromSheets(client, discordClient){
		console.log("in asking from sheets");
		await this.readQuestion(client, discordClient);
		await this.removeQuestion(client)
	},
	async delay(ms){
		return await new Promise(resolve => setTimeout(resolve, ms));
	},
	async start(discordClient){
		console.log("starting");
		var question = "";
		try {
			var client = await this.authenticate(scopes);
			while(true){
				await this.delay(10000);
				await this.askingFromSheets(client, discordClient);
			}
			// setInterval(askingFromSheets(client, discordClient), 10000);
			// delete row!
		} catch(error){
			console.error;
		}

	}
}