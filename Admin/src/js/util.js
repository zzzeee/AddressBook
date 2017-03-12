/* 
 * ======================================
 * 系统公用库
 * ======================================
 */

var Util = {
    //验证登录状态
    checkSession: function () {
        if(typeof(window) != 'undefined')
        {
            var loginState = window.sessionStorage.getItem('AppAdmin') || '';
            var pathname = window.location.pathname || '';

            //非登录页面 非登录状态 跳到登录页面
            if(loginState !== 'ok' && pathname.toUpperCase() != '/LOGIN' && pathname.toUpperCase() != '/')
            {
                alert('请先登录');
                window.open('/login', '_self');
            }

            //登录页面 登录状态 跳到默认页
            if(loginState == 'ok' && pathname.toUpperCase() == '/LOGIN')
            {
                window.open('/user_list', '_self');
            }
        }
    },

    //登录成功后保存状态
    loginSuccess: function() {
        if(window)
        {
            window.sessionStorage.setItem('AppAdmin', 'ok');
            window.open('/user_list', '_self');
        }
    },

    //去除前后空格
    trim: function (str) {
        var _str = str ? str : '';
        return _str.replace(/(^\s*)|(\s*$)/g, "");
    },

    //获取URL参数
    getQuery: function (name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null; 
    },

    /*
     * 格式化日期和时间
     * type = 1 时，返回  yyyy-MM-dd HH:MM:SS
     * type = 2 时，返回 yyyy-MM-dd
     */
    formatTime: function (time, type)
    {
        var date = new Date(time);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate;
        
        if(type == 1)
        {
            currentdate = date.getFullYear() + seperator1 + month + seperator1
            + strDate + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        }
        else if(type == 2)
        {
            currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        }
        else
        {
            currentdate = '';
        }
            
        return currentdate;
    },
};

//非登录页面 验证登录状态
if(typeof(window) != 'undefined')
{
    Util.checkSession();
}

if(typeof(module) != 'undefined')
{
    module.exports = Util;
}
