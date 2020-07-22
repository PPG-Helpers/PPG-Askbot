module.exports = {
	name: 'askppg',
	description: 'accept question submissions from users',
	usage: '!askppg',
	execute(message, client){
		if(!message.content.match(/^(!askppg)( )*[0-9a-zA-Z_ ?]+[?]$/g)){
			return;
		}

		// TODO: accept multiple questions, delimited by a ';' symbol
		var question = message.content.substring("!askppg".length);

		message.reply('Thank you for submitting the question: "' + question + '" It has been queued to the question pool!')
	  	  .catch(console.error);
	},
	addQuestionToSheets(){

	}
}