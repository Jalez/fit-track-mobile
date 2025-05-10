/**
 * @format
 */

// The Reanimated import must be the first import in the file
import 'react-native-reanimated';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Make sure we register with the correct app name
AppRegistry.registerComponent(appName, () => App);
