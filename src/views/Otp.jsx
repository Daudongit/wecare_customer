import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold } from '../config/Constants';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from '../components/StatusBar';

const Otp = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [otp_value, setOtpValue] = useState(route.params.data);
  const [type, setType] = useState(route.params.type);
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number);
  const [id, setid] = useState(route.params.id);

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      if (global.mode === 'DEMO') {
        const timer = setTimeout(() => {
          check_otp(otp_value);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [otp_value])
  );

  const check_otp = async (code) => {
    if (code != otp_value) {
      alert('Please enter valid OTP');
    } else if (type == 1) {
      navigation.navigate('Register', {
        phone_with_code_value: phone_with_code_value,
        phone_number_value: phone_number_value,
      });
    } else if (type == 2) {
      navigation.navigate('CreatePassword', { id: id, from: 'otp' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <View>
          <TouchableOpacity onPress={handleBackButtonClick}>
            <Icon
              type={Icons.Feather}
              name="arrow-left"
              color={colors.theme_fg_two}
              style={{ fontSize: 35 }}
            />
          </TouchableOpacity>

          <View style={{ margin: 20 }} />

          <Text style={{ fontSize: 20, color: colors.theme_fg_two, fontFamily: bold }}>
            Enter OTP
          </Text>
          <View style={{ margin: 2 }} />
          <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>
            Enter the 4 digit code that was sent to your phone number
          </Text>

          <View style={{ margin: 10 }} />

          {/* using single TextInput instead of plugin */}
          <View style={styles.code}>
            <TextInput
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={4}
              onChangeText={(text) => {
                if (text.length === 4) {
                  check_otp(text);
                }
              }}
              placeholder="Enter OTP"
              placeholderTextColor={colors.grey}
            />
          </View>

          <View style={{ margin: 20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  code: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: colors.theme_bg,
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    fontFamily: bold,
    color: colors.theme_fg,
    width: '60%',
    textAlign: 'center',
  },
});

export default Otp;
