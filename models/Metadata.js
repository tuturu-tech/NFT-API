const mongoose = require("mongoose");

const MetadataSchema = mongoose.Schema({
	tokenId: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	age: {
		type: String,
	},
	planted: {
		type: Date,
	},
	group: {
		type: Number,
	},
	status: {
		type: String,
	},
});

module.exports = mongoose.model("Metadata", MetadataSchema);
