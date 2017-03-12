var mongoose = require('mongoose');

var noticeSchema = new mongoose.Schema({
	//_id: {type: mongoose.Schema.Types.ObjectId}, 	//主键				//ID
	Type : { type:Number, default: 0},	//公告类型： 0普通, 1紧急
	Content : { type:String},			//公告内容
	Author : {type:String},				//公告发布者
	UserId : {type:String},				//公告发布者ID
	UserName : {type:String},			//公告发布者用户名
	Department : {type:String},			//向某个部门发布公告
	AddTime : { type:Date, default:Date.now },		//添加时间
});

noticeSchema.statics.findnotices = function(_where_, _sort_, _skip_, _limit_, callback){
	return this.find(_where_)
			.sort(_sort_)
			.skip(_skip_)
			.limit(_limit_)
			.exec(callback);
};

noticeSchema.statics.findCount = function(_where_, callback){
	return this.count(_where_)
			.exec(callback);
};

noticeSchema.statics.findAll = function(callback){
	return this.find({})
			.sort({})
			.exec(callback);
};

module.exports = noticeSchema;