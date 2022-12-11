const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema( {
	unique_id: Number,
	username: String,
	password: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
}));