import React, { useEffect, useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon, { Icons } from './src/components/Icons';
import * as colors from './src/assets/css/Colors';
import { img_url, regular } from './src/config/Constants';
import * as Animatable from 'react-native-animatable';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* Screens */
import Splash from './src/views/Splash';
import Intro from './src/views/Intro';
import Dashboard from './src/views/Dashboard';
import LoginHome from './src/views/LoginHome';
import Faq from './src/views/Faq';
import FaqCategories from './src/views/FaqCategories';
import FaqDetails from './src/views/FaqDetails';
import PrivacyPolicies from './src/views/PrivacyPolicies';
import Otp from './src/views/Otp';
import DoctorList from './src/views/DoctorList';
import Hospital from './src/views/Hospital';
import CheckPhone  from './src/views/CheckPhone';
import CreatePassword  from './src/views/CreatePassword';
import Password  from './src/views/Password';
import DoctorCategories from './src/views/DoctorCategories';
import More from './src/views/More';
import Register from './src/views/Register';
import LocationEnable from './src/views/LocationEnable';
import PaymentMethods from './src/views/PaymentMethods';
import SelectCurrentLocation from './src/views/SelectCurrentLocation';
import CurrentLocation from './src/views/CurrentLocation';
import AddressList from './src/views/AddressList';
import AddAddress from './src/views/AddAddress';
import Profile from './src/views/Profile';
import MyOnlineConsultations from './src/views/MyOnlineConsultations';
import PromoCode from './src/views/PromoCode';
import DoctorSearch from './src/views/DoctorSearch';
import HospitalSearch from './src/views/HospitalSearch';
import ConsultationRating from './src/views/ConsultationRating';
import PatientDetails from './src/views/PatientDetails';
import Notifications from './src/views/Notifications';
import NotificationDetails from './src/views/NotificationDetails';
import Blog from './src/views/Blog';
import BlogDetails from './src/views/BlogDetails';
import ViewPrescription from './src/views/ViewPrescription';
import HospitalDetails from './src/views/HospitalDetails';
import Chat from './src/views/Chat';
import TodayReminder from './src/views/TodayReminder';
import ConfirmReminder from './src/views/ConfirmReminder';
import DoctorProfile from './src/views/DoctorProfile'; 
import DoctorChat from './src/views/DoctorChat'; 
import Paypal from './src/views/Paypal'; 
import MyAppointments from './src/views/MyAppointments';
import CreateAppointment from './src/views/CreateAppointment';
import ViewList from './src/views/ViewList';
import AppointmentDetails from './src/views/AppointmentDetails';
import NoInternet from './src/views/NoInternet';
import Agora from './src/views/Agora';


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
  { route: 'Dashboard', label: 'Home', type: Icons.Feather, icon: 'home', component: Dashboard, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'Myonlineconsults', label: 'My online consults', type: Icons.Feather, icon: 'file-text', component: MyOnlineConsultations, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'MyAppointments', label: 'MyAppointments', type: Icons.Feather, icon: 'list', component: MyAppointments, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'More', label: 'More', type: Icons.FontAwesome, icon: 'user-circle-o', component: More, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
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


  const handlePress = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    onPress();
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 200 : 165}]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: item.color, borderRadius: 16 }]} />
        <View style={[styles.btn, { backgroundColor: focused ? null : item.alphaClr }]}>
          <Icon type={item.type} name={item.icon} color={focused ? colors.theme_fg_three : colors.grey} />
          <Animatable.View
            ref={textViewRef}>
            {focused && <Text style={{
              color: colors.theme_fg_three,fontSize:13,fontFamily:regular  }}>{item.label}</Text>}
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
          borderRadius: 16,
          alignSelf:"center",
          width:"95%",
          marginRight:10,
          marginLeft:10
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

