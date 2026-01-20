///////////////////////////////////////
//CONNECTING TO THE STREAMER.BOT CLIENT
///////////////////////////////////////
const client = new StreamerbotClient({

	//sicne we are hosting the file locally we dont need an ip, leave as 'localhost' or '127.0.0.1'
	host: '127.0.0.1',

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

//this functions subscribes to custom events within streamer.bot (hotkey presses)
client.on('Raw.ActionCompleted', (data) => {
	if (data.data.name == "deathAdd"){
		activateDeathAdd(data.data)
	}
	if (data.data.name == "deathSubtract"){
		activateDeathSubtract(data.data)
	}
});

//this function subscribes to any commands that have been triggered
client.on('Command.Triggered', (data) => {
	console.log("COMMAND TRIGGERED:",data.data)
	switch (data.data.name) {
		case "setDeath":
			setDeathCount(data)
			break;
		case "Blackout":
			blackoutActivate(data.data)
			console.log("BLACKOUT!")
			break;
		case "Flashbang":
			flashBangActivate(data.data)
			break;
		case "Jumpscare":
			jumpscareActivate(data.data)
			break;
		case "TestCommand":
			playSound('audio/flashbang.mp3')
		case "Refresh":
			location.reload()
			break;
		default:
			console.log("unknown command trigger!")
			return
	}
	
});

/////////////////////////
//DEATH COUNTER FUNCTIONS
/////////////////////////

function activateDeathAdd(data){
	let element = document.getElementById("death-counter")
	element.innerHTML = parseInt(element.innerHTML) + 1
}
function activateDeathSubtract(data){
	let element = document.getElementById("death-counter")
	element.innerHTML = parseInt(element.innerHTML) + -1
}

function setDeathCount(data){
	console.log(data.data.message)
	let deathcount = data.data.message.replace(`${data.data.command} `,"")
	let element = document.getElementById("death-counter")
	element.innerHTML = parseInt(deathcount)
}

/////////////////
//ALERT FUNCTIONS
/////////////////

function playSound(url) {
  const audio = new Audio(url);
  audio.play()
    .catch(error => {
      // Handle the error if playback fails (e.g., user hasn't interacted yet)
      console.error("Audio playback failed:", error);
    });
}

function flashBangActivate(data) {

    var flashbangDiv = document.getElementById('flashbang');
	var flashbangMessage = document.getElementById('flashbangMessage');

    flashbangDiv.style.transition = 'none';
    flashbangDiv.style.backgroundColor = 'white';
	flashbangMessage.innerHTML = `[${data.user.name}]`
	playSound('audio/flashbang.mp3')
    setTimeout(() => {
		flashbangDiv.style.transition = 'background-color 5s ease-out';
        flashbangDiv.style.backgroundColor = "#00000000";
		flashbangMessage.style.transition = 'color 5s ease-out';
		flashbangMessage.style.color = "#00000000";
    }, 2000);
}

function blackoutActivate(data) {
    var blackoutDiv = document.getElementById('blackout');
	var blackoutMessage = document.getElementById('blackoutMessage')

    blackoutDiv.style.transition = 'none';
    blackoutDiv.style.backgroundColor = 'white';
	blackoutMessage.innerHTML = `[${data.user.name}]`
    blackoutDiv.style.backgroundColor = 'black';

    setTimeout(() => {
		blackoutDiv.style.transition = 'background-color 3s ease-out';
        blackoutDiv.style.backgroundColor = "#00000000";
		blackoutMessage.style.transition = 'color 3s ease-out';
		blackoutMessage.style.color = "#00000000";
    }, 5000);
}

function jumpscareActivate(data) {
    var jumpscareDiv = document.getElementById('jumpscare');
	var jumpscareMessage = document.getElementById('jumpscareMessage');

	playSound("audio/jumpscare.mp3")

    jumpscareDiv.style.transition = 'none';
    jumpscareDiv.style.opacity = '100%';
	jumpscareMessage.innerHTML = `[${data.user.name}]`
    jumpscareDiv.style.backgroundColor = 'black';

    setTimeout(() => {
		jumpscareDiv.style.transition = 'opacity 1s ease-out';
        jumpscareDiv.style.opacity = "0%";
		jumpscareMessage.style.transition = 'color 1s ease-out';
		jumpscareMessage.style.color = "#00000000";
    }, 1000);
}