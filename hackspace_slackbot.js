var RtmClient = require('@slack/client').RtmClient;
var MemoryDataStore = require('@slack/client').MemoryDataStore;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var WebClient = require('@slack/client').WebClient;
var querystring = require("querystring");
var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;
var child;
var images = require("node-images");

var token = process.env.SLACK_API_TOKEN || '';
var bot;

var slack = new RtmClient(token, {
  logLevel: 'error', 
  dataStore: new MemoryDataStore(),
  autoReconnect: true,
  autoMark: true 
});

var web = new WebClient(token);

slack.start();

slack.on('authenticated', function(data) {
  bot = data.self;
  console.log("Logged in as " + bot.name
        + " of " + data.team.name + ", but not yet connected");
});

slack.on('open', function() {
    console.log('Connected');
});


slack.on('message', function handleRtmMessage(message) {
    console.log("messaage");
    console.log(message);
    console.log("user "+message.user);
    console.log("channel "+message.channel);    

    if (message.user == bot.id) return; // Ignore bot's own messages
 
    var channel = slack.dataStore.getChannelGroupOrDMById(message.channel);
    var user = slack.dataStore.getUserById(message.user);
    var m_text = message.text.replace(/[\.\,\/#!$%\^&\*;:{}=\-`~\(\)\?\"\'\“\@\<\>]/g," ").toLowerCase();
    console.log("m text "+m_text);
    if(m_text && (m_text.match(bot.name) || m_text.match("U0ZC159Q9".toLowerCase()) )){
         slack.sendTyping(message.channel);
         var file1_int = getRandomIntInclusive(0,25);
         var file2_int = getRandomIntInclusive(26,52);
         var file3_int = getRandomIntInclusive(53,76);
         var file1;
         if(file1_int < 10){
            file1 = "images/hackspace_0"+file1_int+".png";
         }else{
            file1 = "images/hackspace_"+file1_int+".png";
         }
         var file2 = "images/hackspace_"+file2_int+".png";
         var file3 = "images/hackspace_"+file3_int+".png";

         var file = "random_3_cards.jpg";

         images(1220,509).fill(255,255,255).draw(images(file1),0,0).draw(images(file2), 410, 0).draw(images(file3),820,0).save(file);
         var command = 'curl -F file=@'+file+' -F channels='+message.channel+' -F token='+token+' https://slack.com/api/files.upload';
         console.log(command);
         child = exec(command, function (error, stdout, stderr) {
           sys.print('stdout: ' + stdout);
           sys.print('stderr: ' + stderr);
           if (error !== null) {
             console.log('exec error: ' + error);
           }else{
             slack.sendTyping(message.channel);
             slack.sendMessage('What could this be?', channel.id);
           }
         });

    }
});


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
