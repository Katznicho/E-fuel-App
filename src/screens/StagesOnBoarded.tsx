import { Alert, StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../urls';
import moment from 'moment';
import { ADMIN } from '../constants/roles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const StagesOnBoarded = ({ navigation }:any) => {
    //show back button using useLayoutEffect
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 10 }}>
                    <Ionicons
                        name="arrow-back"
                        size={25}
                        color="#000"
                        onPress={() => navigation.goBack()}
                    />
                </View>
            ),
            title:"Stages"
        });
    }, [navigation]);


    const dispatch = useDispatch();
    const { location, user, accessToken } = useSelector(state => state?.user);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('ContentType', 'multipart/form-data');
    headers.append('Authorization', `Bearer ${accessToken}`);
    const [stages, setStages] = useState<any>([]);
    const [loading, setLoading] = useState <boolean>(false);

    const body = new FormData();
    body.append('user_id', user.adminId);

    const getStages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/getRegisteredStages`, {
                method: 'POST',
                headers,
                body,
            });
            const data = await response.json();
            setStages(data?.data);
            setLoading(false);
        } catch (error) {
            Alert.alert('An error occured');
            setLoading(false);
        }
    };

    useEffect(() => {
        getStages();
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            getStages();
        });
        
    }, [navigation]);

    //{"stageId":9,"stageName":"TESTING STAGE","stageStatus":0,"chairmanId":null,"fuelStationId":1,"location":null,"districtCode":12,"countyCode":35,"latitude":"0.3351679","longitude":"32.5696443","subCountyCode":1,"parishCode":12,"user_id":1,"villageCode":3}
    const renderCard = ({ item }:any) => {
        //const updatedAt = moment(item.updated_at).format('YYYY-MM-DD');

        return (
            <TouchableOpacity style={styles.card} 
            key={item?.stageId}
             onPress={() =>{
                    navigation.navigate("StageDetails",{stage:item})
             }}
            >
                

                <View style={styles.detailsContainer}>
                    <Text style={styles.detailText}>
                        Stage Name: {item?.stageName}
                    </Text>
                    
                    <Text style={styles.detailText}>
                        Stage Status :{item?.stageStatus===0?"Not Active":"Active"}
                    </Text>
                    
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View>
                    <Text>loading ...</Text>
                </View>
            ) : stages.length > 0 ? (
                <FlatList
                    data={stages}
                    renderItem={renderCard}
                    keyExtractor={item => item?.stageId?.toString()}
                />
            ) : (
                <View style={styles.noHistory}>
                    <Text>No Stages found</Text>
                </View>
            )}
        </View>
    );
};

export default StagesOnBoarded;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    },
    noHistory: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },
});
