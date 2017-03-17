import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View, 
	TouchableHighlight,
	Alert,
	ScrollView,
	Switch,
	Image,
} from 'react-native';

import Button from '../public/Button';
import TopTitle from '../public/TopTitle';
import InputText from '../public/InputText';
import Toast from 'react-native-root-toast';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadAnimated from '../public/LoadAnimated';

var Util = require('../public/Util');
var Config = require('../public/Config');
var maxImageSize = 1024 * 1024 * 2;	// 2M
var maxImageSizeM = 2;
var maxPX = 1800;	// 1800像素

// More info on all the options is below in the README...just some common use cases shown here
var options = {
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
	quality: 0.7,
	maxWidth: maxPX,
	maxHeight: maxPX,
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
			birthday : null,
			localUserId: null,
			userHeadImg : null,
			modalVisible : false,
      	};

		// 部分可自行修改的内容
		// 一些信息需人事确认修改 如果：部门，姓名等。
		this.toast = null;
		this.userInfo = null;
		this._userInfo = null;
		this.userHeadImg = null;
		this.selectLocalImage = this.selectLocalImage.bind(this);
  	}

  	componentWillMount() {
  		let that = this;
		let _id = that.props._id;
		if(_id && this.props.uid)
		{
			let url = Config.host + Config.getUserInfo;
			Util.fetch(url, 'get', {
				action : 'edit',
				uid : that.props.uid,
			}, function(ret){
				if(ret && ret.uinfo){
					that.userInfo = ret.uinfo;
					that._userInfo = Object.assign({}, ret.uinfo);
					that.setState({
						localUserId : _id,
						birthday : ret.uinfo.Birthday,
						userHeadImg : ret.uinfo.HeadImg ? {uri: Config.host + '/images/' + ret.uinfo.HeadImg} : require('../../images/head.jpeg'),
					});
				}else{
					//alert('未查询到该用户信息');
					that.toast = Toast.show('未查询到该用户信息', {
						duration: Toast.durations.LONG,
						position: Toast.positions.CENTER,
						hideOnPress: true,
					});
				}
			});
		}
  	}

	componentWillUnmount() {
		//this.toast && clearTimeout(this.toast);
		//Toast.hide(this.toast);
	}

  	render() {
		let uinfo = this.userInfo || null;
  		let {nav, route, uid} = this.props;	
		if(!uinfo || !uid) {
			return (
				<View style={styles.loadBox}>
					<Text style={styles.loadTxt}>正在加载 ..</Text>
				</View>
			);
		}
		let disEdit = (uid == this.state.localUserId) ? false : true;
  		return (
			<View style={styles.flex}>
				<LoadAnimated modalVisible={this.state.modalVisible} />
				<TopTitle  title={route.title} showReturn={true} appColor={Config.appColor} onPress={()=>{
					this.toast && Toast.hide(this.toast);
					let obj = {id : route.returnId, title : route.returnTitle};
					
					if(route.search) obj.search = route.search;
					if(route.returnId2) obj.returnId = route.returnId2;
					if(route.returnTitle2) obj.returnTitle = route.returnTitle2;

					nav.push(obj);
				}} />
				<ScrollView contentContainerStyle={styles.bodyBox}>
					<TouchableHighlight underlayColor='transparent' onPress={()=>{
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
							{disEdit ? null : <Text>点击更改</Text>}
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
							if(disEdit || this.state.modalVisible) return false;

							if(this.userInfo.Position == '')
							{
								//alert('员工职位不能为空');
								this.toast = Toast.show('员工职位不能为空', {
									duration: Toast.durations.LONG,
									position: Toast.positions.CENTER,
									hideOnPress: true,
								});
								return false;
							}

							if(this.userInfo.Mobile == '')
							{
								//alert('员工手机不能为空');
								this.toast = Toast.show('员工手机不能为空', {
									duration: Toast.durations.LONG,
									position: Toast.positions.CENTER,
									hideOnPress: true,
								});
								return false;
							}

							//判断是否修改信息
							if((!this.userHeadImg || (this.userHeadImg && this.userHeadImg.data == this._userInfo.imageData)) && 
								this.userInfo.Position == this._userInfo.Position && 
								this.userInfo.Mobile == this._userInfo.Mobile && 
								this.userInfo.Email == this._userInfo.Email && 
								this.userInfo.Address == this._userInfo.Address && 
								this.userInfo.Explain == this._userInfo.Explain &&
								this.userInfo.Birthday == this.state.birthday)
							{
								this.toast = Toast.show('资料未修改，无需提交。', {
									duration: Toast.durations.LONG,
									position: Toast.positions.CENTER,
									hideOnPress: true,
								});
								return false;
							}

							this.setState({modalVisible : true});
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
									//alert(result.msg);
									//if(result.err === 0)
									//{
									//	nav.push({id : 'main'});
									//}
									that.setState({modalVisible : false}, ()=>{
										for(let key in that.userInfo)
										{
											that._userInfo[key] = that.userInfo[key];
										}

										that.toast = Toast.show(result.msg, {
											position: Toast.positions.CENTER,
										});
									});
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
			else if (!response.data)
			{
				return false;
			}
			else if (response.width > maxPX || response.height > maxPX)
			{
				this.toast = Toast.show('你上传的图片像素过大(最大' + maxPX + '*' + maxPX + ')', {
					duration: Toast.durations.LONG,
					position: Toast.positions.CENTER,
					hideOnPress: true,
				});
				return false;
			}
			else if(response.type != 'image/jpeg' && response.type != 'image/png' && response.type != 'image/gif' && response.type != 'image/bmp')
			{
				//alert('你上传的图片类型不对');
				this.toast = Toast.show('你上传的图片类型不可用', {
					duration: Toast.durations.LONG,
					position: Toast.positions.CENTER,
					hideOnPress: true,
				});
				return false;
			}
            else {
				this.userHeadImg = response;
				this.userInfo.imageType = response.type;
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