import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View, 
	TouchableOpacity,
	AsyncStorage,
	Alert,
    Navigator,
} from 'react-native';

import Main from './Main';
import AddUser from './AddUser';
import AddNotice from './AddNotice';
import TopTitle from '../public/TopTitle';
import ChangeUserPwd from './ChangeUserPwd';
import Icon from 'react-native-vector-icons/FontAwesome';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class Management extends Component {
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

  	componentWillMount() {
  		let that = this;
        AsyncStorage.getItem(Config.storageKey, function(err, result){
            if(!err && result)
            {
                that.userInfo = JSON.parse(result);
            }
        });
  	}

    render() {
        return (
            <Navigator
                initialRoute={{title: this.props.title, id: this.props.pageId}}
                renderScene={this.rendNavigator}
            />
        );   
    }

    //跳转管理
    rendNavigator = (route, navigator) => {
        switch(route.id){
            case 'main' :
                return this.pageContent(route, navigator, false, <Main nav={navigator} route={route} logout={this.props.logout} />);
                break;
            case 'management_pwd' :
                return this.pageContent(route, navigator, true, <ChangeUserPwd nav={navigator} route={route} logout={this.props.logout} />);
                break;
            case 'management_adduser' :
                return this.pageContent(route, navigator, true, <AddUser nav={navigator} route={route} />);
                break;
            case 'management_addnotice' :
                return this.pageContent(route, navigator, true, <AddNotice nav={navigator} route={route} />);
                break;
            default : 
                return null;
                break;
        }
    };

    // 页面内容结构
    pageContent = (route, nav, isReturn, body) => {
        return (
            <View style={styles.flex}>
                <TopTitle  title={route.title} showReturn={isReturn} 
                    onPress={() => {
                        nav.push({title:'管理', id:'main'});
                    }}
                />
                {body}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    flex : {
        flex : 1,
        backgroundColor : '#fff',
    },
});
