import { StreamerbotClient } from '@streamerbot/client';

///////////////////////////////////////
//CONNECTING TO THE STREAMER.BOT CLIENT
///////////////////////////////////////
const client = new StreamerbotClient({

	//sicne we are hosting the file locally we dont need an ip, leave as 'localhost' or '127.0.0.1'
	host: 'localhost',

	//the port we used in Streamer.bot's websocket settings.
	port: 8080, 

	//dont change
	endpoint: '/', 

	// Only needed if authentication is enabled
	password: 'my-secret-password' 
});

////////////////////////
//SUBSCRIPTION FUNCTIONS
////////////////////////

//This function runs when we detect a twitch chat message has been sent.
client.on('Twitch.ChatMessage', async (data) => {

	//set the username of the message sender.
	let username = data.data.user.name 

	// retreive the broadcaster information from Streamer.bot
	const response = await client.getBroadcaster(); 
	// console.log("RESPONSE",response)
	//This loops through all active streaming platforms (Twitch, YouTube)
	for (let i in response.platforms){

		//checks for bot user's for all active streams (UUDbot)
		let botUser = response.platforms[i].botUserName 

		//checks for the broadcasters username in all active streams (UUDvideogames)
		let broadcastUser = response.platforms[i].broadcastUserName 
		
		//If we find a bot match, discard the message.
		if (username == botUser){
			console.log("USER MATCH BOT ACCOUNT, IGNORING",username) 
			return
		}

		//If we find a broadcaster match, discard the message.
		if (username == broadcastUser){
			console.log("USER MATCH BROADCAST ACCOUNT, IGNORING",username) 
			return
		}
	}

	//creating the message string EXAMPLE (   [User1234]: Hello stream!   )
	let messageString = `[${data.data.message.username}]: ${data.data.message.message}` 
	
	//Sending the message string to youtube via our bot account (UUDbot)
	client.sendMessage("youtube",
                   messageString,   
                   { bot: true, internal: false }
				);  
});

//This function runs when we detect a youtube chat message has been sent.
client.on('YouTube.Message', async (data) => {
	
	//set the username of the message sender.
	let username = data.data.user.name

	// retreive the broadcaster information from Streamer.bot
	const response = await client.getBroadcaster();

	//This loops through all active streaming platforms (Twitch, YouTube)
	for (let i in response.platforms){

		//checks for bot user's for all active streams (UUDbot)
		let botUser = response.platforms[i].botUserName

		//checks for the broadcasters username in all active streams (UUDvideogames)
		let broadcastUser = response.platforms[i].broadcastUserName

		//If we find a bot match, discard the message.
		if (username == botUser){
			console.log("USER MATCH BOT ACCOUNT, IGNORING",botUser)
			return
		}

		//If we find a broadcaster match, discard the message.
		if (username == broadcastUser){
			console.log("USER MATCH BROADCAST ACCOUNT, IGNORING",botUser)
			return
		}
	}

	//creating the message string EXAMPLE (   [User1234]: Hello stream!   )
	let messageString = `[${username}]: ${data.data.message}`

	//Sending the message string to twitch via our bot account (UUDbot)
	client.sendMessage("twitch",
                   	messageString,
                   	{ bot: true, internal: false }
				);							   
});