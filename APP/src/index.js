import {
	AppRegistry
} from 'react-native';
import App from './Navigator/App';

if (!__DEV__) {
	global.console = {
		info: () => {},
		log: () => {},
		warn: () => {},
		error: () => {},
	};
}

AppRegistry.registerComponent('APP', () => App);