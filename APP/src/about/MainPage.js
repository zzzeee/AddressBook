import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Alert,
    ListView,
    Image,
    Linking,
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class MainPage extends Component {
    //构造
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            showLoad : true,
            userInfoQuery: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };

        this.timer = null;
        this.user_id = null;
        this.local_id = null;
        this._route = {};
        this._navigator = {};
    }

    componentDidMount() {
        this._route = this.props.route;
        this._navigator = this.props.nav;
        this.user_id = this.props.user_id;
        this.local_id = this.props.local_id;
        this.initData(this.user_id);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    initData = (uid) => {
        if (uid) {
            let that = this;
            let url = Config.host + Config.userAllInfo;
            
            Util.fetch(url, 'get', {
                uid: uid
            }, function (result) {
                if(result) {
                    let uinfo = result.uinfo || null;
                    let notices = result.notices || [];
                    if(uinfo && uinfo._id) {
                        that.setState({
                            datas: notices,
                            userInfoQuery: uinfo,
                            dataSource: that.state.dataSource.cloneWithRows(notices)
                        });
                    }
                }
            });
        }
    };

    render() {
        let userinfo = this.state.userInfoQuery || null;
        if(!this.local_id || !this.user_id || !userinfo) return null;

        const {onScroll = () => {}} = this.props;
        let isSelf = this.user_id == this.local_id ? true : false;
        let img = userinfo.HeadImg ? {uri: Config.host + '/images/' + userinfo.HeadImg} : require('../../images/head.jpeg');
        let userName = (
            <TouchableHighlight underlayColor='transparent' onPress={()=>this.linkViewEditInfo(isSelf)}>
                <View style={styles.nameView}>
                    <Text style={styles.nameText}>
                        {userinfo.Department + ' ● ' + userinfo.Name}
                    </Text>
                    <Icon name={isSelf ? 'edit' : 'search'} size={14} color='#fff' backgroundColor='rgba(0, 0, 0, 0.2)' />
                </View>
            </TouchableHighlight>
        );
        return (
            <ListView
                ref="ListViews"
                style={styles.bodyBox}
                dataSource={this.state.dataSource}
                renderRow={this.renderNotice.bind(this)}
                enableEmptySections={true}  //允许空数据
                renderScrollComponent={props => (
                    <ParallaxScrollView
                        onScroll={onScroll}
                        headerBackgroundColor={this.props.appColor}
                        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                        backgroundSpeed={10}
                        renderBackground={() => (
                            <View key="background">
                                <Image 
                                    source={require('../../images/userbg.jpg')}
                                    style={styles.topImgView}
                                />
                                <View style={styles.background} />
                            </View>
                        )}
                        renderForeground={() => (
                            <View key="parallax-header" style={styles.parallaxHeader}>
                                <TouchableHighlight underlayColor='transparent' onPress={()=>this.linkViewEditInfo(isSelf)}>
                                    <Image 
                                        source={img}
                                        style={styles.avatar}
                                    />
                                </TouchableHighlight>
                                {userName}
                            </View>
                        )}
                        renderStickyHeader={() => (
                            <View key="sticky-header" style={[styles.stickySection, {backgroundColor: this.props.appColor}]}>
                                <Text style={styles.nameText}>
                                    {userinfo.Department + ' ● ' + userinfo.Name}
                                </Text>
                            </View>
                        )}
                    />
                )}
                renderHeader={() => {
                    return (
                        <View>
                            <View style={styles.explainView}>
                                <Text style={styles.explainText}>
                                    {userinfo.Explain ? userinfo.Explain.replace(/[\r\n]/g, "") : '暂无简介'}
                                </Text>
                            </View>
                            <View style={styles.noticeNum}>
                                <Text style={styles.noticeNumText}>{'已发公告 (' + this.state.datas.length + ')'}</Text>
                            </View>
                        </View>
                    );
                }}
            />
        );
    };

    // 跳转到查看编辑用户信息页面
    linkViewEditInfo = (isSelf) => {
        let uid = this.user_id || null;
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

    //单条公告
    renderNotice = (notice, sectionID, rowID) => {
        return (
            <TouchableHighlight
                key={rowID}
                underlayColor='transparent'
                onPress={() => {

                    let obj = {
                        id: 'noticeView',
                        title: '公告详情',
                        notice: notice,
                        dislink: true,
                    }

                    if (this._route.uid) obj.uid = this._route.uid;
                    if (this._route.id) obj.returnId = this._route.id;
                    if (this._route.title) obj.returnTitle = this._route.title;
                    if (this._route.search) obj.search = this._route.search;
                    if (this._route.returnId) obj.returnId2 = this._route.returnId;
                    if (this._route.returnTitle) obj.returnTitle2 = this._route.returnTitle;
                    this._navigator.push(obj);
                }}
            >
                <View key={rowID} style={styles.oneNotice}>
                    <View style={[styles.userFristView, this.props.appColor ? {backgroundColor: this.props.appColor} : {}]}>
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


const AVATAR_SIZE = 80;
const PARALLAX_HEADER_HEIGHT = 200;
const STICKY_HEADER_HEIGHT = 40;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    centerBox : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#ddd',
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
    },
    nameView: {
        height: 40,
        flexDirection: 'row',
    },
    nameText: {
        color: '#eee',
        fontSize: 15,
        //fontWeight : 'bold',
        paddingRight: 10,
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
        //height: 60,
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
    background: {
        position: 'absolute',
        top: 0,
        width: Util.size.width,
        backgroundColor: 'rgba(0,0,0,.4)',
        height: PARALLAX_HEADER_HEIGHT,
    },
    stickySection: {
        width: Util.size.width,
        height: STICKY_HEADER_HEIGHT,
        paddingLeft : 10,
        justifyContent: 'center',
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom : 10,
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
});