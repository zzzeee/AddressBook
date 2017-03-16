import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View, 
	TouchableOpacity, 
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
var Config = require('./public/Config');

export default class AppTabBar extends Component {
	constructor(props) {
        super(props);
	}

	renderTabOption(tab, i) {
		//let {Menus, activeTab, goToPage} = this.props;
	  	let color = this.props.activeTab == i ? Config.appColor : "#666"; // 判断i是否是当前选中的tab，设置不同的颜色
		
		return (
		    <TouchableOpacity key={i} onPress={()=>{
					if(GoToPageObj) GoToPageObj = {};
					this.props.goToPage(i);
				}} style={styles.tab}>
		        <View style={styles.tabItem}>
		            <Icon
		                name={this.props.activeTab == i ? tab.selIcon : tab.icon}  // 图标
		                size={27}
		                color={color}/>
		            <Text style={{
						color: color,
						fontSize: 13,
					}}>
		                {tab.name}
		            </Text>
		        </View>
		    </TouchableOpacity>
	   	);
	}

	render() {
		return (
		    <View style={styles.tabs}>
		        {this.props.Menus.map((tab, i) => this.renderTabOption(tab, i))}
		    </View>
		);
	}
}

var styles = StyleSheet.create({
	tabs : {
		height : 50,
		backgroundColor : '#eee',
		flexDirection: 'row',
    	justifyContent: 'space-between',
    	borderTopColor : '#999',
	  	borderTopWidth : StyleSheet.hairlineWidth,
	},
	tab : {
		flex : 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	tabItem : {
		justifyContent: 'center',
		alignItems: 'center',
	},
});