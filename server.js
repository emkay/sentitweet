const url = require('url')
const http = require('http')
const response = require('response')
const st = require('st')
const mount = st({
  path: __dirname + '/static',
  url: '/static'
})

var dbUtils = require('./db-utils')

var router = require('routes')()

router.addRoute('/data/', function (req, res, match) {
  var ds = dbUtils.valueStream()
  var total = []

  ds.on('data', function (data) {
    var results = JSON.parse(data)
    total.push(results)
  })

  ds.on('end', function () {
    response.json(total).pipe(res)
  })
})

router.addRoute('/', function (req, res, match) {
  res.end('<!doctype html><html><body><script src="/static/bundle.js"></script></body></html>')
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
module.exports = server
