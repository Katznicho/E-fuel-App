import React, { useEffect, useState } from 'react';
import {
    BackHandler,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    Alert

} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNLocation from 'react-native-location';
import { useDispatch, useSelector } from 'react-redux';
import { updateLocation } from '../redux/user/userActions';
import { useShowGreeting } from '../utils/useShowGreetings';
import { BASE_URL } from '../urls/index';
import { ADMIN } from '../constants/roles';
import { ScrollView } from 'react-native-gesture-handler';

export default function LandingScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const {  user, accessToken } = useSelector(state => state?.user);



    const [totalbodas, setTotalbodas] = useState(0);
    const [totalfuelstations, setTotalfuelstations] = useState(0);
    const [totalbodastages, setTotalbodastages] = useState(0);
    const [paidloans, setPaidLoans] = useState(0);
    const [unpaid , setUnpaid]= useState(0);

    const [suspendedBodaRiders, setSuspendedBodaRiders] = useState([]);
    const [suspendedBodaStages, setSuspendedBodaStages] = useState([]);

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('ContentType', 'multipart/form-data');
    headers.append('Authorization', `Bearer ${accessToken}`);

    const body = new FormData();
    body.append('user_id', user.adminId);


    const getUserTotals = async () => {
        fetch(`${BASE_URL}/getusertotals`, {
            method: 'POST',
            headers,
            body,
        })

            .then(a => a.json())
            .then(response => {
                //console.log(`The response is ${JSON.stringify(response)}`);
                if (response.errors) {
                    //setErrors(response.errors);
                }
                if (response.data) {
                    //check the data array if it has any data
                    if (response.data.length > 0) {
                        console.log(`The response is ${JSON.stringify(response.data[0].daily_boda_riders)}`);
                        setTotalbodas(response.data[0]?.daily_boda_riders);
                        setTotalfuelstations(response.data[0].daily_fuel_stations);
                        setTotalbodastages(response.data[0].daily_boda_stages);
                    }
                    else {
                        //set all totals to zero
                        setTotalbodastages(0);
                        setTotalbodas(0);
                        setTotalfuelstations(0);

                    }

                }
            }
            )
            .catch(error => {
                console.log(error);
                Alert.alert('Error', 'Something went wrong');
            }
            )
    }



      const getPaidLoans = async()=>{

       try {
        const response = await fetch(`${BASE_URL}/paidLoans`, {
            method: 'POST',
            headers,
            body,
        })
         const data  = await response.json();

          

           setPaidLoans(data?.data);
       } catch (error) {
           Alert.alert("Error", "some thing went wrong")
       }
         
      }

      const getUnpaidLoans = async()=>{

        try {
         const response = await fetch(`${BASE_URL}/unPaidLoans`, {
             method: 'POST',
             headers,
             body,
         })
          const data  = await response.json();
 
            setUnpaid(data?.data);
        } catch (error) {
            Alert.alert("Error", "some thing went wrong")
        }
          
       }

       const getSuspendedBodaRiders = async()=>{
        try {
            const response = await fetch(`${BASE_URL}/getSuspendedBodaRiders`, {
                method: 'POST',
                headers,
                body,
            })
             const data  = await response.json();

              console.log("=========suspended boda riders===================")
                console.log(data);
                console.log("============================")

              setSuspendedBodaRiders(data?.data);
           } catch (error) {
            console.log("============================")
             console.log(error);
             console.log("============================")
            // Alert.alert("Error", "some thing went wrong")
           }
       }
    


         const getSuspendedBodaStages = async()=>{
            try {
                const response = await fetch(`${BASE_URL}/getSuspendedStages`, {
                    method: 'POST',
                    headers,
                    body,
                })
                 const data  = await response.json();
                 console.log("=========suspended boda riders===================")
                 console.log(data);
                 console.log("============================")
                     setSuspendedBodaStages(data?.data);
               } catch (error) {
                console.log("============================")
                console.log(error);
                console.log("============================")
                  // Alert.alert("Error", "some thing went wrong")
               }
           
            }      




    const greetings = useShowGreeting();

    RNLocation.configure({
        // distanceFilter: 1,
        desiredAccuracy: {
            ios: 'best',
            android: 'balancedPowerAccuracy',
        },
        // iOS only
        // allowsBackgroundLocationUpdates: true,
    });

    //
    // Get User's Location
    function getUserLocation() {
        // RNLocation.requestPermission({
        //     ios: 'whenInUse',
        //     android: {
        //         detail: 'fine',
        //     },
        // }).then(granted => {
        //     if (granted) {
        //         RNLocation.subscribeToLocationUpdates(locations => {
        //             dispatch(
        //                 updateLocation(
        //                     locations[0]?.latitude,
        //                     locations[0]?.longitude,
        //                 ),
        //             );
        //             console.log(
        //                 locations[0]?.latitude,
        //                 locations[0]?.longitude,
        //             );
        //         });
        //     }
        // });
        RNLocation.checkPermission({
            ios: 'always',
            android: { detail: 'fine' },
        })
            .then(response => {
                if (!response) {
                    RNLocation.requestPermission({
                        ios: 'whenInUse',
                        android: {
                            detail: 'fine',
                            rationale: {
                                title: 'We need to access your location',
                                message:
                                    'We need to know the location from which data is submitted.',
                                buttonPositive: 'OK',
                                buttonNegative: 'Cancel',
                            },
                        },
                    })
                        .then(feedback => {
                            // console.log(feedback);
                            // Close app if user denies access to his or her location
                            if (feedback === false) {
                                BackHandler.exitApp();
                            }

                            RNLocation.subscribeToLocationUpdates(locations => {
                                dispatch(
                                    updateLocation(
                                        locations[0]?.latitude,
                                        locations[0]?.longitude,
                                    ),
                                );
                                console.log(
                                    locations[0]?.latitude,
                                    locations[0]?.longitude,
                                );
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    RNLocation.subscribeToLocationUpdates(locations => {
                        dispatch(
                            updateLocation(
                                locations[0]?.latitude,
                                locations[0]?.longitude,
                            ),
                        );
                        console.log(
                            locations[0]?.latitude,
                            locations[0]?.longitude,
                        );
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getUserLocation();
        getPaidLoans();
        getUnpaidLoans();

        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            getUserTotals()
            getPaidLoans();
            getUnpaidLoans();
            getSuspendedBodaRiders();
            getSuspendedBodaStages();
        });


    }, [navigation]);

    //
    //
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* state status bar to black */}
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{
                marginHorizontal: 20,
                marginTop: 20,
                marginBottom: 10,
                padding: 10,
                elevation: 5,
                backgroundColor: '#fff',
                borderRadius: 10,
                justifyContent: 'space-between',
                alignItems: 'center'

            }}>
                <Text
                    style={{

                        color: '#000'

                    }}
                >
                    {greetings}   {user.name}
                </Text>
                <Text
                    style={{

                        color: 'grey'

                    }}
                >
                    Your Dasbhoard on {new Date().toDateString()}
                </Text>
                {/* add a touchable opacity field with an option of tap to refresh */}

            </View>


             
            <View style={styles.cardRow}>
            {
                user?.role?.name==ADMIN&&(
                    <View style={styles.cardParent}>
                    
                    <TouchableOpacity
                        
                        style={styles.cardContainer}>
                        {/* <MaterialCommunityIcons
                        name="gas-station"
                        size={50}
                        color="#1c478e"
                    /> */}

                        <FontAwesome5
                            name="gas-pump"
                            size={50}
                            color="#1c478e"
                        />

                        <Text style={styles.title}>{totalfuelstations}  Fuel Stations  OnBoarded</Text>
                    </TouchableOpacity>
                </View>
                )
             }
           
              
                    <View style={styles.cardParent}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('StagesOnBoarded');
                            getUserLocation();
                        }}
                        style={styles.cardContainer}>
                        <Ionicons name="location" size={50} color="#1c478e" />
                        <Text style={styles.title}>
                            {totalbodastages}  Boda Stages OnBoarded

                        </Text>
                    </TouchableOpacity>
                </View>
                


            </View>

            <View style={styles.cardRow}>
                <View style={styles.cardParent}>
                    <TouchableOpacity
                        
                        style={styles.cardContainer}>
                        <FontAwesome5
                            name="motorcycle"
                            size={50}
                            color="#1c478e"
                        />

                        <Text style={styles.title}>
                            {totalbodas}  Boda Riders OnBoarded

                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardParent}></View>
            </View>

             {/* loans  */}
             <View style={styles.cardRow}>
             <View style={styles.cardParent}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('PaidLoans');
                            getUserLocation();
                        }}
                        style={styles.cardContainer}>
                        <MaterialIcons
                            name="payments"
                            size={50}
                            color="#1c478e"
                        />

                        <Text style={styles.title}>
                            {paidloans?.length}  Total Paid Loans

                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardParent}>
                    <TouchableOpacity
                         onPress={() => {
                            navigation.navigate('UnpaidLoans');
                            
                        }}
                        style={styles.cardContainer}>
                        <MaterialIcons
                            name="payments"
                            size={50}
                            color="#1c478e"
                        />

                        <Text style={styles.title}>
                            {unpaid?.length}  Total Unpaid Loans

                        </Text>
                    </TouchableOpacity>
                </View>
                  
                 
            </View>
             {/* loans */}

             {/* suspended details */}
             <View style={styles.cardRow}>
             <View style={styles.cardParent}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('SuspendedRiders');
                            getUserLocation();
                        }}
                        style={styles.cardContainer}>
                        <MaterialIcons
                            name="payments"
                            size={50}
                            color="#1c478e"
                        />

                        <Text style={styles.title}>
                            {suspendedBodaStages!=null && suspendedBodaRiders?.length}   Suspended Boda Riders

                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardParent}>
                    <TouchableOpacity
                         onPress={() => {
                            navigation.navigate('SuspendedStages');
                            
                        }}
                        style={styles.cardContainer}>
                        <MaterialIcons
                            name="payments"
                            size={50}
                            color="#1c478e"
                        />

                        <Text style={styles.title}>
                            {suspendedBodaStages!=null && suspendedBodaStages?.length}   Suspended Boda Stages

                        </Text>
                    </TouchableOpacity>
                </View>
                  
                 
            </View>
             {/* suspended details */}

             
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginVertical: 20,
    },

    cardRow: { flexDirection: 'row' },

    cardParent: { flex: 1, margin: 10 },

    cardContainer: {
        backgroundColor: '#fff',
        paddingVertical: 40,
        borderRadius: 10,
        alignItems: 'center',
    },

    title: { fontWeight: 'bold', color: '#000' },
});
