require('dotenv').load()

const Twitter = require('twitter')
const sentiment = require('sentiment')
const cuid = require('cuid')
const level = require('level')
const levelWs = require('level-ws')
const tracking = require('./tracking')

var db = levelWs(level('./sentiment-db'))
var ws = db.createWriteStream()

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

ws.on('error', function (err) {
  console.error('Error:', err)
})
ws.on('close', function () {
  console.log('Stream closed')
})

function gather () {
  client.stream('statuses/filter', {track: tracking.join(',')}, function (s) {
    s.on('data', function (tweet) {
      var text = tweet && tweet.lang === 'en' && tweet.text
      var results = text && sentiment(text)

      if (results) {
        ws.write({ key: cuid(), value: JSON.stringify(results)})
      }
    })

    s.on('error', function (error) {
      console.log(error)
    })
  })
}

module.exports = gather
