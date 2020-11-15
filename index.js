const fetch = require("node-fetch");
const config = require('./.git/config.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(config.token)

client.on('ready', readyDiscord);

function readyDiscord(){
  console.log('bruno discord bot is ready to rumble...')
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const memesUrl = new URL('https://api.imgflip.com/get_memes');

function getMemes(url){
  fetch(url)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        const randomNum = Math.floor(Math.random() * data.data.memes.length) + 1;
        const meme = data.data.memes[randomNum].url;
        console.log(meme);
        
        sendMemeImage(meme);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

function sendMemeImage(meme){
  const command = '!meme';
  
  client.on('message', msg => {
    if (msg.content === command){
      msg.channel.send(meme);
    }
  })
}

client.on('message', msg => {
  getMemes(memesUrl);

  if (msg.content === '!bruno'){
    msg.reply('Bruno is 20 years old and a frontend developer at The Student Broker and KB Creative');
  } else if (msg.content === '!tsb'){
    msg.channel.send('http://thestudentbroker.com/');
  }
});