const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const userSchema = new Schema ({
	name: String
})

module.exports = mongoose.model('User', userSchema)
