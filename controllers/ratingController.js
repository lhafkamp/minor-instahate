const mongoose = require('mongoose')
const User = mongoose.model('User')
const Image = mongoose.model('Image')
let userId

exports.rating = async (req, res) => {
	const dislikes = []

	// find the current user
	await User.find({ user_id: req.session.userId }, async (err, user) => {
		userId = user[0]._id
		await user[0].dislikes.forEach((obj) => {
			dislikes.push(`${obj}`)
		})
	})

	const operator = dislikes.includes(req.params.id) ? '$pull' : '$addToSet'
	const user = await User
		.findByIdAndUpdate(userId,
			{ [operator]: { dislikes: req.params.id } },
			{ new: true }
		)
	
	res.json(user)

	// const userDislikes = []
	// let dislikeCount = 0

	// flatten all arrays and push every object into 1 array
	// await User.find({}, (err, users) => {
	// 	users.forEach((user) => {
	// 		user.dislikes.forEach(dislike => {
	// 			userDislikes.push(`${dislike}`)
	// 		})
	// 	})
	// })

	// await User.find({}, (err, users) => {
	// 	users.forEach((user) => {
	// 		console.log('==========')
	// 		user.dislikes.forEach(dislike => {
	// 			console.log(dislike);
	// 		})
	// 	})
	// })

	// count every dislike for 'this' image
	// await userDislikes.forEach((img) => {
	// 	if (img === req.params.id) {
	// 		dislikeCount++
	// 	}
	// })

	// console.log(dislikeCount);
}
