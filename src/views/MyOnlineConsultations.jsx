import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { bold, regular, consultation_list, api_url, img_url, start_call } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Loader  from '../components/Loader';
import DropShadow from "react-native-drop-shadow";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon, { Icons } from '../components/Icons';
import Moment from 'moment';
import { StatusBar } from '../components/StatusBar';
import NetInfo from "@react-native-community/netinfo";
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';


const MyOnlineConsultations = () =>{
	const navigation = useNavigation();
	const [loading, setLoading] = useState(false);
	const [consult_list, setConsultList] = useState([]);
	const [dt, setDt] = useState(new Date().toTimeString().split(' ')[0]);

	var d = new Date(); // get current date
	d.setHours(d.getHours(),d.getMinutes()+30,0,0);

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

	useEffect( () => {
		const unsubscribe = navigation.addListener('focus', async () => {
		  get_consultation_list();
		});
		let secTimer = setInterval( () => {
			setDt(new Date().toTimeString().split(' ')[0])
		  },1000)

		return unsubscribe;
		return () => clearInterval(secTimer);
	},[]); 

	const handlePress = (title,next) => {
		ReactNativeHapticFeedback.trigger('impactHeavy', {
		  enableVibrateFallback: true,
		  ignoreAndroidSystemSettings: false,
		});
		next(title);
	  };

	const get_consultation_list = async () => {
		setLoading(true);
	  await axios({
		method: "post",
		url: api_url + consultation_list,
		data: { customer_id:global.id }
	  })
	  .then(async (response) => {
			setLoading(false);
			setConsultList(response.data.result);
			console.log(response.data.result)
	  })
	  .catch(async(error) => {
		  await setLoading(false);
		alert('Sorry, something went wrong!')
	  });
	}

	const move_rating = (data) =>{
		navigation.navigate("ConsultationRating",{ data : data });
	}

	const view_prescription = (data) =>{
		navigation.navigate("ViewPrescription", {data:data});
	}

	const check_time = (id, doctor_id, time) =>{
		if(time => dt){

			ReactNativeHapticFeedback.trigger('impactHeavy', {
				enableVibrateFallback: true,
				ignoreAndroidSystemSettings: false,
			  });
			call_start(id, doctor_id)
		}else{
			alert('Wait for your turn')
		}
	}

	const call_start = async (id, doctor_id) => {
		setLoading(true);
	  await axios({
		method: "post",
		url: api_url + start_call,
		data: { id:id }
	  })
	  .then(async (response) => {
		if(response.data.status == 1){
			move_to_room(id);
		}else{
			alert(response.data.message);
		}
	  })
	  .catch(async(error) => {
		setLoading(false);
		alert('Sorry, something went wrong!')
	  });
	}

	// const move_to_room = (id,doctor_id) =>{
	// navigation.navigate('VideoCall',{ id : id, doctor_id:doctor_id })
	// }

	const move_to_room = (id) =>{
		navigation.navigate('Agora',{ id : id })
		}

	const chat = (id) =>{
		navigation.navigate('DoctorChat',{ id : id })
	}

	const renderItem = ({ item }) => (
		
		
		<DropShadow

		 style={{
			padding:10,
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
			<View style={{ padding:10, flexDirection:'row', width:'100%'}}>
				<View style={{ width:'20%',justifyContent:'center', alignItems:'center' }}>
					<Image style={{ height: 50, width: 50, borderRadius:10 }} source={{uri: img_url + item.profile_image}} />
				</View>  
				<View style={{ margin:5 }}/>
				<View style={{ width:'65%'}}>
					<Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold  }}>Dr.{item.doctor_name} #{item.id}</Text>
					<View style={{ margin:3 }} />
					{item.status == 4 ?
					<Text style={{ fontSize:12, color:colors.success, fontFamily:bold  }}>{item.status_name}{item.online_status}</Text>
					:
					<Text style={{ fontSize:12, color:colors.error, fontFamily:bold  }}>{item.status_name}</Text>
					}
					<View style={{margin:5}}/>
				</View>
				<View style={{ width:'15%'}}>
					<Text style={{ fontSize:11, color:colors.grey, fontFamily:regular  }}>{global.currency}{item.total}</Text>
				</View>
			</View>
			<View style={{ flexDirection:"row", width:'100%', marginLeft:10, marginRight:10}}>
				{item.status != 3 && item.status != 4 && 
				<View style={{ width:'60%', justifyContent:'flex-start', alignItems:'flex-start', flexDirection:'row'}}>
					{item.online_status == 1 ?
						<View>
							<Text style={{ fontFamily:regular, fontSize:14, color:colors.green}}>Your doctor is in online.</Text>
						</View>
						:
						<View>
							<Text style={{ fontFamily:regular, fontSize:14, color:colors.grey}}>Your doctor is in offline.</Text>
						</View>
					}
				</View>
				}
				<View style={{ margin:10 }}/>
				<View style={{ width:'40%', justifyContent:'flex-start', alignItems:'flex-start'}}>
					{item.btn_status == 1 && item.status != 3 && item.status != 4 &&
						<TouchableOpacity onPress={check_time.bind(this, item.id, item.doctor_id, item.time)} style={{ flexDirection:'row' }} >
							<Icon type={Icons.Ionicons} name="call" color={colors.error} style={{ fontSize:15 }} />
							<View style={{ margin:2 }}/>
							<Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two, textAlign:'center'}}>Call Doctor</Text>
						</TouchableOpacity>
					}
				</View>
			</View>
			<View style={{ flexDirection:'row', with:'100%', padding:10,}}>
				{item.status == 4 && item.status != 3 &&
					<View style={{ width:'33%', justifyContent:'flex-end', alignItems:'flex-end'}}>
						<TouchableOpacity onPress={view_prescription.bind(this, item)} style={{ borderWidth:1, borderRadius:5, backgroundColor:colors.green, alignItems:'center', justifyContent:'center'}}>
							<Text style={{ fontSize:11, color:colors.theme_fg_three, fontFamily:bold, padding:5, textAlign:"center" }}>View Prescription</Text>
						</TouchableOpacity>
					</View>
				}
				{item.status < 4 && item.status != 3 &&
					<View style={{ width:'33%', justifyContent:'flex-end', alignItems:'flex-end'}}>
						<TouchableOpacity onPress={view_prescription.bind(this, item)} style={{ borderWidth:1, borderRadius:5, backgroundColor:colors.error, alignItems:'center', justifyContent:'center'}}>
							<Text style={{ fontSize:11, color:colors.theme_fg_three, fontFamily:bold, padding:5, textAlign:"center" }}>View Prescription</Text>
						</TouchableOpacity>
					</View>
				}
				<View style={{ width:'30%', justifyContent:'flex-end', alignItems:'flex-end'}}>
					{item.status <= 4 && item.status != 3 && item.chat_status == 1 &&
						<TouchableOpacity onPress={chat.bind(this,item.id)} style={{ borderWidth:1, borderRadius:5, backgroundColor:colors.theme_bg, alignItems:'center', justifyContent:'center'}}>
							<Text style={{ fontSize:11, color:colors.theme_fg_three, fontFamily:bold, padding:5, textAlign:"center" }}>Chat Doctor</Text>
						</TouchableOpacity>
					}
				</View>
				<View style={{ width:'33%', justifyContent:'flex-end', alignItems:'flex-end'}}>
					{ item.status == 4 && item.status != 3 && item.rating == 0 &&
						<TouchableOpacity onPress={move_rating.bind(this,item)} style={{ borderWidth:1, borderRadius:5, backgroundColor:colors.theme_bg, alignItems:'center', justifyContent:'center'}}>
							<Text style={{ fontSize:11, color:colors.theme_fg_three, fontFamily:bold, padding:5, textAlign:"center" }}>Add Ratings</Text>
						</TouchableOpacity>
					}
					{ item.status == 4 && item.status != 3 && item.rating != 0 &&
						<View style={{ flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
							<Icon type={Icons.Ionicons} name="star" color={colors.warning} style={{ fontSize:15 }} />
							<View style={{ margin:2}} />
							<Text style={{ fontSize:15, color:colors.grey, fontFamily:bold, textAlign:"center"  }}>{item.rating} Rating</Text>
						</View>
					}
				</View>
			</View>
			</View>
		</DropShadow>
	);

	return(
		<SafeAreaView style={styles.container}>
			<StatusBar />
			<View style={{ margin:5 }} />
    		<Loader visible={loading} />
			{consult_list.length > 0 ?
			<FlatList
				data={consult_list}
				renderItem={renderItem}
				keyExtractor={item => item.id}
			/>
			:
			<View style={{ width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
				<Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Sorry no data found</Text>
			</View>
			}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: 'flex-start',
	  backgroundColor:colors.light_blue,
	}
  });
  
export default MyOnlineConsultations;
