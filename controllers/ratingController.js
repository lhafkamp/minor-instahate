const mongoose = require('mongoose')
const User = mongoose.model('User')
const Image = mongoose.model('Image')
const titles = ['newbie', 'not very nice', 'bad person', 'hater', 'friendless', 'troll', 'terrible person', 'sociopath', 'chaotic evil', 'inhuman', 'god of hate']

exports.rating = async (req, res) => {
	const dislikes = await req.session.user[0].dislikes.map(obj => obj.toString())
	const operator = await dislikes.includes(req.params.id) ? '$addToSet' : '$addToSet'

	const user = await User
		.findByIdAndUpdate(req.session.user[0]._id,
		{ [operator]: { dislikes: req.params.id } },
		{ new: true }
	)

	titleUpdate()

	async function titleUpdate() {
		if (user.dislikes.length > 1) {
			const newTitle = await User.findOneAndUpdate({ name: req.session.user[0].name }, 
				{ title: titles[5] }, { new: true }, (err, title) => {
				if (err) throw err

				res.json(title)
				console.log('title updated!');
			})

		} else {
			res.json(user)
		}
	}
}
