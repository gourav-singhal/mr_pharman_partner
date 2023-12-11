import React, { useEffect, useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon, { Icons } from './src/components/Icons';
import * as colors from './src/assets/css/Colors';
import * as Animatable from 'react-native-animatable';

//Screens
import Splash from './src/views/Splash';
import LoginHome from './src/views/LoginHome';
import CheckPhone  from './src/views/CheckPhone';
import Otp from './src/views/Otp';
import ResetPassword  from './src/views/ResetPassword';
import Password  from './src/views/Password';
import Home from './src/views/Home';
import More from './src/views/More';
import Profile from './src/views/Profile';
import Faq from './src/views/Faq';
import FaqCategories from './src/views/FaqCategories';
import FaqDetails from './src/views/FaqDetails';
import PrivacyPolicy from './src/views/PrivacyPolicy';
import MyOrders from './src/views/MyOrders';
import MyOrderDetails from './src/views/MyOrderDetails'; 
import OrderRequest from './src/views/OrderRequest'; 
import Notifications from './src/views/Notifications';
import NotificationDetails from './src/views/NotificationDetails';
import Chat from './src/views/Chat';
import AppUpdate from './src/views/AppUpdate';

const forFade = ({ current, next }) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity },
  };
};
const TabArr = [
  { route: 'Home', label: 'Home', type: Icons.Feather, icon: 'home', component: Home, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'MyOrders', label: 'My Orders', type: Icons.Feather, icon: 'file-text', component: MyOrders, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'More', label: 'More', type: Icons.Feather, icon: 'settings', component: More, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
];

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);

  useEffect(() => {
    if (focused) { // 0.3: { scale: .7 }, 0.5: { scale: .3 }, 0.8: { scale: .7 },
      viewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      textViewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
    } else {
      viewRef.current.animate({ 0: { scale: 1, }, 1: { scale: 0, } });
      textViewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 0.65}]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: item.color, borderRadius: 16 }]} />
        <View style={[styles.btn, { backgroundColor: focused ? null : item.alphaClr }]}>
          <Icon type={item.type} name={item.icon} color={focused ? colors.theme_fg_three : colors.grey} />
          <Animatable.View
            ref={textViewRef}>
            {focused && <Text style={{
              color: colors.theme_fg_three, paddingHorizontal: 8
            }}>{item.label}</Text>}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 16
        }
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen key={index} name={item.route} component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />
            }}
          />
        )
      })}
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" >
        <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}} />
        <Stack.Screen name="LoginHome" component={LoginHome} options={{headerShown: false}} />
        <Stack.Screen name="CheckPhone" component={CheckPhone} options={{headerShown: false}} />
        <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false}} />
        <Stack.Screen name="Password" component={Password} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}}/>
        <Stack.Screen name="More" component={More} options={{headerShown: false}}/>
        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }}/>
        <Stack.Screen name="FaqDetails" component={FaqDetails} options={{ title: 'Faq Details' }}/>
      	<Stack.Screen name="FaqCategories" component={FaqCategories} options={{ title: 'Faq Categories' }}/>
      	<Stack.Screen name="Faq" component={Faq} options={{ title: 'Faq' }}/>
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ title: 'Privacy Policy' }}/>
        <Stack.Screen name="MyOrders" component={MyOrders} options={{headerShown: false}}/>
        <Stack.Screen name="MyOrderDetails" component={MyOrderDetails} options={{headerShown: false}}/>
        <Stack.Screen name="OrderRequest" component={OrderRequest} options={{headerShown: false}} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Notifications' }} />
        <Stack.Screen name="NotificationDetails" component={NotificationDetails} options={{ title: '' }} />
        <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
        <Stack.Screen name="AppUpdate" options={{ headerShown:false}} component={AppUpdate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  }
})

export default App;