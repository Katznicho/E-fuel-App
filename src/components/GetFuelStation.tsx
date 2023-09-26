import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../urls';

interface Props {
    district: string;
    county: string;
}

export default function GetFuelStation({ district, county, setFuelStation }) {
    const { accessToken } = useSelector(state => state.user);

    const [stations, setStations] = useState<
        {
            key: number;
            label: string;
        }[]
    >([]);

    //
    // Get Fuel Stations
    useEffect(() => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);

        const body = new FormData();
        body.append('districtCode', district);
        body.append('countyCode', county);

        fetch(`${BASE_URL}/fetchstationsbycounty`, {
            method: 'POST',
            headers,
            body,
        })
            .then(a => a.json())
            .then(response => {
                const { message, data } = response;
                // console.log(data);
                if (message === 'success') {
                    const clean = data.map(d => {
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
    }, [district, county, accessToken]);

    //
    //
    return (
        <View style={styles.infoRow}>
            <Text style={styles.title}>Fuel Station</Text>

            <ModalSelector
                optionContainerStyle={{ backgroundColor: '#fff' }}
                cancelStyle={{ backgroundColor: '#fff' }}
                data={stations}
                initValue="Select fuel station"
                onChange={option => {
                    setFuelStation(option.key);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    infoRow: { marginBottom: 20, padding: 10 },

    title: { fontWeight: 'bold', color: '#000' },

    input: {
        borderBottomColor: '#000',
        borderBottomWidth: 0.5,
        padding: 0,
    },
});
