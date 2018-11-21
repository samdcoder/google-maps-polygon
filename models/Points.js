const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId,  ref: 'Id'},
	points: [{'lat': Number, 'long': Number}]
	}, 
	{timestamps: true}
);

module.exports = mongoose.model('Points', pointsSchema);

