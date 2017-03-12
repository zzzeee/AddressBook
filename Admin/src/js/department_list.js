/**
 *  部门列表
 * ==============================
 *  
 *  作者 ： linzeyong
 *  日期 ： 2017.2.21
 *  =============================
 */

var colorList = ['#0379fb', '#fcd333', '#e7463e', '#57b648', '#ed6fbb', '#e38830'];

//获取所有部门列表
 var getDepartmartList = function() {
 	$.getJSON('/allDepartments', {
    }, function(result) {
        //console.log(result);
        var list = result || [];
        $('.departmentList').empty();
        $(list).each(function(key, val) {
        	var name = val.Name || '';
        	var sname = val.ShowName || '';
        	$('.departmentList').append(
        		"<div class='snameItem snameItem" + key + "'>" + 
        			sname + 
        			"<div class='delDepartment' onclick=\"delDepartment('" + name +"', " + key + ")\" title='删除该部门'>" +
        				"<i class='icon-remove'></i>" +
        			"</div>" +
        		"</div>"
        	);
        	$('.departmentList .snameItem' + key).css('background-color', colorList[key ? key % colorList.length : 0]);
        });
    });
 };

//删除部门
 var delDepartment = function(name, i) {
 	var ret = confirm("确定要删除 " + name + " 部门吗？");

 	if(ret && name)
 	{
 		$.getJSON('/delDepartment', {
	 		name : name
	 	}, function(result) {
	 		//console.log(result);
	 		if(result)
	 		{
	 			if(result.ok)
	 			{
	 				alert('成功删除部门');
	 				$('.snameItem' + i).remove();
	 			}
	 			else if(result.msg)
	 			{
	 				alert(result.msg);
	 			}
	 		}
	 	});
 	}
 };

 (function($){
 	//部门列表
 	getDepartmartList();

 	$(document).ready(function(){
 		$('#subAddDepartment').click(function(){
 			var name = $('#userDepID').val() || '';
 			var _name = $('#user_DepID').val() || '';
 			name = $.trim(name);
 			_name = $.trim(_name);

 			if(name == '')
 			{
 				alert('部门名称不能为空');
 				$('#userDepID').focus();
 				return false;
 			}

 			if(_name == '')
 			{
 				alert('显示名称不能为空');
 				$('#user_DepID').focus();
 				return false;
 			}

	 		$.getJSON('/addDepartment', {
	 			depname : name,
	 			depshowname : _name,
		    }, function(result) {
		        if(result && result._id)
		        {
		        	$('#userDepID').val('');
		        	$('#user_DepID').val('');
		        	getDepartmartList();
		        }
		        else if(result && result.err)
		        {
		        	alert(result.err);
		        }
		    });
	 	});
 	});
 })(jQuery);