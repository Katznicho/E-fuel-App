import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { BASE_URL } from '../urls';

import Progress from 'react-native-progress/Bar';

export default function UploadRiderDetails({
    setRiderPhoto,
    setMotorcyclePhoto,
    setImagesUploading,
    imageTextOne = "Front ID Photo",
    imageTextTwo = "Back ID Photo",
    profileImagesUploading
}: any) {
    const { accessToken } = useSelector(state => state.user);

    const [one, setOne] = useState<string | null>(null);
    const [two, setTwo] = useState<string | null>(null);

    const [photoOne, setPhotoOne] = useState<string | null>(null);
    const [photoTwo, setPhotoTwo] = useState<string | null>(null);

    const screenWidth = useWindowDimensions().width;
    const [uploadProgress, setUploadProgress] = useState(0);

    // Open Phone Gallery
    function openGalleryOne() {
        ImageCropPicker.openPicker({
            cropping: true
        })
            .then(image => {
                setOne(RNFetchBlob.wrap(image.path));
                setPhotoOne(image.path);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function openGalleryTwo() {
        ImageCropPicker.openPicker({
            cropping: true
        })
            .then(image => {
                setTwo(RNFetchBlob.wrap(image.path));
                setPhotoTwo(image.path);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Open camera
    function takePhotoOne() {
        ImageCropPicker.openCamera({ width: 300, height: 400 })
            .then(image => {
                console.log('');
                console.log('');
                console.log('');
                console.log(image);
                // setImages(image);
                setOne(RNFetchBlob.wrap(image.path));
                setPhotoOne(image.path);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function takePhotoTwo() {
        ImageCropPicker.openCamera({ width: 300, height: 400 })
            .then(image => {
                console.log('');
                console.log('');
                console.log('');
                console.log(image);
                // setImages(image);
                setTwo(RNFetchBlob.wrap(image.path));
                setPhotoTwo(image.path);
            })
            .catch(error => {
                console.log(error);
            });
    }



    const deletePhotoOne = () => {
        Alert.alert(
            'Delete Photo',
            'Are you sure you want to delete this photo?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },

                {
                    text: 'OK',
                    onPress: () => {
                        setOne(null);
                        setPhotoOne(null);
                    },
                },
            ],
            { cancelable: false },
        );
    };

    const deletePhotoTwo = () => {
        Alert.alert(
            'Delete Photo',
            'Are you sure you want to delete this photo?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },

                {
                    text: 'OK',
                    onPress: () => {
                        setTwo(null);
                        setPhotoTwo(null);
                    },
                },
            ],
            { cancelable: false },
        );
    };



    const uploadImages = () => {
        if (one && two) {
            setImagesUploading(true);

            RNFetchBlob.fetch(
                'POST',
                `${BASE_URL}/profileUploads`,
                {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                [
                    {
                        name: 'riderPhoto',
                        filename: 'image.png',
                        data: one,
                    },
                    {
                        name: 'motorcyclePhoto',
                        filename: 'image.png',
                        data: two,
                    },
                ],
            )
                .uploadProgress((written, total) => {
                    // console.log('uploaded', written / total);
                    setUploadProgress(written / total);
                })
                .then(response => {
                    // console.log(JSON.parse(response.data));
                    const { message, data, errors } = JSON.parse(response.data);
                    // console.log(message);
                    if (errors) {
                        return console.log(errors);
                    }

                    if (message === 'failure') {
                        Alert.alert('Error', errors);
                        // setFrontId(data.image);
                    }

                    if (message === 'success') {
                        setRiderPhoto(data.riderPhoto);
                        setMotorcyclePhoto(data.motorcyclePhoto);

                        setUploadProgress(1);
                        
                        //setImagesUploading(false);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        else {
            Alert.alert(
                'Upload Photo',
                'Please upload both photos',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            console.log('OK Pressed');
                        },
                    },
                ],
                { cancelable: false },
            );

        }


    }


    //
    //
    return (
        <>
            <Text style={styles.title}>{imageTextOne}</Text>

            {!one ? (
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <MaterialIcons
                            name="photo-library"
                            size={40}
                            color="#1c478e"
                            onPress={openGalleryOne}
                        />
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <MaterialIcons
                            name="photo-camera"
                            size={40}
                            color="#1c478e"
                            onPress={takePhotoOne}
                        />
                    </View>
                </View>
            ) : (
                <TouchableOpacity onPress={deletePhotoOne}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 50,
                        width: 40,
                        position: 'absolute',
                        top: -10,
                        right: 10,
                    }}>
                        <Entypo
                            name="cross"
                            size={40}
                            color="red"
                        />
                    </View>
                    <Image
                        source={{ uri: photoOne }}
                        style={{ width: 200, height: 200, alignSelf: 'center' }}
                    />
                </TouchableOpacity>
            )}

            <Text style={styles.title}>{imageTextTwo}</Text>

            {!photoTwo ? (
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <MaterialIcons
                            name="photo-library"
                            size={40}
                            color="#1c478e"
                            onPress={openGalleryTwo}
                        />
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <MaterialIcons
                            name="photo-camera"
                            size={40}
                            color="#1c478e"
                            onPress={takePhotoTwo}
                        />
                    </View>
                </View>
            ) : (
                <TouchableOpacity onPress={deletePhotoTwo}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 50,
                        width: 40,
                        position: 'absolute',
                        top: -10,
                        right: 10,
                    }}>
                        <Entypo
                            name="cross"
                            size={40}
                            color="red"
                        />
                    </View>
                    <Image
                        source={{ uri: photoTwo }}
                        style={{ width: 200, height: 200, alignSelf: 'center' }}
                    />
                </TouchableOpacity>
            )}

            {
                profileImagesUploading ? (
                    <Progress
                        progress={uploadProgress}
                        width={screenWidth / 2 - 24}
                        color="#34D399"
                        borderWidth={0}
                        unfilledColor="grey"
                        height={1.5}
                        style={styles.progress}
                    />
                ) : (
                    <View
                     
                    >
                        <Button
                            title="Upload Images"
                            onPress={uploadImages}
                            style={{
                                marginTop: 20,
                                marginHorizontal: 40,
                                backgroundColor: '#1c478e',
                                borderRadius: 20,
                                alignSelf: 'center',
                                padding: 10,

                            }}

                        />

                    </View>

                )

            }


        </>
    );
}

const styles = StyleSheet.create({
    title: { fontWeight: 'bold', color: '#000', textAlign: 'center' },

    progress: { marginTop: 10, alignSelf: 'center' },
});
