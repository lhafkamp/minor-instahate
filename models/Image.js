const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const imageSchema = new Schema ({
	image: String,
})

module.exports = mongoose.model('Image', imageSchema)
