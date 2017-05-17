const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
// const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')

require('./models/User')
const routes = require('./routes/index')

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

// connect to the database
mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
  console.error('mongoose is not connecting');
})

// store data from request to request
app.use(session({
	secret: process.env.SES_SECRET,
	key: process.env.SES_KEY,
	resave: false,
	saveUninitialized: false
}))

// handle routes
app.use('/', routes)

// run the app
http.listen(4000, () => {
  console.log('running on', `http://localhost:${http.address().port}`)
})
