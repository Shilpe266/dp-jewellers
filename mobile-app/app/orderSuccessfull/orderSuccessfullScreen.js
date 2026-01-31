import { Text, View, Image, BackHandler } from 'react-native'
import React, { useCallback } from 'react'
import { Colors, Fonts, Screen, Sizes } from '../../constants/styles'
import { useFocusEffect } from '@react-navigation/native'
import MyStatusBar from '../../components/myStatusBar'
import { useNavigation } from 'expo-router'

const OrderSuccessfullScreen = () => {

    const navigation = useNavigation();

    const backAction = () => {
        navigation.push('(tabs)');
        return true;
    };

    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => {
                backHandler.remove();
            };
        }, [backAction])
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {successInfo()}
            </View>
            {backToHomeText()}
        </View>
    )

    function backToHomeText() {
        return (
            <Text
                onPress={() => { navigation.push('(tabs)') }}
                style={{ alignSelf: 'center', margin: Sizes.fixPadding * 2.0, ...Fonts.primaryColor14Bold }}
            >
                BACK TO HOME
            </Text>
        )
    }

    function successInfo() {
        return (
            <>
                <Image
                    source={require('../../assets/images/orderConfirm.png')}
                    style={{ width: Screen.width / 2.7, height: Screen.width / 2.7, resizeMode: 'contain' }}
                />
                <Text style={{ ...Fonts.blackColor18Regular, marginTop: Sizes.fixPadding }}>
                    Order Placed Successfully!
                </Text>
            </>
        )
    }
}

export default OrderSuccessfullScreen