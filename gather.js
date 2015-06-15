require('dotenv').load()

const Twitter = require('twitter')
const sentiment = require('sentiment')
const tracking = require('./tracking')

function gather (stream) {
  var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  })

  client.stream('statuses/filter', {track: tracking.join(',')}, function (s) {
    s.on('data', function (tweet) {
      var text = tweet && tweet.lang === 'en' && tweet.text
      var results = text && sentiment(text)
      var score = results && results.score

      if (score) {
        stream.write(score)
      }
    })

    s.on('error', function (error) {
      console.log(error)
    })
  })
}

module.exports = gather
