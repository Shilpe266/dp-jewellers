import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors, CommomStyles, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const RegisterScreen = () => {

    const navigation = useNavigation();

    const [fullName, setfullName] = useState('');
    const [email, setemail] = useState('');
    const [mobileNumber, setmobileNumber] = useState('');
    const [password, setpassword] = useState('');

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {backArrow()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}>
                    {header()}
                    {fullNameInfo()}
                    {emailInfo()}
                    {mobileNumberInfo()}
                    {passwordInfo()}
                    {termsAndConditionInfo()}
                    {registerButton()}
                    {orText()}
                    {socialMediaOptions()}
                </ScrollView>
            </View>
            {alreadyAccountInfo()}
        </View>
    )

    function alreadyAccountInfo() {
        return (
            <Text style={{ textAlign: 'center', margin: Sizes.fixPadding * 2.0, ...Fonts.grayColor15Regular }}>
                Already have an account? { }
                <Text onPress={() => { navigation.push('auth/loginScreen') }} style={{ ...Fonts.blackColor15Medium }}>
                    Login Now
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

    function registerButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.push('auth/verificationScreen') }}
                style={{ ...CommomStyles.buttonStyle, marginVertical: Sizes.fixPadding * 2.8 }}
            >
                <Text style={{ ...Fonts.whiteColor19Medium }}>
                    Register
                </Text>
            </TouchableOpacity>
        )
    }

    function termsAndConditionInfo() {
        return (
            <Text style={{ marginTop: Sizes.fixPadding - 8.0, marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.grayColor15Regular, }}>
                By creating account or logging your agree to our { }
                <Text style={{ ...Fonts.blackColor15Medium }}>
                    Terms & Conditions
                </Text>
                { } and { }
                <Text style={{ ...Fonts.blackColor15Medium }}>
                    Privacy Policy.
                </Text>
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

    function mobileNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    Mobile Number
                </Text>
                <TextInput
                    placeholder='Enter Mobile Number'
                    placeholderTextColor={Colors.grayColor}
                    value={mobileNumber}
                    onChangeText={(newVal) => setmobileNumber(newVal)}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    keyboardType="phone-pad"
                    numberOfLines={1}
                />
            </View>
        )
    }

    function emailInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginVertical: Sizes.fixPadding * 2.8 }}>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    Email Address
                </Text>
                <TextInput
                    placeholder='Enter Email Address'
                    placeholderTextColor={Colors.grayColor}
                    value={email}
                    onChangeText={(newVal) => setemail(newVal)}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    keyboardType="email-address"
                    numberOfLines={1}
                />
            </View>
        )
    }

    function fullNameInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    Full Name
                </Text>
                <TextInput
                    placeholder='Enter Full Name'
                    placeholderTextColor={Colors.grayColor}
                    value={fullName}
                    onChangeText={(newVal) => setfullName(newVal)}
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
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor20SemiBold }}>
                    Register
                </Text>
                <Text style={{ ...Fonts.blackColor15Regular }}>
                    Please Register using your personal details to contiue.
                </Text>
            </View>
        )
    }

    function backArrow() {
        return (
            <MaterialIcons
                name="keyboard-backspace"
                size={26}
                color={Colors.blackColor}
                onPress={() => { navigation.pop() }}
                style={styles.backArrowWrapper}
            />
        )
    }
}

export default RegisterScreen

const styles = StyleSheet.create({
    backArrowWrapper: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding,
        alignSelf: 'flex-start',
    },
    textFieldStyle: {
        ...Fonts.blackColor17Regular,
        borderBottomColor: Colors.blackColor,
        borderBottomWidth: 1.0,
        paddingTop:0,
        paddingBottom: Sizes.fixPadding
    },
    socialMediaConnectedButtonStyle: {
        borderRadius: Sizes.fixPadding,
        alignItems: 'center', justifyContent: 'center',
        padding: Sizes.fixPadding + 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding + 5.0,
        flexDirection: 'row',
    }
})