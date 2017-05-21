const mongoose = require('mongoose')
const Image = mongoose.model('Image')
const User = mongoose.model('User')
const request = require('request')
const titles = ['newbie', 'not very nice', 'bad person', 'hater', 'friendless', 'troll', 'terrible person', 'sociopath', 'chaotic evil', 'inhuman', 'god of hate']

exports.mainPage = (req, res) => {
	const imageArray = []
	const dislikes = []

	// find all images to display on start
	Image.find({}, (err, images) => {
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

	// get a socket connection
	// const io = req.app.get('io')
	// io.on('connection', (socket) => {
	// 	socket.on('title', (rank) => {
	// 		let oldRank
	// 		const newRank = titles[rank]

	// 		function newTitle() {
	// 			if (newRank === oldRank) {
	// 				console.log('same rank!')
	// 			} else {
	// 				console.log('new title!')
	// 				socket.emit('titleUpdate', (titles[rank]))
	// 			}
	// 		}

	// 		console.log(req.session.userName)

	// 		User.findOneAndUpdate({ name: req.session.user[0].name }, 
	// 			{ title: titles[rank] }, { upsert: true }, (err, user) => {
	// 			if (err) throw err
	// 			oldRank = user.title
	// 			newTitle()
	// 		})
	// 	})
	// })

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
