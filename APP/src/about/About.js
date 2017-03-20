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
    Animated,
    Dimensions
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
        //alert('about' + this.props.appColor);
        return (
            <View style={styles.flex}>
                <TopTitle title={title} appColor={Config.appColor} showReturn={isreturn} onPress={() => {
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
                }} />
                <View style={styles.flex}>
                    <MainPage user_id={this.user_id} local_id={this.local_id} nav={navigator} route={route} appColor={Config.appColor} />
                </View>
                {(this.user_id && this.local_id && this.user_id != this.local_id) ?
                    <View style={styles.viewMySelfInfo} >
                        <TouchableHighlight onPress={() => {
                            this.user_id = this.local_id;
                            navigator.push({
                                id: 'main',
                                title: '个人中心',
                            });
                        }}>
                            <Text style={styles.viewMySelfInfoText}>Me</Text>
                        </TouchableHighlight>
                    </View>
                    : null
                }
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
    topView: {
        height: 330,
    },
    topImgView: {
        height: 200,
        width: Util.size.width,
        justifyContent: 'flex-end',
    },
    nameView: {
        height: 40,
        paddingLeft: 115,
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        color: '#eee',
        fontSize: 15,
        //fontWeight : 'bold',
        paddingRight: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    btnBoxView: {
        height: 40,
        flexDirection: 'row',
        paddingLeft: 115,
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    button: {
        height: 22,
        borderWidth: 1,
        borderColor: '#aaa',
        backgroundColor: '#fff',
        marginLeft: 0,
        marginRight: 10,
        marginTop: 0,
        marginBottom: 0,
        minWidth: 50,
    },
    buttonText: {
        color: '#999'
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
        height: 60,
        padding: 10,
        backgroundColor: '#dfdfdf',
    },
    explainText: {
        color: '#888',
        lineHeight: 20,
    },
    noticeNum: {
        height: 30,
        backgroundColor: '#999',
        paddingLeft: 20,
        justifyContent: 'center',
    },
    noticeNumText: {
        color: '#fff',
    },
    noResult: {
        flex: 1,
        width: Util.size.width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    noResultText: {
        color: '#aaa',
        fontSize: 15,
    },
    oneNotice: {
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
        //paddingTop : 15,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: Util.pixel,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
        //alignItems: 'center',
    },
    userFristView: {
        width: 42,
        height: 43,
        borderRadius: 6,
        backgroundColor: Config.appColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userFristText: {
        color: '#fff',
        fontSize: 24,
    },
    contentBox: {
        flex: 1,
        marginLeft: 10,
    },
    contentTxt: {
        fontSize: 16,
        color: '#666',
        height: 40,
        lineHeight: 20,
    },
    NameTimeBox: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    smallText: {
        fontSize: 14,
        color: '#aaa',
    },
    noticeTypeBox: {
        position: 'absolute',
        top: 10,
        left: 40,
        borderRadius: 6,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'rgba(190, 48, 95, 0.8)',
    },
    noticeType: {
        color: '#fff',
        fontSize: 10,
    },
    viewMySelfInfo: {
        width: 30,
        height: 30,
        borderRadius: 15,
        position: 'absolute',
        top: 45,
        right: 5,
        backgroundColor: 'rgba(190, 48, 95, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewMySelfInfoText: {
        fontStyle: 'italic',
        color: '#fff',
    },
    loadMoreView: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
});