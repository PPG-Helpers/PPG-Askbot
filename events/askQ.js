module.exports = {
	name: 'askQ',
	description: 'asks question once a day at 12:05 am',
	ask(client, channelId, question){
		client.guilds.cache.forEach((guild) => {
	    	client.channels.fetch(channelId).then(channel => {
	    		channel.send(question).catch(console.error);
	    	});
    	});
	},
	retrieveQuestion(day){

	}
}