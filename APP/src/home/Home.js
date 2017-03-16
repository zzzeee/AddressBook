import React, { Component } from 'react';
import { 
	Navigator, 
	StyleSheet,
	Text, 
	View, 
	TouchableHighlight,
	ListView,
	Linking,
} from 'react-native';

import Button from '../public/Button';
import TopTitle from '../public/TopTitle';
import UserList from './UserList';

var Util = require('../public/Util');
var Config = require('../public/Config');
var colorList = ['#0379fb', '#fcc433', '#e7463e', '#57b648', '#ed6fbb', '#e38830'];

/*========================================================================
 * 本页原打算制作是每次加载网络数据时
 * 显示加载页，加载好后显示内容
 * 
 * 多次测试结果如下(猜测)：
 *  每次显示加载样式更改一次状态，加载好后再更改一次状态
 *	相当于每次切换页面会多次更新状态(setState 异步)
 *	导致页面出现异常错误
 *	现给予去除加载提示，只留有main页面
 *
 * 还有个问题是，刚进入本页的第一次点击无效
 *	猜测原因：本页默认给搜索框获得焦点，所以第一次点击让搜索框失去焦点
 *
 * 楼上的傻逼你不会直接测试一下啊   
 * <<<< 回复：经测试跟你猜的一样
 *========================================================================
 */

export default class Home extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
      		showLoad : true,
			fetchError : null,
      		datas : [],
      	};

		this.fetchQueryData = {};
  	}

  	componentDidMount() {
  		this.getInitDate();
		
		//自定义网络请求超时事件
		let that = this;
		Util.fetchError = (err, obj) => {
			if(err)
			{
				that.fetchQueryData = obj ? obj : {};
				that.setState({
					fetchError : err,
				});
			}
		};
  	}

	//自定义网络请求超时页面
	fetchErrorView = () => {
		return (this.state.fetchError ?
			<View style={styles.centerBox}>
				<Button style={styles.refaceBtn} textStyle={styles.refaceBtnText} text="点击重新连接" onPress={()=>{
					if(this.fetchQueryData.u && this.fetchQueryData.t)
					{
						Util.fetch(this.fetchQueryData.u, this.fetchQueryData.t, this.fetchQueryData.o, this.fetchQueryData.c);
					}
				}} />
				<Text>网络请求超时，请检查网络设置。</Text>
			</View> :
			<View style={styles.centerBox}>
				<Text style={styles.loadTxt}>加载中 ...</Text>
			</View>
		);
	};

  	render() {
	    return (
		    <Navigator
		        initialRoute={{title: this.props.title, id: this.props.pageId}}
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
				return (this.initPage(navigator));
				break;
			case 'users' :
				route.search = this.props.query ? this.props.query : (route.search ? route.search : GoToPageObj.UserListSearch);
				
				if(route.search){
					GoToPageObj.UserListSearch = Object.assign({}, route.search);
					let obj = {
						search : JSON.stringify(route.search),
						sort : 'UserName',
						order : 'ASC',
					};
					return <UserList route={route} nav={navigator} return={()=>{
						navigator.push({title: '首页', id: 'main'});
					}} obj={obj} />;
				}else{
					return null;
				}
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
				{this.state.showLoad ?
					(this.fetchErrorView()) :
					<View  style={styles.menuBox}>
						{this.state.datas.map((obj, i) => this.renderItem(obj, i, navigator))}
					</View>
				}
			</View>
		);
	};

	//获取初始化数据
	getInitDate = () => {
		let that = this;
		let url = Config.host + Config.allDep;

		Util.fetch(url, 'get', {
        }, function(result){
        	if(result)
        	{
        		that.setState({
	            	showLoad : false,
	            	datas : result,
	            });
        	}
        });
	};

	//首页的单个部门
	renderItem = (obj, i, navigator) => {
		return (
			<TouchableHighlight 
				key={i}
				activeOpacity={1}
				underlayColor='transparent'
				onPress={()=> {
					navigator.push({
						title: obj.Name, 
						id: 'users',
						search : {Department : obj.Name},
					});
				}}
			>
				<View style={[styles.depItem, {'backgroundColor' : colorList[i ? i % colorList.length : 0]}]}>
					<Text style={styles.depItemText}>
						{obj.ShowName}
					</Text>
				</View>
			</TouchableHighlight>
		);
	};
}

const styles = StyleSheet.create({
	flex : {
		flex : 1,
	},
	centerBox : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#ddd',
    },
    loadTxt : {
        letterSpacing : 5,
        fontStyle : 'italic',
    },
	refaceBtn : {
		backgroundColor : '#ccc',
		borderWidth : 1,
		borderColor : '#999',
		minWidth : 80,
		marginBottom : 20,
		borderRadius : 12,
		paddingLeft : 10,
		paddingRight: 10,
	},
	refaceBtnText : {
		color : '#555'
	},
	menuBox : {
		flex : 1,
		flexDirection : 'row',
		flexWrap: 'wrap',
		backgroundColor : '#fff',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		padding : 10,
	},
	depItem : {
		height: (Util.size.width - 100) / 4,
		borderRadius : 5,
		margin : 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	depItemText : {
		color : '#fff',
		minWidth : (Util.size.width - 100) / 4,
		textAlign : 'center',
		paddingLeft : 10,
		paddingRight: 10,
		fontSize : 18,
	},
});