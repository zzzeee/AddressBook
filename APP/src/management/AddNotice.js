import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View,
	Alert,
	ScrollView,
	TextInput,
	Picker,
	Switch,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import Button from '../public/Button';
import PickerAndroidIOS from '../public/PickerAndroidIOS';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class AddUser extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
      		departments : [],
      		selDepartment : '所有部门',
      		isUrgent : false,
      	};

      	this.notice_txt = '';
		this.userid = '';
      	this.uname = '';
      	this.username = '';
  	}

  	componentDidMount() {
  		let {route} = this.props;
		this.userid = route.userid;
  		this.uname = route.uname;
  		this.username = route.username;
  		this.department = route.department;

  		let that = this;
		let url = Config.host + Config.getUserInfo;

  		Util.fetch(url, 'get', {
  			action : 'add'
        }, function(result){
        	if(result && result.dep)
        	{
        		result.dep.unshift({Name : '所有部门'});
        		that.setState({
	            	departments : result.dep,
	            });
        	}
        });
  	}

  	render() {
  		let {nav} = this.props;
  		return (
  			<ScrollView contentContainerStyle={styles.bodyBox}>
  				<View style={styles.inputView}>
					<Text style={styles.inlineLeft}>发送给</Text>
					<View style={styles.inlineRight}>
						<PickerAndroidIOS 
							options={this.state.departments} 
							initValue={this.state.selDepartment}
							selectLab='Name'
							selectVal='Name'
							onValueChange={(val)=>{
								this.setState({selDepartment: val});
							}}
						/>
				    </View>
				</View>
				<View style={styles.inputView}>
					<Text style={styles.inputText}>是否紧急</Text>
					<View style={styles.inlineRight}>
						<Switch
					        onValueChange={(value) => {
					        	this.setState({isUrgent: value});
					        }}
					        value={this.state.isUrgent} />
				    </View>
				</View>
				<View style={styles.contentBox}>
					<TextInput
	                    style={styles.inputStyle}
	                    onChangeText={(text) => {
	                    	this.notice_txt = text;
	                    }}
	                    value={null}
	                    placeholder='请输入公告内容'
	                    placeholderTextColor='#bbb'
	                    underlineColorAndroid='transparent'
	                    multiline={true}
	                />
				</View>
  				<View style={styles.btnAddUser}>
					<Button text='发 布' style={{backgroundColor : Config.appColor}} onPress={()=>{
						if(this.uname && this.username && this.notice_txt)
						{
							let that = this;
							let url = Config.host + Config.addNotice;
					  		Util.fetch(url, 'post', {
					  			type : this.state.isUrgent ? 1 : 0,
					  			name : this.uname,
								uid : this.userid,
					  			username : this.username,
					  			department : this.state.selDepartment,
					  			content : this.notice_txt
					  		}, function(result){
					        	if(result && result.msg)
					        	{
					        		alert(result.msg);

					        		if(result.err === 0)
					        		{
					        			nav.push({title:'管理', id:'main'});
					        		}
					        	}
					        	else
					        	{
					        		alert('请求失败');
					        	}
					        });
						}
					}} />
				</View>
			</ScrollView>
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
        backgroundColor : '#ddd',
    },
    loadTxt : {
        letterSpacing : 5,
        fontStyle : 'italic',
    },
    bodyBox : {
    	flex : 1,
		backgroundColor : '#eee',
		padding: 10,
	},
	inputView : {
		height : 40,
		flexDirection : 'row',
		alignItems: 'center',
        justifyContent: 'center',
	},
	contentBox : {
		flex : 1,
		height : 220,
		marginTop : 10,
	},
	blurOnSubmit : {
		width : 100,
		backgroundColor : '#ddd',
	},
	inlineLeft : {
		flex : 1,
	},
	inlineRight : {
		flex : 3.6,
	},
	inputStyle : {
		flex : 1,
		borderWidth : 1,
		borderColor : '#aaa',
		borderRadius: 8,
		backgroundColor : '#fff',
		padding : 10,
		fontSize : 13,
		color : '#666',
	},
	btnAddUser : {
		height : 50,
		alignItems: 'flex-end',
		justifyContent: 'center',
		marginTop : 30,
		marginBottom : 20,
	},
});