/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { View, Text, Pressable, Image, Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../../../constants/colors';
import { FONTS, SIZES, images } from '../../../constants';
import Button from '../../Components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../Components/Pixel/Index';
import AntDesign from 'react-native-vector-icons/AntDesign';
import fontFamily from '../../../constants/fontFamily';
import ImageCropPicker from 'react-native-image-crop-picker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';

const EditProfile = () => {

    const [showMenu, setShowMenu] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewProfileModalVisible, setViewProfileModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const currentUserRandomNumber = '9649726428'; // replace this with the current user's random number
    const [phoneNumber, setPhoneNumber] = useState(currentUserRandomNumber);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleMenuOption = async (option) => {
        if (option === 'viewProfile') {
            setViewProfileModalVisible(true);
        } else if (option === 'removeProfile') {
            setSelectedImage(null);
        } else if (option === 'changeProfile') {
            ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
            }).then(image => {
                console.log(image);
                setSelectedImage(image.path);
            });
        }
        toggleMenu();
    };

    const saveProfile = async () => {
        const userRef = firestore().collection('Users').doc(phoneNumber);
        const doc = await userRef.get();

        if (doc.exists) {
            await userRef.update({
                name,
                email,
                bio,
                profileImage: selectedImage,
            });
            Alert.alert('Profile saved successfully');
        } else {
            Alert.alert('User not found');
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <Text style={{
                        marginTop: hp(2),
                        paddingHorizontal: wp(2),
                        // fontWeight: '400',
                        // marginVertical: ,
                        fontFamily: fontFamily.FONTS.Medium,
                        fontSize: hp(2.5),
                        color: COLORS.darkgray1,
                    }}>
                        Edit Profile
                    </Text>
                    {/** <Text style={{
                        paddingHorizontal: wp(2),
                        // fontWeight: '400',
                        marginVertical: hp(1.5),
                        fontFamily: fontFamily.FONTS.regular,
                        fontSize: hp(2),
                        color: COLORS.darkgray1,
                    }}>Add a profile photo, name and bio to let people know who you are </Text> */}
                    
                    <TouchableOpacity onPress={toggleMenu}>
                        <View
                            style={{
                                width: wp(35),
                                height: wp(35),
                                marginVertical: hp(1),
                                borderRadius: wp(35),
                                backgroundColor: COLORS.secondaryWhite,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: COLORS.tertiaryWhite,
                            }}
                        >
                            {selectedImage ? (
                                <Image source={{ uri: selectedImage }} style={{ width: wp(34), height: wp(34), borderRadius: wp(34) }} />
                            ) : (
                                <AntDesign name="user" size={hp(7)} color={COLORS.darkgray1} />
                            )}
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: hp(1),
                                    right: 0,
                                }}
                            >
                                <AntDesign name="pluscircle" size={hp(4)} color={COLORS.gray} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Modal to view profile image */}
                    <Modal visible={viewProfileModalVisible} transparent animationType="fade">
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                            onPress={() => setViewProfileModalVisible(false)}
                        >
                            <View style={{ backgroundColor: COLORS.white, borderRadius: wp(1), padding: hp(0.4), width: wp(80), height: hp(40) }}>
                                {selectedImage ? (
                                    <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%', borderRadius: wp(1) }} />
                                ) : (
                                    <Text>No profile image selected</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    <Modal visible={showMenu} transparent animationType="fade">
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                            onPress={toggleMenu}
                        >
                            <View style={{
                                backgroundColor: COLORS.white, borderRadius: wp(2), padding: wp(4), width: wp(60),
                                height: hp(20), justifyContent: 'center',
                            }}>
                                <TouchableOpacity style={{ paddingVertical: hp(1) }} onPress={() => handleMenuOption('viewProfile')}>
                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.darkgray1 }} >View Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ paddingVertical: hp(1) }} onPress={() => handleMenuOption('removeProfile')}>
                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.darkgray1 }}>Remove Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ paddingVertical: hp(1) }} onPress={() => handleMenuOption('changeProfile')}>
                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.darkgray1 }} >Change Profile</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    <View style={styles.formContainer}>
                        <Text style={styles.lable}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.TextInput}>{phoneNumber}</Text>
                        </View>

                        <Text style={styles.lable}>Display name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter Your name"
                                placeholderTextColor={COLORS.secondaryGray}
                                keyboardType="default"
                                style={styles.textInput}
                                onChangeText={(text) => setName(text)}
                            />
                        </View>

                        <Text style={styles.lable}>Bio</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Hi there! My name is XYZ"
                                placeholderTextColor={COLORS.secondaryGray}
                                keyboardType="default"
                                style={styles.textInput}
                                onChangeText={(text) => setBio(text)}
                            />
                        </View>

                        <Text style={styles.lable}>Email </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="xyz@gmail.com"
                                placeholderTextColor={COLORS.secondaryGray}
                                keyboardType="email-address"
                                style={styles.textInput}
                                onChangeText={(text) => setEmail(text)}
                            />
                        </View>

                        <Button
                            title="Save"
                            // filled
                            onPress={() => saveProfile()}
                            style={{
                                marginVertical: hp(4),
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({});