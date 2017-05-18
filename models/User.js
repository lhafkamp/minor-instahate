const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const userSchema = new Schema({
	user_id: String,
	name: String,
	dislikes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Image',
		}
	]
})

module.exports = mongoose.model('User', userSchema)
