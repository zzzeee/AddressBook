import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View, 
	TouchableHighlight,
	Alert,
	TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../public/Button';
import InputText from '../public/InputText';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class ChangeUserPwd extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
      		reload : false,
      	};

      	this.username = '';
      	this.opwd = '';
      	this.npwd = '';
      	this.npwd2 = '';
  	}

  	componentDidMount() {
  		let {route} = this.props;
  		this.username = route.username;
  	}

  	render() {
  		return (
  			<View style={styles.bodyBox}>
	  			<View>
		  			<View style={styles.inputView}>
						<InputText pText='旧密码' isPWD={true} length={20} onChange={(txt)=>this.opwd = txt} />
					</View>
					<View style={styles.inputView}>
						<InputText pText='新密码' isPWD={true} length={20} onChange={(txt)=>this.npwd = txt} />
					</View>
					<View style={styles.inputView}>
						<InputText pText='确认新密码' isPWD={true} length={20} onChange={(txt)=>this.npwd2 = txt} />
					</View>
				</View>
			
				<View style={styles.inputView}>
					<Button text='确 定' style={{backgroundColor : Config.appColor}} onPress={()=>{
						if(!this.opwd)
						{
							alert('未输入旧密码');
							return false;
						}
						else if(!this.npwd)
						{
							alert('未输入新密码');
							return false;
						}
						else if(!this.npwd2)
						{
							alert('未输入确认密码');
							return false;
						}
						else if(this.npwd != this.npwd2)
						{
							alert('新密码与确认密码不一致');
							return false;
						}
						else if(this.npwd.length < 6)
						{
							alert('密码不能低于6位');
							return false;
						}
						else if(this.npwd == this.opwd)
						{
							alert('新密码不能与旧密码一样');
							return false;
						}
						else if(!this.username)
						{
							alert('未获取到用户信息');
							return false;
						}
						else
						{
							let url = Config.host + Config.changePwd;
							let that = this;
							Util.fetch(url, 'get', {
								username : this.username,
								userpwd : this.opwd,
								usernewpwd : this.npwd,
					        }, function(result){
					            if(result)
					            {
					            	if(result.err === 0)
					            	{
					            		alert('密码修改成功');
					            		that.opwd = '';
					            		that.npwd = '';
					            		that.npwd2 = '';
					            		that.props.logout();
					            	}
					            	else
					            	{
					            		alert(result.msg);
					            	}
					            }
					        }.bind(this));
						}
					}} />
				</View>
			</View>
  		);
	}
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
        backgroundColor : '#ccc',
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
		padding: 30,
		justifyContent: 'space-between',

	},
    inputView : {
		height : 48,
	},
});