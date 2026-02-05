import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, PermissionsAndroid, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, height_50, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, location,google_sans_regular ,customer_add_address, api_url, customer_update_address, customer_edit_address } from '../config/Constants';
import MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Icon, { Icons } from '../components/Icons';
import Loader from '../components/Loader';
import { StatusBar } from '../components/StatusBar';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import allReducers from '../reducers';



const AddAddress = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState('false');
  const [mapRegion, setmapRegion] = useState(null);
  const mapRef = useRef(null);
  const [address, setAddress] = useState('Please select your location...');
  const [pin_code, setPinCode] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0); 
  const [address_id, setAddressId] = useState(route.params.id);
  const [landmark, setLandmark] = useState('');
  const [validation,setValidation] = useState(false); 
  const [location_value, setLocationValue] = useState('');
  const [isGooglePlacesVisible, setIsGooglePlacesVisible] = useState(true);  
  const googlePlacesRef = useRef(null);  
  const [userLocation, setUserLocation] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);


  const handleBackButtonClick= () => {
    navigation.goBack()
  }
  
  const ref_variable = async() =>{
    setIsGooglePlacesVisible(true);

    await setTimeout(() => {
      mapRef.current.focus();
      googlePlacesRef.current?.focus();  
    }, 200);
  }

  const onInputFocus = () => {
    setAddress(""); 
    setIsGooglePlacesVisible(true);
    setIsInputFocused(true);  

    Keyboard.dismiss(); 
    setTimeout(() => {
      googlePlacesRef.current?.focus();  
    }, 100);
  };

  const centerToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...mapRegion,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    }
  };

  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await requestCameraPermission();
    });
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        let region = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setmapRegion(region);
      },
      (error) => console.error('Error fetching location:', error), // Log errors
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    return unsubscribe;
  },[navigation]);

  const requestCameraPermission = async() =>{
    if(Platform.OS === "android"){
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': global.app_name+' needs to Access your location for tracking'
            }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await findType();
        } else {
            await handleBackButtonClick();
        }
    } catch (err) {
        await handleBackButtonClick();
    }
    }else{
      await getInitialLocation();
    }
  }

  const findType = async() =>{
    if(address_id == 0){
      getInitialLocation();
    }else{
      edit_address();
    }
  }

  const get_location=(data, details)=>{
    console.log("data",data, details)
    if (details?.geometry?.location) {
      const { lat, lng } = details.geometry.location;
      setAddress(details.formatted_address);
      setLatitude(lat);
      setLongitude(lng);
      let region = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      onRegionChange(region); // Pass the location data to your custom function
    } else {
      console.warn("Details or location not available");
    }

}


  const edit_address = async() =>{
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_edit_address,
      data:{ id: address_id, customer_id: global.id }
    })
    .then(async response => {
      setLoading(false);
      //alert(JSON.stringify(response))
      setLocationValue(response.data.result)
      setLocation(response.data.result);
    })
    .catch(error => {
      setLoading(false);
      console.log('Sorry something went wrong')
    });
  }

  const setLocation = async(data) =>{
    let region = {
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lng),
      latitudeDelta:  LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }
    setAddress(data.address);
    setLandmark(data.landmark);
    setmapRegion(region);
    //alert(JSON.stringify(mapRegion))
  }

  const getInitialLocation = async() =>{
    await Geolocation.getCurrentPosition( async(position) => {
      let region = {
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      setmapRegion( region )
      
    }, error => console.log(error) , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  const onRegionChange = async(value) => {
    console.log("region",value)
    setIsGooglePlacesVisible(false);
    setAddress( "please_wait..." );
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              let address = responseJson.results[0].address_components;
              let pin_code = address[address.length - 1].long_name;
              setPinCode(  pin_code );
              setAddress( responseJson.results[0].formatted_address );
              setLatitude(  value.latitude );
              setLongitude(  value.longitude );
           }else{
            setAddress("sorry something went wrong" );
           }
    }) 
  }  

  const address_validation = async() =>{
    if(landmark == ""){
      alert('Please enter the landmark')
      await setValidation(false);
    }else{
      await setValidation(true);
      add_address();
    }
  }

  const update_address_validation = async() =>{
    if(landmark == ""){
      alert('Please enter the landmark')
      await setValidation(false);
    }else{
      await setValidation(true);
      update_address();
    }
  }

  const add_address = async () => {
    console.log({ customer_id: global.id, address: address.toString(), landmark: landmark, lat: latitude, lng: longitude })
    console.log(api_url + customer_add_address)
    console.log("location add address")
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_add_address,
      data:{ customer_id: global.id, address: address.toString(), landmark: landmark, lat: latitude, lng: longitude }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        handleBackButtonClick();
      }else{
        alert(response.data.message);
      }
    })
    .catch(error => {
      setLoading(false);
      console.log('Sorry something went wrong')
      alert('Sorry something went wrong')
    });
    }

  const update_address = async () => {
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_update_address,
      data:{ id: address_id, customer_id: global.id, address: address.toString(), landmark: landmark, lat: latitude, lng: longitude }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        handleBackButtonClick();
      }
    })
    .catch(error => {
      setLoading(false);
      console.log('Sorry something went wrong')
    });
  }

  return (
<SafeAreaView style={styles.container} keyboardShouldPersistTaps="always" >
    <StatusBar backgroundColor="transparent" barStyle={'dark-content'}  translucent={true} />

      <Loader visible={loading} />
        <View style={styles.header}>


          
        </View>

        <View style={styles.content}>
      
      {/*         <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                // style={styles.map}
                style={[styles.map]}  // Set a fixed height for the map
                initialRegion={mapRegion}
                // showsUserLocation={true}
                showsMyLocationButton={true}
                onRegionChangeComplete={(region) => {onRegionChange(region)}}
              >
                <Marker
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  title="You are here"
                  description="This is your custom location marker"
                >
                  <View style={styles.customMarker}>
                  </View>
                </Marker>
              </MapView> */}

              <MapView
          provider={PROVIDER_GOOGLE} 
          ref={mapRef}
          style={{width: '100%',height: '100%'}}
          initialRegion={ mapRegion }
          onRegionChangeComplete={region => onRegionChange(region)}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
        </MapView>
        <View style={{position: 'absolute',}}>
          <View style={{height:30, width:25, top:-15 }} >
            <Image
              style= {{flex:1 , width: undefined, height: undefined}}
              source={location}
            />
          </View>
        </View>
                      
   <View style={{padding:10,position:'absolute',top:10,width:'100%',}}>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.theme_bg_two, borderRadius: 20 ,backgroundColor: '#044078',elevation:5}}>
          <Icon 
            type={Icons.Ionicons} 
            name="arrow-back-outline" 
            color={colors.theme_fg_three} 
            style={{ fontSize: 20 }} 
          />
        </TouchableOpacity>
        <View style={{margin:5}}/>
        <View style={{backgroundColor:colors.theme_bg_three,padding:0,borderRadius:16,elevation:5}}>
        {isGooglePlacesVisible ? (
        <GooglePlacesAutocomplete
        ref={googlePlacesRef} 
        minLength={2}
        placeholder={address || "Search Address"}
        fetchDetails={true}
        listViewDisplayed="auto"
        GooglePlacesSearchQuery={{
          rankby: "distance",
          types: "food",
        }}
        debounce={200}
        filterReverseGeocodingByTypes={[
          "locality",
          "administrative_area_level_3",
        ]}
        textInputProps={{
          placeholderTextColor: colors.grey,
          returnKeyType: "search",
        }}
        styles={{
          textInputContainer: {
            backgroundColor: colors.theme_bg_three,
            borderRadius: 10,
          },
          description: {
            color: "#000",
          },
          textInput: {
            color: colors.grey,
            fontSize: 12,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            
          },
          predefinedPlacesDescription: {
            color: colors.grey,
          },
        }}
        currentLocation={true}
        enableHighAccuracyLocation={true}
        query={{
          key: GOOGLE_KEY,
          language: "en",
          radius: "1500",
          location: latitude + "," + longitude,
          types: ["geocode", "address"],
        }}
        onPress={(data, details = null) => {
          if (details?.geometry?.location) {
            const { lat, lng } = details.geometry.location;
            // Move the map to the selected location
            mapRef.current?.animateToRegion(
              {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.005, // Adjust zoom level
                longitudeDelta: 0.005, // Adjust zoom level
              },
              1000 // Animation duration in ms
            );

            // Call your custom function with the location details
            get_location(data, details);
          } else {
            console.warn("Details or location not available");
          }
        }}
      />
      ) : (
                <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "nowrap",padding:10, }}    >
                <Text 
                  style={[styles.address_text, { flex: 1 }]}
                  onPress={onInputFocus}
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                >
                  {address || "Search address"}
                </Text>
                <TouchableOpacity onPress={onInputFocus}>
                <Icon    
                  type={Icons.AntDesign}
                  name="search1"
                  style={{ color: colors.grey, marginLeft: 8 }}
                />
                </TouchableOpacity>
               
              </View>
              
              )}
        </View>
        <View style={{margin:5}}/>
          <View
            style={[styles.textFieldcontainer,{elevation:5}]}>
            <TextInput
              style={styles.textField}
              placeholder={"enter your landmark"}
            placeholderTextColor={colors.grey}
   
              onChangeText={text => setLandmark(text)}
              value={landmark}
            />
          </View>
   </View>

              <TouchableOpacity
                  style={{
                    position: "absolute",
                    bottom: 80,
                    right: 20,
                    backgroundColor: "#fff",
                    borderRadius: 50,
                    padding: 10,
                    elevation: 5,
                  }}
                  onPress={centerToUserLocation}
                >
                  <Icon
                    type={Icons.MaterialIcons}
                    name="my-location"
                    color={colors.grey}
                    style={{ fontSize: 22 }}
                  />
                </TouchableOpacity>
                
            </View>

      {address_id == 0 ?
        <View style={{ left:0, right:0, bottom:15, alignItems:'center', height:50, position:'absolute', justifyContent:'center',marginHorizontal:10}}>
            <TouchableOpacity onPress={address_validation.bind(this)} style={{ width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:colors.theme_bg, borderRadius:16, padding:15,}}>
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:16}}>Add address</Text>
            </TouchableOpacity>
        </View>
        :
        <View style={{ left:0, right:0, bottom:15,alignItems:'center', height:50, position:'absolute', justifyContent:'center',marginHorizontal:10}}>
            <TouchableOpacity onPress={update_address_validation.bind(this)} style={{ width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:colors.theme_bg, borderRadius:16, padding:15,}}>
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:16}}>update address</Text>
            </TouchableOpacity>
        </View>
        
      }
    </SafeAreaView>  

  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:colors.lite_bg,
    flex:1
  },

map: {
  width: "100%",
  height:'100%',
},

  button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'94%',
    marginLeft:'3%',
    marginRight:'3%',
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
    height: 45,
    elevation:5
  },
  textField: {
    flex: 1,
    padding: 1,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    color:colors.theme_fg_two,
    padding:10
  },
  landmark_label:{
    fontSize:15, 
    fontFamily:bold, 
    color:colors.theme_fg_two 
  },
  address_text:{
    color:colors.theme_fg_two,
    fontSize:12,
    fontFamily:regular,
    margin:5,
    width:"50%"
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex:1
  },
});

export default AddAddress;
