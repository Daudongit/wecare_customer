import React, { useState, useEffect, useCallback } from 'react';
import { BackHandler, View, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { img_url, chat_pusher, api_url, image_upload } from '../config/Constants';
import { GiftedChat, Actions } from 'react-native-gifted-chat';
import { getDatabase, ref, onChildAdded, push, limitToLast, query } from '@react-native-firebase/database';
import { connect } from 'react-redux';
import { updateProfilePicture } from '../actions/CurrentAddressActions';
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import Loader from '../components/Loader';
import axios from 'axios';
import * as colors from '../assets/css/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DoctorChat = ({ route, navigation, profile_picture }) => {
  const { id } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgData, setImgData] = useState("");
  const db = getDatabase();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleBackButtonClick = useCallback(() => {
    navigation.goBack();
    return true;
  }, []);
  
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick
    );
  
    return () => backHandler.remove(); // correct way to remove
  }, []);
  

  const parse = useCallback((snapshot) => {
    const { text, user, image } = snapshot.val();
    const { key: _id } = snapshot;
    return { _id, text, user, image };
  }, []);

  useEffect(() => {
    const chatRef = ref(db, `/chat/${id}`);
    const chatQuery = query(chatRef, limitToLast(20));
    
    const unsubscribe = onChildAdded(chatQuery, (snapshot) => {
      const message = parse(snapshot);
      setMessages(prev => GiftedChat.append(prev, message));
    });

    return () => unsubscribe();
  }, [db, id, parse]);

  const onSend = useCallback((messages = []) => {
    const chatRef = ref(db, `/chat/${id}`);
    
    messages.forEach(({ text, user, image }) => {
      push(chatRef, { text, user, image });
      chatPusher(text);
    });
  }, [db, id]);

  const chatPusher = useCallback(async (message) => {
    try {
      await axios.post(api_url + chat_pusher, {
        type: 2,
        consultation_id: id,
        message: message
      });
    } catch (error) {
      console.error('Chat pusher error:', error);
    }
  }, [id]);

  const selectPhoto = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,

    };

    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel || response.errorCode) return;
      
      const source = response.assets[0].uri;
      setImgData(source);
      await profileImageUpdate(source);
    });
  }, []);

  const profileImageUpdate = useCallback(async (uri) => {
    setLoading(true);
    
    try {
      const imageData = RNFetchBlob.wrap(uri);
      const resp = await RNFetchBlob.fetch(
        'POST',
        api_url + image_upload,
        { 'Content-Type': 'multipart/form-data' },
        [{ name: 'image', filename: 'image.png', data: imageData }]
      );
      
      const data = JSON.parse(resp.data);
      const chatRef = ref(db, `/chat/${id}`);
      
      push(chatRef, {
        user: {
          _id: global.id + '-Cr',
          name: global.customer_name,
          avatar: img_url + profile_picture
        },
        image: img_url + data.result,
      });
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setLoading(false);
    }
  }, [db, id, profile_picture]);

  const renderActions = useCallback((props) => (
    <Actions
      {...props}
      containerStyle={styles.chat_style1}
      icon={() => (
        <FontAwesome 
          name='paperclip'
          size={25}
          color='black'
          style={styles.chat_style2}
        />
      )}
      options={{
        'Choose From Library': selectPhoto,
        Cancel: () => console.log('Cancel'),
      }}
      optionTintColor="#222B45"
    />
  ), [selectPhoto]);

  const renderMessageImage = (props) => {
    return (
      <TouchableOpacity onPress={() => setSelectedImage(props.currentMessage.image)}>
        <Image
          source={{ uri: props.currentMessage.image }}
          style={{ width: 200, height: 200, borderRadius: 10 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };


  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: global.id + '-Cr',
          name: global.customer_name,
          avatar: img_url + profile_picture
        }}
        renderActions={renderActions}
        showUserAvatar
        renderMessageImage={renderMessageImage} 
      />
      <Loader visible={loading} />
      <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
  <TouchableOpacity style={styles.modalBackground} onPress={() => setSelectedImage(null)}>
    <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
  </TouchableOpacity>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  chat_style1: { 
    width: 44, 
    height: 44, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 4, 
    marginRight: 4, 
    marginBottom: 0 
  },
  chat_style2: { 
    color: colors.theme_fg 
  },
  fullImage: {
    width: '90%',
    height: '90%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => ({
  profile_picture: state.current_location.profile_picture,
});

export default connect(mapStateToProps)(DoctorChat);