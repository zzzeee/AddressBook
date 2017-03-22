import React, {
    Component
} from 'react';
import {
    Animated,
    Easing,
    Image,
    StyleSheet,
    Text,
    View,
    Modal,
    ActivityIndicator
} from 'react-native';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class LoadAnimated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rotateValue: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.startAnimation();
    }

    startAnimation = () => {
        let that = this;
        this.state.rotateValue.setValue(0);
        Animated.timing(
            this.state.rotateValue, {
                toValue: 1,             // 目标值
                duration: 800,          // 动画时间
                easing: Easing.linear
            }
        ).start(that.startAnimation);
    };

    render() {
        let {text = '正在加载', appColor = Config.appColor} = this.props;
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={() => {}}
            >
                <View style={styles.centerBox}>
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>{text}</Text>
                        <ActivityIndicator
                            animating={true}
                            color={'#fff'}
                            size="small"
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    centerBox : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBody : {
        width : Util.size.width * 0.5,
        flexDirection : 'row',
		alignItems: 'center',
        justifyContent: 'center',
        borderWidth : 2,
        borderColor : '#aaa',
		backgroundColor : 'rgba(0, 0, 0, 0.92)',
        padding : 30,
		borderRadius : 18,
	},
	modalText : {
		color : '#fff',
        fontSize : 16,
        paddingRight: 20,
	},
});