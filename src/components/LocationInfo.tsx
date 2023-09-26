import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../urls';

interface Props {
    locationInfo: {
        district: string;
        county: string;
        subCounty: string;
        parish: string;
        village: string;
    };
    setLocationInfo: void;
}

export default function LocationInfo({ locationInfo, setLocationInfo }: Props) {
    const { accessToken } = useSelector(state => state.user);

    const [districts, setDistricts] = useState<
        {
            key: number;
            label: string;
        }[]
    >([]);

    const [counties, setCounties] = useState<
        {
            key: number;
            label: string;
        }[]
    >([]);

    const [subCounties, setSubCounties] = useState<
        {
            key: number;
            label: string;
        }[]
    >([]);

    const [parishes, setParishes] = useState<
        {
            key: number;
            label: string;
        }[]
    >([]);

    const [villages, setVillages] = useState<
        {
            key: number;
            label: string;
        }[]
    >([]);

    //
    // Get Districts

    useEffect(() => {

          console.log(accessToken);
          console.log("====================================")
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);

        fetch(`${BASE_URL}/districts`, { headers })
            .then(a => a.json())
            .then(response => {
                console.log("=========fetching districts===================")
                 console.log(response);
                 console.log("=========fetching districts===================")
                const { message, data } = response;
                if (message === 'success') {
                    const clean = data.map((d: { districtCode: any; districtName: any; }) => {
                        return { key: d.districtCode, label: d.districtName };
                    });
                    setDistricts(clean);
                }
            })
            .catch(error => {
                 console.log("========Error fetching districts====================")
                console.log(JSON.stringify(error));
                console.log("=================================")
            });
    }, []);

    //
    // Get Counties
    useEffect(() => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);

        const body = new FormData();
        body.append('districtCode', locationInfo.district);

        fetch(`${BASE_URL}/counties`, { method: 'POST', headers, body })
            .then(a => a.json())
            .then(response => {
                const { message, data } = response;
                // console.log(data);
                if (message === 'success') {
                    const clean = data.map((d: { countyCode: any; countyName: any; }) => {
                        return { key: d.countyCode, label: d.countyName };
                    });
                    setCounties(clean);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [locationInfo.district]);

    //
    // Get Sub Counties
    useEffect(() => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);

        const body = new FormData();
        body.append('districtCode', locationInfo.district);
        body.append('countyCode', locationInfo.county);

        fetch(`${BASE_URL}/subcounties`, { method: 'POST', headers, body })
            .then(a => a.json())
            .then(response => {
                const { message, data } = response;
                // console.log(data);
                if (message === 'success') {
                    const clean = data.map(d => {
                        return { key: d.subCountyCode, label: d.subCountyName };
                    });
                    setSubCounties(clean);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [locationInfo.district, locationInfo.county]);

    //
    // Get Parish
    useEffect(() => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);

        const body = new FormData();
        body.append('districtCode', locationInfo.district);
        body.append('countyCode', locationInfo.county);
        body.append('subCountyCode', locationInfo.subCounty);

        fetch(`${BASE_URL}/parishes`, { method: 'POST', headers, body })
            .then(a => a.json())
            .then(response => {
                const { message, data } = response;
                // console.log(data);
                if (message === 'success') {
                    const clean = data.map(d => {
                        return { key: d.parishCode, label: d.parishName };
                    });
                    setParishes(clean);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [locationInfo.district, locationInfo.county, locationInfo.subCounty]);

    //
    // Get Villages
    useEffect(() => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('ContentType', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);

        const body = new FormData();
        body.append('districtCode', locationInfo.district);
        body.append('countyCode', locationInfo.county);
        body.append('subCountyCode', locationInfo.subCounty);
        body.append('parishCode', locationInfo.parish);

        fetch(`${BASE_URL}/villages`, { method: 'POST', headers, body })
            .then(a => a.json())
            .then(response => {
                const { message, data } = response;
                // console.log(data);
                if (message === 'success') {
                    const clean = data.map(d => {
                        return { key: d.villageCode, label: d.villageName };
                    });
                    setVillages(clean);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [
        locationInfo.district,
        locationInfo.county,
        locationInfo.subCounty,
        locationInfo.parish,
    ]);

    //
    //
    return (
        <>
            <View style={styles.infoRow}>
                <Text style={styles.title}>Station District</Text>
                <ModalSelector
                    optionContainerStyle={{ backgroundColor: '#fff' }}
                    cancelStyle={{ backgroundColor: '#fff' }}
                    data={districts}
                    initValue="Select District"
                    onChange={option => {
                        setLocationInfo({
                            ...locationInfo,
                            district: option.key,
                        });
                    }}
                />
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.title}>Station County</Text>

                <ModalSelector
                    optionContainerStyle={{ backgroundColor: '#fff' }}
                    cancelStyle={{ backgroundColor: '#fff' }}
                    data={counties}
                    initValue="Select county"
                    onChange={option => {
                        setLocationInfo({
                            ...locationInfo,
                            county: option.key,
                        });
                    }}
                />
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.title}>Station Sub County</Text>

                <ModalSelector
                    optionContainerStyle={{ backgroundColor: '#fff' }}
                    cancelStyle={{ backgroundColor: '#fff' }}
                    data={subCounties}
                    initValue="Select sub county"
                    onChange={option => {
                        setLocationInfo({
                            ...locationInfo,
                            subCounty: option.key,
                        });
                    }}
                />
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.title}>Station Parish</Text>

                <ModalSelector
                    optionContainerStyle={{ backgroundColor: '#fff' }}
                    cancelStyle={{ backgroundColor: '#fff' }}
                    data={parishes}
                    initValue="Select parish"
                    onChange={option => {
                        setLocationInfo({
                            ...locationInfo,
                            parish: option.key,
                        });
                    }}
                />
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.title}>Station Village</Text>

                <ModalSelector
                    optionContainerStyle={{ backgroundColor: '#fff' }}
                    cancelStyle={{ backgroundColor: '#fff' }}
                    data={villages}
                    initValue="Select village"
                    onChange={option => {
                        setLocationInfo({
                            ...locationInfo,
                            village: option.key,
                        });
                    }}
                />
            </View>
        </>
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
