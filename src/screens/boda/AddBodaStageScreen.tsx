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
import ModalSelector from 'react-native-modal-selector-searchable';
import { useSelector } from 'react-redux';
import GetFuelStation from '../../components/GetFuelStation';
import LocationInfo from '../../components/LocationInfo';
import { BASE_URL } from '../../urls';

export default function AddBodaStageScreen({ navigation }) {
    const { accessToken, location, user } = useSelector(state => state.user);

    const [fuelStation, setFuelStation] = useState('');
    const [stageName, setStageName] = useState('');

    const [locationInfo, setLocationInfo] = useState({
        district: '',
        county: '',
        subCounty: '',
        parish: '',
        village: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Save Boda Stage
    function saveBodaStage() {
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
        body.append('villageCode', locationInfo.village);
        body.append('stageName', stageName);
        body.append('fuelStationId', fuelStation);
        body.append('latitude', location.latitude);
        body.append('longitude', location.longitude);
        body.append('user_id', user.adminId);

        fetch(`${BASE_URL}/registerstage`, {
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
                    Alert.alert('Success', 'Boda stage added successfully');
                    setFuelStation('');
                    setStageName('');

                    setLocationInfo({
                        district: '',
                        county: '',
                        subCounty: '',
                        parish: '',
                        village: '',
                    });
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
                <LocationInfo
                    locationInfo={locationInfo}
                    setLocationInfo={setLocationInfo}
                />

                <View style={styles.infoRow}>
                    <Text style={styles.title}>Stage Name</Text>
                    <TextInput
                        value={stageName}
                        onChangeText={text => setStageName(text)}
                        style={styles.input}
                        placeholder="ENTER STAGE NAME"
                        autoCapitalize="characters"
                    />
                </View>

                <GetFuelStation
                    district={locationInfo.district}
                    county={locationInfo.county}
                    setFuelStation={setFuelStation}
                />

                <View style={styles.infoRow}>
                    {Object.entries(errors).map((e, index) => (
                        <Text key={index} style={styles.errorColor}>
                            {e[0]} - {e[1][0]}
                        </Text>
                    ))}
                </View>

                <View style={styles.infoRow}>
                    {!loading ? (
                        <Pressable onPress={saveBodaStage}>
                            <Text style={styles.login}>SAVE BODA STAGE</Text>
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