const Stack = createNativeStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" options={{headerShown: false}} >
      <Stack.Screen name="Intro" component={Intro} options={{headerShown: false}}/>
      <Stack.Screen name="Agora" component={Agora} options={{headerShown: false}} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} options={{ title: 'Select Payment Mode' }} />
      <Stack.Screen name="HospitalDetails" component={HospitalDetails} options={{ title: 'Hospital Details' }} />
      <Stack.Screen name="ConsultationRating" component={ConsultationRating} options={{headerShown: false}} />
      <Stack.Screen name="HospitalSearch" component={HospitalSearch} options={{headerShown: false}} />
      <Stack.Screen name="FaqDetails" component={FaqDetails} options={{ title: 'Faq Details' }} />
      <Stack.Screen name="DoctorSearch" component={DoctorSearch} options={{headerShown: false}} />
      <Stack.Screen name="Hospital" component={Hospital} options={{ title: 'Hospitals' }} />
      <Stack.Screen name="FaqCategories" component={FaqCategories} options={{ title: 'Faq Categories' }} />
      <Stack.Screen name="Faq" component={Faq} options={{ title: 'Faq' }}  />
      <Stack.Screen name="Home" component={TabNavigator}  options={{headerShown: false}} />
      <Stack.Screen name="LoginHome" component={LoginHome} options={{headerShown: false}} />
      <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}} />
      <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}} />
      <Stack.Screen name="DoctorList" component={DoctorList} options={{ title: 'Find your doctor' }} />
      <Stack.Screen name="CheckPhone" component={CheckPhone} options={{ headerShown: false }} />
      <Stack.Screen name="CreatePassword" component={CreatePassword} options={{headerShown: false}} />
      <Stack.Screen name="Password" component={Password} options={{headerShown: false}} />
      <Stack.Screen name="PrivacyPolicies" component={PrivacyPolicies} options={{ title:'Privacy Policy' }} />
      <Stack.Screen name="DoctorCategories" component={DoctorCategories} options={{ title: 'Common Symptoms' }} />
      <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
      <Stack.Screen name="LocationEnable" component={LocationEnable} options={{ title: 'Location Enable' }} />
      <Stack.Screen name="SelectCurrentLocation" component={SelectCurrentLocation} options={{ title: 'Pick your Location' }} />
      <Stack.Screen name="CurrentLocation" component={CurrentLocation} options={{ headerShown: false }} />
      <Stack.Screen name="AddressList" component={AddressList} options={{ title: 'Address List' }} />
      <Stack.Screen name="AddAddress" component={AddAddress} options={{headerShown: false}} />
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
      <Stack.Screen name="MyOnlineConsultations" component={MyOnlineConsultations} options={{ title: 'My Consultations' }} />
      <Stack.Screen name="MyAppointments" component={MyAppointments} options={{ title: 'My Appointments' }}  />
      <Stack.Screen name="PromoCode" component={PromoCode} options={{ title: 'Apply Promo Code' }} />
      <Stack.Screen name="PatientDetails" component={PatientDetails} />
      <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Notifications' }} />
      <Stack.Screen name="NotificationDetails" component={NotificationDetails} options={{ title: '' }} />
      <Stack.Screen name="BlogDetails" component={BlogDetails} options={{ title: '' }} />
      <Stack.Screen name="Blog" component={Blog} options={{ title: '' }} />
      <Stack.Screen name="ViewPrescription" component={ViewPrescription} options={{ title: 'View Prescription' }} />
      <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
      <Stack.Screen name="TodayReminder" component={TodayReminder} options={{ title: 'Today Reminders' }} />
      <Stack.Screen name="ConfirmReminder" component={ConfirmReminder} options={{ title: 'Confirm Reminder' }} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{ title: 'Doctor Profile' }} /> 
      <Stack.Screen name="DoctorChat" component={DoctorChat} options={{ title: 'Chat with doctor' }} /> 
      <Stack.Screen name="Paypal" component={Paypal} options={{ title: 'Pay with PayPal' }} /> 
      <Stack.Screen name="CreateAppointment" component={CreateAppointment} options={{ title: '' }} /> 
      <Stack.Screen name="ViewList" component={ViewList} options={({ route }) => ({ title: route.params.title })} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} options={{headerShown: false}} />
      <Stack.Screen name="NoInternet" component={NoInternet} options={{headerShown: false}} />

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