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

export default class APP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin : null,
            selectIndex: 0,
            userInfo : null,
        };

        this._id = null;
        this.selectPage = 'main';
        this.selectTitle = '';
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

        this.showLoadPage = this.showLoadPage.bind(this);
        this.showContentPage = this.showContentPage.bind(this);
        this.linkUserList = this.linkUserList.bind(this);
    }

    componentDidMount() {
        let that = this;
        AsyncStorage.getItem(Config.storageKey, function(err, result){
            if(!err)
            {
                //如果已登录，去除登录页面
                that.setState({
                    showLogin : result ? false : true,
                    userInfo : result ? JSON.parse(result) : {},
                });
            }
        });
    }

    componentDidUpdate() {
        this._id = null;
        this.selectTitle =  '';
        this.selectPage = 'main';
        this.query = null;
    }

    render() {
        if(!this.state.userInfo) return null;

        return (
            <View style={styles.flex}>
                {this.state.showLogin === null ?
                    null :
                    (this.state.showLogin ?
                        <LoginPage callback={(uinfo)=>{
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

    //用户列表
    linkUserList = (obj) => {
        this.query = obj;
        this.selectPage = 'users';
        this.refs.tabView1.goToPage(0);
    };

    //显示正文
    showContentPage = () => {
        switch(this.state.selectIndex){
            case 0 :
                return <Home 
                    title={this.returnTitle()} 
                    query={this.query} 
                    pageId={this.returnPage()} 
                    viewUser={this.viewUserInfo} 
                />;
                break;
            case 1 :
                return <Notice title={this.returnTitle()} pageId={this.returnPage()} viewUser={this.viewUserInfo} />;
                break;
            case 2 :
                return <Management title={this.returnTitle()} pageId={this.returnPage()} logout={this.userLogout} />;
                break;
            case 3 :
                return <About 
                    title={this.returnTitle()} 
                    pageId={this.returnPage()} 
                    _id={this.return_id()} 
                    logout={this.userLogout}
                    linkUserList={this.linkUserList}
                />;
                break;
            default : 
                return null;
        }
    };

    //返回跳转页面的标题
    returnTitle = () => {
        return this.selectTitle ? this.selectTitle : this.Menus[this.state.selectIndex].name;
    };

    //返回跳转页面的第几层子页
    returnPage = () => {
        return this.selectPage ? this.selectPage : 'main';
    };

    //返回用户的_id
    return_id = () => {
        return this._id ? this._id : this.state.userInfo._id;
    };

    //查看员工信息
    viewUserInfo = (id) => {
        this._id = id;
        this.refs.tabView1.goToPage(3);
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