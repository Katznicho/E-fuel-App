import React, { useEffect } from 'react';
import {
    BackHandler,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNLocation from 'react-native-location';
import { useDispatch, useSelector } from 'react-redux';
import { updateLocation } from '../redux/user/userActions';
import { ADMIN } from '../constants/roles';

export default function HomeScreen({ navigation }:any) {
    const dispatch = useDispatch();
    
    const { user } = useSelector(state => state?.user);
    // console.log(location);

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
                            // if (feedback === false) {
                            //     BackHandler.exitApp();
                            // }

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
    }, []);

    //
    //
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/c+logo.png')}
                style={styles.logo}
            />

            <View style={styles.cardRow}>
                {
                    user?.role.name==ADMIN&&(<View style={styles.cardParent}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('FuelStation');
                                getUserLocation();
                            }}
                            style={styles.cardContainer}>
                            {/* <MaterialCommunityIcons
                            name="gas-stationyuu"
                            size={50}
                            color="#1c478e"
                        /> */}
    
                            <FontAwesome5
                                name="gas-pump"
                                size={50}
                                color="#1c478e"
                            />
    
                            <Text style={styles.title}>Add Fuel Station</Text>
                        </TouchableOpacity>
                    </View>)
                }

                <View style={styles.cardParent}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('BodaStage');
                                getUserLocation();
                            }}
                            style={styles.cardContainer}>
                            <Ionicons name="location" size={50} color="#1c478e" />
                            <Text style={styles.title}>Add Boda Stage</Text>
                        </TouchableOpacity>
                    </View>
                



            </View>

            <View style={styles.cardRow}>
                <View style={styles.cardParent}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('BodaRider');
                            getUserLocation();
                        }}
                        style={styles.cardContainer}>
                        <FontAwesome5
                            name="motorcycle"
                            size={50}
                            color="#1c478e"
                        />

                        <Text style={styles.title}>Add Boda Rider</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardParent}></View>
            </View>
        </View>
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

    cardRow: { flexDirection: 'row',  },

    cardParent: { flex: 1, margin: 10 },

    cardContainer: {
        backgroundColor: '#fff',
        paddingVertical: 40,
        borderRadius: 10,
        alignItems: 'center',
    },

    title: { fontWeight: 'bold', color: '#000' },
});
