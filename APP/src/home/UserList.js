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
import InputText from '../public/InputText';

var Util = require('../public/Util');
var Config = require('../public/Config');
var colorList = ['#0379fb', '#fcd333', '#e7463e', '#57b648', '#ed6fbb', '#e38830'];

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
        let obj = {
            search : JSON.stringify(this.props.route.search),
            sort : 'UserName',
            order : 'ASC',
        };
  		this.queryUserList(obj);
  	}

	//部门员工列表
	render() {
        let {route, nav} = this.props;
		return (
			<View style={styles.flex}>
				<View>
					<TopTitle  title={route.title} showReturn={true} 
						onPress={() => {
							nav.push({title:'首页', id:'main'});
						}}
					/>
				</View>
				<View style={styles.inputView}>
					<InputText vText={this.state.searchTxt} 
					pText='搜索员工' 
					isPWD={false} 
					length={30}
					onChange={(txt)=>{
						//查询条件
						let _txt = Util.trim(txt);
						let obj = {
							$or : [{
									Name : {$regex : _txt}
								},
								{
									UserName : {$regex : _txt},
								},],
						};
						obj = Object.assign(obj, route.search);
						this.queryUserList({
							search : JSON.stringify(obj),
							RegExp : 1,
							sort : 'UserName',
							order : 'ASC',
						});
					}} />
				</View>
				<View style={styles.flex}>
					{this.state.dataSource._cachedRowCount ?
						<ListView 
					        dataSource={this.state.dataSource} 
					        renderRow={this.renderUser.bind(this)}
					        enableEmptySections={true}	//允许空数据
				        /> :
				        <View style={styles.noResult}>
				        	<Text style={styles.noResultText}>未搜索到员工</Text>
				        </View>
					}
				</View>
			</View>
		);
	};

	//单个员工
	renderUser = (obj, sectionID, rowID) => {
		return (
			<View key={rowID} style={styles.oneUserView}>
				<View style={styles.userFristView}>
					<Text style={styles.userFristText}>{obj.Name.substring(0, 1)}</Text>
				</View>
				<View style={styles.userNameView}>
					<TouchableHighlight style={styles.flex} onPress={()=>{
						if(obj._id){
							this.props.viewUser(obj._id);
						}
					}}>
						<Text style={styles.userNameText}>{obj.Name}</Text>
					</TouchableHighlight>
				</View>
				<View style={styles.userMobileView}>
					<TouchableHighlight onPress={()=>{
						Linking.openURL('tel: ' + obj.Mobile).catch(err => console.error('An error occurred', err));
					}}>
						<Text style={[styles.userMobileText, {paddingLeft:12}]}>
							<Text style={styles.smallTxt}>Tel : </Text>
							<Text>{obj.Mobile}</Text>
						</Text>
					</TouchableHighlight>
					<TouchableHighlight onPress={()=>{
						Linking.openURL('mailto: ' + obj.Email).catch(err => console.error('An error occurred', err));
					}}>
						<Text style={styles.userMobileText}>
							<Text style={styles.smallTxt}>Email : </Text>
							<Text>{obj.Email}</Text>
						</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	};

	//获取指定条件的员工列表
	queryUserList = (obj) => {
		let that = this;
        let url = Config.host + Config.queryUsers;
        
        Util.fetch(url, 'get', obj, function(result){
            //console.log(result);
            let error = result.error || '';
            let lists = result.rows || [];
            let count = result.total || 0;

            if(error){
            	alert(error);
            }else{
            	that.setState({
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
    inputView : {
		width : Util.size.width,
		height : 50,
        backgroundColor : '#eee',
        borderBottomWidth : Util.pixel,
        borderBottomColor : '#ccc',
		paddingTop : 8,
		paddingLeft : 10,
		paddingRight : 10,
	},
    noResult : {
    	flex : 1,
    	width : Util.size.width,
    	justifyContent : 'center',
    	alignItems : 'center',
    	backgroundColor : '#ddd',
    },
	noResultText : {
		color : '#aaa',
		fontSize : 15,
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
		width : 44,
		height : 44,
		borderRadius : 6,
		backgroundColor : Config.appColor,
		justifyContent: 'center',
		alignItems: 'center',
	},
	userFristText : {
		color : '#fff',
		fontSize : 22,
	},
	userNameView : {
		flex : 2,
		paddingLeft : 10,
	},
	userNameText : {
		fontSize : 14,
		color : '#666',
	},
	userMobileView : {
		flex : 3,
		height : 40,
		justifyContent: 'space-between',
		flexDirection : 'column',
	},
	userMobileText : {
		fontSize : 13,
		color : '#42A6F4',
		flexDirection : 'row',
	},
	smallTxt : {
		fontStyle : 'italic',
		color : '#999',
		fontSize : 11,
	},
});