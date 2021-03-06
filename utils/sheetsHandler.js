require('dotenv').config();
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
	process.env.CLIENTID,
	process.env.CLIENTSECRET,
	process.env.REDIRECTURI
);

google.options({auth: authClient});

var weekday = new Date().getDay();
var sheetRange = 'general!A1:A1';
var sheetId = '0';
var sheetTag = 'general';
if(weekday == 6){
	sheetRange = 'serious!A1:A1';
	sheetId = '1525201989';
	sheetTag = 'serious';
}
// note thet sheetId != spreadsheet id
// https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=sheetId
// 0 is the sheetId for general, other one is for serious

exports.loop;
loop = true;

exports.gClient;

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
		console.log(loop);
		if(loop){
			sheets.spreadsheets.values.get(
			{
				auth: auth,
				spreadsheetId: process.env.SPREADSHEETID,
				range: sheetRange
			}, (err, res) => {
				if(err) { 
					console.error('API threw an error');
					askQ.ask(client, process.env.ASKID, "Problem with retrieving question of the day");
					throw error;
				}
				var rows = res.data.values;
				var question = "I'm sorry, I'm out of questions to ask. :("
				if(rows == undefined){
					console.log("length is 0");
					loop = false;
				} else {
					let d = new Date();
					question = `Question of the day ${d.getMonth() + 1 }/${d.getDate()}/${d.getFullYear()}: ${rows[0]}`;
				}
				// every interval, read, delete, and post
				askQ.ask(client, process.env.ASKID, question);
			});
		}
	},
	async removeQuestion(auth){
		console.log("starting to remove a question");
		if(loop){
			sheets.spreadsheets.batchUpdate(
			{
				spreadsheetId: process.env.SPREADSHEETID,
				resource:{
					requests: [{
						deleteDimension : {
							range:{
								sheetId: sheetId,
								dimension: 'ROWS',
								startIndex: 0,
								endIndex: 1
							}
						},
					}],
				}

			}, (err, res) => {
				if(err){
					console.error('Unable to delete');
					console.log(err);
					throw error;
				}
				console.log("question successfully removed");
			});
		}
	},
	async addQuestion(question){
		console.log("asking question");
		sheets.spreadsheets.values.append({
		    spreadsheetId: process.env.SPREADSHEETID,
		    range: sheetTag,
		    valueInputOption: 'USER_ENTERED',
		    requestBody: {
		      values: [
		        [question],
		      ],
		    },
	  	}, (err, res) => {
	  		if(err){
	  			console.error('Unable to add');
	  			console.log(err);
	  			throw error;
	  		}
	  		console.log("question successfully added");
	  	});
	},
	async askingFromSheets(client, discordClient){
		console.log("in asking from sheets");
		try{
			await this.readQuestion(client, discordClient);
			await this.removeQuestion(client);
		} catch(error){
			console.error;
		}
	},
	async delay(ms){
		try {
			return await new Promise(resolve => setTimeout(resolve, ms));
		} catch(error){
			console.error;
		}
	},
	async askDailyQuestion(client, discordClient, external){
		console.log("in daily");
		if(external && !loop){
			loop = true;
		}
		while(loop){
			// 1 second = 1000 ms
			await this.delay(60 * 60 * 1000);
			await this.askingFromSheets(client, discordClient);
		}

	},
	async start(discordClient){
		console.log("starting");
		var question = "";
		try {
			gClient = await this.authenticate(scopes);
			this.askDailyQuestion(gClient, discordClient, false);
		} catch(error){
			console.error;
		}
	}
}