const sheetsHandler = require('../utils/sheetsHandler.js');
var question = ""
const submissionPrefix = [
`Thank you for submitting a question! '`,
`Wow, what a wonderful question! '`,
`Yoo wassaaa dude–I love this question. '`,
`I'm impressed by your question writing abilities! '`
];
const submissionSuffix = [
`' has been queued to the question pool!`,
`' has been added to the question database.`,
`' has really got me thinking! <:thonk:733110723521150977>`,
`' is gold <:dabonmh8ers:713420117069004830>`
]
module.exports = {
	name: 'askppg',
	description: 'accept question submissions from users',
	usage: '!askppg',
	execute(message, client){
		if(!message.content.match(/^(!askppg)( )*[0-9a-zA-Z_ ?]+[?]$/g)){
			return;
		}

		// TODO: accept multiple questions, delimited by a ';' symbol
		var question = message.content.substring("!askppg".length + 1);

		sheetsHandler.addQuestion(question);

		var random = [Math.floor((Math.random() * 4) + 1) - 1, Math.floor((Math.random() * 4) + 1) - 1];

		var response = submissionPrefix[random[0]] + question + submissionSuffix[random[1]];
		//'Thank you for submitting the question: "' + question + '" It has been queued to the question pool!'
		message.reply(response)
	  	  .catch(console.error);

	  	sheetsHandler.askDailyQuestion(sheetsHandler.gClient, client, true);
	  	
	},
}