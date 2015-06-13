var level = require('level')
var db = level('./sentiment-db')

db.createValueStream().on('data', function (data) {
  console.log(JSON.parse(data))
})
