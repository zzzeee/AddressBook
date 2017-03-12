var mongoose = require('mongoose');

var aSchema = new mongoose.Schema({
	type: {
		type: Number,
		default: 1,
	},
	log: String,
	time: {
		type : Date,
		default : Date.now()
	},
});

aSchema.statics.findLog = function(_where_, _sort_, _skip_, _limit_, callback){
	return this.find(_where_)
			.sort(_sort_)
			.skip(_skip_)
			.limit(_limit_)
			.exec(callback);
};

aSchema.statics.findCount = function(_where_, callback){
	return this.count(_where_)
			.exec(callback);
};

aSchema.statics.findAll = function(callback){
	return this.find({})
			.sort({type:-1,time:-1})
			.exec(callback);
};

module.exports = aSchema;