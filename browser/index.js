var domready = require('domready')
var shoe = require('shoe')
var through = require('through')

domready(function () {
  console.log('hello')
  var stream = shoe('/data')

  stream.pipe(through(function (data) {
    console.log(data)
    this.queue(data)
  })).pipe(stream)
})
