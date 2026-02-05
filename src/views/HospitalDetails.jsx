import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, Platform, PermissionsAndroid, SafeAreaView, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { bold, api_url, img_url, regular } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { connect } from 'react-redux';
import DropShadow from "react-native-drop-shadow";
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import { Rating } from 'react-native-ratings';
//import { Gallery } from 'react-native-gallery-view';

const HospitalDetails = (props) => {
    const route = useRoute();
    const navigation = useNavigation();

    const [data, setData] = useState(route.params.data);
    const [visible, setIsVisible] = useState(false);

    const onSelect = (images, index) => {
        setImageIndex(index);
        setImages(images);
        setIsVisible(true);
    };

    console.log(data)
    useEffect(() => {

    }, []);

    const redirect_website = (url) => {
        Linking.openURL(url);
    }

    const redirect_phone = (url) => {
        Linking.openURL('tel:' + url);
    }

    const redirect_email = (url) => {
        Linking.openURL('mailto:' + url);
    }

    const create_appointment = (doctor_details) => {
        navigation.navigate("CreateAppointment", { doctor_details: doctor_details, appointment_fee: data.appointment_fee });
    }

    const view_doctor_details = (data) => {
        navigation.navigate("DoctorProfile", { doctor_details: data });
    }

    const departments = () => {
        return data.departments.map((val) => {
            return (
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: img_url + val.image }} style={{ height: 20, width: 20, borderRadius: 5 }} />
                    </View>
                    <View style={{ width: '80%', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: regular }}>{val.name}</Text>
                    </View>
                </View>
            )
        });
    }

    const doctors = () => {
        return data.doctors.map((val) => {
            return (
                <View style={{ flexDirection: 'row', margin: 10, borderBottomWidth: 0.5 }}>
                    <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Image source={{ uri: img_url + val.profile_image }} style={{ height: 50, width: 50, borderRadius: 25 }} />
                    </View>
                    <View style={{ width: '70%', justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 15, color: colors.theme_fg_two, fontFamily: bold }}>Dr.{val.doctor_name}</Text>
                        <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>{val.specialist} - {val.sub_specialist}</Text>
                        <View style={{ margin: 3 }} />
                        <View style={{ flexDirection: 'row' }}>
                            {val.appointment_status == 1 &&
                                <TouchableOpacity activeOpacity={1} onPress={create_appointment.bind(this, val)} style={{ alignItems: 'center', justifyContent: 'center', width: 100, padding: 5, backgroundColor: colors.theme_bg, borderRadius: 10 }}>
                                    <Text style={{ color: colors.theme_fg_three, fontSize: 12, fontFamily: bold }}>Book Now</Text>
                                </TouchableOpacity>
                            }
                            <View style={{ margin: 10 }} />
                            <TouchableOpacity activeOpacity={1} onPress={view_doctor_details.bind(this, val)} style={{ alignItems: 'center', justifyContent: 'center', width: 100, padding: 5, backgroundColor: colors.regular_blue, borderRadius: 10 }}>
                                <Text style={{ color: colors.theme_fg_three, fontSize: 12, fontFamily: bold }}>View Details</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ margin: 10 }} />
                    </View>
                </View>
            )
        });
    }

    const facilities = () => {
        return data.facilities.map((val) => {
            return (
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: img_url + val.icon }} style={{ height: 20, width: 20, borderRadius: 5 }} />
                    </View>
                    <View style={{ width: '80%', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: regular }}>{val.name}</Text>
                    </View>
                </View>
            )
        });
    }

    const show_hospital_services = () => {
        return data.hospital_services.map((val) => {
            return (
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: img_url + val.service_icon }} style={{ height: 20, width: 20, borderRadius: 5 }} />
                    </View>
                    <View style={{ width: '70%', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: regular }}>{val.service_name}</Text>
                    </View>
                    <View style={{ width: '20%', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 15, color: colors.theme_fg, fontFamily: regular }}>{global.currency}{val.starting_from}</Text>
                    </View>
                </View>
            )
        });
    }

    const insurances = () => {
        return data.insurances.map((val) => {
            return (
                <TouchableOpacity onPress={redirect_website.bind(this, val.insurance_link)} style={{ alignItems: 'center', margin: 5, width: 90, backgroundColor: colors.theme_bg_three, borderRadius: 10, padding: 5 }}>
                    <Image source={{ uri: img_url + val.insurance_logo }} style={{ height: 70, width: 70, borderRadius: 5, borderColor: colors.light_grey, borderWidth: 1, padding: 5 }} />
                    <View style={{ margin: 2 }} />
                    <Text style={{ fontSize: 12, color: colors.theme_fg_two, fontFamily: regular, textAlign: 'center' }}>{val.insurance_name}</Text>
                </TouchableOpacity>
            )
        });
    }

   

 

  
    const show_galries = () => {
        return data.galleries.map((data) => {
            return (
                <View style={{ width: 200, height: 200, margin: 5, }}>
                    <Image
                        style={{ flex: 1, height: undefined, width: undefined, borderRadius: 10 }}
                        source={{ uri: data.src }}
                    />
                </View>
            )
        });
    }

    return (
        <SafeAreaView style={{ backgroundColor: colors.light_blue, flex: 1 }}>
            <ScrollView  showsVerticalScrollIndicator={false}
            >
                
                <DropShadow
                    style={{
                        margin: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                >
                    <View style={{ borderRadius: 10, backgroundColor: colors.theme_fg_three }}>
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <View style={{ width: '35%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Image source={{ uri: img_url + data.hospital_logo }} style={{ height: 80, width: 80, borderRadius: 10 }} />
                            </View>
                            <View style={{ width: '65%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: bold, fontSize: 16, color: colors.theme_fg_two }}>{data.hospital_name}</Text>
                                <View style={{ margin: 2 }} />
                                <Text style={{ fontFamily: regular, fontSize: 12, color: colors.grey }}>{data.address}</Text>
                                <View style={{ margin: 5 }} />
                              {data.overall_ratings != 0 ?
                                    <Rating
                                    type="star"
                                    readonly
                                    imageSize={15}
                                    startingValue={data.overall_ratings}
                                    ratingCount={5}
                                    ratingBackgroundColor={colors.light_grey}
                                    ratingColor={colors.yellow}
                                />
                                    :
                                    <View style={{ width: 50, alignItems: 'center', justifyContent: 'center', padding: 2, backgroundColor: colors.theme_bg, borderRadius: 5 }}>
                                        <Text style={{ fontSize: 10, color: colors.theme_fg_three, fontFamily: bold }}>New</Text>
                                    </View>
                                } 
                            </View>
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontFamily: bold, fontSize: 15, color: colors.grey }}>About Hospital</Text>
                            <View style={{ margin: 5 }} />
                            <Text style={{ fontFamily: regular, fontSize: 12, color: colors.grey }}>{data.description}</Text>
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontFamily: bold, fontSize: 15, color: colors.grey }}>Contact Info</Text>
                            <View style={{ margin: 5 }} />
                            <TouchableOpacity onPress={redirect_phone.bind(this, data.phone_with_code)} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%', flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon type={Icons.Ionicons} name="call-outline" style={{ fontSize: 20, color: colors.theme_fg_two }} />
                                    <View style={{ margin: 5 }} />
                                    <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: bold }}>Phone</Text>
                                </View>
                                <View style={{ width: '5%' }}><Text>:</Text></View>
                                <View style={{ width: '65%', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: regular, color: colors.theme_fg}}>{data.phone_with_code}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ margin: 3 }} />
                            <TouchableOpacity onPress={redirect_email.bind(this, data.email)} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%', flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon type={Icons.Ionicons} name="mail-outline" style={{ fontSize: 20, color: colors.theme_fg_two }} />
                                    <View style={{ margin: 5 }} />
                                    <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: bold }}>Email</Text>
                                </View>
                                <View style={{ width: '5%' ,}}><Text>:</Text></View>
                                <View style={{ width: '65%', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: regular, color: colors.theme_fg }}>{data.email}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ margin: 3 }} />
                            {data.website &&
                                <TouchableOpacity onPress={redirect_website.bind(this, data.website)} style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon type={Icons.Ionicons} name="globe-outline" style={{ fontSize: 20, color: colors.theme_fg_two }} />
                                        <View style={{ margin: 5 }} />
                                        <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: bold }}>Web</Text>
                                    </View>
                                    <View style={{ width: '5%' }}><Text>:</Text></View>
                                    <View style={{ width: '65%', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: regular }}>{data.website}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{ margin: 5 }} />
                        <TouchableOpacity onPress={redirect_phone.bind(this, data.phone_with_code)} activeOpacity={1} style={{ borderRadius: 5, width: '90%', marginLeft: '5%', marginRight: '5%', padding: 10, borderWidth: 1, borderColor: colors.theme_fg, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: bold, fontSize: 14, color: colors.theme_fg }}>Contact Number</Text>
                        </TouchableOpacity>
                        <View style={{ margin: 10 }} />
                    </View>
                </DropShadow>
                <DropShadow
                    style={{
                        margin: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                >
                    <View style={{ borderRadius: 10, backgroundColor: colors.theme_fg_three }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontFamily: bold, fontSize: 15, color: colors.grey }}>Our Doctors</Text>
                            <View style={{ margin: 5 }} />
                            {doctors()}
                        </View>
                    </View>
                </DropShadow>
               
                <DropShadow
                    style={{
                        margin: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                >
                    <View style={{ borderRadius: 10, backgroundColor: colors.theme_fg_three }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontFamily: bold, fontSize: 15, color: colors.grey }}>Department and Services</Text>
                            <View style={{ margin: 5 }} />
                            {departments()}
                        </View>
                    </View>
                </DropShadow>
                <DropShadow
                    style={{
                        margin: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                >
                    <View style={{ borderRadius: 10, backgroundColor: colors.theme_fg_three }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontFamily: bold, fontSize: 15, color: colors.grey }}>Amenities</Text>
                            <View style={{ margin: 5 }} />
                            {facilities()}
                        </View>
                    </View>
                </DropShadow>
                <DropShadow
                    style={{
                        margin: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                >
                  

                    <View style={{ padding: 10, borderRadius: 10, backgroundColor: colors.theme_fg_three }}>
                        <Text style={{ fontFamily: bold, fontSize: 15, color: colors.grey }}>Our Gallery</Text>
                        <View style={{ margin: 5 }} />
                        <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    pagingEnabled={true}>
                                    {show_galries()}
                                </ScrollView>
                       

                    </View>
                </DropShadow>
                <DropShadow
                    style={{

                        margin: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                >
                    <View style={{ borderRadius: 10, backgroundColor: colors.theme_fg_three }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontFamily: bold, fontSize: 15, color: colors.grey }}> Hospital Insurance</Text>
                            <View style={{ margin: 5 }} />
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled={true}>
                                {insurances()}
                            </ScrollView>
                        </View>
                    </View>
                </DropShadow>
                <DropShadow
                    style={{
                        margin: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                >
                    <View style={{ borderRadius: 10, backgroundColor: colors.theme_fg_three }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontFamily: bold, fontSize: 15, color: colors.grey }}>Hospital Services</Text>
                            <View style={{ margin: 5 }} />
                            {show_hospital_services()}
                        </View>
                    </View>
                </DropShadow>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

});

export default connect(null, null)(HospitalDetails);
