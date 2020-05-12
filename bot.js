// Run dotenv
require("dotenv").config();
const Discord = require("discord.js");
var fs = require("fs");
const client = new Discord.Client();
let screamIntervalMap = {};

const getRandomAudio = async () => {
  // Randomize scream from /screams folder
  let res = fs.readdir('./screams', function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    
    const random = Math.floor(Math.random() * files.length);
    screamFile = './screams/' + files[random];
  })
}

// set default scream, rotate random scream every 5 seconds
let screamFile = './screams/ahhh.m4a';
screamFile = setInterval(getRandomAudio, 5000);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  if (message.content === "!SCREAM") {
    if (message.channel.type !== "text") return;

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply("please join a voice channel first!");
    }

    // Logic to join, scream, and leave channel
    const scream = () => {
      voiceChannel.join().then(connection => {
        const dispatcher = connection.play(screamFile);
        dispatcher.on("finish", () => {
          voiceChannel.leave();
        });
      });
    };

    const id = message.member.voice.channel.id
    if(!screamIntervalMap[id]) {
      // First scream before interval kicks off
      scream();
      const screamInterval = setInterval(scream, 5000);
      screamIntervalMap[id] = screamInterval;
    }
  }

  if (message.content === "!STOP") {
    const id = message.member.voice.channel.id
    clearInterval(screamIntervalMap[id]);
    delete screamIntervalMap[id];
  }
});

client.login(process.env.DxISCORD_TOKEN);
