const express = require('express');
const app = express();
const TelegramBot = require('node-telegram-bot-api');
const token = "847053296:AAH9MP8G6vw7IW6r5jg6HAggcvllRM9I1i8";
const bot = new TelegramBot(token, {polling: true});
const mtg = require('mtgsdk');
const request = require('request');
const axios = require('axios');

const port = process.env.PORT || 8080

app.use(express.json());

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});

bot.onText(/\/echo (.+)/, function(msg, match){
  console.log(msg)
  // console.log(match)
  const chatId = msg.chat.id;
  const echo = match[1];
  if(msg.from.id === 290994421) {
    bot.sendMessage(chatId, 'die');
  } else {
    bot.sendMessage(chatId, echo);
  }
})

bot.onText(/\/mtg (.+)/, function(msg, match){
  console.log(msg)
  const chatId = msg.chat.id;
  const cardName = match[1];
  console.log(match)
  mtg.card
    .where( {name: cardName} )
    .then(result => {
      // console.log(result)
      const messageCards = result.map(card => {
          return card.name
      })
      // console.log(messageCards)
      const uniqueSet = new Set(messageCards); // removes duplicates
      const uniqueArray = [...uniqueSet]; // back to array
      const finalArray = uniqueArray.join(", "); // joins array into string
      const finalMessage = `${result[0].imageUrl}\n${finalArray}` // final message text
      console.log(finalMessage);
      bot.sendMessage(chatId, finalMessage)
    })
    // .then(result => {
    //   // console.log(result)
    //   const card = result[0].imageUrl
    //   bot.sendMessage(chatId, card)
    // })
    .catch(err => {
      bot.sendMessage(chatId, 'No such card found');
    })
});


bot.onText(/\/movie (.+)/, function(msg, match) {
  const movie = match[1];
  const chatId = msg.chat.id;
  request(`http://www.omdbapi.com/?i=tt3896198&apikey=110b029a&t=${movie}`, function(error, response, body) {
        console.log(body)
        if(!error && response.statusCode == 200) {
          bot.sendMessage(chatId, '_Looking for _' + movie + '...', {parse_mode:'Markdown'})
            .then(function(msg) {
              const res = JSON.parse(body);
              console.log(res);
              // bot.sendMessage(chatId, 'Result: \nTitle ' + res.Title + '\nYear: ' + res.Year + '\nRated: ' + res.Rated + '\nReleased: ' + res.Released );
              bot.sendPhoto(chatId, res.Poster, {caption: '\nTitle: ' + res.Title + '\nYear: ' + res.Year + '\nRated: ' + res.Rated + '\nReleased: ' + res.Released})
            })
        }
      });
})

bot.onText(/\/cat/, function(msg, match) {
  const chatId = msg.chat.id;

  axios
    .get('https://catfact.ninja/fact')
    .then(res => {
      bot.sendMessage(chatId, res.data.fact);
    })
    .catch(err => {
      console.log(err);
    })

})

bot.onText(/\/trump (.+)/, function(msg, match){
  console.log(msg)
  const chatId = msg.chat.id;
  const trumpInput = match[1];
  console.log(match)

  if(trumpInput === 'q') {
    axios
      .get('https://api.tronalddump.io/random/quote')
      .then( res => {
        console.log(res);
        bot.sendMessage(chatId, res.data.value);
      })
  } else if(trumpInput === 'm') {
      axios
        .get('https://api.tronalddump.io/random/meme')
        .then(res => {
          console.log(res.data);
          bot.sendPhoto(chatId, res.data);
        })
  } else {
    bot.sendMessage(chatId, 'Use q for a quote and m for a meme.')
  }
})