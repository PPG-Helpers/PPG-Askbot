const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
    console.log("Servers:");
    client.guilds.cache.forEach((guild) => {
    	console.log("-" + guild.name);
    });
});

client.on('message', message => {
	if(!message.content.match(/^(!askppg)( )*[0-9a-zA-Z_ ?]+[?]$/g)){
		return;
	}

	// TODO: accept multiple questions, delimited by a ';' symbol
	var question = message.content.substring(7);

	message.reply('Thank you for submitting the question: "' + question + '" It has been queued to the question pool!')
	  .then(() => console.log(`Sent a reply to ${message.author.username}`))
  	  .catch(console.error);
});

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"

client.login(config.token);