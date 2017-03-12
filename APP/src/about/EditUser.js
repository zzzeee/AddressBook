import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View, 
	TouchableHighlight,
	Alert,
	ScrollView,
	Switch,
	AsyncStorage,
	Image,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import Button from '../public/Button';
import TopTitle from '../public/TopTitle';
import InputText from '../public/InputText';

var Util = require('../public/Util');
var Config = require('../public/Config');
var maxImageSize = 1024 * 1024 * 3;	// 3M

// More info on all the options is below in the README...just some common use cases shown here
var options = {
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照 (不可用)',
    chooseFromLibraryButtonTitle: '选择相册',
	quality: 0.7,
	allowsEditing: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
};

export default class EditUser extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
			userHeadImg : null,
      		birthday : null,
			userInfo : null,
			localUserId: null,
      	};

		// 部分可自行修改的内容
		// 一些信息需人事确认修改 如果：部门，姓名等。
		this.userHeadImg
      	this.userInfo = null;
		this.selectLocalImage = this.selectLocalImage.bind(this);
  	}

  	componentDidMount() {
  		let that = this;
		
        AsyncStorage.getItem(Config.storageKey, function(err, result){
            if(!err && result)
            {
				let _id = JSON.parse(result)._id;
				if(_id && that.props.uid)
				{
					let url = Config.host + Config.getUserInfo;
					Util.fetch(url, 'get', {
						action : 'edit',
						uid : that.props.uid,
					}, function(ret){
						if(ret && ret.uinfo){
							that.userInfo = ret.uinfo;
							that.setState({
								birthday : ret.uinfo.Birthday,
								localUserId : _id,
								userInfo : ret.uinfo,
								userHeadImg : ret.uinfo.HeadImg ? {uri: Config.host + '/images/' + ret.uinfo.HeadImg} : require('../../images/head.jpeg'),
							});
						}else{
							alert('未查询到该用户信息')
						}
					});
				}
            }
        });
  	}

  	render() {
		let uinfo = this.state.userInfo || null;
  		let {nav, route, uid} = this.props;
		
		if(!uinfo || !uid) return null;
		
		let disEdit = (uid == this.state.localUserId) ? false : true;
		
  		return (
			<View style={styles.flex}>
				<TopTitle  title={route.title} showReturn={true} onPress={()=>{
					nav.push({id : route.returnId});
				}} />
				<ScrollView contentContainerStyle={styles.bodyBox}>
					<TouchableHighlight onPress={()=>{
						if(!disEdit)
						{
							this.selectLocalImage();
						}
					}}>
						<View style={styles.headView}>
							<Image
								source={this.state.userHeadImg}
								style={styles.headImage}
							/>
							<Text>点击更改</Text>
						</View>
					</TouchableHighlight>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>姓名</Text>
						<View style={styles.inlineRight}>
							<InputText style={styles.disableInput} defaultValue={uinfo.Name} disEdit={true} />
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>用户名</Text>
						<View style={styles.inlineRight}>
							<InputText style={styles.disableInput} defaultValue={uinfo.UserName} disEdit={true} />
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>APP权限</Text>
						<View style={styles.inlineRight2}>
							<Switch
								value={uinfo.IsAddUser} />
							<Text style={{paddingRight : 20}}>可添加用户</Text>
							<Switch
								value={uinfo.IsSendNotice} />
							<Text>可发布公告</Text>
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>部门</Text>
						<View style={styles.inlineRight}>
							<InputText style={styles.disableInput} defaultValue={uinfo.Department} disEdit={true} />
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>职位</Text>
						<View style={styles.inlineRight}>
							<InputText 
								style={disEdit ? styles.disableInput : styles.flex} 
								length={30} 
								pText='员工职位' 
								defaultValue={uinfo.Position} 
								disEdit={disEdit}
								onChange={(txt)=>this.userInfo.Position = txt} 
							/>
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>岗位等级</Text>
						<View style={styles.inlineRight}>
							<InputText style={styles.disableInput} length={30} defaultValue={'等级' + uinfo.Level} disEdit={true} />
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>手机</Text>
						<View style={styles.inlineRight}>
							<InputText defaultValue={uinfo.Mobile} pText='员工手机号码' 
								style={disEdit ? styles.disableInput : styles.flex}
								length={11} 
								disEdit={disEdit}
								keyType='numeric' 
								onChange={(txt)=>this.userInfo.Mobile = txt} 
							/>
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>邮箱</Text>
						<View style={styles.inlineRight}>
							<InputText 
								defaultValue={uinfo.Email} 
								pText='员工邮箱' 
								style={disEdit ? styles.disableInput : styles.flex}  
								length={50} 
								disEdit={disEdit} 
								onChange={(txt)=>this.userInfo.Email = txt} 
							/>
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>地址</Text>
						<View style={styles.inlineRight}>
							<InputText 
								defaultValue={uinfo.Address} 
								pText='员工地址' 
								style={disEdit ? styles.disableInput : styles.flex}  
								length={60} 
								disEdit={disEdit} 
								onChange={(txt)=>this.userInfo.Address = txt} 
							/>
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>出生日期</Text>
						<View style={styles.inlineRight}>
							{disEdit ?
								<InputText style={styles.disableInput} defaultValue={Util.getFormatDate(uinfo.Birthday, 2)} disEdit={true} /> :
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
							}
						</View>
					</View>
					<View style={[styles.inputView, {height : 100}]}>
						<Text style={styles.inputText}>简介</Text>
						<View style={styles.inlineRight}>
							<InputText 
								style={disEdit ? styles.disableInput : styles.flex} 
								length={200} 
								pText='个人简介' 
								defaultValue={uinfo.Explain}
								disEdit={disEdit}
								onChange={(txt)=>this.userInfo.Explain = txt} 
								multiline={true}
							/>
						</View>
					</View>
					<View style={styles.inputView}>
						<Text style={styles.inputText}>入职时间</Text>
						<View style={styles.inlineRight}>
							<InputText style={styles.disableInput} defaultValue={Util.getFormatDate(uinfo.EntryTime, 2)} disEdit={true} />
						</View>
					</View>

					<View style={styles.btnAddUser}>
						<Button text='修 改' style={{backgroundColor : (disEdit ? '#ccc' : Config.appColor)}} onPress={()=>{
							if(disEdit) return false;

							if(this.userInfo.Position == '')
							{
								alert('员工职位不能为空');
								return false;
							}

							if(this.userInfo.Mobile == '')
							{
								alert('员工手机不能为空');
								return false;
							}

							let that = this;
							let url = Config.host + Config.saveUser;
							Util.fetch(url, 'post', {
								type : 'edit',
								from : 'app',
								uid : that.userInfo._id,
								userName : that.userInfo.UserName,
								userPosition : that.userInfo.Position,
								userMobile : that.userInfo.Mobile,
								userEmail : that.userInfo.Email,
								userAddress : that.userInfo.Address,
								userExplain : that.userInfo.Explain,
								userBirthday : that.state.birthday,
								imageType : that.userInfo.imageType ? that.userInfo.imageType : '',
								imageData : that.userInfo.imageData ? that.userInfo.imageData : '',
							}, function(result){
								
								if(result && result.msg)
								{
									alert(result.msg);
									if(result.err === 0)
									{
										nav.push({id : 'main'});
									}
								}
							});
						}} />
					</View>
				</ScrollView>
			</View>
  		);
	}

	//选择本地图片
    selectLocalImage = () => {
        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info below in README)
         */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
			else if (response.fileSize > maxImageSize) {
				alert('你上传图片过大');
				return false;
			}
            else {
				switch(response.type){
					case 'image/jpeg' :
						this.userInfo.imageType = 'jpg';
						break;
					case 'image/png' :
						this.userInfo.imageType = 'png';
						break;
					case 'image/gif' : 
						this.userInfo.imageType = 'gif';
						break;
					case 'image/bmp' : 
						this.userInfo.imageType = 'bmp';
						break;
					default : 
						alert('你上传的图片类型不对');
						return false;
				}

				this.userHeadImg = response;
				this.userInfo.imageData = response.data;
                let source = {uri: response.uri};
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    userHeadImg: source
                });
            }
        });
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
	headView : {
		height : 80,
		flexDirection : 'row',
		alignItems : 'center',
		justifyContent: 'space-between',
		marginBottom : 10,
		paddingRight : 6,
		paddingLeft : 6,
	},
    bodyBox : {
		backgroundColor : '#fff',
		padding: 18,
	},
	headImage : {
		width : 80,
		height : 80,
		borderRadius : 40,
		borderWidth : 1,
		borderColor : '#ccc',
	},
	disableInput : {
		flex : 1,
		backgroundColor : '#ddd',
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