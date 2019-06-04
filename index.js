const express = require('express');
const app = express();
const TelegramBot = require('node-telegram-bot-api');
const token = "847053296:AAH9MP8G6vw7IW6r5jg6HAggcvllRM9I1i8";
const bot = new TelegramBot(token, {polling: true});
const mtg = require('mtgsdk');
const request = require('request');
const axios = require('axios');
const tweetData = require('./tweetData.js');
const steam = 'D1D682C581C091D5834EBEA30245480D';
const d20 = require('d20');
const droll = require('droll');

const port = process.env.PORT || 8080

app.use(express.json());

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});

bot.onText(/\/echo (.+)/, function(msg, match){
  console.log(msg)
  console.log(match)
  console.log(match[1]);
  const newArray = match[1].split(' '); // split string into array by spaces
  console.log(newArray);
  const finalString = newArray.join(''); // join array into string no spaces
  console.log(finalString);
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
      const finalMessage = `${result[0].imageUrl}\n${finalArray}`; // final message text
      // console.log(finalMessage);
      console.log(uniqueSet);
      console.log(result[0]);
      if(!result[0].imageUrl) {
        bot.sendMessage(chatId, finalArray);
      } else {
        const firstCardPic = result[0].imageUrl;
        bot.sendPhoto(chatId, firstCardPic, {caption: `Also see: ${finalArray}`});
      }
    })
    // .then(result => {
    //   // console.log(result)
    //   const card = result[0].imageUrl
    //   bot.sendMessage(chatId, card)
    // })
    .catch(err => {
      console.log(err);
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

bot.onText(/\/trump/, function(msg, match){
  const chatId = msg.chat.id;
  console.log(tweetData[1]);


  var tweet = tweetData[Math.floor(Math.random()*tweetData.length)];

  bot.sendMessage(chatId, tweet.text);
  // axios
  //   .get('https://api.whatdoestrumpthink.com/api/v1/quotes/random')
  //   .then( res => {
  //     console.log(res);
  //     bot.sendMessage(chatId, res.data.message);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
})

bot.onText(/\/today/, function(msg, match){
  const chatId = msg.chat.id;


  axios.get('https://history.muffinlabs.com/date')
  .then( res => {
    // res.data.date
    // res.data.url
    // res.data.data.events/births/deaths
    // console.log(res.data.data.Events);
    const Events = res.data.data.Events;
    const randomEvent = Events[Math.floor(Math.random()*Events.length)];
    bot.sendMessage(chatId, `On this date in ${randomEvent.year}: ${randomEvent.text}`)
  })
  .catch( err => {
    console.log(err);
  })

})

bot.onText(/\/steam (.+)/, function(msg, match){
  console.log(msg)
  // console.log(match)
  const chatId = msg.chat.id;
  const user = match[1];
  axios
    .get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steam}&steamid=${user}&include_appinfo=1&format=json`)
    .then( res => {
      console.log(res.data);
      const gamesArray = res.data.response.games.map( game => {
        return game.name;
      })
      const gamesList = gamesArray.join(", ");
      bot.sendMessage(chatId, `User owns a total of ${res.data.response.game_count} games on Steam.`)
    })
    .catch(err => {
      console.log(err);
    })
})

bot.onText(/\/roll (.+)/, function(msg, match){
  // console.log(msg)
  // console.log(match)
  console.log(msg)
  const chatId = msg.chat.id;
  const user = msg.from.first_name;
  console.log(user);
  // const newArray = match[1].split(' '); // split string into array by spaces
  // console.log(newArray);
  // const finalString = newArray.join(''); // join array into string no spaces
  // console.log(finalString);
  console.log(match[1]);
  const rollDice = match[1];
  console.log(rollDice);
  // console.log(rollDice);
  // const result = d20.roll(rollDice);
  // console.log(result);
  const result = droll.roll(rollDice).toString();
  console.log(result);
  // console.log(`${user} rolled ${result.DrollResult.numDice} ${result.DrollResult.numSides}-sided dice with a modifier of +${result.DrollResult.modifier}. They rolled ${result.DrollResult.toString()}`)
  // const resultString = result.DrollResult.toString();
  console.log(result);
  bot.sendMessage(chatId, result);
})
