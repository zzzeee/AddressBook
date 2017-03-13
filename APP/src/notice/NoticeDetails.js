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
	    var {route, nav, viewUser} = this.props;
		if(!route.notice) return null;

		return (
			<View style={styles.flex}>
				<View>
					<TopTitle  title={route.title} showReturn={true} 
						onPress={() => {
							nav.push({id: route.returnId});
						}}
					/>
				</View>
				<View style={styles.noticeBox}>
					<ScrollView>
						<View>
							<Text style={styles.contentFristRow}>{'致 : ' + route.notice.Department}</Text>
							<Text style={styles.allContentText}>{route.notice.Content}</Text>
						</View>
						<View style={styles.contentLastRow}>
							{viewUser ?
								<TouchableHighlight underlayColor='transparent' onPress={()=>{
									if(route.notice.UserId){
										viewUser(route.notice.UserId);
									}
								}}>
									<Text style={styles.smallText2}>{route.notice.Author}</Text>
								</TouchableHighlight>
								: <Text style={styles.smallText2}>{route.notice.Author}</Text>
							}
							<Text style={styles.smallText2}>{Util.getFormatDate(route.notice.AddTime, 1)}</Text>
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