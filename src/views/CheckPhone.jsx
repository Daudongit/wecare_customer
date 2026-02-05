import React, { useState, useRef }  from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Keyboard,StatusBar} from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, api_url, customer_check_phone,login } from '../config/Constants';
import PhoneInput from 'react-native-phone-input';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';
import { Image } from 'react-native-animatable';
import Icon, { Icons } from '../components/Icons';


const CheckPhone = () => {

  const navigation = useNavigation();
  const phone_ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false); 

  const otp = () => {
    navigation.navigate("Password")
  }

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const onPressFlag = () => {
    countryPicker.openModal()
  }

  const phone_reference = async() => {
    await setTimeout(() => {
      phone_ref.current.focus();
    }, 200);
  }

  const check_validation = async() => {
    Keyboard.dismiss();
    if('+'+phone_ref.current.getCountryCode() == phone_ref.current.getValue()){
      await setValidation(false);
      alert('Please enter your phone number')
    }else if(!phone_ref.current.isValidNumber()){
      await setValidation(false);
      alert('Please enter valid phone number')
    }else{
      await setValidation(true);
      //otp();
      check_phone_number( phone_ref.current.getValue() )
    }
  }

  const check_phone_number = async(phone_with_code) => {
    console.log({ phone_with_code : phone_with_code})
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_check_phone,
      data:{ phone_with_code : phone_with_code}
    })
    .then(async response => {
      setLoading(false);
      if(response.data.result.is_available == 1){
        navigation.navigate('Password',{ phone_with_code : phone_with_code })
      }else{
        let phone_number = phone_ref.current.getValue();
        phone_number = phone_number.replace("+"+phone_ref.current.getCountryCode(), "");
        navigation.navigate('Otp',{ data : response.data.result.otp, type: 1, phone_with_code : phone_with_code, phone_number : phone_number })
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }


return (
  <SafeAreaView style={styles.container}>
  <StatusBar backgroundColor="transparent" barStyle={'dark-content'} translucent/>
  <Loader visible={loading} />
  <ScrollView  showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
  <View style={{width:500}} >
    <Image source={login} style={{width:400,height:430,}}/>
      <TouchableOpacity onPress={handleBackButtonClick} style={{ width:100 , justifyContent:'center', alignItems:'flex-start',position:'absolute',padding:10 }}>
        <Icon type={Icons.Ionicons} name="arrow-back-outline" color={colors.theme_fg_two} style={{ fontSize:25,padding:15,marginTop:30}} />
      </TouchableOpacity>
      <TouchableOpacity style={{ width:100 , justifyContent:'center', alignItems:'flex-start' }}>
      </TouchableOpacity>
      </View>
    <View style={{padding:15,backgroundColor:colors.lite_bg,}}>
    <Text style={ styles.title}>Consult doctors online, book hospitals and labs, order medicines – complete healthcare in one app!</Text>
    <View style={{ margin:10 }}/>
      <View style={{ margin:10 }}/>
      <View style={styles.textFieldcontainer}>
        <PhoneInput ref={phone_ref} style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style}  initialCountry="in" offset={10} textStyle={styles.country_text} textProps={{ placeholder: "Enter your phone number", placeholderTextColor : colors.grey }} autoFormat/>
      </View>
      <View style={{ margin:20 }}/>
      <TouchableOpacity  onPress={check_validation}  style={styles.button}>
        <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Continue</Text>
      </TouchableOpacity>
      <View style={{ margin:10 }}/>
    </View>  
    </ScrollView>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textFieldIcon: {
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three
  },
  title: {
    fontSize: 20,
    color:colors.theme_fg_two,
    fontFamily:regular,
    textAlign: 'center',
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontFamily:regular,
    fontSize: 17,
    color: colors.theme_fg_two
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 55
  },
});

export default CheckPhone;