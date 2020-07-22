const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const prefix = '!';

// load commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// events
client.on('ready', () => {
    console.log("Servers:");
    client.guilds.cache.forEach((guild) => {
    	console.log("-" + guild.name);
    });
});

client.on('message', message => {
	if(!message.content.startsWith(prefix) || message.author.bot){
		return;
	}

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	console.log(command);

	try {
		client.commands.get(command).execute(message, client);
	} catch(error) {
		console.log("undefined command or improper command formatting");
	}

});

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"

client.login(config.token);