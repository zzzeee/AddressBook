import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View, 
    TextInput, 
} from 'react-native';

export default class InputText extends Component {

	//构造
	constructor(props)
	{
		super(props);
		this.state = {};
	}

	render() {
		let {vText, defaultValue, pText, pcolor, onChange, style, isPWD, length, focus, keyType, disEdit, multiline} = this.props;
	    return (
            <TextInput
                style={[styles.inputStyle, style]}
                onChangeText={(text) => onChange(text)}
                value={vText ? vText : null}
                defaultValue={defaultValue ? defaultValue : null}
                placeholder={pText}
                placeholderTextColor={pcolor ? pcolor : '#bbb'}
                secureTextEntry={isPWD ? true : false}
                underlineColorAndroid='transparent'
                maxLength={length ? length : null}
                autoFocus={focus ? true : false}
                keyboardType={keyType ? keyType : 'default'}
                editable={disEdit ? false : true}
                multiline={multiline ? multiline : false}
            />
	    );
	}
}

const styles = StyleSheet.create({
	inputStyle : {
        color : '#444',
        padding : 9,
        fontSize : 14,
        height : 34,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor : '#fff'
    },
});
