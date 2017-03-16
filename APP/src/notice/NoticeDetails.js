import React, { Component } from 'react';
import { 
	StyleSheet,
	Text, 
	View, 
	ScrollView,
	TouchableHighlight,
} from 'react-native';

import Button from '../public/Button';
import TopTitle from '../public/TopTitle';

var Util = require('../public/Util');
var Config = require('../public/Config');

export default class NoticeDetails extends Component {
	//构造
  	constructor(props)
  	{
      	super(props);
      	this.state = {
      		showLoad : true,
      	};
  	}

  	render() {
	    var {route, nav} = this.props;
		let notice = route.notice ? route.notice : GoToPageObj.notice;
		let retitle = route.returnTitle ? route.returnTitle : '公告';
		if(!notice) return null;

		return (
			<View style={styles.flex}>
				<View>
					<TopTitle  title={route.title} showReturn={true} 
						onPress={() => {
							let obj = {id : 'main', title : retitle};
							if(route.search) obj.search = route.search;
							if(route.returnId2) obj.returnId = route.returnId2;
							if(route.returnTitle2) obj.returnTitle = route.returnTitle2;

							nav.push(obj);
						}}
					/>
				</View>
				<View style={styles.noticeBox}>
					<ScrollView>
						<View>
							<Text style={styles.contentFristRow}>{'致 : ' + notice.Department}</Text>
							<Text style={styles.allContentText}>{notice.Content}</Text>
						</View>
						<View style={styles.contentLastRow}>
							<TouchableHighlight underlayColor='transparent' onPress={()=>{
								if(notice.UserId && !route.dislink){
									GoToPageObj.uid = notice.UserId;
									GoToPageObj.index =3;
									GoToPageObj.pre_page = GoToPageObj.now_page;
									GoToPageObj.pre_index = GoToPageObj.now_index;
									GoToPageObj.pre_title = GoToPageObj.now_title;
									GoToPageObj.notice = notice;

									GoToPage();
								}
							}}>
								<Text style={styles.smallText2}>{notice.Author}</Text>
							</TouchableHighlight>
							<Text style={styles.smallText2}>{Util.getFormatDate(notice.AddTime, 1)}</Text>
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	flex : {
		flex : 1,
	},
	loadBox : {
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#ccc',
    },
    loadTxt : {
        letterSpacing : 5,
        fontStyle : 'italic',
    },
	smallText2 : {
		fontSize : 15,
		color : '#999',
	},
	noticeBox : {
		flex : 1,
		padding : 10,
		backgroundColor : '#fff',
	},
	contentFristRow : {
		paddingBottom : 15,
	},
	allContentText : {
		fontSize : 14,
		color : '#666',
		lineHeight : 24,
		paddingBottom : 50,
		//textIndent : 20,
	},
	contentLastRow : {
		paddingBottom : 10,
		paddingRight : 20,
		alignItems : 'flex-end',
	},
});