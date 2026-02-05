import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, img_url, api_url, get_online_doctors, get_nearest_doctors, create_consultation, check_consultation, continue_consultation, consultation_time_slots, month_name,no_data,semibold} from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { connect } from 'react-redux';
import Loader from '../components/Loader';
import RBSheet from "react-native-raw-bottom-sheet";
import { StatusBar } from '../components/StatusBar';
import ContentLoader from "react-native-easy-content-loader";
import * as Animatable from 'react-native-animatable';

const DoctorList = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [specialist, setSpecialist] = useState(route.params.specialist);
  const [type, setType] = useState(route.params.type);
  const [doctor_list, setDoctorList] = useState([]);
  const [is_error, setError] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dates, setDateList] = useState([]);
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState(undefined);
  const [defaultDate, setDefaultDate] = useState(new Date(1598051730000));
  const [slots, setSlots] = useState([]);
  const refRBSheet = useRef(null);
  const [consultation_fee, setConsultationFee] = useState(0);
  const [doctor_id, setDoctorId] = useState(0); 
  const [key_value, setKeyValue] = useState(undefined);

  const rbsheet_reference = async() => {
    setTimeout(() => {
      refRBSheet.current.focus();
    }, 200);
  }
  
  useEffect(() => {
    get_dates();
    if(type == 1){
      online_doctors(); 
    }else{
      nearest_doctors(); 
    }
  },[]);

  const get_dates = async() =>{
    let dates = [];
    for(let i=0; i<7; i++){
      if(i==0){
        let today = new Date();
        dates[i] = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      }else{
        let today = new Date();
        let new_date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+i);
        dates[i] = new_date.getFullYear()+'-'+(new_date.getMonth()+1)+'-'+new_date.getDate();
      }
    }
    setDateList(dates);
    setDate(dates[0]);
  }

  const get_slots = async(id, consultation_fee) =>{
    console.log()
    await setConsultationFee(consultation_fee);
    await setDoctorId(id); 
    get_time();
  }

  const get_time = async() =>{ 
   console.log({ date:date, doctor_id:id })
    await axios({

      method: 'post', 
      url: api_url + consultation_time_slots,
      data:{ date:date, doctor_id:id }
    })
    .then(async response => {
      /* setSlots(response.data.result);
      setTime(response.data.result[0].value)
      show_slots();
      setKeyValue(0); */
      if(response.data.status == 1){
        setSlots(response.data.result);
        console.log(response.data.result)
        setTime(response.data.result[0].value)
        change_time(response.data.result[0].value,response.data.result[0].key)
      refRBSheet.current.open()}
      else{
        alert(response.data.message)
      }
      show_slots();
    })
    .catch(error => {
    });
  }

  const onChange = async(event, selectedTime) => {
    setShow(false);
    let hours = await selectedTime.getHours(),
      minutes = await selectedTime.getMinutes(),
      seconds = await selectedTime.getSeconds();
    let time = await hours + ":" + minutes + ":" + seconds;
    setDefaultDate(selectedTime);
    setTime(time);
  };

  const change_date = async(date) => {
    setDate(date);
    get_time(date);
  };
  
  const change_time = (time, key) => {
    console.log("time",time, key)
    setTime(time);
    setKeyValue(key);
  };

  const online_doctors = async() =>{ 
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_online_doctors,
      data:{ specialist : specialist, search:'' }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        setDoctorList(response.data.result)
      }else{
        setError(1);
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const nearest_doctors = async() =>{ 
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_nearest_doctors,
      data:{ specialist : specialist, lat:props.current_lat, lng:props.current_lng, search:'' }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        setDoctorList(response.data.result.doctor_list)
      }else{
        setError(1);
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const hospital_details = (data) =>{
    navigation.navigate("HospitalDetails",{ data : data});
  }

  const search = () =>{
    navigation.navigate("DoctorSearch",{ specialist : specialist});
  }

  const payment_methods = (data) => {
    if(global.id == 0){
      navigation.navigate("CheckPhone")
    }else{
      confirm_consultation(data);
    }
  }

  const confirm_consultation = async(data) =>{ 
    setLoading(true);
    console.log("data2",api_url + check_consultation)
    console.log({ patient_id :global.id, doctor_id:data.doctor_id })
    await axios({
      method: 'post', 
      url: api_url + check_consultation,
      data:{ patient_id :global.id, doctor_id:data.doctor_id,consultation_type:data.consultation_type }
    })
    .then(async response => {
      setLoading(false);
      console.log("response1",response.data.result)
      if(response.data.result == 0){
        navigation.navigate("PaymentMethods", { type : 2, amount : data.total, data:data, route:create_consultation, from:'doctor_list' });
      }else{
        move_to_call(response.data.result, data);
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const move_to_call = async(consultation_request_id, data) =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + continue_consultation,
      data:{ patient_id :global.id, doctor_id:data.doctor_id, consultation_request_id:consultation_request_id }
    })
    .then(async response => {
      setLoading(false);
      navigation.navigate("Agora", { id: response.data.result.id});
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const set_data = async (doctor_id,amount) =>{
      let data = {
        patient_id:global.id,
        doctor_id:doctor_id,
        total:amount, 
        consultation_type:1
      }
      payment_methods(data);
  }

  const set_consultation_data = async () =>{
    let data = {
      patient_id:global.id,
      doctor_id:doctor_id,
      total:consultation_fee, 
      consultation_type:2,
      date:date,
      time:time,
    }
    console.log("data1",data)
    refRBSheet.current.close()
    payment_methods(data);
}

  const create_appointment = (data) => {
    navigation.navigate("CreateAppointment", { doctor_details : data });
  }

  const show_dates = () => { 
    return dates.map((data) => {
      let temp = data.split('-');
      let cur_date = temp[2];
      let month = month_name[temp[1] - 1];
      return (
        <TouchableOpacity onPress={change_date.bind(this,data)} style={ (data == date) ? styles.active_badge : styles.in_active_badge}>
          <Text style={ (data == date) ? styles.active_text : styles.in_active_text}>{cur_date}</Text>
          <View style={{ margin:1 }} />  
          <Text style={ (data == date) ? styles.active_text : styles.in_active_text}>{month}</Text>
        </TouchableOpacity>
      )
    });
  }

  const show_slots = () => { 
    return slots.map((data) => {
      return (
        <TouchableOpacity onPress={change_time.bind(this,data['value'],data['key'])} style={ (data['key'] == key_value) ? styles.active_time_badge : styles.in_active_time_badge}>
          <Text style={ (data['key'] == key_value) ? styles.active_time_text : styles.in_active_time_text}>{data['key']}</Text>
        </TouchableOpacity>
      )
    });
  }
  
  const render_online_doctors = ({ item }) => (
    <View style={{padding:10,}}>
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
            <View style={{ width:'100%', backgroundColor:colors.theme_bg_three , padding:5, borderRadius:10 }} >
              <View style={{flexDirection:'row'}}>
            <View style={{ width:50,height:50,borderRadius: 100,borderWidth:0.2, }}>
          		<Image style={{ height: undefined, width: undefined, flex:1, borderRadius:25 }} source={{ uri:img_url + item.profile_image }}/>
         		</View>
            <View style={{padding:5,paddingRight:10}}>
             <Text style={{ fontSize:14, color:colors.theme_bg_two, fontFamily:semibold,}}>Dr.{ item.doctor_name }</Text>
             <Text style={{ fontSize:13, color:colors.theme_fg_two, fontFamily:regular }}> { item.specialist }({ item.experience } Years Exp
             )</Text>
             </View>
             {/* <View style={{ width:'13%',height:"45%", borderColor:colors.light_blue, alignItems:'center', justifyContent:'center', backgroundColor:colors.light_blue , borderWidth:1, borderRadius:10, padding:5, flexDirection:'row'  }} > */}
             {/* <View style={{ width:'40%', alignItems:'center', justifyContent:'center' }} >
	        			<Icon type={Icons.FontAwesome} name="star" color={colors.theme_fg_two} style={{ fontSize:12, color:colors.theme_fg }} />
	        		</View> */}
	        	{/* 	<View style={{ width:'50%',  alignItems:'center', justifyContent:'center',   }} >
	        			<Text style={{ fontSize:10, color:colors.theme_fg_two, letterSpacing:1, fontFamily:semibold }}>{ item.overall_ratings }</Text>
	        		</View> */}
              {/* </View> */}
              </View>
              <View style={{margin:5}}/>
              <View style={{ width:'100%',flexDirection:'row', backgroundColor:colors.light_blue , padding:20, borderRadius:10 }} >
              {item.online_status == 1 ?
              <View style={{flexDirection:'row'}}>
                <View>
                <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:semibold,}}>Available Now</Text>
                <View style={{flexDirection:'row'}}>
                <Icon type={Icons.MaterialCommunityIcons} name="video" color={colors.theme_fg_two} style={{ fontSize:20, color:colors.success }} />
                <Text style={{ fontSize:14, color:colors.success, fontFamily:semibold,}}>Online</Text>
                </View>
                </View>
              </View>
              :
              <View style={{flexDirection:'row'}}>
                <View>
                <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:semibold,}}>Not Available</Text>
                <View style={{flexDirection:'row'}}>
                <Icon type={Icons.MaterialCommunityIcons} name="video" color={colors.theme_fg_two} style={{ fontSize:20, color:colors.error }} />
                <Text style={{ fontSize:14, color:colors.error, fontFamily:semibold,}}>Offline</Text>
                </View>
                </View>
              </View>
              }
            <View style={{width: 1,backgroundColor: '#ccc',height: '100%',marginHorizontal: 10,justifyContent:"center"}}/>
            <View style={{ width:'40%', justifyContent:'center',padding:10   }} >
        		<Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:semibold }}>{global.currency}{ item.consultation_fee }</Text>
            <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular,}}>Consultation Fee</Text>
        	  </View>
            </View>
            {item.online_status == 1 ?
          <View style={{ flexDirection:'row', width:'100%',  }} >
            <View style={{ width:'50%', justifyContent:'center', alignItems:'center'}}>
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
                <TouchableOpacity onPress={set_data.bind(this,item.id, item.consultation_fee)} style={styles.button}>
                  <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14, textAlign:'center'}}>Consult Now</Text>
                </TouchableOpacity>
                </View>
              </DropShadow>
            </View>
            <View style={{ width:'50%', justifyContent:'center', alignItems:'center'}}>
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
                <TouchableOpacity onPress={get_slots.bind(this,item.id, item.consultation_fee)} style={styles.button}>
                  <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14, textAlign:'center'}}>Consult Later</Text>
                </TouchableOpacity>
              </DropShadow>
            </View>
          </View>
          :
          <View style={{ flexDirection:'row', width:'100%', justifyContent:'center', alignItems:'center' }} >
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
              <TouchableOpacity onPress={get_slots.bind(this,item.id, item.consultation_fee)} style={styles.offline_button}>
                <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14, textAlign:'center'}}>Consult Later</Text>
              </TouchableOpacity>
            </DropShadow>
          </View>
        }
          <RBSheet
        ref={refRBSheet}
        height={300}
        closeOnDragDown={true}
        closeOnPressMask={false}
        
        customStyles={{
          container: {
            backgroundColor: '#e9edf5',
            borderTopColor:colors.grey, // Light blue background
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            shadowColor: '#000', // Shadow color for the border
            shadowOffset: { width: 0, height: -2 }, // Shadow offset to the top
            shadowOpacity: 0.2, // Shadow opacity
            shadowRadius: 4,
            elevation: 5, // Shadow for Android
          },
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
        >
        <View style={{ padding:10 }}>
          <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>Select your date</Text>
          <View style={{ flexDirection:'row', marginTop:10 }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {show_dates()}
            </ScrollView>
          </View> 
          <View style={{ margin:10}}/>
          <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>Select your Time</Text>
          <View style={{ flexDirection:'row', marginTop:10 }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {show_slots()}
            </ScrollView>
          </View> 
        </View>
        <TouchableOpacity style={styles.rb_button} onPress={set_consultation_data.bind(this)}>
          <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_three}}>Done</Text>
        </TouchableOpacity>
      </RBSheet>
            </View>
          </DropShadow>
    </View>
  );


  

  const render_nearest_doctors = ({ item }) => (
    <View style={{ marginBottom:20, margin:5 }} >
      <View >
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
          <View style={{borderRadius:10,padding:10, backgroundColor:colors.theme_fg_three}}>
          <View style={{ width:'100%', flexDirection:'row',  padding:15,  }} >
            <View style={{ width:120, alignItems:'flex-start', justifyContent:'center' }} >
              <View style={{ height: 100, width: 100, borderWidth:1, borderRadius:10, borderColor:colors.theme_fg_three }} >
                <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10, }} source={{ uri:img_url + item.hospital_logo }}/>
              </View> 
            </View>
            <View style={{ justifyContent:'center' }} >
              <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>{item.hospital_name}</Text>
              <View style={{ margin:3 }} />
              <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{item.opening_time} - {item.closing_time}</Text>
             
              <View style={{margin:5}}/>
              {item.type == 1 ?
                <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.warning, borderRadius:10, padding:3, textAlign:'center' }}>Hospital</Text>
                :
                <Text style={{ fontSize:12, color:colors.theme_bg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.warning, borderRadius:10, padding:3, textAlign:'center' }}>Clinic</Text>
              }
            </View>
          </View>
          <View style={{ width:'100%', padding:15, alignItems:'flex-start', justifyContent:'center' }} >
            <View style={{ flexDirection:'row' }} >
              <Icon type={Icons.Entypo} name="location" style={{ fontSize:15, color:colors.theme_fg }} />
              <View style={{ margin:3 }} />
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>{item.address}</Text>
            </View>
            <View style={{ margin:5 }} />
            <View style={{ flexDirection:'row' }} >
              <Icon type={Icons.FontAwesome} name="money" style={{ fontSize:15, color:colors.theme_fg }} />
              <View style={{ margin:3 }} />
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>Consultation Fee : </Text>
              <View style={{ margin:3 }} />
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:bold }}>{global.currency}{ item.appointment_fee }</Text>
            </View>
            <View style={{ margin:5 }} />
            <View style={{ flexDirection:'row' }} >
              <Icon type={Icons.FontAwesome5} name="business-time" style={{ fontSize:15, color:colors.theme_fg }} />
              <View style={{ margin:3 }} />
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>Waiting Time : </Text>
              <View style={{ margin:3 }} />
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:bold }}>{item.waiting_time} min</Text>
            </View>
          </View>
          <View style={{ width:'100%', flexDirection:'row', padding:10}}>
            {/*<TouchableOpacity activeOpacity={1} onPress={create_appointment.bind(this,item)} style={{ width:'30%', alignItems:'flex-start', justifyContent:'center'}}>
              <View style={{ width:'100%', alignItems:'center', justifyContent:'center', backgroundColor:colors.light_yellow, borderRadius:5, padding:10,}}>
                <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:12}}>Book Now</Text>
              </View>
            </TouchableOpacity>
            <View style={{ marginLeft:'3%' }} />*/}
            <View style={{ width:'100%', alignItems:'flex-end', justifyContent:'center'}}>
              <TouchableOpacity onPress={hospital_details.bind(this,item)} style={{ width:'100%', alignItems:'center', justifyContent:'center', backgroundColor:colors.regular_blue, borderRadius:5, padding:10}}>
                <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:12}}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View>
            <View style={{ flexDirection:'row', marginTop:10 }}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {show_dates()}
              </ScrollView>
            </View> 
            <View style={{ flexDirection:'row', marginTop:10 }}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {show_slots()}
              </ScrollView>
            </View> 
          </View> 
          <View style={{ margin:10 }} /> */} 
          </View>
        </DropShadow>
      </View>
    </View>
  );
  
  return (
  <SafeAreaView style={styles.container}> 
    <StatusBar />
    {type == 1 &&
    <View>
      <View style={{ margin:10 }} />
      <TouchableOpacity onPress={search} activeOpacity={1} style={{height: 45, borderRadius:10, padding:10, borderColor:colors.grey, backgroundColor:colors.light_blue, width:'90%', marginLeft:'5%', marginRight:'5%',flexDirection:'row',alignItems:'flex-start'}}>
      <Icon type={Icons.AntDesign} name="search1" color={colors.grey} style={{ fontSize:20 }} />
        <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular,paddingRight:10}}>Search by doctor's name</Text>
      </TouchableOpacity>
    </View>
    }
    <Loader visible={loading}/>
    {doctor_list.length != 0 ?
      <ScrollView style={{ padding:5 }} showsVerticalScrollIndicator={false}> 
        <ContentLoader 
		  avatar
		  aShape='square'
		  aSize={20}
		  pRows={2}
		  pHeight={[8, 8, 20]}
		  pWidth={['90%', 70, 100]}
		  listSize={5}
		  loading={loading}>
            {type == 1 ?
             <FlatList
               data={doctor_list}
               renderItem={render_online_doctors}
               keyExtractor={item => item.id}
             />
             :
             <FlatList
               data={doctor_list}
               renderItem={render_nearest_doctors}
               keyExtractor={item => item.id}
             />
           }
 

          
        <View style={{ margin:5 }} />
        </ContentLoader>
      </ScrollView>
      :
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
         {/* Image Section */}
         <View style={{ width: '100%', aspectRatio: 1 }}>
            <Image
              source={no_data} // Replace with your image path
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }} // Ensures proper scaling
            />
          </View>
        <Text style={{marginTop:20,fontFamily:semibold, color:colors.theme_fg_two, fontSize:16}}>Sorry no doctors found...</Text>
      </View>
    }
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:150
  },
  offline_button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:300
  },
  rb_button: {
    position: 'absolute', // Keep button at the bottom of the sheet
    bottom: 10,           // Maintain space from the bottom edge
    left: 20,             // Margins from left
    right: 20,            // Margins from right
    paddingVertical: 15,  // Adjust vertical padding for usability
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
    elevation: 5,         // Adds shadow for better visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  in_active_badge:{ 
    borderWidth:1, 
    borderColor:colors.light_grey, 
    backgroundColor:colors.theme_fg_three, 
    padding:5, 
    width:60, 
    height:60, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  in_active_time_badge:{ 
    borderWidth:1, 
    borderColor:colors.light_grey, 
    backgroundColor:colors.theme_fg_three, 
    padding:5, 
    width:100, 
    height:40, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  active_badge:{ 
    borderWidth:1, 
    borderColor:colors.theme_bg, 
    backgroundColor:colors.theme_bg, 
    padding:5, 
    width:60, 
    height:60, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  active_time_badge:{ 
    borderWidth:1, 
    borderColor:colors.theme_bg, 
    backgroundColor:colors.theme_bg, 
    padding:5, 
    width:100, 
    height:40, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  in_active_text:{ 
    fontSize:12, 
    color:colors.theme_fg_two, 
    fontFamily:bold 
  },
  in_active_time_text:{ 
    fontSize:12, 
    color:colors.theme_fg_two, 
    fontFamily:bold 
  },
  active_text:{ 
    fontSize:12, 
    color:colors.theme_fg_three, 
    fontFamily:bold 
  },
  active_time_text:{ 
    fontSize:12, 
    color:colors.theme_fg_three, 
    fontFamily:bold 
  }
});
function mapStateToProps(state){
  return{
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
  };
}
export default connect(mapStateToProps,null)(DoctorList);