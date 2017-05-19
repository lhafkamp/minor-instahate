const mongoose = require('mongoose')
const User = mongoose.model('User')
const Image = mongoose.model('Image')

exports.rating = async (req, res) => {
	const dislikes = req.session.user[0].dislikes.map(obj => obj.toString())
	const operator = dislikes.includes(req.params.id) ? '$pull' : '$addToSet'

	const user = await User
		.findByIdAndUpdate(req.session.user[0]._id,
		{ [operator]: { dislikes: req.params.id } },
		{ new: true }
	)

	res.json(user)
}
