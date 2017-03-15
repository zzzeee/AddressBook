公司通讯录

灵感：携程团队 -- <<React Native入门与实战>> 
      https://github.com/vczero/React-Native-App
      仅参考界面设计，其他再无借鉴。

由于这本书的案例基本是在IOS平台开发的，萌生了一个开发一个兼容Android与IOS的APP(2016.12接触ReactNative，基本算练手与组件整合)。
参考：上面项目的界面，Github上的一些组件(如： react-native-scrollable-tab-view, react-native-vector-icons等)
      其他的代码就基本上是自己手写的了。

环境： 
1. nodejs   
2. express
3. mongoose
4. react-native

安装步骤
1. nodejs 安装
2. node install express --save
3. node install mongoose --save
4. reactnative安装参考： http://reactnative.cn/docs/0.42/getting-started.html#content

启动项目
1. react-native init APP
2. 拷贝此项目/AddressBook/APP下的所有文件至刚init好的APP内覆盖
3. 运行npm install
4. 启动react-native run-android
5. 后台 ： /AddressBook/Admin
6. 运行npm install
7. 启动后台服务 : cd userAdmin && node index
8. 有人欢喜，有人忧


注： 
一. /APP/android/build.gradle
原为： 
dependencies {
    classpath 'com.android.tools.build:gradle:1.3.2'
}
用真机调试有报错，修改成如下内容，可能能解决
dependencies {
    classpath 'com.android.tools.build:gradle:1.2.3'
}

二. 配置 react-native-image-picker 生成的坑
1. npm install react-native-image-picker@latest --save
2. react-native link
3. 修改文件 /APP/android/build.gradle
dependencies {
    classpath 'com.android.tools.build:gradle:2.2.3'
}

4. 修改文件 /APP/android/gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-2.14.1-all.zip

5. 修改文件 /APP/android/app/src/main/AndroidManifest.xml
添加这2行 ：
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

配置 步骤3 和 步骤4 编译出错，如果略过(调用相册没问题，调用相机却会闪退)
手动下载 gradle-2.14.1-all (http://www.androiddevtools.cn/, ctrl+F 查找一下gradle-2.14.1-all)
不解压放入 ：
C:\Users\Administrator\.gradle\wrapper\dists\gradle-2.14.1-all\8bnwg5hd3w55iofp58khbp6yv

如果有错可以试着把文件 /APP/android/build.gradle 修改url编译后，再还原回来
    maven {
        // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
        //url "$rootDir/../node_modules/react-native/android"
        url "http://jcenter.bintray.com/"
    }

虽然经过七弄八弄 完成了 react-native-image-picker配置
现状态为：
1. 本地调试没问题
2. 真机调试有问题  (可用直接安装app-debug.apk代替此问题 /APP/android/app/build/outputs/apk/app-debug.apk)
3. 打包APK有问题