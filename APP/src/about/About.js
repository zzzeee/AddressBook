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
import Button from '../public/Button';
import TopTitle from '../public/TopTitle';
import EditUser from './EditUser';
import NoticeDetails from '../notice/NoticeDetails';
import UserList from '../home/UserList';
import AboutTop from './AboutTop';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class About extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
            datas : null,
            userInfoQuery : null,
      		userInfoLocal : null,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      	};
       
        this.user_id = null;
        this._route = {};
        this._navigator = {};
  	}

    componentDidMount() {
        
    }

    componentWillMount() {
        let that = this;
        AsyncStorage.getItem(Config.storageKey, function(err, result){
            if(!err && result) {
                that.setState({userInfoLocal : JSON.parse(result)});
            }
        });
    }

    initData = (uid) => {
        //alert(uid);
        if(uid)
        {
            let that = this;
            let url = Config.host + Config.notices;
            Util.fetch(url, 'get', {
                userid : uid
            }, function(result){
                that.setState({
                    datas : result,
                    dataSource: that.state.dataSource.cloneWithRows(result)
                });
            });
        }
    };

    render() {
        return (
            <Navigator
                initialRoute={{title: this.props.title, id: this.props.pageId}}
                renderScene={this.rendNavigator}
                onWillFocus={()=>{
                    //GoToPageObj.pre_page = GoToPageObj.now_page;
		            //GoToPageObj.pre_title = GoToPageObj.now_title;
                    
                    this.user_id = this.user_id ? this.user_id : this.props._id;
                    this.initData(this.user_id);
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
        
        switch(route.id){
            case 'main' :
                return (this.initPage(route, navigator));
                break;
            case 'noticeView' :
                return <NoticeDetails route={route} nav={navigator} />;
				break;
            case 'editUser' : 
                return <EditUser nav={navigator} route={route} _id={this.state.userInfoLocal._id} uid={route.uid} />;
                break;
            case 'users' :
				return <UserList 
                        route={route} 
                        nav={navigator} 
                        obj={{
                            search : JSON.stringify(route.search),
                            sort : 'UserName',
                            order : 'ASC',
                        }}
                        return={()=>{
                            this.user_id = this.state.userInfoLocal._id;
                            navigator.push({
                                id : 'main',
                                title : '个人中心',
                            });
                        }} 
                        viewUser={(id)=>{
                            this.user_id = id;
                            navigator.push({
                                id : 'main',
                                title : route.nextTitle,
                                returnId : 'users',
                                returnTitle : route.title,
                                search : route.search,
                            });
                        }} 
                    />;
				break;
            default : 
                return false;
        }
    };

    //初始化
    initPage = (route, navigator) => {
        let return_pre = (GoToPageObj.hasOwnProperty('pre_index') && GoToPageObj.pre_page) ? true : false;
        let isreturn = route.returnId || return_pre ? true : false;
        let title = route.title ? route.title : this.props.title;
        return (
            <View style={styles.flex}>
                <TopTitle  title={title} showReturn={isreturn} onPress={()=>{
                    if(route.returnId){
                        navigator.push({
                            id : route.returnId,
                            title : route.returnTitle,
                            returnId : 'main',
                            returnTitle : '个人中心',
                            nextTitle : route.title,
                            search : route.search,
                        });
                    }
                    else if (return_pre){
                        //alert(JSON.stringify(GoToPageObj));
                        GoToPageObj.page = GoToPageObj.pre_page;
                        GoToPageObj.title = GoToPageObj.pre_title;
                        GoToPageObj.index = GoToPageObj.pre_index;
                        GoToPageObj.clear_pre = true;
                        
                        GoToPage();
                    }
                }} />
                <View  style={styles.bodyBox}>
                    <ListView 
                        dataSource={this.state.dataSource} 
                        renderRow={this.renderNotice.bind(this)}
                        enableEmptySections={true}  //允许空数据
                        renderHeader={() => {
                            return <AboutTop 
                                nav={navigator} 
                                route={route} 
                                uid={this.user_id} 
                                userinfo={this.state.userInfoLocal} 
                                noticeNum={this.state.datas ? this.state.datas.length : 0} 
                            />;
                        }}
                    />
                </View>
                <View style={styles.viewMySelfInfo}>
                </View>
            </View>
        );
    };

    //单条公告
	renderNotice = (notice, sectionID, rowID) => {
		return (
			<TouchableHighlight 
				key={rowID}
                underlayColor='transparent'
				onPress={()=> {
					
                    let obj = {
						id:'noticeView',
                        title: '公告详情',
                        notice: notice,
                        dislink: true,
                    }

                    if(this._route.uid) obj.uid = this._route.uid;
					if(this._route.id) obj.returnId = this._route.id;
					if(this._route.title) obj.returnTitle = this._route.title;
                    if(this._route.search) obj.search = this._route.search;
                    if(this._route.returnId) obj.returnId2 = this._route.returnId;
                    if(this._route.returnTitle) obj.returnTitle2 = this._route.returnTitle;
                    this._navigator.push(obj);
				}}
			>
			<View key={rowID} style={styles.oneNotice}>
				<View style={styles.userFristView}>
					<Text style={styles.userFristText}>{notice.Department.substring(0, 1)}</Text>
				</View>
				<View style={styles.contentBox}>
					<View>
						<Text style={styles.contentTxt} numberOfLines={2}>{notice.Content}</Text>
					</View>
					<View style={styles.NameTimeBox}>
						<Text style={styles.smallText}>{Util.getFormatDate(notice.AddTime, 1)}</Text>
					</View>
				</View>
				{notice.Type ?
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
		backgroundColor : 'rgba(190, 48, 95, 0.8)',
	},
	noticeType : {
		color : '#fff',
		fontSize : 10,
	},
});