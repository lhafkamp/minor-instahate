const mongoose = require('mongoose')
const Image = mongoose.model('Image')
const request = require('request')

exports.mainPage = (req, res) => {
	Image.find({}, (err, images) => {
		let imageArray = []

		images.forEach(obj => {
			imageArray.push(obj.image)
		})

		res.render('main', {
			userName: req.session.userName,
			images: imageArray
		})
	})

	const io = req.app.get('io')
	
	io.on('connection', socket => {
		console.log('socket connected!')
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

					io.sockets.emit('newPic', img)
				}
			})
		})
	}, 6000)
}
