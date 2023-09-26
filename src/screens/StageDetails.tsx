import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../urls';
import { useRoute } from '@react-navigation/native';

const StageDetails = () => {
    //const stage = navigation?.route;
    const route = useRoute();
    // Access the parameters from the route object
    const { stage } = route.params;

    const [loading, setLoading] = useState(false);
    const [stages, setStages] = useState<any>([]);
    const [boda, setBoda] = useState<any>([]);
    const [disabled, setDisabled] = useState(false);

    const { location, user, accessToken } = useSelector(state => state?.user);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('ContentType', 'multipart/form-data');
    headers.append('Authorization', `Bearer ${accessToken}`);

    const body = new FormData();
    body.append('user_id', user?.adminId);
    body.append('stage_id', stage?.stageId);

    const getStageDetails = async () => {
        try {
            const response = await fetch(`${BASE_URL}/getSpecificStageOnBoarded`, {
                method: 'POST',
                headers,
                body,
            });
            const data = await response.json();
            console.log('=============================');
            console.log(JSON.stringify(data));
            console.log('=============================');
            setStages(data?.stage);
            setBoda(data?.bodas);
            setLoading(false);
        } catch (error) {
            Alert.alert('An error occured');
            setLoading(false);
        }
    };

    useEffect(() => {
        getStageDetails();
    }, []);

    const activateStage = async () => {
        try {
            //setLoading(true);
            setDisabled(true);
            const response = await fetch(`${BASE_URL}/activateRegisteredStage`, {
                method: 'POST',
                headers,
                body,
            });
            const data = await response.json();

            //setLoading(false);
            setDisabled(false);
            Alert.alert(data?.message , data?.message);
            getStageDetails();
        } catch (error) {
            Alert.alert('An error occured');
            //setLoading(false);
            setDisabled(false);
        }
    };



    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: '#fff' }}
        >
            {
                loading ? <View style={styles.noHistory}>
                    <Text>loading ...</Text>
                </View> :
                    <View>
                        <View style={styles.card}>
                            <Text style={styles.detailText}>
                                Stage Name: {stages[0]?.stageName}
                            </Text>

                            <Text style={styles.detailText}>
                                Stage Status :{stages[0]?.stageStatus === 0 ? "Not Active" : "Active"}
                            </Text>

                            <Text style={styles.detailText}>
                                Total Boda Users :{boda?.length}
                            </Text>
                        </View>
                        {/* activate button */}
                        {
                            stages[0]?.stageStatus === 0 &&(<View style={{
                                marginVertical: 10,
                                marginHorizontal: 20,
                            }}>
                                <Button
                                    title='Activate'
                                    style={{
                                        marginVertical: 10,
                                        marginHorizontal: 10,
                                        borderRadius: 10,
                                        backgroundColor: '#000',
                                        borderRadius: 10,
    
                                    }}
                                    disabled={disabled}
                                    onPress={activateStage}
                                >
                                    Activate
                                </Button>
                            </View>)
                        }


                        {/* activate button */}
                    </View>
            }
        </ScrollView>
    )
}

export default StageDetails

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    dateContainer: {
        flex: 1,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailsContainer: {
        flex: 3,
        marginLeft: 10,
    },
    detailText: {
        fontSize: 14,
        marginBottom: 5,
        color: "#000"
    },
    noHistory: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },
})