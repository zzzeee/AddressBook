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
    Dimensions,
    PanResponder,
    propTypes,
    TouchableOpacity,
} from 'react-native';

var {height, width} = Dimensions.get('window');

export default class SwiperBtns extends Component {
    // 默认参数
    static defaultProps = {
        open3D: true,       //开启3D
        radius: 50,         //3D半径 (需开启3D)
        autoPlay: true,     //自动轮播
        playTime: 500,      //播放间隔
        playNumber: 0,      //播放轮数 (数值大于0时有效)
        friction: 7,        //摩擦力
        tension: 40,        //张力
        direction: 'right', //默认方向 (顺时针)
    };
    // 参数类型
    static propTypes = {
        open3D: React.PropTypes.bool.isRequired,
        radius: React.PropTypes.number.isRequired,
        autoPlay: React.PropTypes.bool.isRequired,
        playTime: React.PropTypes.number.isRequired,
        playNumber: React.PropTypes.number.isRequired,
        friction: React.PropTypes.number.isRequired,
        tension: React.PropTypes.number.isRequired,
        direction: React.PropTypes.oneOf(['left', 'right']),
    };
    // 构造函数
    constructor(props) {
        super(props);

        this.timer = [];
        this.playCount = 0;
        this.positionValue = 0;
        this.position = new Animated.Value(0);
        this.count = React.Children.count(this.props.children);
        this.animatedStart = this.animatedStart.bind(this);
        // 监听 this.position 值的变化
        this.position.addListener(v => {
            this.positionValue = v.value;
        });
    }

    // 组件加载完成
    componentDidMount() {
        //this.autoLoop();
    }

    // 卸载组件
    componentWillUnmount() {
        this.clearTimer();
    }

    // 清空定时器
    clearTimer = () => {
        for(let t of this.timer) {
            clearTimeout(t);
        }
    };

    // 是否继续播放动画
    playContinue = () => {
        let number = this.props.playNumber || 0;
        if(number > 0) {
            if(this.props.direction == 'right' && (number * this.count - 1) <= this.playCount) return false;
            if(this.props.direction == 'left' && (number * this.count) <= -this.playCount) return false;
        }
        return true;
    };

    //自动轮播
    autoLoop = () => {
        if(this.props.autoPlay && this.playContinue()) {
            let that = this;
            let nextValue = this.props.direction == 'left' ? this.positionValue - 1 : this.positionValue + 1;
            nextValue = this.loopStartEnd(nextValue);
            let _timer = setTimeout(() => {
                that.animatedStart(nextValue);
            }, that.props.playTime);
            this.timer.push(_timer);
        }
    };

    //播放动画
    animatedStart = (value) => {
        // 记录轮播总次数
        if(value - this.positionValue > 0) this.playCount++;
        if(value - this.positionValue < 0) this.playCount--;
        // 开始播放
        let that = this;
        Animated.spring(that.position, {
            toValue: value,
            friction: that.props.friction,
            tension: that.props.tension,
        }).start(that.autoLoop);
    };

    // 处理循环的过渡
    loopStartEnd = (n) => {
        if(n < 0) {
            n += this.count;
            this.position.setValue(this.positionValue + this.count);
        }else if(n >= this.count) {
            n -= this.count;
            this.position.setValue(this.positionValue - this.count);
        }

        return n;
    };

    //定义触屏响应事件
    panResponderInit = PanResponder.create({
        // 要求成为响应者：
        onStartShouldSetPanResponder: (evt, gestureState) => false,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        // 响应开始
        onPanResponderGrant: (evt, gestureState) => {
        },
        // 移动过程
        onPanResponderMove: (evt, gestureState) => {
            const {dx} = gestureState;
            this.position.setValue(dx);
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        // 响应结束
        onPanResponderRelease: (evt, {vx}) => {
            // let that = this;
            // this.position.flattenOffset();
            // const left = Math.floor(this.positionValue);
            // const right = left + 1;
            // let result = 0;
            // // 速度快时 按方向翻页。否则按移动距离翻页。
            // if(vx > 0.05) {
            //     result = left;
            // }else if(vx < -0.05) {
            //     result = right;
            // }else {
            //     result = Math.round(this.positionValue);
            // }
            // // 处理循环的过渡
            // result = this.loopStartEnd(result);
            // // 动画效果
            // this.animatedStart(result);
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
            // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
            // 默认返回true。目前暂时只支持android。
            return true;
        },
    });

    // 基本函数
    render() {
        const { style, children, btns } = this.props;
        
        return (
            <View style={styles.container} {...this.panResponderInit.panHandlers}>
                <Animated.View style={[styles.item, {transform: [{translateX: this.position}]}]}>
                    {children}
                </Animated.View>
                <View style={styles.btnsView}>
                    {btns.map((btn, i) => {
                        return (
                            <TouchableOpacity
                                key={i}
                                style={styles.btnsTouch} 
                                onPress={(evt)=>{console.log((evt.nativeEvent))}}
                            >
                                <Text style={styles.btnText}>{btn.text}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        height: 80,
        backgroundColor : '#bbb',
    },
    item: {
        flexDirection: 'row',
		alignItems: 'center',
        position: 'absolute',
        left: 0,
        zIndex: 9,
    },
    btnsView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
		alignItems: 'center',
    },
    btnsTouch : {
        height: 80,
        backgroundColor: 'red',
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