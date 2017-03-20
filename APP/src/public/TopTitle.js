import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View, 
	TouchableHighlight, 
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

var Config = require('./Config');

export default class TopTitle extends Component {

	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {};
  	}

	render() {
		let {title, onPress, showReturn, sideRight} = this.props;
		
	    return (
	    	<View style={[styles.topBox, this.props.appColor ? {backgroundColor: this.props.appColor} : {}]}>
	    		<View style={styles.sideBox}>
	    			{this.props.showReturn ?
	    				<TouchableHighlight underlayColor='transparent' style={styles.btn} onPress={onPress}>
		    				<Icon name="ios-arrow-dropleft-outline" size={26} color="#eee" />
		    			</TouchableHighlight>
		    			: null
	    			}
	    		</View>
	    		<View style={styles.middleBox}>
	    			<Text style={styles.title}>{title}</Text>
	    		</View>
	    		<View style={[styles.sideBox, {paddingBottom: 6}]}>
					{sideRight ? sideRight : null}
	    		</View>
			</View>
	    );
	}
}

var styles = StyleSheet.create({
	topBox : {
		height : 60,
		flexDirection : 'row',
		justifyContent : 'center',
		alignItems: 'flex-end',
		paddingBottom : 4,
		backgroundColor : Config.appColor,
	},
	sideBox : {
		flex : 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	middleBox : {
		flex : 8,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom : 6,
	},
	title : {
		color : '#fff',
		fontSize : 18,
	},
	btn : {
		padding : 5,
	},
});
