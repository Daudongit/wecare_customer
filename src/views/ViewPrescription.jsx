import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, FlatList, TouchableOpacity, ScrollView, SafeAreaView, View, PermissionsAndroid, Image ,Platform, Alert, ActivityIndicator, Modal} from 'react-native';
import { api_url, get_prescription, bold, e_prescription, background_img, regular, img_url } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Loader from '../components/Loader'; 
import axios from 'axios';
import { Badge } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updatePrescriptionDetails, updatePrescriptionId  } from '../actions/PrescriptionOrderActions';
import { connect } from 'react-redux'; 
import RNFetchBlob from 'rn-fetch-blob';
import { StatusBar } from '../components/StatusBar';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
const ViewPrescription = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false); 
  const [booking, setBooking] = useState(route.params.data); 
  const [data, setData] = useState([]); 
  const [pdfVisible, setPdfVisible] = useState(false);
const [pdfPath, setPdfPath] = useState('');
  const image_path = api_url+e_prescription+props.prescription_id
console.log(image_path)
  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      show_prescriptions();
    });
    return unsubscribe;
  },[]); 

 

  const show_prescriptions = async() =>{
    console.log(api_url + get_prescription)
    console.log({ booking_id:booking.id })
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_prescription,
      data:{ booking_id:booking.id }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        props.updatePrescriptionDetails(response.data.result.items);
        props.updatePrescriptionId(response.data.result.prescription_id);
        setData(response.data.result.items)
      }else{
        alert("Please wait doctor will upload your prescription.")
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry, something went wrong');
    });
  }

  const   checkPermission = async () => {
    setLoading(true)
    if (Platform.OS === 'ios') {
      // iOS doesn't require manual permission handling for file downloads
      downloadFile();
    } else {
      // For Android versions below 10, we need to request storage permission
      if (Platform.Version < 29) { // Android 9 (Pie) and below
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message: 'App needs access to your storage to download images.',
              buttonPositive: 'OK',
            }
          );
  
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
     
            console.log('Storage Permission Granted');
            downloadFile(); // Call download function
          } else {
            Alert.alert('Permission Denied', 'Storage permission is required to save images.');
          }
        } catch (err) {
          console.error('Permission error:', err);
          Alert.alert('Error', 'Something went wrong while requesting permissions.');
        }
      } else {
        // For Android 10+ (API 29 and above), permissions are automatically handled by scoped storage
        startDownload();
      }
    }
    setLoading(false)

  };
 
  
  // Function to start downloading the file using react-native-fs
  const startDownload = () => {
  setLoading(true);

 const path = `${RNFS.ExternalDirectoryPath}/prescription.pdf`;
  const image_path = api_url + e_prescription + props.prescription_id;

  console.log(`Downloading file from: ${image_path}`);
  console.log(`Saving file to: ${path}`);

  RNFS.downloadFile({
    fromUrl: image_path,
    toFile: path,
    background: true,
    discretionary: true,
    progress: (res) => {
      let percentage = (res.bytesWritten / res.contentLength) * 100;
      console.log(`Downloading: ${percentage.toFixed(2)}%`);
    },
    progressDivider: 1,
  })
    .promise.then((res) => {
      console.log('File downloaded successfully:', res);
      console.log('File saved at:', path);

     RNFS.exists(RNFS.ExternalDirectoryPath).then(exists => {
       console.log('External directory exists:', exists);
        if (exists) {
          console.log('File exists at:', path);
          setPdfPath(path);
          setPdfVisible(true);   // Show PDF viewer modal
        } else {
          Alert.alert(t('error'), t('failed_to_download_prescription'));
        }
        setLoading(false);
      });
    })
    .catch((err) => {
      setLoading(false);
      console.error('Download error:', err);
      Alert.alert(t('error'), t('failed_to_download_prescription'));
    });
};
  
  
  // Function to download and save image
  /* const downloadFile = () => {
    const { config, fs } = RNFetchBlob;
    const dirs = fs.dirs;
    const path = dirs.DownloadDir + '/prescription.pdf'; // Save as PDF in Downloads directory
    
    console.log('Saving to path: ', path); // Debugging log
    
    config({
      fileCache: true,
      path: path, // Save file as a PDF
      addAndroidDownloads: {
        useDownloadManager: true, // Use Android's download manager
        notification: true, // Show notification while downloading
        path: path, // Set the Android download path
        description: 'Downloading prescription as PDF...',
      },
    })
      .fetch('GET', image_path) // Use the full image URL (e.g., e_prescription)
      .then((res) => {
        console.log('File downloaded successfully:', res.path());
        Alert.alert('Success', 'Prescription downloaded successfully as PDF.');
      })
      .catch((err) => {
        console.error('Download error:', err);
        Alert.alert('Error', 'Failed to download prescription.');
      });
  }; */
  

  

  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar />
       <Modal
        visible={pdfVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPdfVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 10, flex: 0.8 }}>
            <Pdf
              source={{ uri: `file://${pdfPath}` }}
              style={{ flex: 1, borderRadius: 10 }}
            />

            <TouchableOpacity
              onPress={() => setPdfVisible(false)}
              style={{
                backgroundColor: 'red',
                padding: 10,
                margin: 10,
                borderRadius: 5,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView style={{ padding:10 }}>
        <View>
          <View style={{ height: 170, width: '100%', borderRadius:20  }}>
            <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={ background_img } />
            <View style={{ position:'absolute', top:0, width:'100%', flexDirection:'row' }}>
              <View style={{ width:'60%', padding:20 }}>
                <Text style={{ fontSize:20, color:colors.theme_fg_three, fontFamily:bold, marginTop:5}}>Dr.{booking.doctor_name}</Text>
                <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:regular, marginTop:10, letterSpacing:1 }}>Specialist -General Sergen</Text>
                <View style={{ margin:15 }} />
                <View style={{ borderWidth:1, borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:5, alignItems:'center', justifyContent:'center', borderRadius:10, width:'70%' }}>
                  <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold }}>Prescriped By</Text>
                </View> 
              </View> 
              <View style={{ width:'40%',  alignItems:'center', justifyContent:'center' }}> 
                <View style={{ height:100, width:100 }}>
                  <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={{uri: img_url+booking.profile_image}} /> 
                </View> 
              </View> 
            </View>   
          </View> 
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()} // Ensure that `item.id` exists and is unique
            renderItem={({ item,index }) => (
              <View style={{flexDirection:'row', paddingTop:10}}>
                <View style={{alignItems:'flex-start', justifyContent:'center', width:'49%'}}>
                  <Text style={{fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.medicine_name}</Text>
                </View>
                <View style={{margin:5}}/>
                <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'center', width:'49%'}}>
                  <View style={styles.prescription_style8}>
                    {item.morning == 1 ? 
                      <Badge status="success" value="M" badgeStyle={{width:35, height:20}}/>
                    :
                      <Badge status="error" value="M" badgeStyle={{width:35, height:20}}/>
                    }
                    <View style={styles.prescription_style8} />
                    {item.afternoon == 1 ? 
                      <Badge status="success" value="A" badgeStyle={{width:35, height:20}}/>
                    :
                      <Badge status="error" value="A" badgeStyle={{width:35, height:20}}/>
                    }
                    <View style={styles.prescription_style9} />
                    {item.evening == 1 ? 
                      <Badge status="success" value="E" badgeStyle={{width:35, height:20}}/>
                    :
                      <Badge status="error" value="E" badgeStyle={{width:35, height:20}}/>
                    }
                    <View style={styles.prescription_style10} />
                    {item.night == 1 ? 
                      <Badge status="success" value="N" badgeStyle={{width:35, height:20}}/>
                    :
                      <Badge status="error" value="N" badgeStyle={{width:35, height:20}}/>
                    }
                  </View>
                </View>
              </View>
            )}
            // keyExtractor={item => item.question}
          />
        </View>
      </ScrollView>
      {data.length != 0 && props.prescription_id != 0 &&
        <View>
          {/* <TouchableOpacity activeOpacity={1} onPress={make_order} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Make Prescription Order</Text>
          </TouchableOpacity> */}
          
          <TouchableOpacity  onPress={checkPermission} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Download Prescription</Text>
          </TouchableOpacity>

        </View>
      }
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

