var Config = {
	host:'http://114.215.168.159:3000',		//主机地址
	login: '/check_user_login',				//登录验证
	allDep: '/allDepartments',				//获取所有部门
	queryUsers : '/queryUserList',			//查询用户列表(适用多条件)
	getDep: '/getDepartments',				//获取单个部门的所有员工
	notices: '/getNotices',					//获取所有公告
	changePwd: '/changeUserPwd',			//修改用户密码
	getUserInfo: '/getBasicInfo',			//获取员工的基本信息
	saveUser: '/saveUserInfo',				//添加，编辑用户
	addNotice: '/addNotice',				//添加公告
	followToggle: '/followToggle',			//添加关注或取消关注
	userNotices : '/getNoticesByUserId', 	//获取所有发布者的公告

	/* -------------全局样式-start---------- */
	//本地存储标记字符
	storageKey: 'AppUser',
	//主色调
	appColor : '#3590D9',
	/* -------------全局样式--end----------- */
};

module.exports = Config;