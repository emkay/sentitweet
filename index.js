require('dotenv').load()

const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || '127.0.0.1'

var server = require('./server')

server.listen(PORT, HOST, function (err) {
  if (err) {
    throw err
  }

  console.log('listening at ', HOST, PORT)
})
