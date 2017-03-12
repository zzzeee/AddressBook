import React, { Component } from 'react';
import {
	StyleSheet,
	Text, 
	View, 
    Picker, 
    PickerIOS,
    Modal,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../public/Button';

var Util = require('../public/Util');

export default class PickerAndroidIOS extends Component {

	//构造
	constructor(props)
	{
		super(props);
		this.state = {
            //...props,
            modalVisible : false,
            selectValIOS : null,
        };
        
	}

    componentDidMount() {
    }

	render() {
		let {options, initValue, selectLab, selectVal, onValueChange} = this.props;
        let _initValue = initValue ? initValue : (options && options[0] && options[0][selectVal] ? options[0][selectVal] : null);
        
	    return (
            <View style={styles.PickerBox}>
                {__IOS__ ?
                    <Button text={_initValue} style={{
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }} textStyle={{
                            color : '#555',
                        }} onPress={()=>{this.setState({modalVisible: true})}} 
                    >
                        <Icon name="caret-down" size={18} color='#555' />
                    </Button> :
                    <Picker
                        selectedValue={_initValue}
                        onValueChange={(value) => onValueChange(value)}
                        style={styles.pickerStyle}
                    >
                        {options.map((obj, i) => this.readOptionAndroid(obj, i, selectLab, selectVal))}
                    </Picker>
                }
                {__IOS__ ?
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {}}
                >
                    <View style={styles.modalBody}>
                        <View style={styles.pickerContralBox}>
                            <Button text="取消" style={styles.btnModal} onPress={()=>this.setState({modalVisible: false})} />
                            <Button text="确定" style={styles.btnModal} onPress={()=>{
                                this.setState({
                                    modalVisible : false,
                                }, onValueChange(this.state.selectValIOS));
                            }} />
                        </View>
                        <View style={styles.pickerBottomBox}>
                            <PickerIOS
                                selectedValue={this.state.selectValIOS ? this.state.selectValIOS : _initValue}
                                onValueChange={(value) => this.setState({selectValIOS : value})}
                            >
                                {options.map((obj, i) => this.readOptionIOS(obj, i, selectLab, selectVal))}
                            </PickerIOS>
                        </View>
                    </View>
                </Modal>
                : null}
            </View>
	    );
	}

    // 加载所有子项 安卓
  	readOptionAndroid = (obj, i, lab, val) => {
        let _lab = lab ? obj[lab] : obj;
        let _val = val ? obj[val] : obj;
  		return <Picker.Item key={i} label={_lab} value={_val} />;
  	};

    // 加载所有子项 苹果
    readOptionIOS = (obj, i, lab, val) => {
        let _lab = lab ? obj[lab] : obj;
        let _val = val ? obj[val] : obj;
  		return <PickerIOS.Item key={i} label={_lab} value={_val} />;
  	};
}

const styles = StyleSheet.create({
    flex : {
        flex : 1,
    },
    PickerBox : {
        height : 34,
        borderRadius: 10,
        borderWidth : 1,
        borderColor : '#aaa',
        backgroundColor : '#ddd',
        //alignItems: 'center',
        justifyContent: 'center',
    },
    pickerIOSStyle : {
        flex : 1,
        width : Util.size.width,
    },
    modalBody : {
        height : 200,
        backgroundColor : '#aaa',
        borderTopWidth : 2,
        borderColor : '#222',
        position : 'absolute',
        bottom : 0,
        left : 0,
    },
    pickerContralBox : {
        height : 30,
        paddingLeft : 10,
        paddingRight : 10,
        backgroundColor : '#444',
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnModal : {
        minWidth : 60,
        height : 26,
        padding : 2,
        backgroundColor : '#0088cc',
        borderColor : '#222',
        borderRadius : 3,
        borderWidth : 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerBottomBox : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerStyle : {
        color : '#666',
    },
});
