/**
 *  用户列表
 * ==============================
 *  
 *  作者 ： linzeyong
 *  日期 ： 2017.1.8
 *  =============================
 */

//表格定义
var table = '#table';
var dataurl = "/queryUserList";

var TableInit = function(table, toolbar, dataurl)
{
    var TableObj = new Object();
    
    TableObj.init = function()
    {
        $(table).bootstrapTable({
            url : dataurl,                      // 数据源
            locale : "zh-CN",                   // 中文语言
            dataField : "rows",                 // 服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            //height : 500,                     // 高度
            search : true,                     // 是否搜索 (searchText为默认表单文字)
            searchPlaceholder : '输入商品名称搜索', // 搜索提示文字 [自定义]
            pagination : true,                  // 是否分页
            pageSize : 10,                      // 单页记录数
            pageList : [ 5, 10, 20, 50 ],       // 分页步进值
            sidePagination : "server",          // 服务端分页
            dataType : "json",                  // 期待返回数据类型
            method : "get",                    // 请求方式
            sortOrder : 'ASC',                 // 定义默认排序
            searchAlign : "left",               // 查询框对齐方式
            searchOnEnterKey : false,            // 回车搜索
            showRefresh : true,                 // 刷新按钮
            showColumns : true,                 // 列选择按钮
            showToggle : true,                  // 显示切换视图
            //uniqueId : 'gID',
            buttonsAlign : "left",              // 按钮对齐方式
            toolbar : toolbar,                  // 指定工具栏
            toolbarAlign : "right",             // 工具栏对齐方式
            detailView : true,                 // 是否显示详情折叠
            queryParams : TableObj.queryParams, // 参数传递
            // 发送到服务器的数据编码类型
            // 如果默认值为'application/json'(json字符串)
            // PHP服务端必须用$GLOBALS['HTTP_RAW_POST_DATA'] 接收并json_decode解析
            contentType : "application/x-www-form-urlencoded",
            columns : [ {
                title : "名字",                  // 标题
                field : "Name",             // 键名
                //fontsize : '14px',            // 字体大小 [自定义、可用]
                //fontweight : "bold",          // 字体粗细 [自定义、可用]
                sortable : true,                // 是否可排序
            }, {
                field : "Department",
                title : "部门",
                //fontsize : '12px',
                sortable : true,
            }, {
                field : "Position",
                title : "职位",
                sortable : true,
            }, {
                field : "EntryTime",
                title : "入职时间",
                sortable : true,
                formatter: 'formatTime',
            }, {
                field : "IsJob",
                title : "是否在职",
                sortable : false,
                formatter: 'formatIsJob',
            }, {
                title : "操作",
                fontsize : '12px',
                sortable : false,
                align : "center",
                formatter : "formatBotton",
            },],
            //格式化详细页面模式的视图
            detailFormatter : function(index, row)
            {
                //console.log(row);
                var name = row.Name || '';
                var username = row.UserName || '';
                var mobile = row.Mobile || '';
                var email = row.Email || '';
                var address = row.Address || '';
                var birthday = row.Birthday || new Date();
                var explain = row.Explain || '';
                var department = row.Department || '';
                var position = row.Position || '';
                var addtime = row.AddTime || new Date();
                var entrytime = row.EntryTime || new Date();
                var isjob = row.IsJob ? '在职' : '离职';
                var level = row.Level || '';

                birthday = Util.formatTime(birthday, 2);
                addtime = Util.formatTime(addtime, 1);
                entrytime = Util.formatTime(entrytime, 2);

                var html = 
                    "<div class='userinfoBox'>" +
                        "<div class='topRow'>" +
                            "<div class='topRowLeft'>" +
                                "<div class='headimgBox'>" +
                                "</div>" +
                            "</div>" +
                            "<div class='topRowRight'>" +
                                "<div class='usernameBox'>" +
                                    "<span class='userName'>" + name + "</span>" +
                                    ' / ' +
                                    "<span class='useruserName'>" + username + "</span>" +
                                "</div>" +
                                "<div class='DepartmentBox'>" +
                                    "<span class='userDepartment'>" + department + "</span>" +
                                    ' / ' +
                                    "<span class='userPosition'>" + position + "</span>" +
                                    "<span class='userLevel'>" + level + "</span>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                        "<div class='bottomRow'>" +
                            "<div class='userinfoRow'>" +
                                "<div class='infoRowLeft noEnter'>" +
                                    "<span>手机 ：" + mobile + "</span>" +
                                "</div>" +
                                "<div class='infoRowLeft noEnter'>" +
                                    "<span>邮箱 ：" + email + "</span>" +
                                "</div>" +
                            "</div>" +
                            "<div class='userinfoRow'>" +
                                "<div class='infoRowLeft noEnter'>" +
                                    "<span>生日 ：" + birthday + "</span>" +
                                "</div>" +
                                "<div class='infoRowLeft noEnter'>" +
                                    "<span>是否在职 ：" + isjob + "</span>" +
                                "</div>" +
                            "</div>" +
                            "<div class='userinfoRow'>" +
                                "<div class='infoRowLeft noEnter'>" +
                                    "<span>入职时间 ：" + entrytime + "</span>" +
                                "</div>" +
                                "<div class='infoRowLeft noEnter'>" +
                                    "<span>添加时间 ：" + addtime + "</span>" +
                                "</div>" +
                            "</div>" +
                            "<div class='userinfoRow'>" +
                                '地址 ： ' + address +
                            "</div>" +
                            // "<div class='userinfoRow'>" +
                            //     '简介 ： ' + explain +
                            // "</div>" +
                        "</div>" +
                    "</div>";

                return html;
            },
        });
    };
    
    TableObj.queryParams = function(params)
    {
        var serchObj = params.search ? {
            Name : {$regex : params.search.replace(/(^\s*)|(\s*$)/g, "")}
        } : undefined;
        
        //这里的键的名字和控制器的变量名必须一致
        var temp = {
            action: 'user_list',
            limit : params.limit,
            offset: params.offset,
            order : params.order,
            search: JSON.stringify(serchObj),
            sort  : params.sort == 'Name' ? 'UserName' : params.sort,
        };
        
        TableObj.params = temp;
        return temp;
    };
    
    return TableObj;
};

