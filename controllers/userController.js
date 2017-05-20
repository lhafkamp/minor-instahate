const mongoose = require('mongoose')
const User = mongoose.model('User')
const request = require('request')
require('dotenv').config()

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
	}, (err, response, body) => {
		if (err) {
			console.error('auth error, everything sucks')
		} else {
			data = JSON.parse(body)
			
			const userId = data.user.id
			const userName = data.user.full_name
			const token = data.access_token

			req.session.userId = userId
			req.session.userName = userName
			req.session.token = token

			User.find({ user_id: userId }, (err, user) => {
				if (user.length > 0) {
					console.log('user found, carry on')
				} else {
					console.log('user NOT found, creating new user..')
					const newUser = new User({
						user_id: userId,
						name: userName,
						title: 'newbie'
					})

					newUser.save((err) => {
						if (err) throw err
						console.log('new user saved succesfully!')
					})
				}

				req.session.user = user
				res.redirect('main')
			})
		}
	})
}
