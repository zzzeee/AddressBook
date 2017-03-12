var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Log = require('./aModel');

app.use('/public', express.static('bower_components'));
app.use('/src', express.static('../src'));

//设置跨域访问
// app.all('*', function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");
    // next();
// });

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/index', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//用户列表
app.get('/user_list', function(req, res) {
	res.sendFile(__dirname + '/userList.html');
});

app.get('/queryUserList', function(req, res) {
	var where = {};
	var result = {
		rows : null,
		total : null,
	};

	Log.findLog(where, {}, 0, 10, function(err, ret_data){
		// console.log(err);
		// console.log(res2);
		if(!err)
		{
			result.rows = ret_data;
			if(result.total !== null)
			{
				res.json(result);
			}
		}
	});

	Log.findCount(where, function(err, ret_count){
		if(!err)
		{
			result.total = ret_count;

			if(result.rows !== null)
			{
				res.json(result);
			}
		}
	});
});

//验证用户登录
app.get('/check_user_login', function (req, res) {
	var user = req.query.user;
	var pwd = req.query.pwd;
	
	if(user && pwd)
	{
		Log.findOne({
			$or : [
				{
					UserName : user,
					Pwd : pwd
				},
				{
					Moble : user,
					Pwd : pwd
				},
			]
		}, function(err, result){
			if(!err)
			{
				//res.send(result);
				if(result)
				{
					res.send(result);
				}
				else
				{
					res.send({
						err : 1,
						msg : '帐号/密码不正确'
					})
				}
			}
		});
	}
	else
	{
		res.send({});
	}
});

//获取所有部门
app.get('/allDepartments', function(req, res) {
	res.send([
		{
			id : 1,
			name : '总裁',
		},
		{
			id : 2,
			name : '技术',
		},
		{
			id : 3,
			name : '销售',
		},
	]);
});

//获取单个部门的所有员工
app.get('/getDepartments', function(req, res) {
	var id = req.query.id;
	var name = req.query.name;

	Log.find({
		Department : name,
	}, function(err, result){
		if(!err)
		{
			res.send(result ? result : []);
		}
		else
		{
			res.send([]);
		}
	});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});