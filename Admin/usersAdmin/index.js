var express = require('express');
var app = express();
var router = express.Router();
var fs = require("fs");
// var formidable = require('formidable');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Users = require('./Model/usersModel');
var Departments = require('./Model/departmentModel');
var Notices = require('./Model/noticeModel');
var md5 = require('js-md5');
var Util = require('../src/js/util');
var _PWD_ = md5('123456');	//重置后的密码
var ADMIN_PWD = 'JINGTAO';
var error_str = '数据库查询出错，请联系管理员。';
var LEVEL = [1, 2, 3, 4, 5, 6, 7, 8, 9];

//app.use('/public', express.static('bower_components'));
app.use('/src', express.static('../src'));
app.use('/images', express.static('./userHeadImage'));
//app.use(bodyParser.urlencoded({ 'limit': '10000kb'}));

// create application/json parser
//var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ 
	extended: false ,
	limit: '3072kb',
});

//默认页面
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/login.html');
});

//登录页面
app.get('/login', function(req, res) {
	res.sendFile(__dirname + '/login.html');
});

//管理员后台登录验证
app.get('/admin_login_check', function(req, res) {
	var password = req.query.password || '';
	if(password && password.toUpperCase() == ADMIN_PWD)
	{
		res.send({ret : true});
	}else{
		res.send({ret : false});
	}
});

//用户列表页面
app.get('/user_list', function(req, res) {
	res.sendFile(__dirname + '/userList.html');
});

//部门列表页面
app.get('/department_list', function(req, res) {
	res.sendFile(__dirname + '/departmentList.html');
});

//公告列表页面
app.get('/notice_list', function(req, res) {
	res.sendFile(__dirname + '/noticeList.html');
});

//添加用户页面
app.get('/userAdd', function(req, res) {
	res.sendFile(__dirname + '/userAdd.html');
});

//编辑用户页面
app.get('/userEdit', function(req, res) {
	res.sendFile(__dirname + '/userAdd.html');
});

//
var addUserReturn = function(from, type, str) {
	if(from == 'app')
	{
		return ({err : type, msg : str});
	}
	else
	{
		return ('<h1 style="text-align: center">' + str + '</h1>');
	}
};

app.post('/uploadimgtest', urlencodedParser, function(req, res) {
	console.log(req.body);
	console.log(req.files);
	console.log(req.file);
});

