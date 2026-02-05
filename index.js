/**
 * @format
 */
import './gesture-handler';
import 'react-native-get-random-values';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { createStore } from 'redux';
import allReducers from './src/reducers/index.js';
import { Provider } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// 🔹 Set up background message handler for FCM
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('📩 FCM Background/Killed :', remoteMessage);

//   if (remoteMessage?.notification) {
//     await notifee.displayNotification({
//       title: remoteMessage.notification?.title || 'New Message',
//       body: remoteMessage.notification?.body || 'Tap to open',
//       android: {
//         channelId: 'default',
//         importance: AndroidImportance.HIGH,
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   }
// });

// 🔹 Handle background notification tap events
// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   if (type === EventType.PRESS) {
//     console.log('🚀 User tapped the notification:', detail.notification);
//     // Handle navigation here if needed
//   }
// });

// 🔹 Create Redux store
const store = createStore(allReducers);

// 🔹 Wrap App with Redux Provider
const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// 🔹 Register App
AppRegistry.registerComponent(appName, () => ReduxApp);

// 🔹 Ignore unnecessary logs
LogBox.ignoreAllLogs();
