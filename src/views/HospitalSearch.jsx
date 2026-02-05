import React, { useRef, useEffect, useState}  from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View, TextInput, Image, FlatList, ScrollView,useColorScheme  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { bold, regular, api_url, get_nearest_doctors, img_url } from '../config/Constants';
import axios from 'axios';
import Icon, { Icons } from '../components/Icons';

const HospitalSearch = () => {
    const navigation = useNavigation();
    const search_ref = useRef();
    const route = useRoute();
    const [data, setData] = useState([]);
    const [recommended_data, setRecommendedData] = useState([]); 
    const [search_txt, setSearchTxt] = useState('');
    const [lat, setLat] = useState(route.params.lat);
    const [lng, setLng] = useState(route.params.lng);
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme(); // Get current color scheme
     // Define text colors based on the color scheme
  const pickerTextColor = colorScheme === 'dark' ? '#fff' : '#000';


    useEffect(() => {
        setTimeout(() => { search_ref.current.focus() }, 200)
    },[]);

    const handleBackButtonClick= () => {
      navigation.goBack()
    }

    const recommended_hospitals = ({ item }) => (
      <TouchableOpacity onPress={view_hospital_details.bind(this,item)} style={{ flexDirection:'row', width:'90%', margin:5, backgroundColor:colors.theme_bg_three, padding:5, paddingTop:10, paddingBottom:10, marginLeft:'5%', marginRight:'5%', borderRadius:10}}>
        <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}}>
            <Image style={{ width:50, height:50, borderRadius:5 }} source={{ uri:img_url + item.hospital_logo }} />
        </View>
        <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.hospital_name}</Text>
            <View style={{ margin:2 }} />
            <Text numberOfLines={2} style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{item.address}</Text>
        </View>
      </TouchableOpacity>
    )

    const render_nearest_hospitals = ({ item }) => (
      <TouchableOpacity onPress={view_hospital_details.bind(this,item)} style={{ flexDirection:'row', width:'90%', margin:5, backgroundColor:colors.theme_bg_three, padding:5, paddingTop:10, paddingBottom:10, marginLeft:'5%', marginRight:'5%', borderRadius:10}}>
        <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}}>
            <Image style={{ width:50, height:50, borderRadius:5 }} source={{ uri:img_url + item.hospital_logo }} />
        </View>
        <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.hospital_name}</Text>
            <View style={{ margin:2 }} />
            <Text numberOfLines={2} style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{item.address}</Text>
        </View>
      </TouchableOpacity>
    );

    const find_hospitals = async(search_txt) =>{ 
      console.log({ lat:lat, lng:lng, search:search_txt })
      if(search_txt != ''){
        setLoading(true);
        await axios({
          method: 'post', 
          url: api_url + get_nearest_doctors,
          data:{ lat:lat, lng:lng, search:search_txt }
        })
        .then(async response => {
          setLoading(false);
          if(response.data.status == 1){
            setData(response.data.result.doctor_list)
            setRecommendedData(response.data.result.recommended)
          }else{
            setData([])
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error)
          alert('Sorry something went wrong');
        });
      }else{
        setData([]);
      }
    }
 
    const view_hospital_details = (data) => {
      navigation.navigate("HospitalDetails",{ data : data  });
  }
  
    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleBackButtonClick.bind(this)} style={{ alignSelf:'flex-end', margin:10}}>
              <Icon type={Icons.Ionicons} name="close" style={{ fontSize:25, color:colors.theme_fg_two }} />
            </TouchableOpacity>
            <View
            style={styles.textFieldcontainer}>
                <TextInput
                    style={styles.textField}
                    ref={search_ref}
                    placeholder="Search Hospitals..."
                    placeholderTextColor={colors.theme_bg_two}
                    underlineColorAndroid="transparent"
                    onChangeText={text => find_hospitals(text)}
                />
            </View>
            <View style={{ margin:3 }} />
            {recommended_data.length > 0 &&
              <View>
                <Text style={{ paddingLeft:20, fontFamily:bold, color:colors.theme_fg_two, fontSize:14 }}>Recommended Hospitals</Text>
                <View style={{ margin:3 }} />
                <FlatList
                  data={recommended_data}
                  renderItem={recommended_hospitals}
                  keyExtractor={item => item.id}
                />
              </View>
            }
            <View style={{ margin:3 }} />
            {data.length > 0 &&
              <ScrollView>
                <Text style={{ paddingLeft:20, fontFamily:bold, color:colors.theme_fg_two, fontSize:14 }}>Nearest Hospitals</Text>
                <View style={{ margin:3 }} />
                <FlatList
                  data={data}
                  renderItem={render_nearest_hospitals}
                  keyExtractor={item => item.id}
                />
              </ScrollView>
            }
            {recommended_data.length == 0 && data.length == 0 &&
              <View style={{ flexDirection:'row', alignItems:'center', justifyContent:"center", marginTop:'50%' }}>
                <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two }}>No Hospitals available right now</Text>
              </View>
            }
           
        </SafeAreaView>  
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textFieldcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
    width:'90%',
    marginLeft:'5%'
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    color:colors.theme_bg_two,
    backgroundColor:colors.theme_bg_three
  },
});

export default HospitalSearch;