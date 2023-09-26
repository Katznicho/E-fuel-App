import React, { useState, useEffect } from 'react';
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
import ImageUpload from '../../components/ImageUpload';
import ModalSelector from 'react-native-modal-selector-searchable';
import { BASE_URL } from '../../urls';
import { useSelector } from 'react-redux';
import { lengthError, numberError } from '../../utils/helper';
import UploadRiderDetails from '../../components/UploadRiderDetails';

export default function AddBodaRiderScreen({ navigation }:any) {
    const { accessToken, location, user } = useSelector(state => state.user);

    const [riderInfo, setRiderInfo] = useState({
        name: '',
        nin: '',
        bodaNumber: '',
        phoneNumber: '',
        role: '',
        fuelStation: 0,
        stage: 0,
    });

    const [frontId, setFrontId] = useState('');
    const [backId, setBackId] = useState('');
    const [riderPhoto, setRiderPhoto] = useState('');
    const [motorcyclePhoto, setMotorcyclePhoto] = useState('');

    const [imagesUploading, setImagesUploading] = useState(false);
    const [profileImagesUploading, setProfileImagesUploading] = useState(false);

    //add error handling for NIN and boda rider
    const [ninError , setNINError] =  useState(false)
    const[bodaNumberError , setBodaNumberError] = useState(false)
    const [phoneNumberError , setPhoneNumberError] = useState(false)

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [stations, setStations] = useState<
        {
            key: number;
            label: string;
        }[]
    >([]);

    const [stages, setStages] = useState<
        {
            key: number;
            label: string;
        }[]
    >([]);
    const disablesubmit = ()=>{
        if(ninError|| bodaNumberError || phoneNumberError) return true
        else return false

    }
    //
    // Get All Fuel Stations
    useEffect(() => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);

        fetch(`${BASE_URL}/stations`, { headers })
            .then(a => a.json())
            .then(response => {
                const { message, data } = response;
                // console.log(data);
                if (message === 'success') {
                    const clean = data.map((d: { fuelStationId: any; fuelStationName: any; }) => {
                        return {
                            key: d.fuelStationId,
                            label: d.fuelStationName,
                        };
                    });
                    setStations(clean);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [accessToken]);

    //
    // Get Boda Stages
    useEffect(() => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);

        fetch(`${BASE_URL}/stages`, { headers })
            .then(a => a.json())
            .then(response => {
                const { message, data } = response;
                // console.log(data);
                if (message === 'success') {
                    const clean = data.map((d: { stageId: any; stageName: any; }) => {
                        return {
                            key: d.stageId,
                            label: d.stageName,
                        };
                    });
                    setStages(clean);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [accessToken]);

    // Save Boda Rider
    function saveBodaRider() {
        if (!riderInfo.fuelStation) {
            return Alert.alert('Alert', 'Select a fuel station');
        }

        if (!riderInfo.stage) {
            return Alert.alert('Alert', 'Select a boda stage');
        }

        setLoading(true);

        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'multipart/form-data');
        headers.append('Authorization', `Bearer ${accessToken}`);

        const body = new FormData();
        body.append('bodaUserName', riderInfo.name);
        // body.append('bodaUserStatus', locationInfo.county);
        body.append('bodaUserNIN', riderInfo.nin);
        body.append('bodaUserPhoneNumber', riderInfo.phoneNumber);
        body.append('bodaUserBodaNumber', riderInfo.bodaNumber);
        body.append('bodaUserBackPhoto', frontId);
        body.append('bodaUserFrontPhoto', backId);
        body.append('bodaUserRole', riderInfo.role);
        body.append('fuelStationId', riderInfo.fuelStation);
        body.append('stageId', riderInfo.stage);
        body.append('longitude', location.longitude);
        body.append('latitude', location.latitude);
        body.append('riderPhoto', riderPhoto);
        body.append('motorcyclePhoto', motorcyclePhoto);
        body.append('user_id', user.adminId);

        fetch(`${BASE_URL}/registerbodauser`, {
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
                    Alert.alert('Success', 'Boda rider added successfully');
                    setRiderInfo({
                        name: '',
                        nin: '',
                        bodaNumber: '',
                        phoneNumber: '',
                        role: '',
                        fuelStation: 0,
                        stage: 0,
                    });
                    setFrontId('');
                    setBackId('');
                }
                // {"data": "Boda user already exisits", "message": "failure", "statusCode": 400}
                if (message === 'failure') {
                    setLoading(false);
                    setErrors({});

                    Alert.alert('Error', data);
                }

            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }

    //
    //
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.infoRow}>
                    <Text style={styles.title}>Boda User Names</Text>
                    <TextInput
                        value={riderInfo.name}
                        onChangeText={text =>
                            setRiderInfo({
                                ...riderInfo,
                                name: text,
                            })
                        }
                        style={styles.input}
                        placeholder="ENTER NAMES"
                        autoCapitalize="characters"
                    />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.title}>NIN Number</Text>
                    <TextInput
                        value={riderInfo.nin}
                        onChangeText={text =>{
                            setRiderInfo({
                                ...riderInfo,
                                nin: text,
                            })
                            lengthError(riderInfo.nin ,14 ,"NIN")==null?setNINError(false):setNINError(true)


                        }
                            
                        }
                        style={
                            [
                                styles.input, 
                                {
                                    borderBottomColor:lengthError(riderInfo.nin ,14 ,"NIN NUMBER")==null?"gray":"red" ,
                                    borderBottomWidth:lengthError(riderInfo.nin ,14 ,"NIN NUMBER")==null?1:2
                                 }
                            ]
                        }
                        placeholder="ENTER NIN NUMBER"
                        autoCapitalize="characters"
                        
                    />
                </View>
                <View  style={styles.errorContainer}>
                    
                    <Text style={[styles.errorColor, {marginTop:-10}]}>
                    {
                        lengthError(riderInfo.nin ,14 ,"NIN NUMBER")
                    }
                    {
                        
                    }

                    </Text>
                    
                </View>


                <View style={styles.infoRow}>
                    <Text style={styles.title}>Boda Number</Text>
                    <TextInput
                        value={riderInfo.bodaNumber}
                        onChangeText={text =>{
                            setRiderInfo({
                                ...riderInfo,
                                bodaNumber: text,
                            })
                            lengthError(riderInfo.bodaNumber ,6 ,"BODA NUMBER")==null?setBodaNumberError(false):setBodaNumberError(false)

                        }
                            
                        }
                        style={
                            [
                                styles.input, 
                                {
                                    borderBottomColor:lengthError(riderInfo.bodaNumber ,6 ,"BODA NUMBER")==null?"gray":"gray" ,
                                    borderBottomWidth:lengthError(riderInfo.bodaNumber ,6 ,"BODA NUMBER")==null?1:2
                                 }
                            ]
                        }
                        placeholder="ENTER BODA NUMBER"
                        autoCapitalize="characters"
                    />
                </View>
                <View  style={styles.errorContainer}>
                    <Text style={[styles.errorColor, {marginTop:-10}]}>
                    {
                        lengthError(riderInfo.bodaNumber ,7 ,"BODA NUMBER")
                    }

                    </Text>
                    
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Phone Number</Text>
                    <TextInput
                        value={riderInfo.phoneNumber}
                        onChangeText={text =>
                            setRiderInfo({
                                ...riderInfo,
                                phoneNumber: text,
                            })
                        }

                        style={
                            [
                                styles.input, 
                                {
                                    borderBottomColor:numberError(riderInfo.phoneNumber)==null?"gray":"red" ,
                                    borderBottomWidth:numberError(riderInfo.phoneNumber)==null?1:2
                                 }
                            ]
                        }
                        placeholder="ENTER PHONE NUMBER"
                        autoCapitalize="characters"
                        keyboardType='numeric'
                    />
                </View>
                <View  style={styles.errorContainer}>
                    <Text style={[styles.errorColor, {marginTop:-10}]}>
                    {
                       numberError(riderInfo.phoneNumber)
                    }

                    </Text>
                    
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Select Role</Text>

                    <ModalSelector
                         selectTextStyle={{
                            color:"black",
                            backgroundColor:"red"

                         }}
                         
                         
                          contentContainerStyle={{
                            
                          }}
                        optionContainerStyle={{ 
                            backgroundColor: '#fff'
                     }}
                        cancelStyle={{ backgroundColor: '#fff' }}
                        data={[
                            { 
                                key: 'STAGE CHAIRMAN', 
                            label: 'STAGE CHAIRMAN' ,


                        },
                            { key: 'BODA USER', label: 'BODA RIDER' },
                        ]}
                        initValue={
                            riderInfo.role !== ''
                                ? riderInfo.role
                                : 'SELECT BODA RIDER ROLE'
                        }
                        initValueTextStyle={{
                            color:riderInfo.role==''?"black":"black"
                        }}

                        selectedItemTextStyle={{color:"black"}}
                        onChange={option => {
                            setRiderInfo({ ...riderInfo, role: option.key });
                        }}
                        search={false}
                        
                    />
                </View>

                <View style={styles.infoRow}>
                    <UploadRiderDetails
                        setRiderPhoto={setRiderPhoto}
                        setMotorcyclePhoto={setMotorcyclePhoto}
                        setImagesUploading={setProfileImagesUploading}
                        imageTextOne={"RIDER PHOTO"}
                        imageTextTwo={"MOTORCYCLE PHOTO"}
                        profileImagesUploading = {profileImagesUploading}
                    />
                </View>

                <View style={styles.infoRow}>
                    <ImageUpload
                        setFrontId={setFrontId}
                        setBackId={setBackId}
                        setImagesUploading={setImagesUploading}
                        imageTextOne={"FRONT NATIONAL ID PHOTO"}
                        imageTextTwo={"BACK NATIONAL ID PHOTO"}
                        imagesUploading={imagesUploading}
                    />
                </View>




                <View style={styles.infoRow}>
                    <Text style={styles.title}>Fuel Station</Text>

                    <ModalSelector
                        optionContainerStyle={{ backgroundColor: '#fff' }}
                        cancelStyle={{ backgroundColor: '#fff' }}
                        data={stations}
                        initValue="Select fuel station"
                        onChange={option => {
                            setRiderInfo({
                                ...riderInfo,
                                fuelStation: option.key,
                            });
                        }}
                    />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Stage</Text>

                    <ModalSelector
                        optionContainerStyle={{ backgroundColor: '#fff' }}
                        cancelStyle={{ backgroundColor: '#fff' }}
                        data={stages}
                        initValue="Select boda stage"
                        onChange={option => {
                            setRiderInfo({ ...riderInfo, stage: option.key });
                        }}
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
                        <Pressable 
                        onPress={saveBodaRider}
                        disabled={loading}

                        >
                            <Text style={styles.login}>SAVE BODA RIDER</Text>
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
