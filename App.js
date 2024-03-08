/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import { Linking, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import LottieView from 'lottie-react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from './src/Components/Pixel/Index';
import SplashScreen from './src/Screens/auth/SplashScreen';
import Login from './src/Screens/auth/Login';
import Welcome from './src/Screens/auth/Welcome';
import AddProfile from './src/Screens/Home/AddProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/Screens/Home/HomeScreen';
import Contacts from './src/Screens/Home/Contacts';
import Chats from './src/Screens/Home/Chats';
import Profile from './src/Screens/Home/Profile';
import AddContact from './src/Screens/Home/AddContact';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditProfile from './src/Screens/Home/EditProfile';
import { COLORS } from './constants';
import PersonalChats from './src/Screens/Home/PersonalChats';
import VoiceCall from './src/Screens/Home/VoiceCall';
// import { Provider } from 'react-redux';
// import store from './src/Redux/Store';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const TabStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          width: '100%',
          height: hp(7),
          backgroundColor: '#fff',
          // borderColor: '#000',
          // borderWidth: 0,
        },
      }}
    >
      <Tab.Screen name="HomeScreen" component={Contacts} options={{
        headerShown: false,
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, color, size }) => (
          <View style={{ alignItems: 'center' }}>
            {focused ? <MaterialCommunityIcons name="contacts" size={hp(3.5)} color={COLORS.lightGreen} /> : <MaterialCommunityIcons name="contacts-outline" size={hp(3)} color={color} />}
            <Text style={{ color: focused ? COLORS.lightGreen : color, fontSize: focused ? hp(1.8) : hp(1.6) }}>Contact</Text>
          </View>
        ),
      }} />
      <Tab.Screen name="Chats" component={Chats} options={{
        headerShown: false,
        tabBarLabel: 'Chats',
        tabBarIcon: ({ focused, color, size }) => (
          <View style={{ alignItems: 'center' }}>
            {focused ? <MaterialCommunityIcons name="message-reply-text" size={hp(3.5)} color={COLORS.lightGreen} /> : <MaterialCommunityIcons name="message-reply-text-outline" size={hp(3)} color={color} />}
            <Text style={{ color: focused ? COLORS.lightGreen : color, fontSize: focused ? hp(1.8) : hp(1.6) }}>Chats</Text>
          </View>
        ),
      }} />
      <Tab.Screen name="Profile" component={Profile} options={{
        headerShown: false,
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused, color, size }) => (
          <View style={{ alignItems: 'center' }}>
            {focused ? <MaterialCommunityIcons name="account" size={hp(4)} color={COLORS.lightGreen} /> : <MaterialCommunityIcons name="account-outline" size={hp(3.5)} color={color} />}
            <Text style={{ color: focused ? COLORS.lightGreen : color, fontSize: focused ? hp(1.8) : hp(1.6) }}>Profile</Text>
          </View>
        ),
      }} />
    </Tab.Navigator>
  );
};
function App() {

  const [initialScreen, setInitialScreen] = useState('SplashScreen');
  // const [user, setUser] = useState(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      navigate(url);
    });

    const subscription = Linking.addEventListener('url', event => {
      navigate(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const navigate = (url) => {
    if (url) {
      const route = url.replace(/.*?:\/\//g, '');
      const routeName = route.split('/')[0];

      if (routeName === 'Login') {
        navigationRef.current?.navigate('Login');
      }
    }
  };

  return (
    // <Provider store={store}>
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={initialScreen}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen name="TabStack" component={TabStack} options={{ headerShown: false }} />
          <Stack.Screen name="AddProfile" component={AddProfile} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
          <Stack.Screen name="AddContact" component={AddContact} options={{ headerShown: true }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PersonalChats" component={PersonalChats} options={{ headerShown: false }} />
          <Stack.Screen name="VoiceCall" component={VoiceCall} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    // </Provider>
  );
}

export default App;
