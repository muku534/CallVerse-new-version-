/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initializeApp} from '@react-native-firebase/app';

// Your Firebase config (from the Firebase console)
const firebaseConfig = {
  apiKey: 'AIzaSyBe2XCr2bv9exIxi59CX6qlXWSXz5FVNQc',
  authDomain: 'callverse-b7cb4.firebaseapp.com',
  projectId: 'callverse-b7cb4',
  storageBucket: 'callverse-b7cb4.appspot.com',
  messagingSenderId: '889153095336',
  appId: '1:889153095336:android:0804682c262714ad06249d',
};

// Initialize Firebase
initializeApp(firebaseConfig);

AppRegistry.registerComponent(appName, () => App);
