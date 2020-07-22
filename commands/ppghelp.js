module.exports = {
	name: 'ppghelp',
	description: 'help people learn how to use ppg askbot',
	usage: '!ppghelp', 
	execute(message, client){
		var reply = "How to use PPG Askbot \n";
		client.commands.forEach(command => {
			reply += command.name + "  |  " + "usage: " + command.usage + "  |  " + command.description + "\n";
		});
		message.channel.send(reply);
	}
}