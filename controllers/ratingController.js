const mongoose = require('mongoose')
const User = mongoose.model('User')
const Image = mongoose.model('Image')
const titles = ['newbie', 'not very nice', 'bad person', 'hater', 'friendless', 'troll', 'terrible person', 'sociopath', 'chaotic evil', 'inhuman', 'god of hate']

exports.rating = async (req, res) => {
	const dislikes = await req.session.user[0].dislikes.map(obj => obj.toString())
	const operator = await dislikes.includes(req.params.id) ? '$addToSet' : '$addToSet'

	// update the dislikes with the current clicked one
	const user = await User
		.findByIdAndUpdate(req.session.user[0]._id,
		{ [operator]: { dislikes: req.params.id } },
		{ new: true }
	)

	// TODOOOO
	// oldRank = user.title
	// newRank = title.title

	// get a percentage for the title
	const rank = Math.round(user.dislikes.length / imageCount * 10)

	// update if ranked up
	titleUpdate()

	async function titleUpdate() {
		if (user.dislikes.length > 1) {
			const newTitle = await User.findOneAndUpdate({ name: req.session.user[0].name }, 
				{ title: titles[rank] }, { new: true }, (err, title) => {
				if (err) throw err

				res.json(title)
				console.log('title updated!')
			})
		} else {
			res.json(user)
		}
	}
}
