// Import commands
const commands = require('./commands')

const fetch = require("node-fetch");
const config = require('./.git/config.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(config.token)

client.on('ready', readyDiscord);

function readyDiscord(){
  console.log('bruno discord bot is ready to rumble...')
}

const memesUrl = new URL('https://api.imgflip.com/get_memes');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  getMemes(memesUrl);
});

let memeImg;
let memesCat = [];

function getMemes(url){
  fetch(url)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Get data from api and save it
      response.json().then(function(data) {
        // Meme for images
        const randomNum = Math.floor(Math.random() * data.data.memes.length) + 1;
        memeImg = data.data.memes[randomNum].url;

        createCatMeme(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

function createCatMeme(data){
  // Check all names and if name includes 'cat' then add to memesCat empty array
  for (i = 0; i < data.data.memes.length; i++){
    const memeName = data.data.memes[i].name.toString();

    if (memeName.toLowerCase().includes('cat')){
      memesCat.push(data.data.memes[i].url.toString());
    }
  }
}
  
client.on('message', msg => {
  getMemes(memesUrl);
  if (msg.content === commands.generalMeme){ // Random meme
    msg.channel.send(memeImg);
  } else if (msg.content == commands.catMeme){ // Random cat meme
    // Random num for the length of cats array
    const randomCatInt = Math.floor(Math.random() * memesCat.length) + 1; 
    // Send random cat image in array
    msg.channel.send(memesCat[randomCatInt]);
  }
})


// Test
client.on('message', msg => {
  if (msg.content === '!bruno'){
    msg.reply('Bruno is 20 years old and a frontend developer at The Student Broker and KB Creative');
  } else if (msg.content === '!tsb'){
    msg.channel.send('http://thestudentbroker.com/');
  }
});