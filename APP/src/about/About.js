import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View, 
	TouchableHighlight,
	AsyncStorage,
	Alert,
    Navigator,
    ListView,
    Image,
    ScrollView,
    Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast';
import Button from '../public/Button';
import TopTitle from '../public/TopTitle';
import EditUser from './EditUser';
import NoticeDetails from '../notice/NoticeDetails';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class About extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
      		userInfoLocal : null,
            userInfoQuery: null,
            datas : null,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      	};

        this._navigator = {};
  	}

    componentDidMount() {
        let that = this;
        AsyncStorage.getItem(Config.storageKey, function(err, result){
            if(!err && result)
            {
                that.setState({
                    userInfoLocal : JSON.parse(result),
                });
            }
        });
        this.initData();
    }

  	componentWillReceiveProps() {
        this.initData();
  	}

    initData = () => {
        let that = this;
		let url = Config.host + Config.getUserInfo;
        //alert(this.props._id);
        if(this.props._id)
        {
            Util.fetch(url, 'get', {
                action : 'edit',
                uid : this.props._id,
            }, function(result){
                if(result)
                {
                    if(result.uinfo)
                    {
                        that.setState({
                            userInfoQuery : result.uinfo,
                        }, ()=>{
                            if(result.uinfo.UserName)
                            {
                                that.getNoticeList(result.uinfo.UserName);
                            }
                        });
                    }
                    else
                    {
                        alert('查不到该员工的信息');
                    }
                }
            });
        }
    };

    render() {
        return (
            <Navigator
                initialRoute={{title: this.props.title, id: this.props.pageId}}
                renderScene={this.rendNavigator}
            />
        );
    }

    //跳转管理
    rendNavigator = (route, navigator) => {
        this._navigator = navigator;
        switch(route.id){
            case 'main' :
                return (this.initPage(navigator));
                break;
            case 'noticeView' :
                return <NoticeDetails route={route} nav={navigator} />;
				break;
            case 'editUser' : 
                return <EditUser nav={navigator} route={route} uid={route.uid} />;
                break;
            default : 
                return false;
        }
    };

    //初始化
    initPage = (navigator) => {
        return (
            <View style={styles.flex}>
                <TopTitle  title={this.props.title} showReturn={false} />
                <View  style={styles.bodyBox}>
                    {this.state.datas === null ? null : (this.state.datas.length ? 
                        <ListView 
                            dataSource={this.state.dataSource} 
                            renderRow={this.renderNotice.bind(this)}
                            enableEmptySections={true}  //允许空数据
                            renderHeader={() => this.initPageTop()}
                        />:
                        <View style={styles.flex}>
                            {this.initPageTop()}
                            <View style={styles.noResult}>
                                <Text style={styles.noResultText}>无公告列表</Text>
                            </View>
                        </View>
					)}
                </View>
            </View>
        );
    };

    //加载公告列表
	getNoticeList = (txt) => {
		let that = this;
		let url = Config.host + Config.notices;

		Util.fetch(url, 'get', {
			text : txt
        }, function(result){
        	var ret = result || [];
            that.setState({
            	datas : ret,
            	dataSource: that.state.dataSource.cloneWithRows(ret)
            });
        });
	};

    //个人中心的头部
    initPageTop = () => {
        if(!this.state.userInfoLocal || !this.state.userInfoQuery) return null;

        let isSelf = this.props._id == this.state.userInfoLocal._id ? true : false;
        let userinfo = this.state.userInfoQuery;
        let img = userinfo.HeadImg ? {uri: Config.host + '/images/' + userinfo.HeadImg} : require('../../images/head.jpeg');

        return (
            <View style={styles.topView}>
                {/*
                    Image组件的 resizeMode属性说明
                    cover:等比拉伸
                    strech:保持原有大小 
                    contain:图片拉伸  充满空间
                */}
                <Image
                    source={require('../../images/userBG.jpg')} 
                    resizeMode={Image.resizeMode.strech}
                    style={styles.topImgView}
                >
                <TouchableHighlight onPress={()=>this.linkViewEditInfo(isSelf)}>
                    <View style={styles.nameView}>
                        <Text style={styles.nameText}>
                            {userinfo.Department + ' ● ' + userinfo.Name}
                        </Text>
                        <Icon name={isSelf ? 'edit' : 'search'} size={16} color='#eee' backgroundColor='rgba(0, 0, 0, 0.2)' />
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
                                this.props.linkUserList({
                                    _id : {'$in' : userinfo.Concerns}
                                });
                            }}
                         />
                        <Button 
                            text={userinfo.Fans.length + " 粉丝"} 
                            style={styles.button} 
                            textStyle={styles.buttonText}
                            onPress={() => {
                                this.props.linkUserList({
                                    _id : {'$in' : userinfo.Fans}
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
                <TouchableHighlight style={styles.headBox} onPress={()=>this.linkViewEditInfo(isSelf)}>
                    <Image
                        source={img}
                        style={styles.headView}
                    />
                </TouchableHighlight>
                <View style={styles.explainView}>
                    <ScrollView>
                        <Text style={styles.explainText}>
                            {userinfo.Explain ? userinfo.Explain : '暂无简介'}
                        </Text>
                    </ScrollView>
                </View>
                <View style={styles.noticeNum}>
                    <Text style={styles.noticeNumText}>{'已发公告 (' + this.state.datas.length + ')'}</Text>
                </View>
            </View>
        );
    };

    // 跳转到查看编辑用户信息页面
    linkViewEditInfo = (isSelf) => {
        this._navigator.push({
            title : isSelf ? '修改资料' : '查看资料', 
            id : 'editUser',
            returnId : 'main',
            uid : this.props._id,
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
        let _fid = this.props._id || null;
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

    //单条公告
	renderNotice = (obj, sectionID, rowID) => {
		return (
			<TouchableHighlight 
				key={rowID}
				onPress={()=> {
					this._navigator.push({
						title: '公告详情', 
						id:'noticeView',
                        returnId : 'main',
						notice: obj,
					});
				}}
			>
			<View key={rowID} style={styles.oneNotice}>
				<View style={styles.userFristView}>
					<Text style={styles.userFristText}>{obj.Department.substring(0, 1)}</Text>
				</View>
				<View style={styles.contentBox}>
					<View>
						<Text style={styles.contentTxt} numberOfLines={2}>{obj.Content}</Text>
					</View>
					<View style={styles.NameTimeBox}>
						<Text style={styles.smallText}>{Util.getFormatDate(obj.AddTime, 1)}</Text>
					</View>
				</View>
				{obj.Type ?
					<View style={styles.noticeTypeBox}>
						<Text style={styles.noticeType}>紧急</Text>
					</View>
					: null
				}
			</View>
			</TouchableHighlight>
		);
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
    },
    nameText : {
        color : '#eee',
        fontSize : 15,
        //fontWeight : 'bold',
        paddingRight : 10,
        backgroundColor : 'rgba(0, 0, 0, 0.2)',
    },
    btnBoxView : {
        height : 40,
        flexDirection : 'row',
        paddingLeft : 115,
        alignItems : 'center',
        backgroundColor : '#ddd',
    },
    button : {
        height : 22,
        borderWidth : 1,
        borderColor : '#aaa',
        backgroundColor : '#fff',
        marginLeft : 0,
        marginRight : 10,
        marginTop : 0,
        marginBottom : 0,
        minWidth : 50,
    },
    buttonText : {
        color : '#999'
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
        height : 60,
        padding : 10,
        backgroundColor : '#dfdfdf',
    },
    explainText : {
        color : '#888',
        lineHeight : 20,
    },
    noticeNum : {
        height : 30,
        backgroundColor : '#999',
        paddingLeft : 20,
        justifyContent : 'center',
    },
    noticeNumText : {
        color : '#fff',
    },
    noResult : {
    	flex : 1,
    	width : Util.size.width,
    	justifyContent : 'center',
    	alignItems : 'center',
    	backgroundColor : '#eee',
    },
	noResultText : {
		color : '#aaa',
		fontSize : 15,
	},
	oneNotice : {
		flexDirection : 'row',
		height : 80,
		alignItems: 'center',
		//paddingTop : 15,
		paddingLeft : 20,
		paddingRight: 20,
		borderBottomWidth : Util.pixel,
		borderBottomColor : '#ccc',
		backgroundColor : '#fff',
		//alignItems: 'center',
	},
	userFristView : {
		width : 42,
		height : 43,
		borderRadius : 6,
		backgroundColor : Config.appColor,
		justifyContent: 'center',
		alignItems: 'center',
	},
	userFristText : {
		color : '#fff',
		fontSize : 24,
	},
	contentBox : {
		flex : 1,
		marginLeft : 10,
	},
	contentTxt : {
		fontSize : 16,
		color : '#666',
		height : 40,
		lineHeight : 20,
	},
	NameTimeBox : {
		flexDirection : 'row',
		justifyContent : 'flex-end',
		height : 20,
	},
	smallText : {
		fontSize : 14,
		color : '#aaa',
	},
	noticeTypeBox : {
		position : 'absolute',
		top : 10,
		left : 40,
		borderRadius : 6,
		paddingTop : 3,
		paddingBottom : 3,
		paddingLeft : 5,
		paddingRight : 5,
		backgroundColor : 'rgba(140, 16, 67, 0.8)',
	},
	noticeType : {
		color : '#fff',
		fontSize : 10,
	},
});