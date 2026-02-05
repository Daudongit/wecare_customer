import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  PermissionsAndroid,
  Linking,
} from "react-native";
import {bold,white_logo,
  api_url,
  customer_app_settings,
  app_name,
  GOOGLE_KEY,
  logo_with_name,
  REVERSE_GEOCODE,
  ROUTEMAPPY_KEY,} from "../config/Constants";
import { useNavigation, CommonActions, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, { Importance } from "react-native-push-notification";
import * as colors from "../assets/css/Colors";
//import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import Geolocation from "@react-native-community/geolocation";
import { connect } from "react-redux";
import { updatePharmId, addToCart, updateSubtotal, updateDeliveryCharge  } from '../actions/PharmOrderActions';
import {
  updateCurrentAddress,
  updateCurrentLat,
  updateCurrentLng,
  currentTag,
  updateProfilePicture,
  updateAddress,
} from "../actions/CurrentAddressActions";
import { StatusBar } from '../components/StatusBar';
import {Animated} from "react-native";
import { Alert } from "react-native";
import messaging from '@react-native-firebase/messaging';
import NetInfo from "@react-native-community/netinfo";


const Splash = (props) => {
  const navigation = useNavigation();
  const [poweredByText, setPoweredByText] = useState('');
  const [companyText, setCompanyText] = useState('');
  const [hasTyped, setHasTyped] = useState(false); // Track if typing has already completed
  const poweredBy = 'Powered by ';
  const companyName = 'Menpani Technology';
  const typingDelay = 10; // Delay between each character

  useFocusEffect(
    useCallback(() => {
      // Reset state variables each time the screen is focused
      setPoweredByText('');
      setCompanyText('');
      setHasTyped(false);
  
      animation_loading(); // Start the animation
  
      return () => {
        // Any necessary cleanup when the screen loses focus
      };
    }, [])
  );

  useEffect(() => {
    const checkConnection = () => {
      NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        navigation.navigate("NoInternet");
      }
      });
    };
    
    // Call the function immediately
    checkConnection();
    
    // Set up interval to call it every 10 seconds
    const interval = setInterval(checkConnection, 10000); // 10 seconds
    
    // Cleanup on unmount
    return () => clearInterval(interval);
    }, []);
  
  
  const animation_loading=()=>{
    if (hasTyped) return;
      let index = 0;
      const animatePoweredBy = () => {
          setPoweredByText((prev) => prev + poweredBy[index]);
          index++;
          if (index < poweredBy.length) {
              setTimeout(() => {
                  requestAnimationFrame(animatePoweredBy);
              }, typingDelay);
          } else {
              animateCompanyName();
          }
      };
      animatePoweredBy();
  }
  const animateCompanyName = () => {
      let index = 0;
      const animate = () => {
          setCompanyText((prev) => prev + companyName[index]);
          index++;
          if (index < companyName.length) {
              setTimeout(() => {
                  requestAnimationFrame(animate);
              }, typingDelay);
          } else {
              setHasTyped(true);
              checkToken(); // Call your function after typing completes
          }
      };
      animate();
  };
  const channel_create = () => {
    PushNotification.createChannel(
      {
        channelId: "medical_application", // (required)
        channelName: "Booking", // (required)
        channelDescription: "Medical Booking Solution", // (optional) default: undefined.
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`+'1') // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };
  const checkToken = async () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received foreground notification:', remoteMessage);
      // Handle the notification, show an alert or local notification if needed
    });
    if(Platform.OS=='android'){
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        if (enabled) {
          const fcmToken = await messaging().getToken();
          if (fcmToken) {
            console.log('fcm_token:1' + fcmToken);
            global.fcm_token = fcmToken;
            app_settings();
          } else {
            Alert.alert(strings.sorry_unable_to_get_your_token);
          }
        } else {
          Alert.alert(strings.sorry_permission_denied);
        }
      } catch (error) {
        console.error('FCM token retrieval error:', error);
        Alert.alert(strings.sorry_unable_to_get_your_token);
      }
    }
  }
 

  const app_settings = async () => {
    axios({
      method: "get",
      url: api_url + customer_app_settings,
    })
      .then(async (response) => {
     
        channel_create();
        await props.updateDeliveryCharge(response.data.result.pharm_delivery_charge);
        await saveData(response.data.result);
      })
      .catch((error) => {
        console.log("vvvvvvvvvvvv",error)
        alert("Sorry something went wrong");
      });
  };

  const saveData = async (data) => {
    const id = await AsyncStorage.getItem("id");
    const customer_name = await AsyncStorage.getItem("customer_name");
    const phone_number = await AsyncStorage.getItem("phone_number");
    const phone_with_code = await AsyncStorage.getItem("phone_with_code");
    const email = await AsyncStorage.getItem("email");
    const profile_picture = await AsyncStorage.getItem("profile_picture");
    const cart_items = await AsyncStorage.getItem("cart_items");
    const sub_total = await AsyncStorage.getItem("sub_total");
    const pharm_id = await AsyncStorage.getItem("pharm_id");
    global.app_name = data.app_name;
    global.currency = data.default_currency;
    global.currency_short_code = data.currency_short_code;
    global.user_type = data.user_type;
    global.admin_contact_number = data.contact_number;
    global.razorpay_key = data.razorpay_key;
    global.mode = data.mode;
    global.admin_phone_number = data.admin_phone_number;
    global.paystack_key = data.paystack_key;
    global.flutterwave_public_key = data.flutterwave_public_key;

    global.tiles=data.map_settings.tiles
    global.geocode=data.map_settings.geocode
    global.routing=data.map_settings.routing
    global.places=data.map_settings.places
    global.reverse_geo_code=data.map_settings.reverse_geo_code


    await props.updateProfilePicture(profile_picture);
    if(sub_total){
      await props.addToCart(JSON.parse(cart_items));
      await props.updateSubtotal(parseFloat(sub_total).toFixed(2));
      await props.updatePharmId(parseInt(pharm_id));
    }
    if (id !== null) {
      global.id = await id;
      global.customer_name = await customer_name;
      global.phone_number = await phone_number;
      global.phone_with_code = await phone_with_code;
      global.email = await email;
      check_location();
    } else {
      global.id = 0;
      check_location();
    }
  };
  
  const check_location = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check if permission is already granted
        const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  
        if (!isGranted) {
          // If not granted, prompt the user for permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Access Required",
                message:
                  app_name +
                  " needs to Access your location.",
                  buttonPositive: "Allow Location", // Custom positive button text
            }
          );
  
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await getInitialLocation();
          } else {
            navigation.navigate('LocationEnable');
            console.log('Permission denied');
            // Alert the user that permission is required
            Alert.alert(
              'Location Permission Required',
              'The app needs location access to function correctly. You can enable it from the app settings.',
              [
                /* {
                  text: 'Cancel',
                  onPress: () => console.log('Permission denied, user canceled'),
                  style: 'cancel',
                }, */
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
          }
        } else {
          console.log('getint')
          // If permission is already granted
          await getInitialLocation();
        }
      } catch (err) {
        console.log(err);
        navigation.navigate('LocationEnable');
      }
    } else {
      await getInitialLocation();
    }
  };

  const getInitialLocation = async () => {
    await Geolocation.getCurrentPosition(
      async (position) => {
        onRegionChange(position.coords);
      },
      (error) => navigation.navigate("LocationEnable"),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };
  // const onRegionChange = async (value) => {
  //   //props.addCurrentAddress('Please wait...')
  //   fetch(
  //     "https://maps.googleapis.com/maps/api/geocode/json?address=" +
  //       value.latitude +
  //       "," +
  //       value.longitude +
  //       "&key=" +
  //       GOOGLE_KEY
  //   )
  //     .then((response) => response.json())
  //     .then(async (responseJson) => {
  //       if (responseJson.results[0].formatted_address != undefined) {
  //         let address = await responseJson.results[0].formatted_address;
  //         await props.updateCurrentAddress(address);
  //         await props.updateCurrentLat(value.latitude);
  //         await props.updateCurrentLng(value.longitude);
  //         await props.currentTag("Current Address");

  //         navigate_app();
  //       } else {
  //         alert("Sorry something went wrong");
  //       }
  //     });
  // };

   const onRegionChange = async (value, type) => {
  console.log('Reverse Geocoding for:', value.latitude, value.longitude);
  
  // Start loading
  // setLoading(true);

  let url = '';

  if (global.geocode==2) {
    url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${value.latitude},${value.longitude}&key=${GOOGLE_KEY}`;
  } else {
    url = `${REVERSE_GEOCODE}lat=${value.latitude}&lon=${value.longitude}&key=${ROUTEMAPPY_KEY}`;
  }

  console.log('Fetching from URL:', url);

  try {
    const response = await fetch(url);
    const responseJson = await response.json();

    let address = '';

    if (global.geocode==2) {
      if (responseJson?.results?.[0]?.formatted_address) {
        let addressComponents = responseJson.results[0].address_components;
        let pin_code = addressComponents[addressComponents.length - 1].long_name;
        address = responseJson.results[0].formatted_address;

       await props.updateCurrentAddress(address);
          await props.updateCurrentLat(value.latitude);
          await props.updateCurrentLng(value.longitude);
          navigate_app();
      }
    } else {
      console.log('geocode_response', responseJson.address.postcode);
      address = responseJson.display_name;

       await props.updateCurrentAddress(address);
          await props.updateCurrentLat(value.latitude);
          await props.updateCurrentLng(value.longitude);
          navigate_app();
    }

    if (address) {
      console.log('Reverse geocode address:', address);
    } else {
      console.log('No address found in response.');
    }
  } catch (error) {
    console.error('Reverse geocode failed:', error);
  } finally {
    // Stop loading regardless of success or failure
    setLoading(false);
  }
}; 

  const navigate_app = async () => {
    if (global.id !== 0) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Intro" }],
        })
      );
    } 
  };

  return (
    <View style={styles.background}>
      <StatusBar />
      <View style={styles.logo_container}>
        <Image style={styles.logo} source={logo_with_name} />
      </View>
      <View style={{ margin: 5 }} />
      <Text style={styles.spl_text}>Customer Application</Text>
      <View style={{position:'absolute', bottom:20, flexDirection:'row'}}>
                <Text style={styles.typingText}>
                    {poweredByText}
                    <Text style={styles.boldText}>{companyText}</Text>
                </Text>
            </View>
        

    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.theme_bg_three,
  },
  logo_container: {
    height: 400,
    width: 400,
  },
  logo: {
    height: undefined,
    width: undefined,
    flex: 1,
  },
  
  typingText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#000', // Replace with colors.theme_fg_two
    letterSpacing: 1,
},
boldText: {
    fontSize: 16,
    fontFamily: bold,
    color: '#000', // Replace with colors.theme_fg_two
    letterSpacing: 1,
},

  spl_text: {
    fontFamily: bold,
    fontSize: 18,
    color: colors.theme_fg,
    letterSpacing: 2,
  },
});

function mapStateToProps(state) {
  return {
    current_address: state.current_location.current_address,
    current_lat: state.current_location.current_lat,
    current_lng: state.current_location.current_lng,
    current_tag: state.current_location.current_tag,
    profile_picture: state.current_location.profile_picture,
    address: state.current_location.address,
    delivery_charge: state.order.delivery_charge,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
  updateTaxList: (data) => dispatch(updateTaxList(data)),
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
  updateAddress: (data) => dispatch(updateAddress(data)),
  updateDeliveryCharge: (data) => dispatch(updateDeliveryCharge(data)),
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
  updatePharmId: (data) => dispatch(updatePharmId(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
