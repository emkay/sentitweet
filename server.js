const url = require('url')
const http = require('http')
const st = require('st')
const mount = st({
  path: __dirname + '/static',
  url: '/static'
})

const shoe = require('shoe')

var gather = require('./gather')

var router = require('routes')()

var sock = shoe(gather)

router.addRoute('/', function (req, res, match) {
  res.end('<!doctype html><html><body style="width: 100%; height: 100%;"><script src="/static/bundle.js"></script></body></html>')
})

function onRequest (req, res) {
  var isStatic = mount(req, res)
  if (isStatic) {
    return
  }

  var path = url.parse(req.url).pathname
  var match = router.match(path)

  if (match) {
    return match.fn(req, res, match)
  }

  res.statusCode = 404
  res.end()
}

var server = http.createServer(onRequest)
sock.install(server, '/data')
module.exports = server
