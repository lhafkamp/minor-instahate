const express = require('express')
const routes = require('./routes/index')
const session = require('express-session')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

const http = require('http').Server(app)
const path = require('path')
const io = require('socket.io')(http)

// get the public files
app.use(express.static(path.join(__dirname, 'public')))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// handle routes
app.use('/', routes);

// run the app
http.listen(4000, () => {
  console.log('running on', `http://localhost:${http.address().port}`)
})
