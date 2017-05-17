const mongoose = require('mongoose')
const Image = mongoose.model('Image')
const User = mongoose.model('User')
const request = require('request')

exports.mainPage = async (req, res) => {
	let imageArray = []
	let dislikes = []
	
	// find all images to display on start
	await Image.find({}, (err, images) => {
		images.forEach(obj => {
			imageArray.push(obj)
		})
	})

	// find a dislike list to see which image has been rated already
	await User.find({ user_id: req.session.userId }, (err, user) => {
		user[0].dislikes.forEach(dislike => {
			dislikes.push(dislike.toString())
		})
	})

	res.render('main', {
		userName: req.session.userName,
		images: imageArray,
		dislikes: dislikes
	})

	const io = req.app.get('io')
	
	io.on('connection', socket => {
		console.log('socket connected!')
	})
	
	// setInterval(() => {
	// 	request(`https://api.instagram.com/v1/users/${req.session.userId}/media/recent/?access_token=${req.session.token}`, (err, response, body) => {
	// 		data = JSON.parse(body)
	// 		imageData = data.data[0].images.low_resolution.url

	// 		Image.find({ image: imageData }, (err, image) => {
	// 			if (!image.length > 0) {
	// 				const img = new Image({
	// 					image: imageData
	// 				})

	// 				img.save(err => {
	// 					if (err) throw err
	// 					console.log('new image saved succesfully!')
	// 				})

	// 				io.sockets.emit('newPic', img)
	// 			}
	// 		})
	// 	})
	// }, 4000)
}
