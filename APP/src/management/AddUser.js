import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View, 
	Alert,
	ScrollView,
	Switch,
	Picker,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import Button from '../public/Button';
import InputText from '../public/InputText';
import PickerAndroidIOS from '../public/PickerAndroidIOS';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class AddUser extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
      		adduserOn : false,
      		sendnoticeOn : false,
      		birthday : null,
      		entryTime : Util.getFormatDate(null, 2),
      		departments : [],
      		levels : [],
      		selDepartment : '',
      		selLevel : '',
      	};

      	this.username = '';
      	this.newUserInfo = {
      		from : 'app',
      		type : 'add',
      		realName : '',
      		userName : '',
      		userDepartment : '',
      		userPosition : '',
      		userLevel : '',
      		userMobile : '',
      		userEmail : '',
      		userAddress : '',
      		userBirthday : '',
      		userEntryTime : '',
      		IsAddUser : '',
      		IsSendNotice : '',
      	};
  	}

  	componentWillMount() {
  		let {route} = this.props;
  		this.username = route.username;

  		let that = this;
		let url = Config.host + Config.getBasicInfo;

  		Util.fetch(url, 'get', {
  			action : 'add'
        }, function(result){
        	if(result && result.dep && result.lev)
        	{
        		result.dep.unshift({Name : '请选择'});
				let leverArray = [];
				for(let i in result.lev)
				{
					let obj = {
						name : '等级' + result.lev[i],
						value: result.lev[i]
					}
					leverArray.push(obj);
				}
        		that.setState({
	            	departments : result.dep,
	            	levels : leverArray,
	            });
        	}
        });
  	}

  	// 加载所有部门
  	readDepartments = (obj, i) => {
  		return <Picker.Item key={i} label={obj.Name} value={obj.Name} />;
  	};

  	// 加载所有等级
  	readLevels = (val, i) => {
  		return <Picker.Item key={i} label={'等级' + val} value={val} />;
  	};

  	render() {
  		let {nav} = this.props;
  		return (
  			<ScrollView contentContainerStyle={styles.bodyBox}>
  				<View style={styles.inputView}>
  					<Text style={styles.inputText}>姓名</Text>
  					<View style={styles.inlineRight}>
						<InputText pText='真实姓名' style={styles.flex} length={30} onChange={(txt)=>this.newUserInfo.realName = txt} />
	                </View>
				</View>
				<View style={styles.inputView}>
  					<Text style={styles.inputText}>用户名</Text>
  					<View style={styles.inlineRight}>
						<InputText pText='统一用姓名的拼音当用户名' style={styles.flex} length={30} onChange={(txt)=>this.newUserInfo.userName = txt} />
	                </View>
				</View>
				<View style={styles.inputView}>
					<Text style={styles.inputText}>APP权限</Text>
					<View style={styles.inlineRight2}>
						<Switch
					        onValueChange={(value) => {
					        	this.setState({adduserOn: value});
					        	this.newUserInfo.IsAddUser = value ? 1 : 0;
					        }}
					        value={this.state.adduserOn} />
					    <Text style={{paddingRight : 20}}>可添加用户</Text>
					    <Switch
					        onValueChange={(value) => {
					        	this.setState({sendnoticeOn: value});
					        	this.newUserInfo.IsSendNotice = value ? 1 : 0;
					        }}
					        value={this.state.sendnoticeOn} />
					    <Text>可发布公告</Text>
				    </View>
				</View>
				<View style={styles.inputView}>
					<Text style={styles.inputText}>密码</Text>
					<View style={styles.inlineRight}>
						<Text>默认： 123456, 请自行登录修改。</Text>
				    </View>
				</View>
				<View style={styles.inputView}>
					<Text style={styles.inputText}>部门</Text>
					<View style={styles.inlineRight}>
						<PickerAndroidIOS 
							options={this.state.departments} 
							initValue={this.state.selDepartment}
							selectLab="Name"
							selectVal="Name"
							onValueChange={(val)=>{
								this.newUserInfo.userDepartment=val;
								this.setState({selDepartment: val});
							}}
						/>
				    </View>
				</View>
				<View style={styles.inputView}>
  					<Text style={styles.inputText}>职位</Text>
  					<View style={styles.inlineRight}>
						<InputText pText='员工职位' style={styles.flex} length={30} onChange={(txt)=>this.newUserInfo.userPosition = txt} />
	                </View>
				</View>
				<View style={styles.inputView}>
  					<Text style={styles.inputText}>岗位等级</Text>
  					<View style={styles.inlineRight}>
						<PickerAndroidIOS 
							options={this.state.levels} 
							initValue={this.state.selLevel}
							selectLab='name'
							selectVal='value'
							onValueChange={(val)=>{
								this.newUserInfo.userLevel=val;
								this.setState({selLevel: val});
							}}
						/>
	                </View>
				</View>
				<View style={styles.inputView}>
  					<Text style={styles.inputText}>手机</Text>
  					<View style={styles.inlineRight}>
						<InputText pText='员工手机号码' style={styles.flex} length={11} keyType='numeric' onChange={(txt)=>this.newUserInfo.userMobile = txt} />
	                </View>
				</View>
				<View style={styles.inputView}>
  					<Text style={styles.inputText}>邮箱</Text>
  					<View style={styles.inlineRight}>
						<InputText pText='员工邮箱' style={styles.flex} length={11} onChange={(txt)=>this.newUserInfo.userEmail = txt} />
	                </View>
				</View>
				<View style={styles.inputView}>
  					<Text style={styles.inputText}>地址</Text>
  					<View style={styles.inlineRight}>
						<InputText pText='员工地址' style={styles.flex} onChange={(txt)=>this.newUserInfo.userAddress = txt} />
	                </View>
				</View>
				<View style={styles.inputView}>
  					<Text style={styles.inputText}>出生日期</Text>
  					<View style={styles.inlineRight}>
						<DatePicker
					        date={this.state.birthday}
					        mode="date"
					        placeholder="select date"
					        format="YYYY-MM-DD"
					        minDate="1960-01-01"
					        maxDate="2012-01-01"
					        confirmBtnText="Confirm"
					        cancelBtnText="Cancel"
					        onDateChange={(date) => {
					        	this.setState({birthday: date});
					        	this.newUserInfo.userBirthday = date;
					        }}
					        customStyles={{
					        	dateIcon: {
						            position: 'absolute',
						            right: 0,
						            top: 6,
					          	},
					        	dateInput: {
					        		height : 32,
					            	borderWidth : 1,
					            	borderColor : '#ccc',
					            	borderRadius: 5,
					            	marginTop : 4,
					          	}
					        }}
					    />
	                </View>
				</View>
				<View style={styles.inputView}>
  					<Text style={styles.inputText}>入职时间</Text>
  					<View style={styles.inlineRight}>
						<DatePicker
					        date={this.state.entryTime}
					        mode="date"
					        placeholder="select date"
					        format="YYYY-MM-DD"
					        minDate="2015-01-01"
					        maxDate="2020-01-31"
					        confirmBtnText="Confirm"
					        cancelBtnText="Cancel"
					        onDateChange={(date) => {
					        	this.setState({entryTime: date});
					        	this.newUserInfo.userEntryTime = date;
					        }}
					        customStyles={{
					        	dateIcon: {
						            position: 'absolute',
						            right: 0,
						            top: 6,
					          	},
					        	dateInput: {
					        		height : 32,
					            	borderWidth : 1,
					            	borderColor : '#ccc',
					            	borderRadius: 5,
					            	marginTop : 4,
					          	}
					        }}
					    />
	                </View>
				</View>

				<View style={styles.btnAddUser}>
					<Button text='添 加' style={{backgroundColor : Config.appColor}} onPress={()=>{
						if(this.newUserInfo.realName == '')
						{
							alert('员工姓名不能为空');
							return false;
						}

						if(this.newUserInfo.userName == '')
						{
							alert('用户名不能为空');
							return false;
						}
						
						if(!this.newUserInfo.userDepartment || this.newUserInfo.userDepartment == '' || this.newUserInfo.userDepartment == '请选择')
						{
							alert('请选择员工部门');
							return false;
						}

						if(this.newUserInfo.userPosition == '')
						{
							alert('员工职位不能为空');
							return false;
						}

						if(this.newUserInfo.userMobile == '')
						{
							alert('员工手机不能为空');
							return false;
						}

						let that = this;
						let url = Config.host + Config.saveUser;
				  		Util.fetch(url, 'post', this.newUserInfo, function(result){
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
        backgroundColor : '#eee',
    },
    loadTxt : {
        letterSpacing : 5,
        fontStyle : 'italic',
    },
    bodyBox : {
		backgroundColor : '#fff',
		padding: 18,
	},
    inputView : {
		height : 36,
		flexDirection : 'row',
		justifyContent: 'flex-start',
		alignItems : 'center',
		marginBottom : 10,
	},
	inputText : {
		color : '#444',
		flex : 1,
	},
	inlineRight : {
		flex : 3.5,
	},
	inlineRight2 : {
		flex : 3.5,
		flexDirection : 'row',
		justifyContent: 'flex-start',
		alignItems : 'center',
	},
    btnAddUser : {
    	height : 32,
    	marginTop : 50,
    	marginBottom : 30,
    },
});