import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View,
	Alert,
	ScrollView,
    TouchableHighlight,
    AsyncStorage,
} from 'react-native';

import Button from '../public/Button';
import LoadAnimated from '../public/LoadAnimated';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class SelectTheme extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
            modalVisible : false,
      	};

        this.timer = null;
        this.userInfo = null;
        this._navigator = {};
        this.renderItem = this.renderItem.bind(this);
        this.themes = [{
            name : 'Default',
            value: '#3590D9',
        },{
            name : 'Red',
            value: '#F44236',
        },{
            name : 'Pink',
            value: '#EA1E63',
        },{
            name : 'Purple',
            value: '#9C28B1',
        },{
            name : 'DeepPurple',
            value: '#673BB7',
        },{
            name : 'Indigo',
            value: '#4150B5',
        },{
            name : 'Blue',
            value: '#2396F3',
        },{
            name : 'LightBlue',
            value: '#03A9F5',
        },{
            name : 'Cyin',
            value: '#03BBD5',
        },{
            name : 'Teal',
            value: '#03958A',
        },{
            name : 'Green',
            value: '#4CAF52',
        },,{
            name : 'LightGreen',
            value: '#8BC24A',
        },{
            name : 'Lime',
            value: '#CDDC39',
        },{
            name : 'Yellow',
            value: '#FFEB3C',
        },{
            name : 'Amber',
            value: '#FEC00B',
        },{
            name : 'Orange',
            value: '#FF9700',
        },{
            name : 'DeepOrange',
            value: '#FE5722'
        },{
            name : 'Brown',
            value: '#795547'
        },{
            name : 'Grey',
            value: '#9E9E9E'
        },{
            name : 'BlueGrey',
            value: '#607D8B'
        },{
            name : 'Black',
            value: '#010101'
        },];
  	}

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

  	render() {
        this.userInfo = this.props.route.uinfo;
  		this._navigator = this.props.nav;
  		return (
            <View style={styles.flex}>
                <ScrollView contentContainerStyle={styles.menuBox}>
                    {this.themes.map((obj, i) => this.renderItem(obj, i))}
                </ScrollView>
                <LoadAnimated modalVisible={this.state.modalVisible} />
            </View>
  		);
	}

    renderItem = (obj, i) => {
        return (
			<TouchableHighlight 
				key={i}
				underlayColor='transparent'
				onPress={()=> {
                    if(this.userInfo && typeof(this.userInfo) == 'object') {
                        let that = this;
                        let time = new Date().getTime();
                        let t = 1000; // 1秒
                        this.setState({
                            modalVisible : true
                        }, () => {
                            that.userInfo.appColor = obj.value;
                            let time2 = new Date().getTime();
                            t = (time2 - time) > t ? t : (t - (time2 - time));
                            that.timer = setTimeout(() => {
                                AsyncStorage.setItem(Config.storageKey, JSON.stringify(that.userInfo), function(err) {
                                    if(!err) {
                                        that.setState({modalVisible : false}, () => {
                                            Config.appColor = obj.value;
                                            GoToPageSelf();
                                        });
                                    }
                                });
                            }, t);
                        });
                    }
				}}
			>
				<View style={[styles.depItem, {'backgroundColor' : obj.value}]}>
					<Text style={styles.depItemText} numberOfLines={1}>
						{obj.name}
					</Text>
				</View>
			</TouchableHighlight>
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
        backgroundColor : '#ddd',
    },
    loadTxt : {
        letterSpacing : 5,
        fontStyle : 'italic',
    },
    menuBox : {
		flexDirection : 'row',
		flexWrap: 'wrap',
		backgroundColor : '#fff',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		padding : 5,
	},
    depItem : {
		height: (Util.size.width - 50) / 4,
		borderRadius : 5,
		margin : 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	depItemText : {
		color : '#fff',
		width : (Util.size.width - 50) / 4,
		textAlign : 'center',
		paddingLeft : 10,
		paddingRight: 10,
		fontSize : 16,
	},
});