//添加/更新员工信息
app.post('/saveUserInfo', urlencodedParser, function(req, res) {
	var Type = req.body.type || 'add';
	var From = req.body.from || '';
	var uid = req.body.uid || null;
	var Name = req.body.realName || '';
	var userName = req.body.userName || '';
	var Department = req.body.userDepartment || '';
	var Position = req.body.userPosition || '';
	var Level = req.body.userLevel || 1;
	var Mobile = req.body.userMobile || '';
	var Email = req.body.userEmail || '';
	var Address = req.body.userAddress || '';
	var Explain = req.body.userExplain || '';
	var Birthday = req.body.userBirthday || '';
	var EntryTime = req.body.userEntryTime || '';
	Birthday = Birthday.substring(0, 10);
	EntryTime = EntryTime.substring(0, 10);
	//console.log(req.body);
	var imageType = req.body.imageType || '';
	var imageData = req.body.imageData || '';

	//本来想写一个函数判断的，但res.send是异步的，麻烦
	if(Type != 'edit' && From != 'app')
	{
		if(!Name || Name == ''){
			res.send(addUserReturn(From, 1, '姓名不能为空'));
			return false;
		}else {
			Name = Util.trim(Name);
		}
	}

	if(Type != 'edit' && From != 'app')
	{
		if(!userName || userName == ''){
			res.send(addUserReturn(From, 1, '用户名不能为空'));
			return false;
		}else {
			userName = Util.trim(userName);
		}
	}

	if(Type != 'edit' && From != 'app')
	{
		if(!Department || Department == '0' || Department == ''){
			res.send(addUserReturn(From, 1, '部门不能为空'));
			return false;
		}else {
			Department = Util.trim(Department);
		}
	}

	
	if(!Position || Position == ''){
		res.send(addUserReturn(From, 1, '职业不能为空'));
		return false;
	}else {
		Position = Util.trim(Position);
	}

	if(!Mobile || Mobile == '')
	{
		res.send(addUserReturn(From, 1, '手机号码不能为空'));
		return false;
	}
	else if(/^1[34578]\d{9}$/.test(Util.trim(Mobile))) {
		Mobile = Util.trim(Mobile);
	}else {
		res.send(addUserReturn(From, 1, '手机号码格式不正确'));
		return false;
	}

	if(Type == 'edit')
	{
		if(!uid || uid == '0' || uid == ''){
			res.send(addUserReturn(From, 1, '没传用户ID参数'));
			return false;
		}

		Users.findOne({
			Mobile : Mobile,
			UserName : {$ne : userName},
		}, function(error2, result2){
			
			if(result2)
			{
				res.send(addUserReturn(From, 1, '手机已被占用'));
				return false;
			}
			else
			{
				var obj = From == 'app' ? 
				{
					Position : Position,
					Mobile : Mobile,
					Email : Email,
					Address : Address,
					Birthday : Birthday,
					Explain : Explain,
				} : {
					Name : Name,
					Department : Department,
					Position : Position,
					Level : Level,
					Mobile : Mobile,
					Email : Email,
					Address : Address,
					Birthday : Birthday,
					EntryTime : EntryTime,
					IsAddUser : req.body.IsAddUser ? true : false,
					IsSendNotice : req.body.IsSendNotice ? true : false,
				};

				if(From == 'app' && imageType && imageData)
				{
					var imgMsg = '';
					var dataBuffer = new Buffer(imageData, 'base64');
					var fileMuLv = __dirname + '/userHeadImage/';
					var imgname = new Date().getTime();
					switch(imageType){
						case 'image/jpeg' :
							imageType = 'jpg';
							break;
						case 'image/png' :
							imageType = 'png';
							break;
						case 'image/gif' : 
							imageType = 'gif';
							break;
						case 'image/bmp' : 
							imageType = 'bmp';
							break;
					}

					//fs.writeFile(fileMuLv + imgname + '.' + 'txt', imageData, function(err){});

					imgname = imgname + '.' + imageType;
					fs.exists(fileMuLv, function (exists) {
						if(!exists)
						{
							fs.mkdir(fileMuLv, 777, function (mkdirerr) {
								if(!mkdirerr)
								{
									fs.writeFile(fileMuLv + imgname, dataBuffer, {encoding : 'utf-8'}, function(imgerr) {
										if(imgerr){
											console.log(imgerr);
											imgMsg = ',图片保存失败';
										}else{
											obj.HeadImg = imgname;
										}
										Users.findByIdAndUpdate(uid, {$set : obj}, function(error, result) {
											if(error){
												res.send(error);
											}else{
												if(From == 'app'){
													if(result){
														res.send({err : 0, msg : '修改成功' + imgMsg});
													}else{
														res.send({err : 1, msg : '修改失败'});
													}
												}else{
													res.redirect('/user_list');
												}
											}
										});
									});
								}
							});
						}
						else
						{
							fs.writeFile(fileMuLv + imgname, dataBuffer, {encoding : 'utf-8'}, function(imgerr) {
								if(imgerr){
									console.log(imgerr);
									imgMsg = ',图片保存失败';
								}else{
									obj.HeadImg = imgname;
								}
								Users.findByIdAndUpdate(uid, {$set : obj}, function(error, result) {
									if(error){
										res.send(error);
									}else{
										if(From == 'app'){
											if(result){
												res.send({err : 0, msg : '修改成功' + imgMsg});
											}else{
												res.send({err : 1, msg : '修改失败'});
											}
										}else{
											res.redirect('/user_list');
										}
									}
								});
							});
						}
					});
				}
				else
				{
					Users.findByIdAndUpdate(uid, {$set : obj}, function(error, result) {
						if(error){
							res.send(error);
						}else{
							if(From == 'app'){
								if(result){
									res.send({err : 0, msg : '修改成功' + imgMsg});
								}else{
									res.send({err : 1, msg : '修改失败'});
								}
							}else{
								res.redirect('/user_list');
							}
						}
					});
				}				
			}
		});
		
	}
	else
	{
		var newUser = new Users({
			Name : Name,
			UserName : userName,
			Department : Department,
			Position : Position,
			Level : Level,
			Mobile : Mobile,
			Email : Email,
			Address : Address,
			Birthday : Birthday,
			EntryTime : EntryTime,
			IsAddUser : req.body.IsAddUser ? true : false,
			IsSendNotice : req.body.IsSendNotice ? true : false,
		});
		
		Users.findOne({$or : [{
			UserName : userName
		}, {
			Mobile : Mobile
		}]}, function(error, result){
			if(error){
				res.send(error);
			}else{
				if(result){
					res.send(addUserReturn(From, 1, '用户名或手机已被占用'));
					return false;
				}else{
					newUser.save(function(error, result2) {
						if(error){
							res.send(error);
						}else{
							//console.log(result2);
							if(From == 'app'){
								res.send({
									err : result2 ? 0 : 1,
									msg : result2 ? '添加成功' : '添加失败'
								});
							}else{
								res.redirect('/user_list');
							}
						}
					});
				}
			}
		});
	}
});

