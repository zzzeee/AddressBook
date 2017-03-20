import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Navigator,
    Animated,
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
            heightValue: new Animated.Value(0),
        };

        this.user_id = null;
        this.local_id = null;
    }

    componentWillMount() {
        this.user_id = this.props.user_id;
        this.local_id = this.props.local_id;
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
                return <UserList
                    route={route}
                    nav={navigator}
                    appColor={Config.appColor}
                    obj={{
                        search: JSON.stringify(route.search),
                        sort: 'UserName',
                        order: 'ASC',
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
                            search: route.search,
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
        let return_pre = (GoToPageObj.hasOwnProperty('pre_index') && GoToPageObj.pre_page) ? true : false;
        let isreturn = route.returnId || return_pre ? true : false;
        let title = route.title ? route.title : this.props.title;
        const {onScroll = () => {}} = this.props;
        let hideMenu = (this.local_id == this.user_id ?
            <Animated.View style={[styles.hideMenuView, {height: this.state.heightValue}]}>
                <View style={styles.hideMenuRow}>
                    <Text style={styles.hideMenuText}>关注列表</Text>
                </View>
                <View style={styles.hideMenuRow}>
                    <Text style={styles.hideMenuText}>粉丝列表</Text>
                </View>
            </Animated.View> :
            <Animated.View style={[styles.hideMenuView, {height: this.state.heightValue}]}>
                <View style={styles.hideMenuRow}>
                    <Text style={styles.hideMenuText}>打电话</Text>
                </View>
                <View style={styles.hideMenuRow}>
                    <Text style={styles.hideMenuText}>发邮件</Text>
                </View>
            </Animated.View>
        );
        
        return (
            <View style={styles.flex}>
                <TopTitle 
                    title={title} 
                    appColor={Config.appColor} 
                    showReturn={isreturn}
                    sideRight={
                        <Icon.Button 
                            name={'ellipsis-v'} 
                            size={18} 
                            iconStyle={{margin: 5}} 
                            onPress={()=>{
                                Animated.timing(this.state.heightValue, {
                                    toValue: this.state.heightValue._value ? 0 : 80,
                                    delay: 260,
                                }).start();
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
                <View style={styles.flex}>
                    <MainPage 
                        user_id={this.user_id} 
                        local_id={this.local_id} 
                        nav={navigator} 
                        route={route} 
                        appColor={Config.appColor} 
                    />
                </View>
                {hideMenu}
            </View>
        );
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
    },
    hideMenuRow : {
        height: 40,
        justifyContent: 'center',
        paddingLeft : 20,
        paddingRight: 20,
    },
    hideMenuText: {
        color: '#fff',
        fontSize : 14,
    },
});