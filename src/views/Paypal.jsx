import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, paypal_url, success_url, failed_url, } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { paypalPaymentStatus } from '../actions/PaymentActions';
import { StatusBar } from '../components/StatusBar';

const Paypal = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [payment_id, setPaymentId] = useState(route.params.payment_id);
  const [url, setUrl] = useState(paypal_url+'paywithpaypal/'+route.params.amount);
  const [type, setType] = useState(route.params.type);
  const [from, setFrom] = useState(route.params.from);
  const [data, setData] = useState(route.params.data);
  const [api_route, setApiRoute] = useState(route.params.route);
  const [amount, setAmount] = useState(route.params.amount);
  
  const go_back = () => {
    navigation.navigate("PaymentMethods", { payment_id: payment_id, type : type, amount : amount, data:data, route:api_route, from:from });
  }

  const _onNavigationStateChange = async (value) => {
    if(value.url == success_url ){
      await props.paypalPaymentStatus(payment_id);
      setTimeout(() => {
        go_back();
      }, 1000)
    }else if(value.url == failed_url){
      await props.paypalPaymentStatus(0);
      alert('Sorry your payment was failed');
      setTimeout(() => {
        go_back();
      }, 1000)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <WebView
        source={{uri: url}}
        style={{marginTop: 20}}
        onNavigationStateChange={_onNavigationStateChange.bind(this)}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
    width: screenWidth,
    backgroundColor: colors.lite_bg
  },
  header: {
    height: 60,
    backgroundColor: colors.lite_bg,
    flexDirection: 'row',
    alignItems: 'center'
  },
});

function mapStateToProps(state){
    return{
      paypal_payment_status : state.payment.paypal_payment_status
    };
  }
  
  const mapDispatchToProps = (dispatch) => ({
    paypalPaymentStatus: (data) => dispatch(paypalPaymentStatus(data))
  });
  
  
  export default connect(mapStateToProps,mapDispatchToProps)(Paypal);