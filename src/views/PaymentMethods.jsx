import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import { app_name, bold, api_url, img_url, get_payment_modes, normal, FLUTTERWAVE_KEY } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { updatePaymentMode } from '../actions/AppointmentActions';
import { connect } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import Loader from '../components/Loader';.0
import { reset } from '../actions/PharmOrderActions';
import RBSheet from "react-native-raw-bottom-sheet";
import { labReset } from '../actions/LabOrderActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { paypalPaymentStatus } from '../actions/PaymentActions';
import { StatusBar } from '../components/StatusBar';
import { Paystack } from 'react-native-paystack-webview';
import { PayWithFlutterwave } from 'flutterwave-react-native';

const PaymentMethods = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [payment_list, setPaymentList] = useState([]);
  const [is_error, setError] = useState(0);
  const wallet_ref = useRef(null);
  const [type, setType] = useState(route.params.type);
  const [from, setFrom] = useState(route.params.from);
  const [data, setData] = useState(route.params.data);
  const [api_route, setApiRoute] = useState(route.params.route);
  const [amount, setAmount] = useState(route.params.amount);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paystack_id, setPaystackId] = useState(0);
  const [flutterwave_id, setFlutterwaveId] = useState(0);
  const ref_flutterwave_sheet = useRef(null);


  useEffect(() => {
    
    const unsubscribe = navigation.addListener('focus', async () => {
      if (props.paypal_payment_status != 0) {
        move_action(props.paypal_payment_status)
      }
      payment_modes();
    });
    return unsubscribe;
  }, []);

  
  const handleOnRedirect = (data) => {

    ref_flutterwave_sheet.current.close()  
    if (data.status == "successful") {
      move_action(id);
    } else {
        alert(t('sorry_your_payment_declined'));
    }
    //wallet_ref.current.open();
  }
  const close_flutterwave = () => {
    ref_flutterwave_sheet.current.close()  
    // wallet_ref.current.close();
  } 

  const payment_modes = async () => {
    console.log({ type: type, customer_id: global.id })
    setLoading(true)
    await axios({
      method: 'post',
      url: api_url + get_payment_modes,
      data: { type: type, customer_id: global.id }
    })
      .then(async response => {
        setLoading(false)
        setPaystackId(0)
        setFlutterwaveId(0);
        if (props.paypal_payment_status != 0) {
          move_action(props.paypal_payment_status)
        } else if (response.data.status == 1) {
          setPaymentList(response.data.result.payment_modes);
          setWallet(response.data.result.wallet_balance);       
        } else {
          setError(1);
        }
      })
      .catch(error => {
        setLoading(false)
        alert('Sorry something went wrong');
      });
  }

  const razorpay = async (id) => {
    var options = {
      description: 'Online Payment',
      currency: global.currency_short_code,
      key: global.razorpay_key,
      amount: parseInt(100 * amount),
      name: app_name,
      prefill: {
        email: global.email,
        contact: global.phone_number,
        name: global.customer_name
      },
      theme: { color: colors.theme_bg }
    }
    await RazorpayCheckout.open(options).then((data) => {
      move_action(id);
    }).catch((error) => {
      // handle failure
      console.log(error)
      alert('Your Transaction is declined');
    });
  }

  const pay_with_wallet = async (id) => {
    if (amount > wallet) {
      alert('Sorry insufficient wallet balance');
    } else {
      move_action(id);
      wallet_ref.current.close();
    }
  }

  // const move_to_room = (id, doctor_id) => {
  //   navigation.navigate('VideoCall', { id: id, doctor_id: doctor_id })
  // }

  const move_to_room = (id) => {
    navigation.navigate('Agora', { id: id })
  }

  const move_action = async (id) => {
    let form_data = await data;
    form_data.payment_mode = await id;
    if (from == "doctor_list") {
      console.log( api_url + api_route)
      console.log(form_data)
      setLoading(true)
      await axios({
        method: 'post',
        url: api_url + api_route,
        data: form_data
      })
        .then(async response => {
          setLoading(false);
          if (response.data.result.consultation_type == 1 && response.data.status == 1) {
            move_to_room(response.data.result.id);
          } else if (response.data.result.consultation_type == 2 && response.data.status == 1) {
            alert('Your appointment created successfully');
            await navigate();
          } else {
            alert('Sorry something went wrong')
          }
          
        })
        .catch(error => {
          setLoading(false)
          console.log(error)
          alert('Sorry something went wrong');
        });
    } else if (from == 'appointment') {
      setLoading(true);
      await axios({
        method: 'post',
        url: api_url + api_route,
        data: form_data
      })
        .then(async response => {
          setLoading(false);
          if (response.data.status == 1) {
            alert('Your appointment created successfully');
            await navigate();
          } else {
            alert(response.data.message)
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(api_route)
          alert('Sorry something went wrong');
        });
    } else if (from == "pharm_cart") {
      console.log(form_data);
      setLoading(true);
      await axios({
        method: 'post',
        url: api_url + api_route,
        data: form_data
      })
        .then(async response => {
          setLoading(false);
          if (response.data.status == 1) {
            alert('Order placed successfully')
            await reset_pharm_data();
            await props.reset();
            await navigate();
          }
          
        })
        .catch(error => {
          setLoading(false);
          console.log(error)
          alert('Sorry something went wrong');
        });
    } else if (from == "lab_cart") {
      console.log(form_data);
      setLoading(true);
      await axios({
        method: 'post',
        url: api_url + api_route,
        data: form_data
      })
        .then(async response => {
          console.log(response)
          setLoading(false);
          if (response.data.status == 1) {
            alert('Order placed successfully')
            await props.labReset();
            await navigate();
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error)
          alert('Sorry something went wrong');
        });
    }
  }

  const reset_pharm_data = async () => {
    try {
      await AsyncStorage.removeItem('cart_items');
      await AsyncStorage.removeItem('sub_total');
      await AsyncStorage.removeItem('pharm_id');
    } catch (e) {
      alert(e);
    }
  }

  const navigate = async () => {
    await props.paypalPaymentStatus(0);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  }

  const select_payment = async (data) => {
    setFlutterwaveId(0);
    await props.updatePaymentMode(data.id);
    if (data.slug == "razorpay") {
      await razorpay(data.id);
    } else if (data.slug == "paypal") {
      await navigate_paypal(data.id);
    } else if (data.slug == "paystack") {
      await setPaystackId(1);
    } else if (data.slug == "FlutterWave") {
      console.log("data")
      console.log('flutter')
      ref_flutterwave_sheet.current.open()  
      // await setFlutterwaveId(1);
    }else {
      await pay_with_wallet(data.id);
    }
  }

  const navigate_paypal = (payment_id) => {
    navigation.navigate("Paypal", { payment_id: payment_id, type: type, amount: amount, data: data, route: api_route, from: from })
  }
  const renderItem = ({ item }) => (
    <View style={{ margin: 10 }}>
      <TouchableOpacity onPress={select_payment.bind(this, item)} style={styles.button}>
        <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center', padding: 15 }}>
          <View style={{ height: 25, width: 25 }}>
            <Image style={{ height: undefined, width: undefined, flex: 1 }} source={{ uri: img_url + item.icon }} />
          </View>
        </View>
        <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text style={{ color: colors.grey, fontFamily: bold, }}>{item.payment_name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Loader visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
        <FlatList
          data={payment_list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
      {props.paypal_payment_status != 0 &&
        <TouchableOpacity activeOpacity={1} onPress={payment_modes} style={{ height: 40, position: 'absolute', bottom: 10, width: '100%', backgroundColor: colors.theme_bg, padding: 10, alignItems: 'center', justifyContent: 'center', width: '90%', marginLeft: '5%', borderRadius: 10 }}>
          <Text style={{ fontFamily: bold, color: colors.theme_fg_three, fontSize: 16 }}>
            Place Order
          </Text>
        </TouchableOpacity>
      }
      <View>
        {paystack_id == 1 &&
          <Paystack
            paystackKey={global.paystack_key}
            amount={amount}
            billingEmail="paystackwebview@something.com"
            activityIndicatorColor="green"
            onCancel={(e) => {
              console.log(e)
              // handle response here
            }}
            onSuccess={(res) => {
              console.log(e)
              // handle response here
            }}
            autoStart={true}
          />
        }
        
      </View>
      <RBSheet
        ref={ref_flutterwave_sheet}
        height={200}
        openDuration={250}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: [styles.sheetContainer, { padding: 20 }],
          draggableIcon: styles.draggableIcon,
        }}
      >
         <View>
            <PayWithFlutterwave
                onRedirect={handleOnRedirect}
                options={{
                    tx_ref: Date.now() + '-' + global.id,
                    authorization: FLUTTERWAVE_KEY,
                    customer: {
                        email: global.email
                    },
                    amount: amount,
                    currency: global.currency_short_code,
                    payment_options: 'card'
                }}
            />
            <View style={{ margin: 10 }} />
            <Text style={{ fontFamily: normal, color: colors.theme_fg_two, alignSelf: 'center', fontSize: 16 }} onPress={close_flutterwave}>{("cancel")}</Text>
        </View>
      </RBSheet>
      
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: colors.theme_fg_three
  },
});

function mapStateToProps(state) {
  return {
    payment_mode: state.appointment.payment_mode,
    paypal_payment_status: state.payment.paypal_payment_status
  };
}

const mapDispatchToProps = (dispatch) => ({
  updatePaymentMode: (data) => dispatch(updatePaymentMode(data)),
  reset: () => dispatch(reset()),
  labReset: () => dispatch(labReset()),
  paypalPaymentStatus: (data) => dispatch(paypalPaymentStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods);
