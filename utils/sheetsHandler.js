module.exports = {
	name: 'sheetsHandler',
	description: 'manages interaction between discord bot and google sheets',
	async start(){
		const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

		const client = new google.auth.OAuth2(
			config.clientId,
			config.clientSecret,
			config.redirectURI
		);

		this.authorizeUrl = client.generateAuthUrl({
  			access_type: 'offline',
  			scope: scopes,
		});

		const {tokens} = await client.getToken(code)
		client.setCredentials(tokens);

		oauth2Client.on('tokens', (tokens) => {
  			if (tokens.refresh_token) {
  				config.refreshToken = tokens.refresh_token;
	   			oauth2Client.setCredentials({refresh_token: tokens.refresh_token});
	  		}
	  		console.log(tokens.access_token);
		});


		var sheetRange = 'general!A1';
		if(new Date().getDay() == 6){
			sheetRange = 'serious!A1';
		}

		const sheets = google.sheets({
			version:'v4', 
			auth: config.apiKey,
			spreadsheetId: config.spreadsheetId,
			range: sheetRange
		}, (err, res) => {
			if(err) { 
				console.error('API threw an error');
				askQ.ask(client, config.askId, "Problem with retrieving question of the day");
				throw error;
			}
			var question = res.data.values[0];
			console.log(question);
		});

		
	},
	init(){
		gapi.load('client', start);
	}

}