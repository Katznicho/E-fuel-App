import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../redux/user/userActions';

// Screens


import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import LandingScreen from './LandingScreen';
import StagesOnBoarded from './StagesOnBoarded';
import StageDetails from './StageDetails';
import PaidLoans from './PaidLoans';
import Unpaid from './UnpaidLoan';
import SuspendedStages from './SuspendedStages';
import SuspendedRiders from './SuspendedRiders';


const LandingStack = () => {
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
        <Stack.Navigator
            initialRouteName='LandingScreen'
        >
            <Stack.Screen
                name="LandingScreen"
                component={LandingScreen}
                options={{
                    headerRight: () => (
                        <MaterialCommunityIcons
                            name="logout"
                            size={35}
                            color="#1c478e"
                            onPress={logOutUser}
                        />
                    ),
                    title: "Dashboard"
                }}
            />
            <Stack.Screen
                name="StagesOnBoarded"
                component={StagesOnBoarded}
                options={{ title: 'Stages' }}
            />

            <Stack.Screen
                name="StageDetails"
                component={StageDetails}
                options={{ title: 'Stages Details' }}
            />
            <Stack.Screen
                name="PaidLoans"
                component={PaidLoans}
                options={{ title: 'Stages Details' }}
            />
            <Stack.Screen
                name="UnpaidLoans"
                component={Unpaid}
                options={{ title: 'Stages Details' }}
            />
            {/* suspended details */}
            <Stack.Screen
                name="SuspendedStages"
                component={SuspendedStages}
                options={{ title: 'Suspended Stages' }}
            />
            <Stack.Screen
                name="SuspendedRiders"
                component={SuspendedRiders}
                options={{ title: 'Suspended Riders' }}
            />

            {/* suspended details */}

        </Stack.Navigator>
    )
}

export default LandingStack

const styles = StyleSheet.create({})