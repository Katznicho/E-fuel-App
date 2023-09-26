import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '../../urls';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../redux/user/userActions';

export default function LoginScreen() {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({});

    //
    // Login User
    function login() {
        // Check if user entered an email
        // if (!email.trim()) {
        //     return Alert.alert('Email is required');
        // }

        // Check if user entered a password
        // if (!password.trim()) {
        //     return Alert.alert('Password is required');
        // }

        setLoading(true);

        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'multipart/form-data');

        const body = new FormData();
        body.append('email', email);
        body.append('password', password);

        fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers,
            body,
        })
            .then(a => a.json())
            .then(response => {


                if (response.errors) {
                    setLoading(false);
                    setErrors(response.errors);
                    return Alert.alert('Error', 'Failed to login');
                }
                if(response.message=='failure'){

                    setLoading(false);
                    return Alert.alert('Error', 'Invalid Credentials');
                }

                const { message, data, accessToken } = response;

                if (message === 'success') {
                    setLoading(false);
                    setErrors({});

                    dispatch(updateUserInfo(data?.user, accessToken, data?.role));
                }
            })
            .catch(error => {
                console.log(`The error is ${JSON.stringify(error)}`);
                setLoading(false);
            });
    }

    //
    //
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                }}>
                <View style={styles.infoRow}>
                    <Text style={styles.title}>EMAIL</Text>
                    <TextInput
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                        // placeholder="Email or User code"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.title}>PASSWORD</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            value={password}
                            onChangeText={text => setPassword(text)}
                            style={[styles.input, { flex: 1 }]}
                            secureTextEntry={showPassword ? false : true}
                        />

                        <Ionicons
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={20}
                            style={styles.eyeIcon}
                            onPress={() => {
                                setShowPassword(prev => !prev);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.infoRow}>
                    {Object.entries(errors).map((e, index) => (
                        <Text key={index} style={styles.errorColor}>
                            {e[0]} - {e[1][0]}
                        </Text>
                    ))}
                </View>

                {!loading ? (
                    <Pressable onPress={login}>
                        <Text style={styles.login}>LOGIN</Text>
                    </Pressable>
                ) : (
                    <ActivityIndicator
                        color="#1c478e"
                        style={{ marginTop: 25 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 20,
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 5,
    },

    infoRow: { marginBottom: 20, padding: 10 },

    title: { fontWeight: 'bold', color: '#000' },

    input: {
        borderBottomColor: '#000',
        borderBottomWidth: 0.5,
        padding: 0,
    },

    eyeIcon: { marginTop: 10, color: '#000' },

    login: {
        backgroundColor: '#1c478e',
        color: '#fff',
        padding: 12,
        textAlign: 'center',
        borderRadius: 15,
        marginTop: 20,
    },

    errorColor: { color: '#EF4444', marginTop: 5 },
});
