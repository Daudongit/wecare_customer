import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as colors from '../assets/css/Colors';
import { success_reminder_icon, failed_reminder_icon, bold, regular } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropShadow from "react-native-drop-shadow";
import { StatusBar } from '../components/StatusBar';

const TodayReminder = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
    	<ScrollView showsVerticalScrollIndicator={false}>
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

                <TouchableOpacity style={{flexDirection:'row', margin:10}}>
                    <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}}>
                        <Image source={success_reminder_icon} style={{ height:40, width:40}} />
                    </View>
                    <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
                        <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_two}}>Test Medicine</Text>
                        <View style={{ margin:2 }} />
                        <Text style={{ fontSize:12, fontFamily:regular, color:colors.grey}}>1:00 PM (2 dose)</Text>
                        <View style={{ margin:2 }} />
                        <Text style={{ fontSize:12, fontFamily:regular, color:colors.success}}>Success</Text>
                    </View>
                </TouchableOpacity>
            </DropShadow>
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
                <TouchableOpacity style={{flexDirection:'row', margin:10}}>
                    <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}}>
                        <Image source={failed_reminder_icon} style={{ height:40, width:40}} />
                    </View>
                    <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
                        <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_two}}>Test Medicine</Text>
                        <View style={{ margin:2 }} />
                        <Text style={{ fontSize:12, fontFamily:regular, color:colors.grey}}>1:00 PM (2 dose)</Text>
                        <View style={{ margin:2 }} />
                        <Text style={{ fontSize:12, fontFamily:regular, color:colors.error}}>Missed</Text>
                    </View>
                </TouchableOpacity>
            </DropShadow>
	    </ScrollView>
    </SafeAreaView>  
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
    padding:10
  },
  description: {
    padding:10
  }
});

export default TodayReminder;
