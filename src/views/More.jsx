import React, { useState ,useEffect} from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Linking,Alert, Modal } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, img_url, login_entry_img, wallet_imge, customer_get_profile, delete_account_request, api_url } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from '../components/StatusBar';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import NetInfo from "@react-native-community/netinfo";
import Profile from './Profile';
import axios from 'axios';



const More = (props) => {

  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wallet_amount, setWalletAmount] = useState(0);
  const [dialog_visibles, setDialogVisibles] = useState(false);


  const next = async (name) => {
    if (name == "Login to see your other features" && global.id == 0) {
      navigation.navigate("CheckPhone")
    } if (name == 'Notifications') {
      navigation.navigate("Notifications")
    }else if (name == 'FAQ Categories') {
      navigation.navigate("FaqCategories")
    }
    else if (name == 'Privacy Policies') {
      navigation.navigate("PrivacyPolicies")
    }else if (name == 'Blog') {
      navigation.navigate("Blog")
    } else if (name == 'Logout') {
      showDialog();
    }
    else if (name =='Delete Account') {
     showDialogs();
  }
}

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


  const showDialog = () => {
    setVisible(true);
  };
  const showDialogs = () => {
    setDialogVisibles(true);
  }
  const closeDialogs = () => {
    setDialogVisibles(false);
  }


  const handlePress2 = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    handleCancel();
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const handlePress4 = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    closeDialogs();
  };
 

  const handlePress1 = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    handleLogout();
  };
  const handleLogout = async () => {
    setVisible(false);
    navigate();
  };

  const navigate = async () => {
    await AsyncStorage.clear();
    global.online_status = 0
    await AsyncStorage.setItem('hasSeenNotice', 'true');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Splash" }],
      })
    );
  }
  const handlePress = (title,next) => {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    next(title);
  };
  const DATA = [
    {
      id: 1,
      title: 'Notifications',
      icon: 'notifications-outline'
    },
 
    {
      id: 4,
      title: 'FAQ Categories',
      icon: 'help-circle-outline'
    },
    {
      id: 5,
      title: 'Privacy Policies',
      icon: 'finger-print-outline'
    },
    {
      id: 7,
      title: 'Blog',
      icon: 'list'
    },
    {
      id: 6,
      title: 'Logout',
      icon: 'log-out-outline'
    },
    {
      title: 'Delete Account',
      icon: 'trash-outline'
    },

  ];
 

  const profile = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    navigation.navigate("Profile")
  }

  const handlePress3 = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    handleDelete();
  };
  const handleDelete = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => call_delete_account_api() },
      ]
    );
    closeDialogs()
  };
  
  const call_delete_account_api = () => {
    console.log({ customer_id: global.id, phone_with_code: global.phone_with_code})
 if(global.mode=='DEMO')
    {
      alert("sorry you can't delete your account in demo mode");
      return;
    }

  
    axios({
        method: 'post',
        url: api_url + delete_account_request,
        data: { delivery_boy_id: global.id, phone_with_code: global.phone_with_code}
    })
    .then(async response => {
      
        AsyncStorage.clear();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Phone" }],
          })
        );
    })
    .catch(error => {
    
        Alert.alert("Sorry Something went wrong")
    });
  }
  const open = () => {
    setShowModal(false)
    setTimeout(() => {
      Alert.alert('Alert', 'Works fine');
    }, 510);
  }

  const Login_DATA = [
    {
      id: 1,
      title: "Login to see your other features",
      Icon: 'walk-outline'
    }
  ]

  const navigate_login = () => {
    navigation.navigate("CheckPhone")
  }

  const view_profile = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + customer_get_profile,
      data: { id: global.id }
    })
      .then(async response => {
        setLoading(false);
        setWalletAmount(response.data.result.wallet);
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry something went wrong')
      });
  }

  const add_wallet = async (number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    await Linking.openURL(phoneNumber);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.title, next.bind(this))}>
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.theme_bg_three }]}>
          <Text style={[styles.title, { fontFamily: bold, color: colors.theme_fg_two }]}>Confirm Logout</Text>
          <Text style={[styles.description, { fontFamily: regular, color: colors.theme_fg_two }]}>
            Do you want to logout?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
              <Text style={[styles.buttonText, { color: colors.theme_fg_two }]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setVisible(false)} style={styles.button}>
              <Text style={[styles.buttonText, { color: colors.theme_fg_two }]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <Modal transparent={true} visible={dialog_visibles} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.theme_bg_three }]}>
          <Text style={[styles.title, { fontFamily: bold, color: colors.theme_fg_two }]}>Confirm Delete</Text>
          <Text style={[styles.description, { fontFamily: regular, color: colors.theme_fg_two }]}>
            Do you want to delete?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handlePress3} style={styles.button}>
              <Text style={[styles.buttonText, { color: colors.theme_fg_two }]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePress4} style={styles.button}>
              <Text style={[styles.buttonText, { color: colors.theme_fg_two }]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
     {/*  <View>
       <Dialog.Container contentStyle={{backgroundColor:colors.theme_bg_three}} visible={dialog_visibles}>
      <Dialog.Title style={{fontFamily: bold, color:colors.theme_fg_two, fontSize:18}}>Confirm Delete</Dialog.Title>
      <Dialog.Description style={{fontFamily: regular, color:colors.theme_fg_two, fontSize:16}}>
        Do you want to Delete?
      </Dialog.Description>
      <Dialog.Button style={{color:colors.theme_fg_two, fontSize:14}} label="Yes" onPress={handlePress3} />
      <Dialog.Button style={{color:colors.theme_fg_two, fontSize:14}} label="No" onPress={handlePress4} />
      </Dialog.Container> 
      </View> */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.light_grey, paddingTop: 15, paddingBottom: 15 }}>
        <View style={{ width: '10%', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Icon type={Icons.Ionicons} name={item.icon} color={colors.grey} style={{ fontSize: 20 }} />
        </View>
        <View style={{ width: '85%', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text style={{ fontFamily: regular, fontSize: 16, color: colors.theme_fg_two }}>{item.title}</Text>
        </View>
        <View style={{ width: '5%', justifyContent: 'center', alignItems: 'flex-end' }}>
          <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.grey} style={{ fontSize: 15 }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <StatusBar />
      {global.id == 0 ?
        <TouchableOpacity onPress={navigate_login} style={styles.null_container}>
          <Image source={login_entry_img} style={{ height: '40%', width: '60%' }} />
          <View style={{ margin: 10 }} />
          <Text style={{ fontFamily: regular, fontSize: 16, color: colors.theme_bg_two }}>Click to Login</Text>
        </TouchableOpacity>
        :
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 10 }}>
            <View style={{ margin: 5 }} />
            <View style={styles.header}>
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={{ color: colors.theme_fg_two, fontFamily: bold, fontSize: 20 }}>Settings</Text>
              </View>
            </View>
            <View style={{ margin: 10 }} />
            <View style={{ flexDirection: "row", width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity activeOpacity={1} onPress={profile} style={{ width: '100%' }}>
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
                  <View style={{ height:70, marginLeft: 5, marginRight: 5, backgroundColor: colors.theme_bg_three }}>
                
                  <View style={{ flexDirection: 'row', paddingTop: 15, paddingBottom: 15, }}>
                    <View style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }}>
                      <Image style={{ height: 40, width: 40, borderRadius: 50 }} source={{ uri: img_url + props.profile_picture }} />
                    </View>
                    <View style={{ width: '70%', justifyContent: 'center', alignItems: 'flex-start' }}>
                      <Text style={{ fontFamily: bold, fontSize: 18, color: colors.theme_fg_two }}>{global.customer_name}</Text>
                      <View style={{ margin: 2 }} />
                      <Text style={{ fontFamily: regular, fontSize: 12, color: colors.grey }}>Edit Profile</Text>
                    </View>
                  </View>
                  </View>
                  </View>
                </DropShadow>
              </TouchableOpacity>
              {/* <View style={{ width: '50%' }}>
                <CardView
                  cardElevation={5}
                  style={{ height: 70, alignItems: 'center', justifyContent: 'center', marginLeft: 5, marginRight: 5, backgroundColor: colors.theme_bg_three }}
                  cardMaxElevation={5}
                  cornerRadius={10}>
                  <TouchableOpacity onPress={add_wallet.bind(this, global.admin_contact_number)} activeOpacity={1} style={{ paddingTop: 5, paddingBottom: 5, }}>
                    <View style={{ flexDirection: 'row', }}>
                    <View style={{ margin:5 }} />
                      <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon type={Icons.Ionicons} name="call-outline" style={{ fontSize: 30 }} />
                      </View>
                      <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: regular, fontSize: 14, color: colors.grey, textAlign: 'center' }}>Call admin support</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </CardView>
              </View> */}
            </View>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </ScrollView>
        </SafeAreaView>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.theme_bg_three,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#ccc',
  },
  null_container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.theme_bg_three,

  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Background overlay
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
  },
});

function mapStateToProps(state) {
  return {
    profile_picture: state.current_location.profile_picture,

  };
}

export default connect(mapStateToProps, null)(More);
