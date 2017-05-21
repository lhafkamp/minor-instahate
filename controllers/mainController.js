const mongoose = require('mongoose')
const Image = mongoose.model('Image')
const User = mongoose.model('User')
const request = require('request')

exports.mainPage = (req, res) => {
	const io = req.app.get('io')
	const imageArray = []
	const dislikes = []

	// find all images to display on start and save them in a global variable for titles later
	Image.find({}, (err, images) => {
		global.imageCount = images.length
		images.forEach((obj) => {
			imageArray.push(obj)
		})
		console.log('1. main')

		// find a dislike list to see which image has been rated already
		User.find({ user_id: req.session.userId }, (err, user) => {
			req.session.user = user

			user[0].dislikes.forEach((dislike) => {
				dislikes.push(dislike.toString())
			})
			console.log('2. main')

			// render page
			res.render('main', {
				userName: req.session.userName,
				title: user[0].title,
				images: imageArray,
				dislikes: dislikes
			})
			console.log('3. main')
		})
	})

	setInterval(() => {
		request(`https://api.instagram.com/v1/users/${req.session.userId}/media/recent/?access_token=${req.session.token}`, (err, response, body) => {
			data = JSON.parse(body)
			imageData = data.data[0].images.low_resolution.url

			Image.find({ image: imageData }, (err, image) => {
				if (!image.length > 0) {
					const img = new Image({
						image: imageData
					})

					img.save(err => {
						if (err) throw err
						console.log('new image saved succesfully!')
					})

					// get the img and dislikes to send to the client
					const obj = {
						img: img,
						dislikes: dislikes
					}

					io.sockets.emit('newPic', obj)
				}
			})
		})
	}, 4000)
}
