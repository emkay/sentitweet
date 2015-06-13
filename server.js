const http = require('http')
const st = require('st')
const mount = st({
  path: __dirname + '/static',
  url: '/static'
})

function onRequest (req, res) {
  var isStatic = mount(req, res)
  if (isStatic) return
  res.end('<!doctype html><html><body><script src="/static/bundle.js"></script></body></html>')
}

var server = http.createServer(onRequest)
module.exports = server
