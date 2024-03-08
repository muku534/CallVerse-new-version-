/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, TextInput, Text, View, Image, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { COLORS } from '../../../constants';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../Components/Pixel/Index';
import fontFamily from '../../../constants/fontFamily';
import user1Image from '../../../assets/image/user1.jpg';
import user2Image from '../../../assets/image/user2.jpg';
import user3Image from '../../../assets/image/user3.jpg';
import user4Image from '../../../assets/image/user4.jpg';
import user5Image from '../../../assets/image/user5.jpg';
import user6Image from '../../../assets/image/user6.jpg';
import user7Image from '../../../assets/image/user7.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Iconics from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import Entypo from 'react-native-vector-icons/Entypo';

const Chats = ({ navigation }) => {

    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredChats, setFilteredChats] = useState([]);
    const [currentUserRandomNumber, setCurrenrUserRandomNumber] = useState(null);
    const [chats, setChats] = useState([]);
    console.log('Chats:', chats);
    console.log('filteredChats', filteredChats);

    const currentUserRandomNumberRef = useRef(null);

    // Function to format time in 12-hour format with "am" or "pm"
    function formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('userData');
                if (jsonValue !== null) {
                    const UserData = JSON.parse(jsonValue);
                    setCurrenrUserRandomNumber(UserData.randomNumber);
                    currentUserRandomNumberRef.current = String(UserData.randomNumber);
                    console.log('Retrieved user data from AsyncStorage:', UserData.randomNumber);
                }
            } catch (error) {
                console.error('Error retrieving user data from AsyncStorage:', error);
            }
        };
        fetchData();
    }, []);

    const fetchChats = useCallback(async () => {
        setChats([]); // Clear the chats state

        const chatsRef = firestore().collection('chatRooms');
        const snapshot = await chatsRef.get();

        for (let doc of snapshot.docs) {
            console.log('Fetched chat room:', doc.id, doc.data()); // Log the document ID and data of each fetched chat room
            // Check if the document ID contains the current user's random number
            if (doc.id.includes(currentUserRandomNumberRef.current)) {
                console.log('Document data:', doc.data());
                const otherUserRandomNumber = doc.id.replace(currentUserRandomNumberRef.current, ''); // Extract the other user's random number from the document ID


                if (otherUserRandomNumber) {

                    // Fetch the current user's contacts from the Contacts collection
                    const contactsRef = firestore().collection('Contacts').doc(currentUserRandomNumberRef.current);
                    const contactsDoc = await contactsRef.get();

                    const messagesRef = doc.ref.collection('messages').orderBy('createdAt', 'desc').limit(1);
                    const messagesSnapshot = await messagesRef.get();

                    let lastMessage = '';
                    let lastMessageTime = '';
                    if (!messagesSnapshot.empty) {
                        lastMessage = messagesSnapshot.docs[0].data().text; // Assuming the message contains a 'text' field
                        const createdAt = new Date(messagesSnapshot.docs[0].data().createdAt.toDate());

                        const currentDate = new Date();
                        const currentDay = currentDate.getDate();
                        const currentMonth = currentDate.getMonth();
                        const currentYear = currentDate.getFullYear();

                        const messageDay = createdAt.getDate();
                        const messageMonth = createdAt.getMonth();
                        const messageYear = createdAt.getFullYear();

                        const timeDiff = currentDate.getTime() - createdAt.getTime();
                        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

                        if (dayDiff === 0) {
                            // Display time only if the message was sent today
                            // Display time only if the message was sent today
                            lastMessageTime = `${formatAMPM(createdAt)}`;
                        } else if (dayDiff === 1) {
                            // Display 'Yesterday' if the message was sent yesterday
                            lastMessageTime = 'Yesterday';
                        } else if (dayDiff > 1 && dayDiff < 7) {
                            // Display day of the week if the message was sent within the last week
                            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            lastMessageTime = days[createdAt.getDay()];
                        } else if (currentYear === messageYear) {
                            // Display date and month if the message was sent within the current year
                            lastMessageTime = `${messageMonth.toString().padStart(2, '0')}`;
                        } else {
                            // Display full date if the message was sent in previous years
                            lastMessageTime = `${messageMonth.toString().padStart(2, '0')} ${messageYear}`;
                        }
                    }



                    let otherUserData;
                    if (contactsDoc.exists) {
                        // If the other user is found in the current user's contacts, use that data
                        otherUserData = contactsDoc.data().contacts.find(contact => contact.randomNumber === otherUserRandomNumber);
                    }

                    if (!otherUserData) {
                        // If the other user is not found in the contacts, fetch them from the Users collection
                        const usersRef = firestore().collection('Users').doc(otherUserRandomNumber);
                        const userDoc = await usersRef.get();
                        otherUserData = userDoc.data();
                    }

                    console.log('Other user data:', otherUserData);
                    // setChats(prevChats => [...prevChats, { id: doc.id, name: otherUserData.name, profileImage: otherUserData.profileImage, message: doc.data().lastMessage }]);
                    if (otherUserData) {
                        setChats(prevChats => [...prevChats, { id: doc.id, name: otherUserData.name, profileImage: otherUserData.profileImage, message: lastMessage, messageTime: lastMessageTime, randomNumber: otherUserData.randomNumber, bio: otherUserData.bio }]);
                    } else {
                        console.error('No data found for other user with random number:', otherUserRandomNumber);
                    }

                } else {
                    console.error('Invalid other user random number:', otherUserRandomNumber);
                }
            }
        }
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    useEffect(() => {
        if (searchText === '') {
            setFilteredChats(chats);
        } else {
            setFilteredChats(chats.filter(chat => chat.name.toLowerCase().includes(searchText.toLowerCase()) || chat.message.toLowerCase().includes(searchText.toLowerCase())));
        }
    }, [chats, searchText]);

    const clearSearch = () => {
        setSearchText('');
    };

    const toggelInput = () => {
        setSearchVisible(!searchVisible);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={COLORS.lightGreen} barStyle="light-content" />

            {searchVisible ? (
                <View style={{ backgroundColor: COLORS.lightGreen, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 7 }}>
                    <View style={{ width: '90%', marginVertical: hp(1), marginHorizontal: wp(5), flexDirection: 'row', justifyContent: 'center', backgroundColor: '#e8e8e8', borderRadius: wp(4) }}>
                        <TouchableOpacity onPress={toggelInput} style={{ marginLeft: wp(10) }}>
                            <AntDesign name="arrowleft" size={hp(3)} color={COLORS.black} style={{ position: 'absolute', left: 10, top: 10 }} />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Search..."
                            placeholderTextColor={COLORS.darkgray1}
                            keyboardType="default"
                            value={searchText}
                            autoFocus={true}
                            style={{ width: '100%', marginLeft: wp(10), height: hp(6), color: COLORS.darkgray, fontFamily: fontFamily.FONTS.regular, }}
                            onChangeText={(text) => setSearchText(text)}
                        />
                        {searchText.length > 0 && ( // Conditionally render the cross icon
                            <TouchableOpacity onPress={clearSearch} style={{ position: 'absolute', right: 10, top: 10 }}>
                                <Entypo name="cross" size={hp(3)} color={COLORS.black} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.lightGreen, height: hp(8), padding: wp(3), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 4 }}>
                    <Text style={{ fontFamily: fontFamily.FONTS.bold, color: COLORS.tertiaryWhite, fontSize: hp(2.5), fontWeight: '700' }}>CallVerse</Text>
                    <TouchableOpacity onPress={toggelInput}>
                        <Iconics name="search" size={hp(3)} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            )}
            <View style={{ marginVertical: hp(1) }}>
                <FlatList
                    data={filteredChats}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('PersonalChats', { User: item })}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: hp(1), marginHorizontal: wp(2) }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Image source={{ uri: item.profileImage }} style={{ width: wp(13), height: wp(13), borderRadius: wp(13) }} />
                                    <View style={{ flexDirection: 'column', marginLeft: wp(2.2) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.5), fontWeight: '600', color: COLORS.darkgray }} numberOfLines={1}>{item.name}</Text>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.8), color: COLORS.darkgray1 }} numberOfLines={1}>{item.message}</Text>
                                    </View>
                                </View>
                                <Text style={{ paddingTop: hp(0.4), fontFamily: fontFamily.FONTS.Medium, fontSize: hp(1.7), color: COLORS.darkgray1 }} numberOfLines={1}>{item.messageTime}</Text>
                            </View>
                        </TouchableOpacity>

                    )}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={() => (
                        <View style={{ flex: 1, marginVertical: hp(30), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: hp(2.2), padding: hp(1.5), color: COLORS.secondaryGray }}>you dont have any contacts add contact click on the + button </Text>
                        </View>
                    )}
                />
            </View>

        </SafeAreaView>
    );
};

export default Chats;

const styles = StyleSheet.create({});
