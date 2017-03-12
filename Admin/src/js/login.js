/**
 *  登录页面
 * ==============================
 *  
 *  作者 ： linzeyong
 *  日期 ： 2017.2.21
 *  =============================
 */

 (function($) {
 	$(document).ready(function() {
 		var loginFUN = function() {
 			var pwd = $('#userpassword').val() || '';
 			if(pwd)
 			{
 				$.getJSON('/admin_login_check', {
 					password : pwd
 				}, function(result) {
 					//console.log(result);
 					if(result && result.ret)
 					{
 						Util.loginSuccess();
 					}
 					else
 					{
 						alert('登录失败');
 					}
 				});
 			}
 		};

 		//点击登录按钮
 		$('#update_form').click(function() {
 			loginFUN();
 		});

 		//按下回车登录
    	$("#userpassword").keydown(function(event){
    		event=document.all?window.event:event;
    		if((event.keyCode || event.which)==13)
    		{
    			loginFUN();
    		}
    	});
 	});
 })(jQuery);
