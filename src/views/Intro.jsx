import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, regular } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar } from '../components/StatusBar';
import PagerView from 'react-native-pager-view';



const Intro = () => {
  const navigation = useNavigation();
  const pagerRef = useRef(null);
  const [page, setPage] = useState(0);

  const slides = [
    {
      key: 1,
      title: "Your Doctor, Just a Tap Away",
      text: "Get professional medical advice securely from certified doctors. Enjoy instant consultations, follow-ups, and prescriptions—all from home.",
      image: require('../assets/json/slider3.json'),
      colors: [colors.theme_bg_three, colors.theme_bg],
    },
    {
      key: 2,
      title: "Hassle-Free Hospital Visits",
      text: "Book your appointment easily for convenient access to expert care. Choose your preferred time and connect with a specialist online.",
      image: require('../assets/json/slider1.json'),
      colors: [colors.theme_bg_three, colors.theme_bg],
    },
    {
      key: 3,
      title: "Your Medicines, Your Way",
      text: "Simplify your health routine with quick pharmacy orders. Search medicines, upload prescriptions, and get fast delivery at your door.",
      image: require('../assets/json/slider_3.json'),
      colors: [colors.theme_bg_three, colors.theme_bg],
    },
    {
      key: 4,
      title: "Diagnostics Made Simple",
      text: "Schedule lab tests conveniently. Select from trusted labs, opt for home sample collection, and access reports digitally.",
      image: require('../assets/json/slider_4.json'),
      colors: [colors.theme_bg_three, colors.theme_bg],
    }
  ];

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem('existing', '1');
      global.existing = '1';
      navigation.navigate('Home');
    } catch (e) {
      alert(e);
    }
  };

  const handleNext = () => {
    if (page < slides.length - 1) {
      pagerRef.current.setPage(page + 1);
    } else {
      handleDone();
    }
  };

  const handleSkip = () => {
    navigation.navigate('Home');
  };

  const renderSlide = (item) => (
    <LinearGradient colors={item.colors} start={{ x: 0.5, y: 0.4 }} end={{ x: 1, y: 1 }} style={styles.slide}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={{ height: '50%', width: '70%' }}>
        <LottieView style={{ flex: 1 }} source={item.image} autoPlay loop />
      </View>
      <Text style={styles.text}>{item.text}</Text>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={e => setPage(e.nativeEvent.position)}
      >
        {slides.map((item, index) => (
          <View key={index}>
            {renderSlide(item)}
          </View>
        ))}
      </PagerView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip} style={styles.buttonCircle}>
          <Icon type={Icons.Ionicons} name="close" color={colors.theme_fg_three} style={{ fontSize: 25 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.buttonCircle}>
          <Icon
            type={Icons.Ionicons}
            name={page === slides.length - 1 ? "home" : "chevron-forward"}
            color={colors.theme_fg_three}
            style={{ fontSize: 25 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  },
  textFieldIcon: {
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.grey
  },
  button: {
    padding:10,
    borderRadius: 10,
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:45
  },


  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 96, 
    width: '100%',
  },
  image: {
    width: 320,
    height: 320,
    marginTop: 32,
  },
  title: {
    fontSize: 25,
    color:colors.theme_fg_two,
    fontFamily:bold,
    textAlign: 'center',
  },
  text:{
    fontSize:19,
    fontFamily:regular,
    color:colors.theme_bg_three,
    marginTop:20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'justify',
    padding:10,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: colors.theme_bg,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
});

export default Intro;