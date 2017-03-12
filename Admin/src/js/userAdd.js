/**
 *  员工列表
 * ==============================
 *  
 *  作者 ： <linzeyong>
 *  日期 ： 2017.2.20
 *  =============================
 */

$(function() {

	//初始化日期插件
	$('.form_date').datetimepicker({
	    language:  'zh-CN',
	    weekStart: 1,
	    todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
		format: "yyyy-m-d",
		minView: "month",		//只显示到年月日，去除这行可显示时分秒
	    //showMeridian: 1
	});

	//判断页面为 添加还是编辑
	var pathName = window.location.pathname || '';
	var uid = Util.getQuery('id');
	var action = 'add';
	if(pathName.toUpperCase() == '/USERADD') $('.bodyTitle').text('录入新员工');
	if(pathName.toUpperCase() == '/USEREDIT')
	{
		action = 'edit';
		$('.bodyTitle').text('修改员工信息');
		$('.userName').prop('disabled', 'disabled');
		$('#type').val('edit');
		$('#userNameBox').append('<input type="hidden" class="userName" name="userName" />')
	}

	/* 获取数据
	 *
	 * 添加 ： 部门列表，等级列表等
	 * 编辑 ： 部门列表，等级列表和个人信息等
	 */
	 $.getJSON('/getBasicInfo', {
	 	action : action,
	 	uid : uid,
	 }, function(result) {
	 	// console.log(result);
	 	var depList = result.dep || [];
	 	var levList = result.lev || [];
	 	var userdep = (result.uinfo && result.uinfo.Department) ? result.uinfo.Department : ''; 
	 	var userlev = (result.uinfo && result.uinfo.Level) ? result.uinfo.Level : '';

	 	$(depList).each(function(key, val) {
	 		var name = val.Name || '';
	 		var option = name == userdep ? 
	 			'<option value="' + name + '" selected="selected">' + name + '</option>' :
	 			'<option value="' + name + '">' + name + '</option>';
	 		$('select.userDepartment').append(option);
	 	});

	 	$(levList).each(function(key, val) {
	 		var option = val == userlev ? 
	 			'<option value="' + val + '" selected="selected">' + val + '</option>' :
	 			'<option value="' + val + '">' + val + '</option>';
	 		$('select.userLevel').append(option);
	 	});

	 	if(result.uinfo)
	 	{
			var uid = result.uinfo._id || '';
	 		var name = result.uinfo.Name || '';
	 		var userName = result.uinfo.UserName || '';
	 		var position = result.uinfo.Position || '';
	 		var mobile = result.uinfo.Mobile || '';
	 		var email = result.uinfo.Email || '';
	 		var address = result.uinfo.Address || '';
	 		var birthday = result.uinfo.Birthday || '';
	 		var entryTime = result.uinfo.EntryTime || '';
	 		var IsAddUser = result.uinfo.IsAddUser || false;
	 		var IsSendNotice = result.uinfo.IsSendNotice || false;

			$('#u_id').val(uid);
	 		$('.realName').val(name);
	 		$('.userName').val(userName);
	 		$('.userPosition').val(position);
	 		$('.userMobile').val(mobile);
	 		$('.userEmail').val(email);
	 		$('.userAddress').val(address);
	 		$('.inputIsAddUser').prop('checked', IsAddUser);
	 		$('.inputIsSendNotice').prop('checked', IsSendNotice);

	 		if(birthday)
	 		{
	 			birthday = Util.formatTime(birthday, 2);
	 			$(".dtp_input1").val(birthday);
	 			$("#dtp_input1").val(birthday);
	 		}

	 		if(entryTime)
	 		{
	 			entryTime = Util.formatTime(entryTime, 2);
	 			$(".dtp_input2").val(entryTime);
	 			$("#dtp_input2").val(entryTime);
	 		}
	 	}
	 });
})

//表单检查
var cheackFrom = function()
{
	var Name = $('.realName').val() || '';
	var userName = $('.userName').val() || '';
	var Department = $('.userDepartment').val() || '';
	var Position = $('.userPosition').val() || '';
	var Mobile = $('.userMobile').val() || '';

	if(Name == ''){
		alert('姓名不能为空');
		$('.realName').focus();
		return false;
	}

	if(userName == ''){
		alert('用户名不能为空');
		$('.userName').focus();
		return false;
	}
	
	if(!Department || Department == '0' || Department == ''){
		alert('部门不能为空');
		$('.userDepartment').focus();
		return false;
	}

	if(Position == ''){
		alert('职业不能为空');
		$('.userPosition').focus();
		return false;
	}

	if(Mobile == '')
	{
		alert('手机号码不能为空');
		$('.userMobile').focus();
		return false;
	}
	else if(/^1[34578]\d{9}$/.test(Util.trim(Mobile))) {
		Mobile = Util.trim(Mobile);
	}else {
		alert('手机号码格式不正确');
		$('.userMobile').focus();
		return false;
	}

	return true;
};