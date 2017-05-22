const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

// require models
require('./models/User')
require('./models/Image')

// require routes
const routes = require('./routes/index')

// set up express
const app = express()

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
	console.error('mongoose is not connecting')
})

// store data from request to request
app.use(session({
	secret: process.env.SES_SECRET,
	key: process.env.SES_KEY,
	resave: false,
	saveUninitialized: false,
}))

// socketio setup
const http = require('http').Server(app)
const io = require('socket.io')(http)
app.set('io', io)

const connections = []

io.on('connection', (socket) => {
	global.socket = socket

	connections.push(socket)
	console.log('Connected: %s sockets', connections.length)

	socket.on('disconnect', () => {
		connections.splice(connections.indexOf(socket), 1)
		console.log('Disconnected: %s sockets', connections.length)
	})
})

// handle routes
app.use('/', routes)

// run the app
http.listen(4000, () => {
	console.log('listening on', http.address().port)
})
