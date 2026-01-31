import { StyleSheet, Text, View, BackHandler, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Colors, CommomStyles, Fonts, Sizes } from "../../constants/styles";
import { useFocusEffect } from '@react-navigation/native';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const LoginScreen = () => {

    const navigation = useNavigation();

    const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
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

    function _spring() {
        setbackClickCount(1)
        setTimeout(() => {
            setbackClickCount(0)
        }, 1000)
    }

    const [backClickCount, setbackClickCount] = useState(0);
    const [fullNameOrEmail, setfullNameOrEmail] = useState('');
    const [password, setpassword] = useState('');

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}>
                    {userNameOrEmailInfo()}
                    {passwordInfo()}
                    {forgetPasswordText()}
                    {loginButton()}
                    {orText()}
                    {socialMediaOptions()}
                </ScrollView>
            </View>
            {dontAccountInfo()}
            {backClickCount == 1 ? exitInfo() : null}
        </View>
    )

    function exitInfo() {
        return (
            <View style={styles.exitWrapStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Press Back Once Again to Exit
                </Text>
            </View>
        )
    }

    function dontAccountInfo() {
        return (
            <Text style={{ textAlign: 'center', margin: Sizes.fixPadding * 2.0, ...Fonts.grayColor15Regular }}>
                Don’t have an account? { }
                <Text onPress={() => { navigation.push('auth/registerScreen') }} style={{ ...Fonts.blackColor15Medium }}>
                    Register Now
                </Text>
            </Text>
        )
    }

    function socialMediaOptions() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
                {connectWithGoogle()}
                {connectWithFacebook()}
                {connectWithApple()}
            </View>
        )
    }

    function connectWithApple() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={{ backgroundColor: Colors.blackColor, ...styles.socialMediaConnectedButtonStyle, }}
            >
                <Image
                    source={require('../../assets/images/icons/apple.png')}
                    style={{ width: 24.0, height: 24.0, resizeMode: 'contain' }}
                />
                <Text numberOfLines={1} style={{ ...Fonts.whiteColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
                    Continue with Apple
                </Text>
            </TouchableOpacity>
        )
    }

    function connectWithFacebook() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={{ backgroundColor: Colors.lightNavyBlueColor, ...styles.socialMediaConnectedButtonStyle, }}
            >
                <Image
                    source={require('../../assets/images/icons/facebook.png')}
                    style={{ width: 24.0, height: 24.0, resizeMode: 'contain' }}
                />
                <Text numberOfLines={1} style={{ ...Fonts.whiteColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
                    Continue with Facebook
                </Text>
            </TouchableOpacity>
        )
    }

    function connectWithGoogle() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={{ borderColor: Colors.blackColor, borderWidth: 1.0, ...styles.socialMediaConnectedButtonStyle, }}
            >
                <Image
                    source={require('../../assets/images/icons/google.png')}
                    style={{ width: 24.0, height: 24.0, resizeMode: 'contain' }}
                />
                <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
                    Continue with Google
                </Text>
            </TouchableOpacity>
        )
    }

    function orText() {
        return (
            <Text style={{ textAlign: 'center', ...Fonts.blackColor15Regular, }}>
                OR
            </Text>
        )
    }

    function loginButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.push('auth/registerScreen') }}
                style={{ ...CommomStyles.buttonStyle, marginVertical: Sizes.fixPadding * 2.8 }}
            >
                <Text style={{ ...Fonts.whiteColor19Medium }}>
                    Login
                </Text>
            </TouchableOpacity>
        )
    }

    function forgetPasswordText() {
        return (
            <Text style={styles.forgetPasswordTextStyle}>
                Forget Password?
            </Text>
        )
    }

    function passwordInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding * 2.8 }}>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    Password
                </Text>
                <TextInput
                    placeholder='Enter Password'
                    placeholderTextColor={Colors.grayColor}
                    value={password}
                    onChangeText={(newVal) => setpassword(newVal)}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    secureTextEntry={true}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function userNameOrEmailInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    Username or Email
                </Text>
                <TextInput
                    placeholder='Enter Username or Email'
                    placeholderTextColor={Colors.grayColor}
                    value={fullNameOrEmail}
                    onChangeText={(newVal) => setfullNameOrEmail(newVal)}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor20SemiBold }}>
                    Login
                </Text>
                <Text style={{ ...Fonts.blackColor15Regular }}>
                    Please Login to continue
                </Text>
            </View>
        )
    }
}

export default LoginScreen

const styles = StyleSheet.create({
    textFieldStyle: {
        ...Fonts.blackColor17Regular,
        borderBottomColor: Colors.blackColor,
        borderBottomWidth: 1.0,
        paddingTop:0,
        paddingBottom: Sizes.fixPadding
    },
    forgetPasswordTextStyle: {
        marginTop: Sizes.fixPadding - 8.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        textAlign: 'right',
        ...Fonts.blackColor15Regular,
        textDecorationLine: 'underline',
    },
    socialMediaConnectedButtonStyle: {
        borderRadius: Sizes.fixPadding,
        alignItems: 'center', justifyContent: 'center',
        padding: Sizes.fixPadding + 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding + 5.0,
        flexDirection: 'row',
    },
    exitWrapStyle: {
        backgroundColor: Colors.blackColor,
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding - 4.0,
    },
})