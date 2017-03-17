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

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class About extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
            userInfoLocal: null,
            userInfoQuery: null,
      	};
       
        this._navigator = {};
        this._route = {};
  	}

    componentDidMount() {
        //alert('componentDidMount');
    }

    componentWillMount() {
        this._route = this.props.route;
        this._navigator = this.props.nav;
        this.initData(this.props.uid);
    }

    initData = (uid) => {
        let that = this;
        if(uid)
        {
            let url = Config.host + Config.getUserInfo;
            Util.fetch(url, 'get', {
                action : 'edit',
                uid : uid,
            }, function(result){
                if(result) {
                    if(result.uinfo){
                        that.setState({
                            userInfoQuery : result.uinfo,
                            userInfoLocal : that.props.userinfo,
                        });
                    }else {
                        alert('查不到该员工的信息');
                    }
                }
            });
        }
    };

    //个人中心的头部
    render() {
        if(!this.state.userInfoLocal || !this.state.userInfoQuery){
            return <View style={styles.topView}></View>;
        }

        let userinfo = this.state.userInfoQuery;
        let isSelf = this.props.uid == this.state.userInfoLocal._id ? true : false;
        let img = userinfo.HeadImg ? {uri: Config.host + '/images/' + userinfo.HeadImg} : require('../../images/head.jpeg');
        
        return (
            <View>
                {/*
                    Image组件的 resizeMode属性说明
                    cover:等比拉伸
                    strech:保持原有大小 
                    contain:图片拉伸  充满空间
                */}
                <Image
                    source={require('../../images/userbg.jpg')} 
                    resizeMode={Image.resizeMode.strech}
                    style={styles.topImgView}
                >
                <TouchableHighlight underlayColor='transparent' onPress={()=>this.linkViewEditInfo(isSelf)}>
                    <View style={styles.nameView}>
                        <Text style={styles.nameText}>
                            {userinfo.Department + ' ● ' + userinfo.Name}
                        </Text>
                        <Icon name={isSelf ? 'edit' : 'search'} size={14} color='#fff' backgroundColor='rgba(0, 0, 0, 0.2)' />
                    </View>
                </TouchableHighlight>
                </Image>
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
                    </View>
                }
                <TouchableHighlight 
                    underlayColor='transparent' 
                    style={styles.headBox}
                    onPress={()=>{
                        this.linkViewEditInfo(isSelf);
                    }}
                >
                    <Image
                        source={img}
                        style={styles.headView}
                        resizemode='contain'
                        resizeMethod ='scale'
                    />
                </TouchableHighlight>
                <View style={styles.explainView}>
                    <ScrollView>
                        <Text style={styles.explainText}>
                            {userinfo.Explain ? userinfo.Explain.replace(/[\r\n]/g, "") : '暂无简介'}
                        </Text>
                    </ScrollView>
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
        let uid = this.props.uid || null;
        let returnId = this._route.id || null;
        let returnTitle = this._route.title || null;
        let search = this._route.search || null;
        let returnId2 = this._route.returnId || null;
        let returnTitle2 = this._route.returnTitle || null;
        
        this._navigator.push({
            title : isSelf ? '修改资料' : '查看资料', 
            id : 'editUser',
            returnId : 'main',
            uid : uid,
            returnId : returnId,
            returnTitle : returnTitle,
            search : search,
            returnId2 : returnId2,
            returnTitle2 : returnTitle2,
        });
    };

    //判断是否关注
    isFollow = () => {
        let _isFollow = false;      
        for(let u of this.state.userInfoQuery.Fans)
        {
            if(u == this.state.userInfoLocal._id)
            {
                _isFollow = true;
                break;
            }
        }
        return _isFollow;
    };

    //更新关注 已关注->取消， 未关注->关注
    followToggle = () => {
        let _uid = this.state.userInfoLocal._id || null;
        let _fid = this.props.uid || null;
        //alert(_uid + '--' + _fid);
        if(_fid && _uid && _fid != _uid)
        {
            let that = this;
            let url = Config.host + Config.followToggle;
           
            Util.fetch(url, 'get', {
                isFollow : this.isFollow() ? 1 : 0,
                uid : _uid,
                fid : _fid,
            }, function(result){
                if(result && result.msg)
                {
                    //alert(result.msg);
                    // Add a Toast on screen.
                    let toast = Toast.show(result.msg, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.CENTER,
                        hideOnPress: true,
                    });

                    if(result && result.uinfo && result.err === 0)
                    {
                        that.setState({
                            userInfoQuery : result.uinfo
                        });
                    }
                }
            });
        }
    };
}

const styles = StyleSheet.create({
	flex : {
		flex : 1,
	},
	bodyBox : {
        flex : 1,
        backgroundColor : '#eee',
        marginBottom : 30,
    },
    loadTxt : {
        letterSpacing : 5,
        fontStyle : 'italic',
    },
    topView : {
        height : 330,
    },
    topImgView : {
        height : 200,
        width : Util.size.width,
        justifyContent : 'flex-end',
    },
    nameView : {
        height : 40,
        paddingLeft : 115,
        flexDirection : 'row',
        alignItems : 'center',
        backgroundColor : 'rgba(0, 0, 0, 0.1)',
    },
    nameText : {
        color : '#fff',
        fontSize : 15,
        marginRight : 10,
    },
    btnBoxView : {
        height : 40,
        flexDirection : 'row',
        paddingLeft : 115,
        alignItems : 'center',
        backgroundColor : '#eee',
    },
    button : {
        height : 22,
        borderWidth : 1,
        borderColor : '#aaa',
        backgroundColor : '#ddd',
        marginLeft : 0,
        marginRight : 10,
        marginTop : 0,
        marginBottom : 0,
        minWidth : 50,
    },
    buttonText : {
        color : '#888'
    },
    headBox : {
        width : 80,
        height : 80,
        position : 'absolute',
        top : 160,
        left : 20,
    },
    headView : {
        width : 80,
        height : 80,
        borderRadius : 40,
    },
    explainView : {
        //height : 60,
        padding : 10,
        backgroundColor : '#eee',
    },
    explainText : {
        color : '#666',
        lineHeight : 20,
    },
    noticeNum : {
        height : 30,
        backgroundColor : '#aaa',
        paddingLeft : 20,
        justifyContent : 'center',
    },
    noticeNumText : {
        color : '#fff',
    },
});