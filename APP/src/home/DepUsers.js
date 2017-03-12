import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View, 
	TouchableHighlight,
	ListView,
	TextInput,
} from 'react-native';

import Button from '../public/Button';
import TopTitle from '../public/TopTitle';

var Util = require('../public/Util');
var Config = require('../public/Config');
var colorList = ['#0379fb', '#fcd333', '#e7463e', '#57b648', '#ed6fbb', '#e38830'];

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
 * 
 * 好吧, 经测试跟你猜的一样
 *========================================================================
 */

export default class DepUsers extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
      		searchTxt : null,
      		dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      	};

      	this.queryUserList = this.queryUserList.bind(this);
  	}

  	componentDidMount() {
  		this.queryUserList({
			search : JSON.stringify({Department : this.props.route.title}),
			sort : 'UserName',
			order : 'ASC',
		}, true);
  	}

  	render() {
		return (
			<View style={styles.flex}>
				<View style={styles.inputView}>
					<TextInput
                        style={styles.inputStyle}
                        onChangeText={(text) => {
       						this.setState({
								searchTxt: text,
							});

							this.queryUserList({
								search : JSON.stringify({Name : {$regex : Util.trim(text)}}),
								sort : 'UserName',
								order : 'ASC',
							}, false);
                        }}
                        value={this.state.searchTxt}
                        placeholder='搜索员工'
                        placeholderTextColor='#bbb'
                        underlineColorAndroid='transparent'
                        autoFocus={this.state.searchTxt ? true : false}
                    />
				</View>
				<View style={styles.flex}>
					{this.state.dataSource._cachedRowCount ?
						<ListView 
					        dataSource={this.state.dataSource} 
					        renderRow={this.renderUser}
					        enableEmptySections={true}	//允许空数据
				        /> :
				        <View style={styles.noResult}>
				        	<Text>未搜索到员工</Text>
				        </View>
					}
				</View>
			</View>
		);
	}

	//单个员工
	renderUser = (obj, sectionID, rowID) => {
		return (
			<View key={rowID} style={styles.oneUserView}>
				<View style={styles.userFristView}>
					<Text style={styles.userFristText}>{obj.Name.substring(0, 1)}</Text>
				</View>
				<View style={styles.userNameView}>
					<Text style={styles.userNameText}>{obj.Name}</Text>
				</View>
				<View style={styles.userMobileView}>
					<Text style={[styles.userMobileText, {paddingLeft:12}]}>
						<Text style={styles.smallTxt}>Tel : </Text>
						<Text>{obj.Moble}</Text>
					</Text>
					<Text style={styles.userMobileText}>
						<Text style={styles.smallTxt}>Email : </Text>
						<Text>{obj.Email}</Text>
					</Text>
				</View>
			</View>
		);
	};

	//获取指定条件的员工列表
	queryUserList = (obj, isClearSearch) => {
		let that = this;
        let url = Config.host + Config.queryUsers;
        
        Util.fetch(url, 'get', obj, function(result){
            console.log(result);
            let error = result.error || '';
            let lists = result.rows || [];
            let count = result.total || 0;

            if(error)
            {
            	alert(error);
            }
            else
            {
            	that.setState({
					//showLoad : false,
					searchTxt: isClearSearch ? null : that.state.searchTxt,
		 			dataSource: that.state.dataSource.cloneWithRows(lists),
				});
            }
        });
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
        backgroundColor : '#ccc',
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
        backgroundColor : '#eee',
        borderBottomWidth : Util.pixel,
        borderBottomColor : '#ccc',
	},
	inputStyle : {
        color : '#333',
        fontSize : 12,
        borderRadius: 5,
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
    	backgroundColor : '#ddd',
    },
	oneUserView : {
		flexDirection : 'row',
		height : 60,
		alignItems: 'center',
		padding : 10,
		borderBottomWidth : Util.pixel,
		borderBottomColor : '#ccc',
		backgroundColor : '#fff',
	},
	userFristView : {
		width : 40,
		height : 40,
		borderRadius : 6,
		backgroundColor : Config.appColor,
		justifyContent: 'center',
		alignItems: 'center',
	},
	userFristText : {
		color : '#fff',
		fontSize : 20,
	},
	userNameView : {
		flex : 2,
		paddingLeft : 10,
	},
	userNameText : {
		fontSize : 13,
		color : '#666',
	},
	userMobileView : {
		flex : 3,
		height : 40,
		justifyContent: 'space-between',
		flexDirection : 'column',
	},
	userMobileText : {
		fontSize : 12,
		color : '#42A6F4',
		flexDirection : 'row',
	},
	smallTxt : {
		fontStyle : 'italic',
		color : '#999',
		fontSize : 10,
	},
});