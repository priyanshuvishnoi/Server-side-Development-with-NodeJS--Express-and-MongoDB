const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favouriteSchema = new Schema(
	{
		dishes: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Dish,
		},
		users: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true, usePushEach: true }
);

const Favourite = mongoose.model('favourite', favouriteSchema);

module.exports = Favourite;
