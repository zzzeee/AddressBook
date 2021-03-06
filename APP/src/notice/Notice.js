import React, { Component } from 'react';
import { 
	Navigator, 
	StyleSheet,
	Text, 
	View, 
	TouchableHighlight,
	ListView,
	ScrollView,
	RefreshControl,
	Animated,
} from 'react-native';

import TopTitle from '../public/TopTitle';
import InputText from '../public/InputText';
import NoticeDetails from './NoticeDetails';
import SwiperBtns from '../public/SwiperBtns';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class About extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
      		showLoad : true,
      		datas : null,
			isRefreshing : false,
			heightValue: new Animated.Value(0),
      		dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      	};
		
      	this.searchTxt = null;
      	this._navigator = {};
  	}

  	componentWillMount() { 
  		this.getNoticeList(null);
  	}

  	render() {
	    return (
		    <Navigator
		        initialRoute={{ title: this.props.title, id: this.props.pageId }}
		        renderScene={this.rendNavigator}
				onWillFocus={()=>{
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
		
		switch(route.id){
			case 'main' :
				return (this.notice_List(route.title, navigator));
				break;
			case 'noticeView' :
				return <NoticeDetails route={route} nav={navigator} />
				break;
			default : 
				return false;
		}
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
				isRefreshing : false,
            	dataSource: that.state.dataSource.cloneWithRows(ret)
            });
        });
	};

  	//公告列表
	notice_List = (title, navigator) => {
		this._navigator = navigator;
		return (
			<View style={styles.flex}>
				<View>
					<TopTitle  title={title} appColor={Config.appColor} showReturn={false} 
						onPress={() => {
							navigator.push({title: this.props.title, id: this.props.pageId});
						}}
					/>
				</View>
				<View style={styles.inputView}>
					<InputText 
						vText={this.searchTxt} 
						pText='搜索 发布部门或发布者' 
						isPWD={false} 
						focus={this.searchTxt ? true : false} 
						onChange={(txt)=>{
							this.searchTxt = null;
							this.getNoticeList(txt);
						}}
					/>
				</View>
				<View style={styles.flex}>
					{this.state.datas === null ? null : (this.state.datas.length ? 
						<ListView 
					        dataSource={this.state.dataSource} 
					        renderRow={this.renderNotice2.bind(this)}
					        enableEmptySections={true}	//允许空数据
							refreshControl={this._refreshControl()}
							onScroll={this._onScroll.bind(this)}
							renderFooter={()=>{
								return (
									<Animated.View style={{
										height : this.state.heightValue,
										justifyContent : 'center',
										alignItems : 'center',
										backgroundColor : '#ddd',
									}}>
										<Text>已经到达底部</Text>
									</Animated.View>
								);
							}}
				        /> :
				        <View style={styles.noResult}>
				        	<Text style={styles.noResultText}>无公告列表</Text>
				        </View>
					)}
				</View>
			</View>
		);
	};

	renderNotice2 = (obj, sectionID, rowID) => {
		let _btns = [{
			'text': '分享',
			'press': ()=>{alert('分享个屁')},
			backgroundColor: 'orange',
		}, {
			'text': '删除',
			'press': ()=>{alert('删除不了')},
			backgroundColor: 'red'
		}];
		let btnConfig = {
			itemHeight: 80,
			friction: 2,        //摩擦力
			tension: 40,        //张力
			direction: 'right', //默认方向 (顺时针)
		};
		return (
			<SwiperBtns btns={_btns} {...btnConfig}>
				<TouchableHighlight 
					key={rowID}
					underlayColor='transparent'
					onPress={()=> {
						this._navigator.push({
							title: '公告详情', 
							id:'noticeView',
							notice: obj,
							returnId: 'main',
							returnTitle: this.props.title,
						});
					}}
				>
				<View key={rowID} style={styles.oneNotice}>
					<View style={[styles.userFristView, {backgroundColor: this.props.appColor}]}>
						<Text style={styles.userFristText}>{obj.Department.substring(0, 1)}</Text>
					</View>
					<View style={styles.contentBox}>
						<View style={styles.contentView}>
							<Text style={styles.contentTxt} numberOfLines={2}>{obj.Content}</Text>
						</View>
						<View style={styles.NameTimeBox}>
							<Text style={styles.smallText}>{obj.Author}</Text>
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
			</SwiperBtns>
		);
	};

	//刷新列表
	_refreshControl = () => {
		return (
			<RefreshControl
				refreshing={this.state.isRefreshing}
				onRefresh={this._onRefresh}
				tintColor="#ff0000"
				colors={[this.props.appColor]}
				progressBackgroundColor="#fff"
           />
		);
	};

	//刷新事件
	_onRefresh = () => {
		let that = this;
		this.setState({isRefreshing: true});
		that.getNoticeList(that.searchTxt);
	};

	//滚动至底部事件
    _onScroll = (event) => {
        if(this.state.heightValue > 0) return;
        let that = this;
        let y = event.nativeEvent.contentOffset.y;
        let h = event.nativeEvent.layoutMeasurement.height;
        let bodyH = event.nativeEvent.contentSize.height;

        if(y + h > bodyH + 20) {
			that.state.heightValue.setValue(50);
            
            that.timer = setTimeout(() => { 
                Animated.timing(that.state.heightValue, {
                    toValue: 0,
                    duration: 200,
                }).start();
            }, 1800);
        }
    };

	//单条公告
	renderNotice = (obj, sectionID, rowID) => {
		return (
			<TouchableHighlight 
				key={rowID}
				underlayColor='transparent'
				onPress={()=> {
					this._navigator.push({
						title: '公告详情', 
						id:'noticeView',
						notice: obj,
						returnId: 'main',
						returnTitle: this.props.title,
					});
				}}
			>
			<View key={rowID} style={styles.oneNotice}>
				<View style={[styles.userFristView, {backgroundColor: this.props.appColor}]}>
					<Text style={styles.userFristText}>{obj.Department.substring(0, 1)}</Text>
				</View>
				<View style={styles.contentBox}>
					<View style={styles.contentView}>
						<Text style={styles.contentTxt} numberOfLines={2}>{obj.Content}</Text>
					</View>
					<View style={styles.NameTimeBox}>
						<Text style={styles.smallText}>{obj.Author}</Text>
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
	loadBox : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#ddd',
    },
    loadTxt : {
        letterSpacing : 5,
        fontStyle : 'italic',
    },
	title : {
		marginBottom : 20,
	},
	inputView : {
		width : Util.size.width,
		height : 50,
        backgroundColor : '#ddd',
        borderBottomWidth : Util.pixel,
        borderBottomColor : '#ccc',
		paddingTop : 8,
		paddingLeft : 10,
		paddingRight : 10,
	},
	inputStyle : {
        color : '#333',
        fontSize : 12,
        borderRadius: 5,
		height : 30,
        padding : 8,
        margin : 10,
		borderWidth : Util.pixel,
        borderColor : '#aaa',
        alignItems : 'center',
        backgroundColor : '#fff',
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
		width: Util.size.width,
		alignItems: 'center',
		paddingLeft : 20,
		paddingRight: 20,
		borderBottomWidth : Util.pixel,
		borderBottomColor : '#ccc',
		backgroundColor : '#fff',
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
		justifyContent : 'space-between',
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