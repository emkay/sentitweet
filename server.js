const url = require('url')
const http = require('http')
const st = require('st')
const mount = st({
  path: __dirname + '/static',
  url: '/static'
})

const shoe = require('shoe')

var dbUtils = require('./db-utils')

var router = require('routes')()

var sock = shoe(function (stream) {
  var ds = dbUtils.valueStream()
  ds.on('data', function (data) {
    stream.write(data)
  })

  ds.on('end', function () {

  })
})

router.addRoute('/', function (req, res, match) {
  res.end('<!doctype html><html><body><div id="results"></div><script src="/static/bundle.js"></script></body></html>')
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
