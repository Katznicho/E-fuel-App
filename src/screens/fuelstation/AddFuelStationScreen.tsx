import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    View,
} from 'react-native';

import { useSelector } from 'react-redux';
import ModalSelector from 'react-native-modal-selector-searchable';
import ImageUpload from '../../components/ImageUpload';
import LocationInfo from '../../components/LocationInfo';
import { BASE_URL } from '../../urls';
import { numberError } from '../../utils/helper';


export default function AddFuelStationScreen({ navigation }:any) {
    const { accessToken, location, user } = useSelector(state => state.user);

    const [stationInfo, setStationInfo] = useState({
        stationName: '',
        stationAddress: '',
        bankName: '',
        bankBranch: '',
        accountName: '',
        accountNumber: '',
        contactPName: '',
        contactPNin: '',
        contactPTel: '',
    });

    const [locationInfo, setLocationInfo] = useState<any>({
        district: '',
        county: '',
        subCounty: '',
        parish: '',
        village: '',
    });

    const [frontId, setFrontId] = useState('');
    const [backId, setBackId] = useState('');
    const [imagesUploading, setImagesUploading] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
            'ID photos are still being uploaded. Try again in a few seconds!',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
        );
    };

    // Save fuel station
    function saveFuelStation() {
        // if (imagesUploading) {
        //     if (Platform.OS === 'android') {
        //         showToastWithGravityAndOffset();
        //     } else {
        //         Alert.alert(
        //             'Oops',
        //             'ID photos are still being uploaded. Try again in a few seconds!',
        //         );
        //     }
        //     return;
        // }

        setLoading(true);

        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'multipart/form-data');
        headers.append('Authorization', `Bearer ${accessToken}`);

        const body = new FormData();
        body.append('districtCode', locationInfo.district);
        body.append('countyCode', locationInfo.county);
        body.append('subCountyCode', locationInfo.subCounty);
        body.append('parishCode', locationInfo.parish);
        body.append('fuelStationName', stationInfo.stationName);
        // body.append('fuelStationName', stationInfo.stationAddress);
        body.append('bankName', stationInfo.bankName);
        body.append('bankBranch', stationInfo.bankBranch);
        body.append('AccName', stationInfo.accountName);
        body.append('AccNumber', stationInfo.accountNumber);
        body.append('contactPersonName', stationInfo.contactPName);
        body.append('contactPersonPhone', stationInfo.contactPTel);
        body.append('ninNumber', stationInfo.contactPNin);

        body.append('frontIDPhoto', frontId);
        body.append('backIDPhoto', backId);
        body.append('longitude', location.longitude);
        body.append('latitude', location.latitude);
        body.append('user_id', user.adminId);



        fetch(`${BASE_URL}/registerfuelstation`, {
            method: 'POST',
            headers,
            body,
        })
            .then(a => a.json())
            .then(response => {
                console.log(response);
                if (response.errors) {
                    setErrors(response.errors);
                    setLoading(false);
                    return Alert.alert('Error', 'All fields are required');
                }

                const { message, data } = response;
                // console.log(data);
                if (message === 'success') {
                    setLoading(false);
                    setErrors({});

                    navigation.popToTop();
                    Alert.alert('Success', 'Fuel station added successfully');
                    setStationInfo({
                        stationName: '',
                        stationAddress: '',
                        bankName: '',
                        bankBranch: '',
                        accountName: '',
                        accountNumber: '',
                        contactPName: '',
                        contactPNin: '',
                        contactPTel: '',
                    });

                    setLocationInfo({
                        district: '',
                        county: '',
                        subCounty: '',
                        parish: '',
                        village: '',
                    });
                    setFrontId('');
                    setBackId('');
                }
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }

    //
    const [banks , setBanks] =  useState([

        {key: 'BANK OF AFRICA', label: 'BANK OF AFRICA'},
        {key: 'BANK OF BARODA', label: 'BANK OF BARODA'},
        {key: 'BANK OF INDIA', label: 'BANK OF INDIA'},
        {key: 'STANBIC BANK', label: 'STANBIC BANK'},
        {key: 'STANDARD CHARTERED BANK', label: 'STANDARD CHARTERED BANK'},
        {key: 'DFCU BANK', label: 'DFCU BANK'},
        {key: 'EQUITY BANK', label: 'EQUITY BANK'},
        {key: 'FINANCE TRUST BANK', label: 'FINANCE TRUST BANK'},
        {key: 'DIAMOND TRUST BANK', label: 'DIAMOND TRUST BANK'},
        {key: 'CENTENARY BANK', label: 'CENTENARY BANK'},
        {key: 'I&M BANK', label: 'I&M BANK'},
        {key: 'KCB BANK', label: 'KCB BANK'},
        {key: 'ABSA BANK', label: 'ABSA BANK'},
        {key: 'ABC CAPITAL BANK', label: 'ABC CAPITAL BANK'},
        {key: 'TROPICAL BANK', label: 'TROPICAL BANK'},
        {key: 'CAIRO BANK', label: 'CAIRO BANK'},
        {key: 'CITI BANK', label: 'CITI BANK'},
        {key: 'HOUSING FINANCE BANK', label: 'HOUSING FINANCE BANK'},
        {key: 'ECO BANK', label: 'ECO BANK'},
        {key: 'EXIM BANK', label: 'EXIM BANK'},
        {key: 'GT BANK', label: 'GT BANK'},
        {key: 'NC BANK', label: 'NC BANK'},
        {key: 'UNITED BANK OF AFRICA', label: 'UNITED BANK OF AFRICA'},



    ])
    //
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <LocationInfo
                    locationInfo={locationInfo}
                    setLocationInfo={setLocationInfo}
                />

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Station Name</Text>
                    <TextInput
                        value={stationInfo.stationName}
                        onChangeText={text =>
                            setStationInfo({
                                ...stationInfo,
                                stationName: text,
                            })
                        }
                        style={styles.input}
                        placeholder="ENTER STATION NAME"
                        autoCapitalize="characters"
                    />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Station Address</Text>
                    <TextInput
                        value={stationInfo.stationAddress}
                        onChangeText={text =>
                            setStationInfo({
                                ...stationInfo,
                                stationAddress: text,
                            })
                        }
                        style={styles.input}
                        placeholder="ENTER STATION ADDRESS"
                        autoCapitalize="characters"
                    />
                </View>
                {/* station drop down */}
                <View style={styles.infoRow}>
                    <Text style={styles.title}>Select Bank</Text>

                    <ModalSelector
                         selectTextStyle={{
                            color:"black",


                         }}
                         
                         
                          contentContainerStyle={{
                            
                          }}
                        optionContainerStyle={{ 
                            backgroundColor: '#fff'
                     }}
                        cancelStyle={{ backgroundColor: '#fff' }}
                        data={banks}
                        initValue={
                        
                             'SELECT BANK NAME'
                        }
                        initValueTextStyle={{
                            color:"black"
                        }}

                        selectedItemTextStyle={{color:"black"}}
                        onChange={option => {
                            //setRiderInfo({ ...riderInfo, role: option.key });
                            setStationInfo({
                                ...stationInfo,
                                bankName: option.key,
                            })
                        }}
                        search={false}
                        
                    />
                </View>
                {/* station drop down */}

                {/* <View style={styles.infoRow}>
                    <Text style={styles.title}>Bank Name</Text>
                    <TextInput
                        value={stationInfo.bankName}
                        onChangeText={text =>
                            setStationInfo({
                                ...stationInfo,
                                bankName: text,
                            })
                        }
                        style={styles.input}
                        placeholder="ENTER BANK NAME"
                        autoCapitalize="characters"
                    />
                </View> */}

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Bank Branch</Text>
                    <TextInput
                        value={stationInfo.bankBranch}
                        onChangeText={text =>
                            setStationInfo({
                                ...stationInfo,
                                bankBranch: text,
                            })
                        }
                        style={styles.input}
                        placeholder="ENTER BANK BRANCH"
                        autoCapitalize="characters"
                    />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Account Name</Text>
                    <TextInput
                        value={stationInfo.accountName}
                        onChangeText={text =>
                            setStationInfo({
                                ...stationInfo,
                                accountName: text,
                            })
                        }
                        style={styles.input}
                        placeholder="ENTER ACCOUNT NAME"
                        autoCapitalize="characters"
                    />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Account Number</Text>
                    <TextInput
                        value={stationInfo.accountNumber}
                        onChangeText={text =>
                            setStationInfo({
                                ...stationInfo,
                                accountNumber: text,
                            })
                        }
                        style={styles.input}
                        placeholder="ENTER ACCOUNT NUMBER"
                        autoCapitalize="characters"
                    />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Contact Person </Text>
                    <TextInput
                        value={stationInfo.contactPName}
                        onChangeText={text =>
                            setStationInfo({
                                ...stationInfo,
                                contactPName: text,
                            })
                        }
                        style={styles.input}
                        placeholder="ENTER CONTACT PERSON"
                        autoCapitalize="characters"
                    />
                </View>

                {/* <View style={styles.infoRow}>
                    <Text style={styles.title}>Contact Person NIN</Text>
                    <TextInput
                        value={stationInfo.contactPNin}
                        onChangeText={text =>
                            setStationInfo({
                                ...stationInfo,
                                contactPNin: text,
                            })
                        }
                        style={styles.input}
                        placeholder="ENTER CONTACT PERSON NIN"
                        autoCapitalize="characters"
                    />
                </View> */}

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Contact Person Number</Text>
                    <TextInput
                        value={stationInfo.contactPTel}
                        onChangeText={text =>
                            setStationInfo({
                                ...stationInfo,
                                contactPTel: text,
                            })
                        }


                        style={
                            [
                                styles.input, 
                                {
                                    borderBottomColor:numberError(stationInfo.contactPTel)==null?"gray":"red" ,
                                    borderBottomWidth:numberError(stationInfo.contactPTel)==null?1:2
                                 }
                            ]
                        }
                        placeholder="ENTER CONTACT PERSON NUMBER"
                        autoCapitalize="characters"
                        keyboardType='numeric'
                    />
                </View>
                <View  style={styles.errorContainer}>
                    <Text style={[styles.errorColor, {marginTop:-10}]}>
                    {
                       numberError(stationInfo.contactPTel)
                    }

                    </Text>
                    
                </View>

                <View style={styles.infoRow}>
                    <ImageUpload
                        setFrontId={setFrontId}
                        setBackId={setBackId}
                        setImagesUploading={setImagesUploading}
                        imageTextOne={"First Station Image"}
                        imageTextTwo={"Second Station Image"}
                        imagesUploading={imagesUploading}
                    />
                </View>

                <View style={styles.infoRow}>
                    {Object.entries(errors).map((e, index) => (
                        <Text key={index} style={styles.errorColor}>
                            {e[0]} - {e[1][0]}
                        </Text>
                    ))}
                </View>

                <View style={styles.infoRow}>
                    {!loading ? (
                        <Pressable onPress={saveFuelStation}>
                            <Text style={styles.login}>SAVE FUEL STATION</Text>
                        </Pressable>
                    ) : (
                        <ActivityIndicator
                            color="#1c478e"
                            style={{ marginTop: 25 }}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        padding: 5,
    },
    errorContainer:{
        marginHorizontal:10,
        marginTop:-18
    },

    infoRow: { marginBottom: 20, padding: 10 },

    title: { fontWeight: 'bold', color: '#000' },

    input: {
        borderBottomColor: '#000',
        borderBottomWidth: 0.5,
        padding: 0,
    },

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