//格式化时间
var formatTime = function(value) {
    return Util.formatTime(value, 1);
};

//格式化是否在职
var formatIsJob = function(value) {
    return value ? '在职' : '离职';
};

//格式化操作按钮
var formatBotton = function(value, row, index) {
    var department = row.Department || '';
    var name = row.Name || '';
    var user = row.UserName || '';
    return (
        '<a href="/userEdit?id=' + row._id + '" class="controlIcon" title="编辑信息"><i class="icon-edit"></i></a>' +
        '<a href="javascript: delUser(\''+ department + '\', \'' + name + '\', \'' + user + '\');"' +
        ' class="controlIcon" title="设为离职"><i class="icon-trash"></i></a>' +
        '<a href="javascript: reductionPWD(\''+ department + '\', \'' + name + '\', \'' + user + '\');"' +
        ' class="controlIcon" title="重置密码"><i class="icon-warning-sign"></i></a>'
    );
};

//删除员工(设为离职)
var delUser = function(department, name, user) {
    var ret = confirm("确定要删除员工：" + department + ' - ' + name + " ?");
    if(ret && user)
    {
        $.getJSON('/delUserInfo', {
            username : user
        }, function(result) {
            var msg = result.msg || '';
            if(msg)
            {
                alert(msg);
            }

            $(table).bootstrapTable('refresh');
        });
    }
};

//还原员工登录密码
var reductionPWD = function(department, name, user) {
    var ret = confirm("确定要还重置 [" + department + " - " + name + "] 的登录密码吗?\n还原后密码为：123456");
    if(ret && user)
    {
        $.getJSON('/reductionUserPwd', {
            username : user
        }, function(result) {
            var msg = result.msg || '';
            if(msg)
            {
                alert(msg);
            }
        });
    }
};

$(function() {
    //1.初始化Table
    var datatable = new TableInit(table, '#toolbar', dataurl);
    datatable.init();
})