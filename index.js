require('dotenv').load();

var Twitter = require('twitter')
var sentiment = require('sentiment')
var cuid = require('cuid')
var level = require('level')
var levelWs = require('level-ws')
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

client.stream('statuses/sample', function (s) {
  s.on('data', function (tweet) {
    var text = tweet && tweet.lang === 'en' && tweet.text
    var results = text && sentiment(text)

    if (results) {
      console.log(results)
      ws.write({ key: cuid(), value: JSON.stringify(results)})
    }
  })

  s.on('error', function (error) {
    console.log(error)
  })
})
