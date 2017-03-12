import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View, 
	TouchableOpacity,
	AsyncStorage,
	Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class Main extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
      		showLoad : true,
      		userInfo : null,
      	};
      	this.userInfo = {};
  	}

  	componentDidMount() {
  		let that = this;
        AsyncStorage.getItem(Config.storageKey, function(err, result){
            if(!err && result)
            {
                that.userInfo = JSON.parse(result);
            }
        });
  	}

  	render() {
  		let that = this;
  		let {route, nav} = this.props;

  		if(this.state.userInfo || true)
  		{
  			return (
  				<View style={styles.bodyBox}>
  					<View>
  						{this.buttonItem('key', '修改密码', '#96551C', () => {
  							nav.push({
  								title : '修改密码', 
  								id : 'management_pwd',
  								username : this.userInfo.UserName,
  							});
  						})}

  						{this.buttonItem('user-plus', '新增员工', '#2FB953', () => {
  							let IsAddUser = this.userInfo.IsAddUser ? false : true;
  							if(IsAddUser)
  							{
  								alert('对不起，你没有新增员工的权限。');
  							}
  							else
  							{
  								nav.push({
	  								title : '新增员工', 
	  								id : 'management_adduser',
	  								username : this.userInfo.UserName,
	  							});
  							}
  						})}

  						{this.buttonItem('send', '发布公告', '#228CBF', () => {
  							let IsSendNotice = this.userInfo.IsSendNotice ? false : true;
  							if(IsSendNotice)
  							{
  								alert('对不起，你没有发布公告的权限。');
  							}
  							else
  							{
  								nav.push({
	  								title : '发布公告', 
	  								id : 'management_addnotice',
									userid: this.userInfo._id,
                                    uname : this.userInfo.Name,
	  								username : this.userInfo.UserName,
                                    department : this.userInfo.Department,
	  							});
  							}
  						})}
  					</View>

  					<View>
  						{this.buttonItem('power-off', '退出登录', '#C31737', () => {
  							Alert.alert(
				            	'登出',
				            	'确定要退出登录吗？',
				            	[
				            		{text: '取消', onPress: () => {}},
				              		{text: '确定', onPress: () => {
				              			that.props.logout();
				              		}},
				            	]
				            )
  						})}
  					</View>
  				</View>
			);
  		}
  		else
  		{
  			return null;
  		}
	}

	buttonItem = (icon, text, color, callback) => {
		return (
			<TouchableOpacity
	          	onPress={() => callback()}
	      	>
	          	<View style={styles.buttonItemStyle}>
	          		<Icon name={icon} size={16} color={color}/>
	            	<Text style={styles.buttonText}>{text}</Text>
	          	</View>
	        </TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	flex : {
		flex : 1,
		backgroundColor : '#fff',
	},
	loadBox : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#eee',
    },
    loadTxt : {
        letterSpacing : 5,
        fontStyle : 'italic',
    },
	bodyBox : {
		flex : 1,
		flexDirection : 'column',
		flexWrap: 'wrap',
		backgroundColor : '#eee',
		paddingTop: 30,
		paddingBottom: 30,
		justifyContent: 'space-between',

	},
	buttonItemStyle : {
		height : 48,
		padding: 10,
		backgroundColor : '#fff',
		borderBottomWidth : Util.pixel,
		borderBottomColor : '#ccc',
		flexDirection : 'row',
		alignItems: 'center',
	},
	buttonText : {
		paddingLeft : 10,
		fontSize : 16,
		color : '#555',
	},
});