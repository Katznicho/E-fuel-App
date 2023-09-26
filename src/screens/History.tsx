import { Alert, StyleSheet, Text, View , FlatList} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../urls';
import moment from 'moment';
import { ADMIN } from '../constants/roles';
import  Ionicons  from 'react-native-vector-icons/Ionicons';


const History = ({navigation}:any) => {

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
        });

 }, [navigation]); 

    const dispatch = useDispatch();
    const { location, user, accessToken } = useSelector(state => state?.user);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('ContentType', 'multipart/form-data');
    headers.append('Authorization', `Bearer ${accessToken}`);
    const [history, setHistory] = useState<any>([]);
    const [loading , setLoading] = useState<boolean>(false);

    const body = new FormData();
    body.append('user_id', user.adminId);

     const getHistory = async()=>{
        try {
            setLoading(true)
            const response = await fetch(`${BASE_URL}/getallusertotals`, {method: 'POST',headers,body})
            const data = await response.json();
           console.log("=============================")
           console.log(JSON.stringify(data));
           console.log('=============================')
            setHistory(data?.data)
            setLoading(false)

        } catch (error) {
             Alert.alert("An error occured");
             setLoading(false);
        }
     }


  useEffect(()=>{
    getHistory();
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getHistory();
  });
  },[navigation])   

  const renderCard = ({ item }:any) => {
    const updatedAt = moment(item.updated_at).format('YYYY-MM-DD');

    return (
        <View style={styles.card}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Summary on { updatedAt}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Total Boda Riders: {item.daily_boda_riders}</Text>
          {
             user?.role.name==ADMIN&&(<Text style={styles.detailText}>Total Fuel Stations: {item.daily_fuel_stations}</Text>)
          }

          
      <Text style={styles.detailText}>Total Boda Stages: {item.daily_boda_stages}</Text>
          


          
        </View>
      </View>
    );
  };
     
  return (
    <View style={styles.container}>
        {
            loading?
             <View>
                 <Text>loading ...</Text>
             </View>
            :
             history?.length>0?
            <FlatList
            data={history}
            renderItem={renderCard}
            keyExtractor={(item) => item.id.toString()}
          />:
           <View style={styles.noHistory}>
                <Text>No History found</Text>
           </View>
        }
      
    </View>
  );
}

export default History

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      backgroundColor: 'white',
      padding: 10,
      marginBottom: 10,
      marginHorizontal:10,
      marginVertical:10,
      borderRadius:10
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
      noHistory:{
        flex: 1,
        alignItems: 'center',
        marginHorizontal:20,
        marginVertical:20
      }
  });