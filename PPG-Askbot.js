const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const askQ = require('./events/askQ.js');
const sheets = require('./utils/sheetsHandler.js');

const {google} = require('googleapis');

const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const fs = require('fs');
const destroyer = require('server-destroy');
const prefix = '!';


// load commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


// events
client.on('ready', async () => {
	sheets.start(client);
	// var question = "I know when you are sleeping, I know when you are awake.";
	// ask ppg id: 723023181878788106
	// general: 688154879793037397
	// cow: 691085181095903234
	// askQ.ask(client, "691085181095903234", question);
});

client.on('message', message => {
	if(!message.content.startsWith(prefix) || message.author.bot){
		return;
	}

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	try {
		client.commands.get(command).execute(message, client);
	} catch(error) {
		console.log("undefined command or improper command formatting");
		console.log(error);
	}

});

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"

client.login(config.token);