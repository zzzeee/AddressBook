var mongoose = require('mongoose');

var depSchema = new mongoose.Schema({
	//_id: {type: mongoose.Schema.Types.ObjectId}, 		//主键
    Id : {type: Number},		//ID
	Name : { type:String },		//部门名
	ShowName : { type:String },	//显示名
	AddTime : { type:Date, default:Date.now },		//添加时间
});

depSchema.statics.findDep = function(_where_, _sort_, _skip_, _limit_, callback){
	return this.find(_where_)
			.sort(_sort_)
			.skip(_skip_)
			.limit(_limit_)
			.exec(callback);
};

depSchema.statics.findCount = function(_where_, callback){
	return this.count(_where_)
			.exec(callback);
};

depSchema.statics.findAll = function(callback){
	return this.find({})
			.sort({})
			.exec(callback);
};

module.exports = depSchema;