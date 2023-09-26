import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../redux/user/userActions';

// Screens
import LoginScreen from './auth/LoginScreen'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import OnBoardStack from './OnBoardStack';
import History from './History';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LandingStack from './LandingStack';






export default function BaseScreen() {
    const dispatch = useDispatch();

    const { isLoggedIn } = useSelector(state => state.user);

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
    //
    return (
        <NavigationContainer>
            {isLoggedIn ? (

                <Tab.Navigator
                    initialRouteName="Home"
                    barStyle={{ 
                        backgroundColor: '#1c478e',
                    
                }}
                
                >
                    <Tab.Screen
                        name="Home"
                        component={LandingStack}
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color, size }:any) => (
                                <MaterialCommunityIcons 
                                name="home" 
                                color={'black'} 
                                size={24} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="OnBoard"
                        
                        component={OnBoardStack}
                        
                        options={{
                            tabBarLabel: 'On Board',
                            tabBarColor: '#000000',

                            tabBarIcon: ({ color, size }:any) => (

                                <Ionicons name="md-add-circle-sharp" size={24} color="black" />

                            ),
                        }}
                    />
                    {/* history */}
                    <Tab.Screen
                        name="History"
                        
                        component={History}
                        
                        options={{
                            tabBarLabel: 'History',
                            tabBarColor: '#000000',

                            tabBarIcon: ({ color, size }:any) => (

                                <MaterialIcons name="history-edu" size={24} color="black" />

                            ),
                        }}
                    />
                    {/* history */}

                </Tab.Navigator>

                
            ) : (
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({});
