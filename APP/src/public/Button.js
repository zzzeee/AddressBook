import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View, 
	TouchableHighlight 
} from 'react-native';

export default class Button extends Component {

	//构造
	constructor(props)
	{
		super(props);
		this.state = {};
	}

	render() {
		let {text, onPress, style, textStyle, children} = this.props;
	    return (
	    	<TouchableHighlight onPress={onPress}>
	    		<View style={[styles.btnBox, style]}>
					<Text  numberOfLines={1} style={[styles.btnText, textStyle]}>{text}</Text>
					{children && children}
				</View>
			</TouchableHighlight>
	    );
	}
}

const styles = StyleSheet.create({
	btnBox : {
		minWidth : 100,
		height : 42,
		borderRadius : 8,
		backgroundColor : 'green',
		flexDirection : 'row',
		justifyContent: 'center',
		alignItems: 'center',
		margin : 5,
		padding : 5,
	},
	btnText : {
		color : '#fff',
	},
});
