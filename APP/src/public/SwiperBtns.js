/**
 * 侧边 Swiper 按钮效果
 * 
 * Date : 2017.04.06
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    PanResponder,
    propTypes,
    TouchableOpacity,
} from 'react-native';

export default class SwiperBtns extends Component {
    // 默认参数
    static defaultProps = {
        friction: 4,        //摩擦力
        tension: 40,        //张力
        direction: 'right', //默认方向 (顺时针)
    };
    // 参数类型
    static propTypes = {
        btns: React.PropTypes.array,
        textStyle: React.PropTypes.object,
        itemHeight: React.PropTypes.number.isRequired,
        friction: React.PropTypes.number.isRequired,
        tension: React.PropTypes.number.isRequired,
        direction: React.PropTypes.oneOf(['left', 'right']),
    };
    // 构造函数
    constructor(props) {
        super(props);

        this.minOffset = 10;
        this.textWidth = 0;
        this.positionValue = 0;
        this.position = new Animated.Value(0);
        // 监听 this.position 值的变化
        this.position.addListener(v => {
            this.positionValue = v.value;
        });
    }

    //定义触屏响应事件
    panResponderInit = PanResponder.create({
        // 要求成为响应者：
        onStartShouldSetPanResponder: (evt, gestureState) => false,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        // 响应开始
        onPanResponderGrant: (evt, gestureState) => {
            this.position.setOffset(this.positionValue);
            this.position.setValue(0);
        },
        // 移动过程
        onPanResponderMove: (evt, gestureState) => {
            const {dx} = gestureState;
            let left = dx;
            let min = this.minOffset;
            let max = this.textWidth + this.minOffset;
            if(this.textWidth > 0) {
                if(this.props.direction === 'left') {
                    if(dx > max) left = max;
                    if(dx < -min) left = -min;
                    this.position.setValue(left);
                }else {
                    if(dx > min) left = min;
                    if(dx < -max) left = -max;
                    this.position.setValue(left);
                }
            }
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        // 响应结束
        onPanResponderRelease: (evt, {vx}) => {
            this.position.flattenOffset();
            let result = 0;
            let min = this.minOffset;
            let max = this.textWidth + this.minOffset;
            let half = this.textWidth / 2;
            // 速度快时 按方向翻页。否则按移动距离翻页。
            if(this.props.direction === 'left') {
                if(vx > 0.05) {
                    result = this.textWidth;
                }
                else if(vx < -0.05) {
                    result = 0;
                }else {
                    if(this.positionValue >= half) {
                        result = this.textWidth;
                    }else {
                        result = 0;
                    }
                }
            }else {
                if(vx > 0.05) {
                    result = 0;
                }
                else if(vx < -0.05) {
                    result = -this.textWidth;
                }else {
                    if(this.positionValue > -half) {
                        result = 0;
                    }else {
                        result = -this.textWidth;
                    }
                }
            }
            // 动画效果
            Animated.spring(this.position, {
                toValue: result,
                friction: this.props.friction,
                tension: this.props.tension,
            }).start();
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
            // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
            // 默认返回true。目前暂时只支持android。
            return true;
        },
    });

    // 基本函数
    render() {
        const { textStyle, itemHeight, children, btns } = this.props;
        let btnText = btns.map((btn, i) => {
            let bgColor = btn.backgroundColor || null;
            if(!bgColor || (typeof(bgColor) != 'string')) {
                let randColor = parseInt(Math.random() * 1000);
                bgColor = randColor > 100 ? ('#' + randColor) : ('#' + (randColor + 100));
            }
            return (
                <TouchableOpacity
                    key={i}
                    style={[styles.btnsTouch, {height: itemHeight, backgroundColor: bgColor}]}
                    onPress={btn.press}
                    onLayout={(evt)=>{
                        this.textWidth += evt.nativeEvent.layout.width;
                    }}
                >
                    <Text style={[styles.btnText, textStyle]}>{btn.text}</Text>
                </TouchableOpacity>
            );
        });
        let direction = this.props.direction === 'left' ? 'flex-start' : 'flex-end';
        return (
            <View style={styles.container} {...this.panResponderInit.panHandlers}>
                <View style={[styles.btnsView, {justifyContent: direction}]}>
                    {btnText}
                </View>
                <Animated.View style={[styles.item, {height: itemHeight, transform: [{translateX: this.position}]}]}>
                    {children}
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor : '#ddd',
    },
    item: {
        flexDirection: 'row',
		alignItems: 'center',
        position: 'absolute',
        left: 0,
    },
    btnsView: {
        flex: 1,
        flexDirection: 'row',
		alignItems: 'center',
    },
    btnsTouch : {
        justifyContent: 'center',
		alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    btnText: {
        fontSize: 14,
        color: '#fff',
    },
});