var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
	//_id: {type: mongoose.Schema.Types.ObjectId}, 		//主键
    Id : {type: Number},		//ID
	UserName:{type:String},		//用户名

	/* 密码
	 * 
	 * 加密方式为自写方法 /src/pubilc/util.js 的Util.md4
	 * 密码默认为：123456
	 * md5('123456') //e10adc3949ba59abbe56e057f20f883e
	 */
	Pwd : { type:String, default: 'e10adc3949ba59abbe56e057f20f883e'},
	Name : { type:String },		//姓名
	HeadImg : { type:String },	//头像
	Mobile : { type:String },	//电话
	Email : { type:String },	//邮箱
	Address: { type:String },	//地址
	Birthday: { type:Date },	//生日
	Explain: { type:String },	//备注
	Department : {type:String}, //部门
	Position : { type:String },	//职位
	Level : {type:Number, default : 1},				//岗位等级
	Permissions : {type: Array},//权限
	Concerns : {type: Array},	//关注
	Fans : {type: Array},		//粉丝
	IsAddUser : {type: Boolean, default : false},	//是否有权限添加新员工
	IsSendNotice : {type: Boolean, default : false},//是否有权限发布新公告
	IsJob : {type: Boolean, default : true},		//是否在职
	EntryTime : { type:Date, default:Date.now },	//入职时间
	AddTime : { type:Date, default:Date.now },		//添加时间
	EditTime : {type: String},						//编辑时间(时间戳)
});

usersSchema.statics.findLog = function(_where_, _sort_, _skip_, _limit_, callback){
	return this.find(_where_)
			.sort(_sort_)
			.skip(_skip_)
			.limit(_limit_)
			.exec(callback);
};

usersSchema.statics.findCount = function(_where_, callback){
	return this.count(_where_)
			.exec(callback);
};

usersSchema.statics.findAll = function(callback){
	return this.find({})
			.sort({})
			.exec(callback);
};

module.exports = usersSchema;