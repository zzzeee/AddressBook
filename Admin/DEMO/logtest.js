var mongoose = require('mongoose');
var Log = require('./aModel');

var newLog = new Log({
	log : 'i am a test message!',
	type : 3,
});

var where_str = {
	type : 3
};

var update_str = {
	log : '666',
};

//调用静态方法
// Log.findlog(function(err, res){
// 	console.log(err);
// 	console.log(res);
// });

//添加
// newLog.save(function(err, res){
// 	console.log(err);
// 	console.log(res);
// });

//查找所有
Log.find({}, function(err, res){
	console.log(err);
	console.log(res);
});

//查找条件 等于 = 
// Log.find({type: 1}, function(err, res){
// 	console.log(err);
// 	console.log(res);
// });

//查找条件 大于 > 
// Log.find({type: {$gte : 1}}, function(err, res){
// 	console.log(err);
// 	console.log(res);
// });

//查找多个条件的 (UserName = user OR Moble = user) AND Pwd = pwd
// Log.findOne({
	// $or : [
		// {
			// UserName : user,
			// Pwd : pwd
		// },
		// {
			// Moble : user,
			// Pwd : pwd
		// },
	// ]
// }, function(err, res){
	// if(!err)
	// {
		// res.json(result);
	// }
// });

//查找单个 
// Log.findOne({type: 1}, function(err, res){
// 	console.log(err);
// 	console.log(res);
// });

//更新
// Log.update(where_str, update_str, function(err, res) {
// 	console.log(err);
// 	console.log(res);
// });

//删除
// Log.remove(where_str, function(err, res) {
// 	console.log(err);
// 	console.log(res);
// });