//添加公告
app.post('/addNotice', urlencodedParser, function(req, res) {
	var type = req.body.type || 0;
	var name = req.body.name || '';
	var username = req.body.username || '';
	var department = req.body.department || '';
	var content = req.body.content || '';
	var uid = req.body.uid || '';

	if(name && username && content && uid && department)
	{
		var newNotice = new Notices({
			Type : type == 1 ? 1 : 0,
			Content : content,
			Author : name,
			UserId : uid,
			UserName : username,
			Department : department
		});

		newNotice.save(function(error, result) {
			if(!error){
				if(result){
					res.send({err : 0, msg : '发布成功'});
				}else{
					res.send({err : 1, msg : '发布失败'});
				}
			}else{
				res.send({err : 2, msg : '存储数据错误'});
			}
		});
	}
	else
	{
		res.send({err : 3, msg : '参数不全'});
	}
});

//删除员工信息
app.get('/delUserInfo', function(req, res) {
	var user = req.query.username || '';
	if(user){
		Users.update({UserName : user, IsJob : true}, {$set : {
			IsJob : false
		}}, function(error, result) {
			if(error){
				res.send({
					err : 1,
					msg : error,
				});
			}else{
				res.send({
					err : 0,
					msg : '删除成功',
				});
			}
		});
	}else{
		res.send({
			err : 2,
			msg : '参数为空',
		});
	}
});

//重置员工登录密码
app.get('/reductionUserPwd', function(req, res) {
	var user = req.query.username || '';

	if(user){
		Users.update({UserName : user}, {$set : {
			Pwd : _PWD_
		}}, function(error, result) {
			if(error){
				res.send({
					err : 1,
					msg : error,
				});
			}else{
				res.send({
					err : 0,
					msg : '重置成功',
				});
			}
		});
	}else{
		res.send({
			err : 2,
			msg : '参数为空',
		});
	}
});

//修改员工登录密码
app.get('/changeUserPwd', function(req, res) {
	var user = req.query.username || '';
	var pwd = req.query.userpwd || '';
	var npwd = req.query.usernewpwd || '';

	if(user && pwd && npwd){
		pwd = md5(pwd);
		npwd = md5(npwd);

		Users.update({
			UserName : user,
			Pwd : pwd
		}, {$set : {
			Pwd : npwd
		}}, function(error, result) {
			if(error){
				res.send({err : 1, msg : error});
			}else{
				if(result && result.ok && result.n){
					res.send({err : 0, msg : '修改成功'});
				}else{
					res.send({err : 2, msg : '旧密码错误'});
				}
				
			}
		});
	}else{
		res.send({err : 3, msg : '参数为空',});
	}
});

