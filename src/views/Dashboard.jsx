import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Dimensions, Text, ScrollView, TouchableOpacity, ImageBackground, Linking } from 'react-native';
import * as colors from '../assets/css/Colors';
import { img_url, regular, bold, home, api_url, location } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateCurrentAddress, updateCurrentLat, updateCurrentLng, currentTag, updateAddress } from '../actions/CurrentAddressActions';
import axios from 'axios';
import { connect } from 'react-redux';
import DropShadow from "react-native-drop-shadow";
import Loader from '../components/Loader';
import Icon, { Icons } from '../components/Icons';
import { StatusBar } from '../components/StatusBar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import NetInfo from "@react-native-community/netinfo";
const Dashboard = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [banners, setBanners] = useState([]);
  const [services, setServices] = useState([]);
  const [symptoms_first, setSymptomsFirst] = useState([]);
  const [symptoms_second, setSymptomsSecond] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [is_error, setError] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommended_doctors, setRecomendedDoctors] = useState([]);
  const [top_rated_doctors, setTopRatedDoctors] = useState([]);
  const [notice,setNotice]=useState(false)


  const doctor_categories = () => {
    navigation.navigate("DoctorCategories")
  }

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

  useEffect(() => {
    important_notice();
    get_home_details();
  }, []);

  const get_home_details = async () => {
    console.log(api_url + home)
    console.log({ lat: props.current_lat, lng: props.current_lng })
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + home,
      data: { lat: props.current_lat, lng: props.current_lng }
    })
      .then(async response => {
        setLoading(false);
        if (response.data.status == 1) {
          setBanners(response.data.result.banners);
          setServices(response.data.result.services);
          setSymptomsFirst(response.data.result.symptoms_first);
          setSymptomsSecond(response.data.result.symptoms_second);
          setHospitals(response.data.result.hospitals);
          setRecomendedDoctors(response.data.result.recommended_doctors);
          setTopRatedDoctors(response.data.result.top_rated_doctors);
        } else {
          setError(1);
        }
      })
      .catch(error => {
        setLoading(false);
        alert(error);
      });
  }
  async function important_notice(){
    try {
      const hasSeenNotice = await AsyncStorage.getItem('hasSeenNotice');
      if (!hasSeenNotice) {
        setNotice(true);
        await AsyncStorage.setItem('hasSeenNotice', 'true');
      }
    } catch (error) {
      console.error('Failed to check AsyncStorage:', error);
    }
  }

  const navigate = (route, param) => {
    navigation.navigate(route, { type: param });
  }

  const navigate_symptoms = (specialist, type) => {
    navigation.navigate('DoctorList', { specialist: specialist, type: type })
  }

  

  const banners_list = () => {
    return banners.map((data) => {
      return (
        <TouchableOpacity onPress={open_linking.bind(this, data.link)} activeOpacity={1}>
          <ImageBackground source={{ uri: img_url + data.url }} imageStyle={styles.home_style2} style={styles.home_style3} />
        </TouchableOpacity>
      )
    });
  }

  const open_linking = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  }

  const services_list = () => {
    return services.map((data) => {
      return (
        <TouchableOpacity activeOpacity={1} style={{ padding: 10 }} onPress={navigate.bind(this, data.action, data.id)}>
           <DropShadow
                style={{
                width:210,
                borderBottom:-10,
                shadowColor: "#000",
                shadowOffset: {
                width: 0,
                height: 0,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                }}
            > 
            <View style={{borderRadius:10,padding:5, backgroundColor:colors.theme_fg_three}}>
            <ImageBackground source={{ uri: img_url + data.service_image }} style={styles.ban_style3} />
          </View>
          </DropShadow>
        </TouchableOpacity>
      )
    });
  }

  const symptoms_first_list = () => {
    return symptoms_first.map((data) => {
      return (
        <TouchableOpacity onPress={navigate_symptoms.bind(this, data.specialist_id, 1)} style={{ alignItems: 'center', width: (Dimensions.get('window').width / 4) - 17, }}>
          <View style={{ height: 70, width: 70, borderRadius: 10 }}>
            <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 10 }} source={{ uri: img_url + data.symptom_image }} />
          </View>
          <View style={{ margin: 5 }} />
          <Text style={{ fontSize: 10, color: colors.theme_fg_two, fontFamily: bold, marginTop: 5 }}>{data.symptom_name}</Text>
        </TouchableOpacity>
      )
    });
  }

  const symptoms_second_list = () => {
    return symptoms_second.map((data) => {
      return (
        <TouchableOpacity onPress={navigate_symptoms.bind(this, data.specialist_id, 1)} style={{ alignItems: 'center', width: (Dimensions.get('window').width / 4) - 17, }}>
          <View style={{ height: 70, width: 70, borderRadius: 10 }}>
            <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 10 }} source={{ uri: img_url + data.symptom_image }} />
          </View>
          <View style={{ margin: 5 }} />
          <Text style={{ fontSize: 10, color: colors.theme_fg_two, fontFamily: bold, marginTop: 5 }}>{data.symptom_name}</Text>
        </TouchableOpacity>
      )
    });
  }

 
  const hospital_details = (data) => {
    navigation.navigate("HospitalDetails", { data: data });
  }

  const view_all = (title, type, data) => {
    navigation.navigate("ViewList", { data: data, title: title, type: type });
  }

  const show_hospitals = () => {
    return hospitals.map((data) => {
      return (
        <View style={{ marginBottom: 20, margin: 5, width: 200 }} >
          <TouchableOpacity activeOpacity={1} onPress={hospital_details.bind(this, data)}>
          <DropShadow
            style={{
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
              <View style={{ width: '100%', alignItems: 'center', backgroundColor: colors.theme_fg_three, borderRadius: 10 }} >
                <View style={{ width: 200, alignItems: 'flex-start', justifyContent: 'center' }} >
                  <View style={{ height: 200, width: '100%', }} >
                  <Image style={{ height: undefined, width: undefined, flex: 1,borderTopLeftRadius:10, borderTopRightRadius:10  }} source={{ uri: img_url + data.hospital_logo }} />
                  </View>
                </View>
                <View style={{ margin: 5 }} />
                <View style={{ justifyContent: 'flex-start' }} >
                  <Text style={{ fontSize: 14, color: colors.theme_fg, fontFamily: bold }}>{data.hospital_name}</Text>
                  <View style={{ margin: 5 }} />
                  {data.type == 1 ?
                    <Text style={{ fontSize: 12, color: colors.theme_fg_three, fontFamily: bold, letterSpacing: 0.5, backgroundColor: colors.badge_bg, borderRadius: 10, padding: 3, textAlign: 'center' }}>Hospital</Text>
                    :
                    <Text style={{ fontSize: 12, color: colors.theme_bg_three, fontFamily: bold, letterSpacing: 0.5, backgroundColor: colors.badge_bg, borderRadius: 10, padding: 3, textAlign: 'center' }}>Clinic</Text>
                  }
                </View>
              </View>
              <View style={{ margin: 5 }} />
              <View style={{ width: '90%', marginLeft: '5%', flexDirection: 'row', paddingLeft: 10, paddingRight: 10, alignItems: 'center' }}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>{data.address}</Text>
              </View>
              <View style={{ margin: 5 }} />
              </View>
            </DropShadow>
          </TouchableOpacity>
        </View>
      )
    });
  }

  const show_recommended_doctors = () => {
    return recommended_doctors.map((data) => {
      return (
        <View style={{ marginBottom: 20, margin: 5, width: 200 }} >
          <TouchableOpacity activeOpacity={1} onPress={consult_doctors.bind(this, data.specialist_id, 1)}>
          <DropShadow
            style={{
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
              <View style={{ width: '100%', alignItems: 'center', backgroundColor: colors.theme_fg_three, borderRadius: 10 }} >
                <View style={{ width: 200 }} >
                  <View style={{ height: 200, width: '100%' }} >
                    <Image style={{ height: undefined, width: undefined, flex: 1, borderTopLeftRadius:10, borderTopRightRadius:10 }} source={{ uri: img_url + data.profile_image }} />
                  </View>
                </View>
                <View style={{ margin: 5 }} />
                <View style={{ justifyContent: 'flex-start' }} >
                  <Text style={{ fontSize: 14, color: colors.theme_fg, fontFamily: bold }}>Dr.{data.doctor_name}</Text>
                  <View style={{ margin: 5 }} />
                  <Text style={{ fontSize: 12, color: colors.theme_fg_three, fontFamily: bold, letterSpacing: 0.5, backgroundColor: colors.badge_bg, borderRadius: 10, padding: 3, textAlign: 'center' }}>{data.qualification}</Text>
                </View>
              </View>
              <View style={{ margin: 5 }} />
              </View>
            </DropShadow>
          </TouchableOpacity>
        </View>
      )
    });
  }

  const create_appointment = (doctor_details) => {
    navigation.navigate("CreateAppointment", { doctor_details: doctor_details, appointment_fee: doctor_details.appointment_fee });
  }

  const consult_doctors = (specialist, type) => {
    navigation.navigate("DoctorList", { specialist: specialist, type: type });
  }

  const show_top_rated_doctors = () => {
    return top_rated_doctors.map((data) => {
      return (
        <View style={{ marginBottom: 20, margin: 5, width: 200 }} >
          <TouchableOpacity activeOpacity={1} onPress={consult_doctors.bind(this, data.specialist_id, 1)}>
          <DropShadow
            style={{
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
              <View style={{ width: '100%', alignItems: 'center', backgroundColor: colors.theme_fg_three, borderRadius: 10 }} >
                <View style={{ width: 200 }} >
                  <View style={{ height: 200, width: '100%' }} >
                    <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius:10, borderTopLeftRadius:10, borderTopRightRadius:10  }} source={{ uri: img_url + data.profile_image }} />
                  </View>
                </View>
                <View style={{ margin: 5 }} />
                <View style={{ justifyContent: 'flex-start' }} >
                  <Text style={{ fontSize: 14, color: colors.theme_fg, fontFamily: bold }}>Dr.{data.doctor_name}</Text>
                  <View style={{ margin: 5 }} />
                  <Text style={{ fontSize: 12, color: colors.theme_fg_three, fontFamily: bold, letterSpacing: 0.5, backgroundColor: colors.badge_bg, borderRadius: 10, padding: 3, textAlign: 'center' }}>{data.qualification}</Text>
                </View>
              </View>
              <View style={{ margin: 5 }} />
              </View>
            </DropShadow>
          </TouchableOpacity>
        </View>
      )
    });
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <Modal
          animationType="fade"
          transparent={true}
          visible={notice}
          onRequestClose={()=>setNotice(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Disclaimer</Text>
              <Text style={styles.modalText}>This app belongs to <Text style={{color:colors.success,fontFamily:bold}}>Menpani Technology Pvt Ltd.</Text> We do not allow reselling by others. For genuine access and support, contact us directly.!</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://menpanitech.com/')} style={{ marginBottom:20 }}>
                <Text style={{ color: colors.theme_bg_two, textAlign: 'center', textDecorationLine: 'underline' }}>
                  https://menpanitech.com
                </Text>
              </TouchableOpacity>
              <TouchableOpacity  onPress={()=>setNotice(false)} style={{width:'100%',backgroundColor:colors.btn_color,padding:10,justifyContent:'center',alignItems:'center',borderRadius:10}}><Text style={{color:colors.theme_bg_three,fontSize:12}}>Okay</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      <StatusBar />
      <Loader visible={loading} />
      <ScrollView style={{ padding: 10 }} showsVerticalScrollIndicator={false}>
        <View style={{ margin: 5 }} />
        <View style={styles.header} >
      
          <View style={{ margin: 5 }} />
         
        </View>
        <View style={{ margin: -5 }} />
        <View style={styles.home_style1}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {banners_list()}
          </ScrollView>
        </View>
        <View style={{ margin: 20 }} />
        <Text style={{ fontSize: 18, color: colors.theme_fg_two, fontFamily: bold }}>Our Valuable Services</Text>
        <View style={{ margin: 5 }} />
        <View style={styles.ban_style1}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {services_list()}
          </ScrollView>
        </View>
        <View style={{ margin: 20 }} />
        <Text style={{ fontSize: 18, color: colors.theme_fg_two, fontFamily: bold }}>Find the doctor for common symptoms</Text>
        <View style={{ margin: 2 }} />
        <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>Select your top doctors - 24/7</Text>
        <View style={{ margin: 5 }} />
        <View style={{ flexDirection: 'row' }}>
          <ScrollView horizontal={true} style={{ padding: 10 }} showsHorizontalScrollIndicator={false}>
            {symptoms_first_list()}
            <View style={{ margin: 5 }} />
          </ScrollView>
        </View>
        <View style={{ margin: 5 }} />
        <View style={{ flexDirection: 'row' }}>
          <ScrollView horizontal={true} style={{ padding: 10 }} showsHorizontalScrollIndicator={false}>
            {symptoms_second_list()}
            <View style={{ margin: 5 }} />
          </ScrollView>
        </View>
        <View style={{ margin: 20 }} />
        {hospitals.length > 0 &&
          <View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ alignSelf: 'flex-start', width: '75%' }}>
                <Text style={{ fontSize: 18, color: colors.theme_fg_two, fontFamily: bold }}>Recommended Hospitals</Text>
              </View>
              <View style={{ alignSelf: 'flex-end', width: '25%' }}>
                <Text onPress={view_all.bind(this, 'Recommended Hospitals', 1, hospitals)} style={{ fontSize: 12, color: colors.theme_bg_three, fontFamily: bold, letterSpacing: 0.5, backgroundColor: colors.badge_bg, borderRadius: 10, padding: 3, textAlign: 'center' }}>View All</Text>
              </View>
            </View>

            <View style={styles.ban_style1}>
              <ScrollView horizontal={true} style={{ padding: 10 }} showsHorizontalScrollIndicator={false}>
                {show_hospitals()}
                <View style={{ margin: 10 }} />
              </ScrollView>
            </View>
          </View>
        }

        <View style={{ margin: 60 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_bg_three,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  modalOverlay: {
    flex: 1,   
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '98%',
    backgroundColor:colors.warning_background,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, 
    shadowRadius: 5 
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'red'
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color:'grey',
    color:colors.theme_bg_two
  },
  ban_style1: {
    flexDirection: 'row'
  },
  ban_style2: {
    borderRadius: 10
  },
  ban_style3: {
    height: 160,
    width: 200,
    borderRadius:10,
    paddingleft:10
  },
  home_style1: {
    flexDirection: 'row',
    padding:15
  },
  home_style2: {
    borderRadius: 10
  },
  home_style3: {
    height: 140,
    width: 260,
    borderRadius: 10,
    marginRight: 10
  },
});

function mapStateToProps(state) {
  return {
    current_lat: state.current_location.current_lat,
    current_lng: state.current_location.current_lng,
    current_address: state.current_location.current_address,
    current_tag: state.current_location.current_tag,
    address: state.current_location.address,
    sub_total: state.order.sub_total,
    cart_count: state.order.cart_count,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateAddress: (data) => dispatch(updateAddress(data)),
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);