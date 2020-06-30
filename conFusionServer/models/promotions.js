const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionsSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		image: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			default: '',
		},
		price: {
			type: Currency,
			required: true,
			min: 0,
		},
		description: {
			type: String,
			required: true,
		},
		featured: {
			type: Boolean,
			required: false,
		},
	},
	{ timestamps: true }
);

const Promotions = mongoose.model('Promotion', promotionsSchema);

module.exports = Promotions;