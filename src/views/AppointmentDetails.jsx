import React, { useState } from 'react';
import { StyleSheet, Image,  View, SafeAreaView, Text, ImageBackground, TouchableOpacity, Linking } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons'
import {  confirmed_icon, rejected_icon, waiting_icon, theme_gradient, regular, bold, img_url } from '../config/Constants';
import { useNavigation,  useRoute } from '@react-navigation/native';
import DropShadow from "react-native-drop-shadow";
import Moment from 'moment';
import { StatusBar } from '../components/StatusBar';
import ContentLoader from "react-native-easy-content-loader";
import * as Animatable from 'react-native-animatable';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';


const AppointmentDetails = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [data, setDate] = useState(route.params.data);
  const [is_error, setError] = useState(0);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const call_redirection = (latitude, longitude) => {
		var lat = latitude;
		var lng = longitude;

		if (lat != 0 && lng != 0) {
      ReactNativeHapticFeedback.trigger('impactHeavy', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
			var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
			var url = scheme + `${lat},${lng}`;
			if (Platform.OS === 'android') {
				Linking.openURL("google.navigation:q=" + lat + " , " + lng + "&mode=d");
			} else {
				Linking.openURL('https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng + '&travelmode=driving');
			}
		}
	}
  
  return (
  <SafeAreaView style={styles.container}>
          <StatusBar/>
    <Animatable.View
        animation="zoomIn" // Animation effect
        duration={500} // Duration of the animation
      >
    <ImageBackground source={theme_gradient} resizeMode="cover" style={styles.image}>
      {data.slug == "waiting_for_confirmation" &&
        <Image source={waiting_icon} style={{ height:100, width:100 }} />
      }
      {data.slug == "booking_confirmed" &&
        <Image source={confirmed_icon} style={{ height:100, width:100 }} />
      }
      {data.slug == "booking_rejected" &&
        <Image source={rejected_icon} style={{ height:100, width:100 }} />
      }
      {data.slug == "booking_completed" &&
        <Image source={confirmed_icon} style={{ height:100, width:100 }} />
      }
      <View style={{ margin:10 }} />
      <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:18}}>{data.status_name}</Text>
    </ImageBackground>
       <DropShadow
               style={{
				       margin:10, 
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 0,
                    },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                }}
        >
       
		<View style={{borderRadius:10, backgroundColor:colors.theme_fg_three}}>
      <View style={{ padding:20, justifyContent:'center', width:'90%', marginLeft:'5%', marginRight:'5%', position:'absolute' }}>
  
        <Text style={{ fontFamily:bold, color:colors.theme_fg, fontSize:15}}>Booking ID : #{data.id}</Text>
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row'}}>
          <View style={{ width:'30%', alignItems:'flex-start', justifyContent:'center'}}>
            <Image source={{ uri : img_url+data.profile_image}} style={{ height:70, width:70, borderRadius:5 }} />
          </View>
          <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>{data.hospital_name}</Text>
            <View style={{ margin:1 }} />
            <Text style={{ fontFamily:bold, color:colors.grey, fontSize:14}}>Dr.{data.doctor_name}</Text>
            <View style={{ margin:2 }} />
            <View style={{ flexDirection:'row'}}>
              <View style={{ width:'80%'}}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontFamily:regular, color:colors.grey, fontSize:13}}>{data.address}</Text>
              </View>
              <TouchableOpacity activeOpacity={1} onPress={call_redirection.bind(this, data.latitude, data.longitude)} style={{ width:'20%', alignItems:'flex-end'}}>
                <Icon type={Icons.Feather} name="navigation" color={colors.theme_fg} style={{ fontSize:25 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <Text  style={{ fontFamily:regular, color:colors.grey, fontSize:13}}>{data.title}</Text>
        <View style={{ margin:10 }} />
        <View style={{ flexDirection:'row', width:'100%'}}>
          <View style={{ flexDirection:'row', width:'60%', alignItems:'center', justifyContent:'flex-start'}}>
            <Icon type={Icons.AntDesign} name="calendar"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg }} />
            <View style={{ margin:5 }} />
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:13, alignSelf:'center', justifyContent:'flex-end'}}>Appointment Date</Text>
          </View>
          <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:13, alignSelf:'flex-start'}}>{Moment(data.start_time).format('DD MMMM-YYYY')}</Text>
          </View>
        </View>
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row', width:'100%'}}>
          <View style={{ flexDirection:'row', width:'60%', alignItems:'center', justifyContent:'flex-start'}}>
            <Icon type={Icons.AntDesign} name="clockcircleo"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg }} />
            <View style={{ margin:5 }} />
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:13, alignSelf:'center', justifyContent:'flex-end'}}>Appointment Time</Text>
          </View>
          <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:13, alignSelf:'flex-start'}}>{Moment(data.start_time).format('hh:mm A')}</Text>
          </View>
        </View>
      </View>
      </View>
    </DropShadow>
    <TouchableOpacity onPress={handleBackButtonClick} style={{ padding:10, position:'absolute' }}>
      <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_three} style={{ fontSize:30 }} />
    </TouchableOpacity>
    </Animatable.View>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three
  },
  image: {
    justifyContent: "center",
    alignItems:'center',
    height:300,
    width:'100%'
  },
});

export default AppointmentDetails;