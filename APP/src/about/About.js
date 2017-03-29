import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Navigator,
    Animated,
    AsyncStorage,
    Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../public/Button';
import TopTitle from '../public/TopTitle';
import EditUser from './EditUser';
import NoticeDetails from '../notice/NoticeDetails';
import UserList from '../home/UserList';
import MainPage from './MainPage';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class About extends Component {
    //构造
    constructor(props) {
        super(props);
        this.state = {
            showLoad : true,
            userInfoQuery : null,
            heightValue: new Animated.Value(0),
            fadeInOpacity: new Animated.Value(0),
        };

        this.user_id = null;
        this.local_id = null;
        this.ConcernsList = [];
        this.FansList = [];
        this.search_key = null;
        this.search_val = null;
    }

    componentWillMount() {
        this.user_id = this.props.user_id;
        this.local_id = this.props.local_id;
        
        let that = this;
        AsyncStorage.getItem(Config.storageKey, function(err, result){
            if(!err) {
                let user = JSON.parse(result) || {};
                that.FansList = user.Fans || [];
                that.ConcernsList = user.Concerns || [];
                that.setState({
                    userInfoQuery : user,
                });
            }
        });
    }

    render() {
        if(!this.local_id || !this.user_id) return null;

        return (
            <Navigator
                initialRoute={{ title: this.props.title, id: this.props.pageId }}
                renderScene={this.rendNavigator}
                onWillFocus={() => {
                    //GoToPageObj.pre_page = GoToPageObj.now_page;
                    //GoToPageObj.pre_title = GoToPageObj.now_title;
                    //this.state.heightValue.setValue(0);
                    //this.state.fadeInOpacity.setValue(0);
                    this.setState({
                        heightValue: new Animated.Value(0),
                        fadeInOpacity: new Animated.Value(0),
                    });
                }}
            />
        );
    }

    //跳转管理
    rendNavigator = (route, navigator) => {
        GoToPageObj.now_page = route.id;
        GoToPageObj.now_title = route.title;
        this._route = route;
        this._navigator = navigator;
        
        switch (route.id) {
            case 'main':
                return (this.initPage(route, navigator));
                break;
            case 'noticeView':
                return <NoticeDetails route={route} nav={navigator} />;
                break;
            case 'editUser':
                return <EditUser nav={navigator} route={route} _id={this.local_id} uid={route.uid} />;
                break;
            case 'users':
                route.search = this.search_val ? this.search_val : route.search;
                return <UserList
                    route={route}
                    nav={navigator}
                    appColor={Config.appColor}
                    queryList={{
                        id: this.local_id,
                        key: this.search_key,
                    }}
                    return={() => {
                        this.user_id = this.local_id;
                        navigator.push({
                            id: 'main',
                            title: '个人中心',
                        });
                    }}
                    viewUser={(id) => {
                        this.user_id = id;
                        navigator.push({
                            id: 'main',
                            title: route.nextTitle,
                            returnId: 'users',
                            returnTitle: route.title,
                            search : route.search,
                        });
                    }}
                />;
                break;
            default:
                return false;
        }
    };

    //初始化
    initPage = (route, navigator) => {
        let userinfo = this.state.userInfoQuery || null;
        let return_pre = (GoToPageObj.hasOwnProperty('pre_index') && GoToPageObj.pre_page) ? true : false;
        let isreturn = route.returnId || return_pre ? true : false;
        let title = route.title ? route.title : this.props.title;
        const {onScroll = () => {}} = this.props;
        let hideMenu = (this.local_id == this.user_id ?
            <Animated.View style={[styles.hideMenuView, {height: this.state.heightValue, opacity: this.state.fadeInOpacity}]}>
                <Button 
                    text='关注列表'
                    style={styles.hideMenuRow} 
                    textStyle={styles.hideMenuText}
                    onPress={() => {
                        if(!this.state.heightValue._value) return false;
                        this.search_key = 'Concerns';
                        navigator.push({
                            id : 'users',
                            title : '关注列表',
                            returnId : 'main',
                            returnTitle : '个人中心',
                            nextTitle : '查看该关注者信息',
                        });
                    }}
                />
                <Button 
                    text='粉丝列表'
                    style={styles.hideMenuRow2} 
                    textStyle={styles.hideMenuText}
                    onPress={() => {
                        if(!this.state.heightValue._value) return false;
                        this.search_key = 'Fans';
                        navigator.push({
                            id : 'users',
                            title : '粉丝列表',
                            returnId : 'main',
                            returnTitle : '个人中心',
                            nextTitle : '查看该粉丝信息',
                        });
                    }}
                />
                <Button 
                    text='修改资料'
                    style={styles.hideMenuRow2} 
                    textStyle={styles.hideMenuText}
                    onPress={() => {
                        if(!this.state.heightValue._value) return false;
                        navigator.push({
                            id : 'editUser',
                            title : '修改资料',
                            uid : this.local_id,
                            returnId: 'main',
                            returnTitle: '个人中心',
                        });
                    }}
                />
            </Animated.View> :
            <Animated.View 
                style={[styles.hideMenuView, { height: this.state.heightValue, opacity: this.state.fadeInOpacity}]}>
                <Button text="打电话" style={styles.hideMenuRow} textStyle={styles.hideMenuText} onPress={()=>{
                    if(!this.state.heightValue._value) return false;
                    Linking.openURL('tel: ' + userinfo.Mobile).catch(err => console.error('Tel error!', err));
                }} />
                <Button text="发邮件" style={styles.hideMenuRow2} textStyle={styles.hideMenuText} onPress={()=>{
                    if(!this.state.heightValue._value) return false;
                    Linking.openURL('mailto: ' + userinfo.Email).catch(err => console.error('Mailto error!', err));
                }} />
                <Button 
                    text='查看自己'
                    style={styles.hideMenuRow2} 
                    textStyle={styles.hideMenuText}
                    onPress={() => {
                        if(!this.state.heightValue._value) return false;
                        this.user_id = this.local_id;
                        navigator.push({
                            id: 'main',
                            title: '个人中心',
                        });
                    }}
                />
            </Animated.View>
        );
        
        return (
            <View style={styles.flex}>
                <View style={{height: 60, zIndex: 9}}>
                    <TopTitle 
                        title={title} 
                        appColor={Config.appColor} 
                        showReturn={isreturn}
                        sideRight={
                            <Icon.Button 
                                name={'ellipsis-v'} 
                                size={18} 
                                iconStyle={{marginRight: 10}}
                                onPress={()=>{
                                    Animated.parallel([
                                        Animated.timing(this.state.fadeInOpacity, {
                                            toValue: this.state.fadeInOpacity._value ? 0 : 1,
                                            duration: 50,
                                        }),
                                        Animated.timing(this.state.heightValue, {
                                            toValue: this.state.heightValue._value ? 0 : 150,
                                            duration: 240,
                                        }),
                                    ]).start();
                                }}  
                                color='#fff' 
                                backgroundColor='transparent' 
                            />
                        }
                        onPress={() => {
                            if (route.returnId) {
                                navigator.push({
                                    id: route.returnId,
                                    title: route.returnTitle,
                                    returnId: 'main',
                                    returnTitle: '个人中心',
                                    nextTitle: route.title,
                                    search: route.search,
                                });
                            }
                            else if (return_pre) {
                                //alert(JSON.stringify(GoToPageObj));
                                GoToPageObj.page = GoToPageObj.pre_page;
                                GoToPageObj.title = GoToPageObj.pre_title;
                                GoToPageObj.index = GoToPageObj.pre_index;
                                GoToPageObj.clear_pre = true;

                                GoToPage();
                            }
                        }}
                    />
                </View>
                <View style={styles.flex}>
                    <MainPage 
                        user_id={this.user_id} 
                        local_id={this.local_id} 
                        nav={navigator} 
                        route={route} 
                        appColor={Config.appColor}
                        referenData={this.referenList}
                    />
                </View>
                {hideMenu}
            </View>
        );
    };

    //刷新员工的关注列表和粉丝列表
    referenList = (clist, flist) => {
        this.FansList = flist || [];
        this.ConcernsList = clist || [];
        
        if(this.search_key == 'FansList') {
            this.search_val = this.FansList;
        } 
        else if (this.search_key == 'ConcernsList'){
            this.search_val = this.ConcernsList;
        }
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#dfdfdf',
    },
    centerBox : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#ddd',
    },
    bodyBox: {
        flex: 1,
        backgroundColor: '#eee',
    },
    loadTxt: {
        letterSpacing: 5,
        fontStyle: 'italic',
    },
    hideMenuView: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        right: 10,
        top: 50,
        borderRadius: 10,
        zIndex: 99,
    },
    hideMenuRow : {
        height: 40,
        justifyContent: 'center',
        margin: 0,
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    hideMenuRow2 : {
        height: 40,
        margin: 0,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    hideMenuText: {
        color: '#fff',
        fontSize : 14,
    },
});