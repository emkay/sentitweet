var domready = require('domready')
var shoe = require('shoe')
var through = require('through')
var Observable = require('observ')

domready(function () {
  console.log('hello')
  var body = document.querySelector('body')
  var stream = shoe('/data')
  var value = Observable(0)

  // TODO: make these observ or observ-struct
  var red = 50
  var green = 50
  var blue = 50

  body.style.backgroundColor = 'rgb(50, 50, 50)'
  value(function onchange (v) {
    var c = v * 3
    if (c > 0) {
      if (green + c > 255) {
        green = 255
      } else {
        green += c

        if ((red - c) > 0) {
          red -= c
        }
      }
    } else {
      if ((red + c * -1) > 255) {
        red = 255
      } else {
        red += c * -1

        if ((green + c) > 0) {
          green += c
        }
      }
    }

    console.log('changing', red, green, blue)
    body.style.backgroundColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')'
  })

  stream.pipe(through(function (data) {
    value.set(Number(value()) + Number(data))
    this.queue(data)
  })).pipe(stream)
})
