import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Alert,
    Navigator,
    Image,
    ScrollView,
    Linking,
} from 'react-native';

import Button from '../public/Button';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

var Util = require('../public/Util');
var Config = require('../public/Config');

const AVATAR_SIZE = 80;
const PARALLAX_HEADER_HEIGHT = 200;
const STICKY_HEADER_HEIGHT = 60;

export default class AboutTop2 extends Component {
    //构造
    constructor(props) {
        super(props);
        this.state = {
            userInfoQuery: null,
        };

        this.user_id = null;
        this.local_id = null;
        this._route = {};
        this._navigator = {};
    }

    componentDidMount() {
        //alert('componentDidMount');
    }

    componentWillMount() {
        this.user_id = this.props.user_id;
        this.local_id = this.props.local_id;
        this._route = this.props.route;
        this._navigator = this.props.nav;
        this.initData(this.user_id);
    }

    initData = (uid) => {
        let that = this;
        if (uid) {
            let url = Config.host + Config.getUserInfo;
            console.log(url);
            Util.fetch(url, 'get', {
                action: 'edit',
                uid: uid,
            }, function (result) {
                if (result) {
                    if (result.uinfo) {
                        that.setState({
                            userInfoQuery: result.uinfo,
                        });
                    } else {
                        alert('查不到该员工的信息');
                    }
                }
            });
        }
    };

    //个人中心的头部
    render() {
        if(!this.user_id || !this.local_id || !this.state.userInfoQuery) return null;

        let userinfo = this.state.userInfoQuery;
        let isSelf = this.user_id == this.local_id ? true : false;

        return (
            <View>
                {isSelf ?
                <View style={styles.btnBoxView}>
                    <Button 
                        text={userinfo.Concerns.length + " 关注"}
                        style={styles.button} 
                        textStyle={styles.buttonText}
                        onPress={() => {
                            this._navigator.push({
                                id : 'users',
                                title : '关注列表',
                                returnId : 'main',
                                returnTitle : '个人中心',
                                nextTitle : '查看该关注者信息',
                                search : {_id : {'$in' : userinfo.Concerns}},
                            });
                        }}
                        />
                    <Button 
                        text={userinfo.Fans.length + " 粉丝"} 
                        style={styles.button} 
                        textStyle={styles.buttonText}
                        onPress={() => {
                            this._navigator.push({
                                id : 'users',
                                title : '粉丝列表',
                                returnId : 'main',
                                returnTitle : '个人中心',
                                nextTitle : '查看该粉丝信息',
                                search : {_id : {'$in' : userinfo.Fans}},
                            });
                        }}
                    />
                </View> :
                <View style={styles.btnBoxView}>
                    <Button text="打电话" style={styles.button} textStyle={styles.buttonText} onPress={()=>{
                        Linking.openURL('tel: ' + userinfo.Mobile).catch(err => console.error('Tel error!', err));
                    }} />
                    <Button text="发邮件" style={styles.button} textStyle={styles.buttonText} onPress={()=>{
                        Linking.openURL('mailto: ' + userinfo.Email).catch(err => console.error('Mailto error!', err));
                    }} />
                    <Button 
                        text={this.isFollow() ? '取消关注' : '加关注'} 
                        onPress={this.followToggle} 
                        style={styles.button} 
                        textStyle={styles.buttonText} 
                    />
                </View>}
                <View style={styles.explainView}>
                    <Text style={styles.explainText}>
                        {userinfo.Explain ? userinfo.Explain.replace(/[\r\n]/g, "") : '暂无简介'}
                    </Text>
                </View>
                <View style={styles.noticeNum}>
                    <Text style={styles.noticeNumText}>{'已发公告 (' + this.props.noticeNum + ')'}</Text>
                </View>
            </View>
        );
    }

    // 跳转到查看编辑用户信息页面
    linkViewEditInfo = (isSelf) => {
        //alert(JSON.stringify(this._route));
        let uid = this.user_id || null;
        let returnId = this._route.id || null;
        let returnTitle = this._route.title || null;
        let search = this._route.search || null;
        let returnId2 = this._route.returnId || null;
        let returnTitle2 = this._route.returnTitle || null;

        this._navigator.push({
            title: isSelf ? '修改资料' : '查看资料',
            id: 'editUser',
            returnId: 'main',
            uid: uid,
            returnId: returnId,
            returnTitle: returnTitle,
            search: search,
            returnId2: returnId2,
            returnTitle2: returnTitle2,
        });
    };

    //判断是否关注
    isFollow = () => {
        let _isFollow = false;
        for (let u of this.state.userInfoQuery.Fans) {
            if (u == this.local_id) {
                _isFollow = true;
                break;
            }
        }
        return _isFollow;
    };

    //更新关注 已关注->取消， 未关注->关注
    followToggle = () => {
        let _uid = this.local_id || null;
        let _fid = this.user_id || null;
        //alert(_uid + '--' + _fid);
        if (_fid && _uid && _fid != _uid) {
            let that = this;
            let url = Config.host + Config.followToggle;

            Util.fetch(url, 'get', {
                isFollow: this.isFollow() ? 1 : 0,
                uid: _uid,
                fid: _fid,
            }, function (result) {
                if (result && result.msg) {
                    //alert(result.msg);
                    // Add a Toast on screen.
                    let toast = Toast.show(result.msg, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.CENTER,
                        hideOnPress: true,
                    });

                    if (result && result.uinfo && result.err === 0) {
                        that.setState({
                            userInfoQuery: result.uinfo
                        });
                    }
                }
            });
        }
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    bodyBox: {
        flex: 1,
        backgroundColor: '#eee',
        marginBottom: 30,
    },
    loadTxt: {
        letterSpacing: 5,
        fontStyle: 'italic',
    },
    topView: {
        height: 330,
    },
    topImgView: {
        height: PARALLAX_HEADER_HEIGHT,
        width: Util.size.width,
    },
    black04 : {
        position: 'absolute',
        top: 0,
        width: Util.size.width,
        backgroundColor: 'rgba(0,0,0,.4)',
        height: PARALLAX_HEADER_HEIGHT
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 50
    },
    nameView: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    nameText: {
        color: '#fff',
        fontSize: 15,
        marginRight: 10,
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        width: 300,
        justifyContent: 'flex-end'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    btnBoxView: {
        height: 40,
        flexDirection: 'row',
        paddingLeft: 115,
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    button: {
        height: 22,
        borderWidth: 1,
        borderColor: '#aaa',
        backgroundColor: '#ddd',
        marginLeft: 0,
        marginRight: 10,
        marginTop: 0,
        marginBottom: 0,
        minWidth: 50,
    },
    buttonText: {
        color: '#888'
    },
    headBox: {
        width: 80,
        height: 80,
        position: 'absolute',
        top: 160,
        left: 20,
    },
    headView: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    explainView: {
        //height : 60,
        padding: 10,
        backgroundColor: '#eee',
    },
    explainText: {
        color: '#666',
        lineHeight: 20,
    },
    noticeNum: {
        height: 30,
        backgroundColor: '#aaa',
        paddingLeft: 20,
        justifyContent: 'center',
    },
    noticeNumText: {
        color: '#fff',
    },
});