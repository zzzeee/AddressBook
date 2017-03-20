import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image,
  StatusBar,
} from 'react-native';

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import LoginPage from './LoginPage';
import AppTabBar from './AppTabBar';
import Button from './public/Button';
import Home from './home/Home';
import Notice from './notice/Notice';
import Management from './management/Management';
import About from './about/About';

var Util = require('./public/Util');
var Config = require('./public/Config');

/* ----------------- 全局变量 start ------------------ */
//全局跳转函数
global.GoToPage = function(){};
//全局跳转携带的参数(可添加)
global.GoToPageObj = {
    now_page : null,    //当前主页下的哪个子页
    now_index : 0,      //当前的哪个主页
    now_title : null,   //当前页的标题
    pre_page : null,    //上一页主页的哪个子页
    pre_index : null,   //上一页的哪个主页
    pre_title : null,   //上一页的标题
};
//跳转至当前页(刷新)
global.GoToPageSelf = function(){
    GoToPageObj.page = GoToPageObj.now_page;
    GoToPageObj.index = GoToPageObj.now_index;
    GoToPageObj.title = GoToPageObj.now_title;
    GoToPage();
};
/* ----------------- 全局变量 end -------------------- */

export default class APP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin : null,
            selectIndex: 0,
            userInfo : null,
        };

        this.query = null;
        this.Menus = [
            {
                name : '首页',
                selIcon : 'ios-home',
                icon : 'ios-home-outline',
            },{
                name : '公告', 
                selIcon : 'ios-leaf',
                icon : 'ios-leaf-outline',
            },{
                name : '管理',
                selIcon : 'ios-analytics',
                icon : 'ios-analytics-outline',
            },{
                name : '个人中心',
                selIcon : 'ios-information-circle',
                icon : 'ios-information-circle-outline',
            }
        ];

        GoToPage = this.initGoToPage.bind(this);
        this.showLoadPage = this.showLoadPage.bind(this);
        this.showContentPage = this.showContentPage.bind(this);
    }

    componentDidMount() {
        let that = this;
        AsyncStorage.getItem(Config.storageKey, function(err, result){
            if(!err)
            {
                let user = JSON.parse(result) || {};
                if(user && user.appColor) {
                    Config.appColor = user.appColor;
                }
                //如果已登录，去除登录页面
                that.setState({
                    showLogin : result ? false : true,
                    userInfo : user,
                });
            }
        });
    }

    componentDidUpdate() {
        GoToPageObj.uid = null;
        GoToPageObj.title =  '';
        GoToPageObj.page = 'main';
        this.query = null;
    }

    render() {
        if(!this.state.userInfo || !this.state.userInfo._id) return null;

        return (
            <View style={styles.flex}>
                {this.state.showLogin === null ?
                    null :
                    (this.state.showLogin ?
                        <LoginPage appColor={Config.appColor} callback={(uinfo)=>{
                            this.setState({
                                showLogin : false,
                                selectIndex : 0,
                                userInfo : uinfo,
                            });
                        }} /> :
                        <View style={styles.flex}>
                            <StatusBar
                                backgroundColor={Config.appColor}
                                barStyle="light-content"
                            />
                            <ScrollableTabView
                                renderTabBar={() => <AppTabBar Menus={this.Menus} />}
                                //renderTabBar={() => <DefaultTabBar />}
                                locked={true}
                                style={styles.flex}
                                ref="tabView1"
                                // 默认打开第几个（0为第一个）
                                initialPage={0}
                                //"top", "bottom", "overlayTop", "overlayBottom"
                                tabBarPosition='overlayBottom'
                                // 选中的下划线颜色
                                tabBarUnderlineStyle={{
                                    //backgroundColor: '#FF0000',
                                    height: 0,
                                }}
                                // 选中的背景颜色
                                tabBarBackgroundColor='rgba(240, 240, 240, 0.8)'
                                // 选中的文字颜色
                                tabBarActiveTextColor='#FF0000'
                                // 未选中的文字颜色
                                tabBarInactiveTextColor='#333'
                                tabBarTextStyle={{fontSize: 12}}
                                onChangeTab={(obj) => {
                                    //无法重宣染页面(狗日的)
                                   
                                    /* 回复楼上的
                                     * this.setState后有重宣染
                                     * 只是不走React周期的componentDidMount，直接进入render
                                     */
                                    GoToPageObj.pre_index = GoToPageObj.now_index;
                                    GoToPageObj.now_index = obj.i;
                                    this.setState({
                                        selectIndex : obj.i,
                                    });
                                }}
                            >
                                <View style={styles.flex} tabLabel='Tab1'>
                                    {this.showLoadPage(0)}
                                </View>
                                <View style={styles.flex} tabLabel='Tab2'>
                                    {this.showLoadPage(1)}
                                </View>
                                <View style={styles.flex} tabLabel='Tab3'>
                                    {this.showLoadPage(2)}
                                </View>
                                <View style={styles.flex} tabLabel='Tab4'>
                                    {this.showLoadPage(3)}
                                </View>
                            </ScrollableTabView>
                        </View>
                    )
                }
            </View>
        );
    }

    //过滤非当前页面的数据
    showLoadPage = (id) => {
        return (
            this.state.selectIndex == id ?
                (<View style={styles.flex}>
                    {this.showContentPage()}
                </View>)
                : null
        );
    };

    //退出登录函数写成props传参
    userLogout = () => {
        let that = this;
        AsyncStorage.removeItem(Config.storageKey, function(err){
            if(!err){
                that.setState({
                    showLogin : true,
                    selectIndex : 0,
                });
            }
        });
    };

    //显示正文
    showContentPage = () => {
        switch(this.state.selectIndex){
            case 0 :
                return <Home 
                    title={this.returnTitle()}
                    pageId={this.returnPage()}
                    appColor={Config.appColor}
                    query={this.query}
                />;
                break;
            case 1 :
                return <Notice 
                    title={this.returnTitle()} 
                    pageId={this.returnPage()}
                    appColor={Config.appColor}
                />;
                break;
            case 2 :
                return <Management 
                    title={this.returnTitle()} 
                    pageId={this.returnPage()}
                    appColor={Config.appColor} 
                    logout={this.userLogout}
                />;
                break;
            case 3 :
                return <About
                    title={this.returnTitle()} 
                    pageId={this.returnPage()}
                    appColor={Config.appColor}
                    user_id={this.return_id()}
                    local_id={this.state.userInfo._id}
                    logout={this.userLogout}
                />;
                break;
            default : 
                return null;
        }
    };

    //返回跳转页面的标题
    returnTitle = () => {
        return GoToPageObj.title ? GoToPageObj.title : this.Menus[this.state.selectIndex].name;
    };

    //返回跳转页面的第几层子页
    returnPage = () => {
        return GoToPageObj.page ? GoToPageObj.page : 'main';
    };

    //返回用户的_id
    return_id = () => {
        let uid = GoToPageObj.uid ? GoToPageObj.uid : this.state.userInfo._id;
        return uid;
    };

    //跳转至做任意页面的子页面
    initGoToPage = () => {
        let index = GoToPageObj.index;
        let page = GoToPageObj.page || null;
        
        if((index || index === 0) && page)
        {
            //是否清空原数据
            if(GoToPageObj.clear_pre) {
                GoToPageObj.pre_page = null;
                GoToPageObj.pre_index = null;
                GoToPageObj.pre_title = null;
                GoToPageObj.clear_pre = false;
            }
            this.refs.tabView1.goToPage(index);
        }
    };
}

var styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    contentBox : {
        flex : 1,
    },
});