//获取 部门，等级[，个人] 等信息
app.get('/getBasicInfo', function(req, res) {
	var action = req.query.action || '';
	if(action == 'add' || action == 'edit')
	{
		var result = {};
		var uid = req.query.uid || '';
		result.lev = LEVEL;
		
		Departments.find({}, function(error, deps) {
			if(error){
				res.send(err);
			}else{
				result.dep = deps;
				if(action == 'edit' && uid)
				{
					Users.findById(uid , function(err, user){
						if(err)
						{
							res.send(err);
						}
						else
						{
							result.uinfo = user;
							res.send(result);
						}
					});
				}else
				{
					res.send(result);
				}
			}
		});
	}
	else
	{
		res.sendStatus(404);
	}
});

//用户列表页面 - 查询结果
app.get('/queryUserList', function(req, res) { 
	//{Name : {$regex : Util.trim(req.query.search)}}
	var search = req.query.search ? JSON.parse(req.query.search) : {};
	var sort = req.query.sort ? req.query.sort : 'AddTime';
	var order = (req.query.order && req.query.order.toUpperCase()) == 'DESC' ? -1 : 1;
	var offset = req.query.offset ? parseInt(req.query.offset) : 0;
	var limit = req.query.limit ? parseInt(req.query.limit) : 0;
	var sortObj = JSON.parse('{"' + sort + '":' + order + '}');
	var isRegExp = req.query.RegExp ? true : false;
	search = Object.assign(search, {IsJob : true});
	
	//正则匹配，支持3级嵌套
	if(isRegExp && typeof(search) == 'object')
	{
		for(var i in search)
		{
			if(typeof(search[i]) == 'object')
			{
				for(var i2 in search[i])
				{
					if(i2 == '$regex')
					{
						search[i][i2] = new RegExp(search[i][i2], "i");
					}
					else
					{
						if(typeof(search[i][i2]) == 'object')
						{
							for(var i3 in search[i][i2])
							{
								if(i3 == '$regex')
								{
									search[i][i2][i3] = new RegExp(search[i][i2][i3], "i");
								}
								else
								{
									if(typeof(search[i][i2][i3]) == 'object')
									{
										for(var i4 in search[i][i2][i3])
										{
											if(i4 == '$regex')
											{
												search[i][i2][i3][i4] = new RegExp(search[i][i2][i3][i4], "i");
											}
											else
											{
												if(typeof(search[i][i2][i3][i4]) == 'object')
												{
													for(var i5 in search[i][i2][i3][i4])
													{
														if(i5 == '$regex')
														{
															search[i][i2][i3][i4][i5] = new RegExp(search[i][i2][i3][i4][i5], "i");
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	var result = {
		rows : null,
		total : null,
		error : null,
	};

	Users.findLog(search, sortObj, offset, limit, function(err, ret_data){
		if(!err)
		{
			result.rows = ret_data;
			
			Users.findCount(search, function(err, ret_count){
				if(!err)
				{
					result.total = ret_count;
					res.send(result);
				}
				else{
					console.log(err);
					result.error = error_str;
					res.send(result);
				}
			});
		}
		else{
			console.log(err);
			result.error = error_str;
			res.send(result);
		}
	});
});

//验证用户登录
app.post('/check_user_login', urlencodedParser, function (req, res) {
	var user = req.body.user;
	var pwd = req.body.pwd;
	pwd = md5(pwd);

	if(user && pwd)
	{
		var obj = {
			$or : [
				{
					UserName : user,
					Pwd : pwd
				},
				{
					Mobile : user,
					Pwd : pwd
				},
			]
		};
		
		Users.findOne(obj, function(err, result){
			if(!err)
			{
				if(result)
				{
					res.send(result);
				}
				else
				{
					res.send({
						err : 1,
						msg : 'error: 帐号或密码不正确'
					});
				}
			}
		});
	}
	else
	{
		res.send({
			err : 2,
			msg : 'error: 帐号或密码为空'
		});
	}
});

//获取所有部门
app.get('/allDepartments', function(req, res) {
	Departments.find({}, function(error, deps) {
		if(error){
			res.send(error);
		}else{
			res.send(deps);
		}
	});
});

//添加部门
app.get('/addDepartment', function(req, res) {
	var name = req.query.depname || '';
	var showname = req.query.depshowname || '';

	if(name != '' && showname != '')
	{
		var newDepartment = new Departments({
			Name : name,
			ShowName : showname,
		});

		Departments.findOne({Name : name}, function(error, dep) {
			if(error){
				res.send({err : error});
			}else{
				if(dep)
				{
					res.send({err : '该部门已经存在'});
				}
				else
				{
					newDepartment.save(function(error, deps) {
						if(error){
							res.send(error);
						}else{
							res.send(deps);
						}
					});
				}
			}
		});
	}
	else
	{
		res.sendStatus(404);
	}
});

//删除部门
app.get('/delDepartment', function(req, res) {
	var name = req.query.name || '';

	if(name)
	{
		Users.findCount({Department : name}, function(error, count) {
			if(error)
			{
				res.send({msg : error, ok : 0});
			}
			else if(count)
			{
				res.send({
					msg : '该部门还有' + count + '个员工，不能删除',
					ok : 0
				});
			}
			else
			{
				Departments.remove({Name : name}, function(error, result) {
					if(error){
						res.send({msg : error, ok : 0});
					}else{
						res.send(result);
					}
				});
			}
		});
	}
	else
	{
		res.sendStatus(404);
	}
});

//搜索公告列表
app.get('/getNotices', function(req, res) {
	var text = req.query.text || null;
	var search = {};
	if(text)
	{
		text = Util.trim(text);
		search = {
			$or : [
				{UserName : {$regex : new RegExp(text,"i")}},
				{Author : {$regex : new RegExp(text,"i")}},
				{Department : {$regex : new RegExp(text,"i")}},
			]
		};
	}
	
	Notices.find(search, function(error, result) {
		if(error){
			res.send(error);
		}else{
			res.send(result);
		}
	}).sort({AddTime : -1});
});

//获取所有发布者的公告
app.get('/getNoticesByUserId', function(req, res) {
	var uid = req.query.uid || null;

	if(uid)
	{
		Notices.find({UserId : uid}, function(error, result) {
			if(error){
				res.send(error);
			}else{
				res.send(result);
			}
		}).sort({AddTime : -1});
	}
});

//获取单个部门的所有员工
app.get('/getDepartments', function(req, res) {
	var id = req.query.id;
	var name = req.query.name;

	Users.find({
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

//添加或取消关注
app.get('/followToggle', function(req, res) {
	var uid = req.query.uid || '';
	var fid = req.query.fid || '';
	var isFollow = req.query.isFollow || 0;
	
	if(uid && fid)
	{
		if(isFollow)
		{
			Users.findByIdAndUpdate(fid, {'$pull' : {'Fans' : uid}}, function(error, result) {
				if(!error && result) {
					Users.findByIdAndUpdate(uid, {'$pull' : {'Concerns' : fid}}, function(error3, result3) {
						if(!error3 && result3) {
							Users.findById(fid, function(error5, result5) {
								if(!error5 && result5)
								{
									res.send({
										err : 0, 
										msg : '取消关注成功',
										uinfo : result5,
									});
								}
								else
								{
									res.send({err : 3, msg : '查询取消关注后的信息失败'});
								}
							});
						} else {
							res.send({err : 1, msg : '取消关注失败'});
						}
					});
				} else {
					res.send({err : 2, msg : '删除粉丝失败'});
				}
			});
		}
		else
		{
			Users.findByIdAndUpdate(fid, {'$addToSet' : {'Fans' : uid}}, function(error2, result2) {
				if(!error2 && result2)
				{
					Users.findByIdAndUpdate(uid, {'$addToSet' : {'Concerns' : fid}}, function(error4, result4) {
						if(!error4 && result4) {
							Users.findById(fid, function(error6, result6) {
								if(!error6 && result6)
								{
									res.send({
										err : 0, 
										msg : '关注成功',
										uinfo : result6,
									});
								}
								else
								{
									res.send({err : 3, msg : '查询关注后的信息失败'});
								}
							});
						} else {
							res.send({err : 1, msg : '关注失败'});
						}
					});
				}
				else
				{
					res.send({err : 2, msg : '添加粉丝失败'});
				}
			});
		}
	}
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});