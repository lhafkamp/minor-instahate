const mongoose = require('mongoose')
// const User = mongoose.model('User')
const request = require('request')
require('dotenv').config()

// env vars
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI

exports.homePage = (req, res) => {
	const auth_url = `https://api.instagram.com/oauth/authorize/?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=basic+public_content`
	res.render('index', {
		auth_url
	})
}

exports.authSucces = (req, res) => {
	request.post({
		uri: 'https://api.instagram.com/oauth/access_token',
		form: {
			client_id: client_id,
			client_secret: client_secret,
			grant_type: 'authorization_code',
			redirect_uri: redirect_uri,
			code: req.query.code
		}
	}, (error, response, body) => {
		if (error) {
			console.error('auth error, everything sucks')
		} else {
			data = JSON.parse(body)

			req.session.user = data.user.id
			req.session.userName = data.user.full_name
			req.session.token = data.access_token

			res.redirect('main')
		}
	})
}

exports.mainPage = (req, res) => {
	res.render('main', {
		userName: req.session.userName
	})
}
