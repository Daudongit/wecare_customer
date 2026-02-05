import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text, Dimensions, TouchableOpacity, FlatList  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, api_url, get_doctor_categories, img_url,regular} from '../config/Constants';
import { useNavigation,  useRoute } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from '../components/StatusBar';
import * as Animatable from 'react-native-animatable';
import Icon, { Icons } from '../components/Icons';



const DoctorCategories = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [categories, setCategories] = useState([]);
  const [is_error, setError] = useState(0);
  const [type, setType] = useState(route.params.type);

  const navigate = (specialist) => {
    navigation.navigate("DoctorList",{ specialist : specialist, type:type })
  }

  const get_categories = async() =>{
    console.log(api_url + get_doctor_categories)
    console.log()
    await axios({
      method: 'get', 
      url: api_url + get_doctor_categories
    })
    .then(async response => {
      if(response.data.status == 1){
        setCategories(response.data.result)
      }else{
        setError(1);
      }
    })
    .catch(error => {
      console.log(error)
      alert('Sorry something went wrong');
    });
  }

  useEffect(() => {
    get_categories(); 
  },[]);

 
  return (
  <SafeAreaView style={styles.container}>
    <StatusBar />
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft:10, paddingRight:10, paddingTop:10 }}>
      <FlatList 
        data={categories}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
       <TouchableOpacity onPress={navigate.bind(this,item.id)} style={{ width:'100%',flexDirection:'row', backgroundColor:colors.theme_bg_three , padding:20, borderRadius:10,marginBottom:10,borderWidth:0.5,borderColor:colors.light_grey }} >
            <View style={{ height: 50, width: 50 }}>
              <Image style={{ height: undefined, width: undefined, flex:1,}} source={{ uri : img_url + item.category_image}}/>
            </View>
            <View style={{ margin:5 }} /> 
            <View style={{ padding:2,width:"75%" ,alignItems:'flex-start'}}>
              <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold, textAlign:'center'}}>{item.category_name}</Text>
              <View style={{ margin:2 }} />
                <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>Safe, effective, sedation, surgery, pain-free, precision, control, recovery.</Text>
            </View>
            <View style={{ margin:5 }} /> 

            <View style={{ width: '5%', justifyContent: 'center', alignItems: 'flex-end' }}>
              <Icon
                type={Icons.Ionicons}
                name="chevron-forward-outline"
                color={colors.grey}
                style={{ fontSize: 15, }}
              />
            </View>
            
          </TouchableOpacity>  
        

        )}
      />
      
    </View>
   
  </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
});

export default DoctorCategories;