function mapStateToProps(state){
	return{
		prescription_details : state.prescription_order.prescription_details,
    prescription_id : state.prescription_order.prescription_id, 
  
	};
  }
  
  const mapDispatchToProps = (dispatch) => ({
	updatePrescriptionDetails: (data) => dispatch(updatePrescriptionDetails(data)),
  updatePrescriptionId: (data) => dispatch(updatePrescriptionId(data)), 
  });
  
export default connect(mapStateToProps,mapDispatchToProps)(ViewPrescription);

const styles = StyleSheet.create({
prescription_style2: { justifyContent:'flex-end', alignItems:'flex-end'},
prescription_style3: {color:colors.theme_fg_two},
prescription_style6: { fontSize:25, color:colors.theme_fg_two,  fontFamily: bold},
prescription_style7: {color:colors.theme_fg_five, marginTop:5},
prescription_style8:{margin:2, flexDirection:'row'},
prescription_style9:{margin:2, flexDirection:'row'},
prescription_style10:{margin:2, flexDirection:'row'},
prescription_style11: { color:colors.theme_fg_two, fontSize:30},
container: {
  flex: 1,
  backgroundColor:colors.theme_fg_three,
},
button: {
  padding:10,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:colors.theme_bg,
  width:'94%',
  marginLeft:'3%',
  marginRight:'3%',
  marginBottom:'5%',
},
});
