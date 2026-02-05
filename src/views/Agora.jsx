import React, { useEffect, useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import axios from 'axios';
import { api_url, create_token } from '../config/Constants';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useNavigation,useRoute, CommonActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../components/Loader';

const Agora = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [video_call, setVideoCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [call_config, setCallConfig] = useState(undefined);
  const [token_id, setTokenId] = useState("");
  const [booking_id, setBookingId] = useState(route.params.id);
  const [channel_name, setChannelName] = useState('consultation'+route.params.id);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      get_create_token();
    });

    return unsubscribe;
  })

  const get_create_token = async () => {
    console.log(api_url + create_token)
     console.log({ channel_name:channel_name})
    //setLoading(true);
    await axios({
      method: "post",
      url: api_url + create_token,
      data: { channel_name: channel_name }
    })
      .then(async (response) => {
        //	setLoading(false);
        make_configuration(response.data.result);
        console.log(response.data.result)
      })
      .catch(async (error) => {
        // await setLoading(false);
        alert('Sorry, something went wrong!')
      });
  }

  const make_configuration = (token) =>{
    console.log('token'+token)
    setCallConfig({
      appId: 'ec85552f57ae4cda8e31279d66b3e1e0',
      channel: channel_name,
      token: token
    })
    setVideoCall(true)
  }

  const connectionData = {
    appId: 'ec85552f57ae4cda8e31279d66b3e1e0',
    channel: 'test106',
    token: token_id
  };

  const rtcCallbacks = {
    EndCall: () => navigate(),
    
  };

  const navigate = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  }
  return video_call ? (

    <AgoraUIKit connectionData={call_config} rtcCallbacks={rtcCallbacks} />
  ) : (
    <Text style={{ color: '#000' }} onPress={() => setVideoCall(true)}>Start Call</Text>
  );
};

export default Agora;