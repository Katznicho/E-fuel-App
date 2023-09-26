import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../redux/user/userActions';

// Screens

import AddFuelStationScreen from './fuelstation/AddFuelStationScreen';
import AddBodaRiderScreen from './boda/AddBodaRiderScreen';
import AddBodaStageScreen from './boda/AddBodaStageScreen';
import HomeScreen from './HomeScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'


const OnBoardStack = () => {
    const dispatch = useDispatch();
    // Create navigation stack
    const Stack = createStackNavigator();

    // Logout
    function logOutUser() {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Logout', onPress: () => dispatch(logOut()) },
        ]);
    }
    const Tab = createMaterialBottomTabNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="OnBoarding"
                component={HomeScreen}
                options={{
                    headerRight: () => (
                        <MaterialCommunityIcons
                            name="logout"
                            size={35}
                            color="#1c478e"
                            onPress={logOutUser}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="FuelStation"
                component={AddFuelStationScreen}
                options={{ title: 'Add Fuel Station' }}
            />
            <Stack.Screen
                name="BodaRider"
                component={AddBodaRiderScreen}
                options={{ title: 'Add Boda Rider' }}
            />
            <Stack.Screen
                name="BodaStage"
                component={AddBodaStageScreen}
                options={{ title: 'Add Boda Stage' }}
            />
        </Stack.Navigator>
    )
}

export default OnBoardStack

const styles = StyleSheet.create({})