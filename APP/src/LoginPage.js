import React, { Component } from 'react';
import {
	StyleSheet,
  	Text,
  	View,
  	AsyncStorage,
  	Image,
    StatusBar,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Button from './public/Button';
import InputText from './public/InputText';

var Util = require('./public/Util');
var Config = require('./public/Config');

export default class LoginPage extends Component {

	//构造
	constructor(props)
	{
		super(props);
		this.state = {};

		this.checkLogin = this.checkLogin.bind(this);
        this.userInfo = {};
        this.user = '';
        this.pwd = '';
	}

	render() {
        return (
        <View style={[styles.loginBody, {backgroundColor: this.props.appColor}]}>
            <StatusBar
                backgroundColor={this.props.appColor}
                barStyle="light-content"
            />
            <View style={styles.logoBox}>
                <Image 
                    source={require('../images/jtlogofff.png')} 
                    style={styles.loginLogo}
                />
                <View style={styles.inputBox}>
                    <View style={styles.inputItem}>
                        <View style={styles.iconBox}>
                            <Icon name={'ios-person'} size={30} color={'#888'}/>
                        </View>
                        <View style={styles.inputView}>
                            <InputText pText='用户名或手机' onChange={(txt)=>this.user = txt} isPWD={false} length={30} />
                        </View>
                    </View>
                    <View style={styles.inputItem}>
                        <View style={styles.iconBox}>
                            <Icon name={'md-lock'} size={30} color={'#888'}/>
                        </View>
                        <View style={styles.inputView}>
                            <InputText pText='密码' onChange={(txt)=>this.pwd = txt} isPWD={true} length={20} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.loginButtonView}>
                <Button text='登 录' style={styles.loginButton} onPress={this.checkLogin} />
            </View>
        </View>
        );
    }

    //检查登录
    checkLogin = () => {
        let URL = Config.host + Config.login;
        let that = this;
        if(Util.trim(this.user) == '')
        {
            alert('用户名不能为空');
            return false;
        }

        if(Util.trim(this.pwd) == '')
        {
            alert('密码不能为空');
            return false;
        }

        Util.fetch(URL, 'post', {
            user : Util.trim(this.user),
            pwd : this.pwd,
        }, function(result){
            //console.log(result);
            if(result)
            {
                if(result.err) {
                    alert(result.msg ? result.msg : '帐号/密码不正确');
                } else {
                    AsyncStorage.setItem(Config.storageKey, JSON.stringify(result), function(err){
                        if(!err && result) {
                            that.props.callback(result);
                        }
                    });
                }
            }
        });
    };
}

var styles = StyleSheet.create({
	loginBody : {
        flex : 1,
        backgroundColor : '#3A98E2',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoBox : {
        alignItems : 'center',
    },
    loginLogo : {
        width : 80,
        height : 80,
        marginTop : 50,
    },
    inputBox : {
        width : Util.size.width * 0.8,
        marginTop : 60,
        padding : 20,
        borderRadius: 8,
        backgroundColor : '#fff',
    },
    inputItem : {
        height : 40,
        flexDirection : 'row',
        marginTop : 10,
        marginBottom: 10,
    },
    iconBox : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight : 10,
    },
    inputView : {
        flex : 7,
        justifyContent: 'center',
    },
    loginButtonView : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton : {
        backgroundColor : '#058075',
        width : Util.size.width * 0.8,
        borderWidth : Util.pixel,
        borderColor : '#5fd3e0'
    },
});