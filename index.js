require('dotenv').load()

const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || '127.0.0.1'
const GATHER = process.env.GATHER || false

var server = require('./server')
var gather = require('./gather')

server.listen(PORT, HOST, function (err) {
  if (err) {
    throw err
  }

  if (GATHER) {
    gather()
  }
  console.log('listening at ', HOST, PORT)
})
