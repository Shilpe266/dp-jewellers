import { StyleSheet, Text, View, Modal, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors, CommomStyles, Fonts, Screen, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import { OtpInput } from 'react-native-otp-entry';
import MyStatusBar from '../../components/myStatusBar';
import { Circle } from 'react-native-animated-spinkit';
import { useNavigation } from 'expo-router';

const VerificationScreen = () => {

    const navigation = useNavigation();

    const [otpInput, setotpInput] = useState('');
    const [showLoadingDialog, setshowLoadingDialog] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {backArrow()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}>
                    {header()}
                    {otpInfo()}
                    {continueButton()}
                </ScrollView>
                {loadingDialog()}
            </View>
        </View>
    )

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setshowLoadingDialog(true)
                    setTimeout(() => {
                        setshowLoadingDialog(false)
                        navigation.push('(tabs)')
                    }, 2000);
                }}
                style={{ ...CommomStyles.buttonStyle, marginTop: Sizes.fixPadding * 4.3, }}
            >
                <Text style={{ ...Fonts.whiteColor19Medium }}>
                    Continue
                </Text>
            </TouchableOpacity>
        )
    }

    function loadingDialog() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLoadingDialog}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={styles.dialogStyle}
                        >
                            <View style={{ alignItems: 'center' }}>
                                <Circle
                                    size={45}
                                    color={Colors.blackColor}
                                />
                                <Text style={{ textAlign: 'center', ...Fonts.grayColor15Regular, marginTop: Sizes.fixPadding + 5.0 }}>
                                    Please wait...
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function otpInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }} >
                <OtpInput
                    numberOfDigits={4}
                    focusColor={Colors.primaryColor}
                    onTextChange={text => {
                        setotpInput(text)
                        if (text.length == 4) {
                            setshowLoadingDialog(true)
                            setTimeout(() => {
                                setshowLoadingDialog(false)
                                navigation.push('(tabs)')
                            }, 2000);
                        }
                    }}
                    theme={{
                        inputsContainerStyle: { justifyContent: 'space-between' },
                        pinCodeContainerStyle: { ...styles.textFieldStyle },
                        pinCodeTextStyle: { ...Fonts.blackColor17Regular },
                    }}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor20SemiBold }}>
                    Verification
                </Text>
                <Text style={{ ...Fonts.blackColor15Regular }}>
                    Enter verification code. We just sent you on{`\n`}+79 147 825 698
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

export default VerificationScreen

const styles = StyleSheet.create({
    backArrowWrapper: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding,
        alignSelf: 'flex-start',
    },
    dialogStyle: {
        overflow: 'hidden',
        width: '85%',
        borderRadius: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        alignSelf: 'center',
        padding: Sizes.fixPadding * 2.8,
    },
    textFieldStyle: {
        borderWidth: 0.0,
        overflow: 'hidden',
        borderBottomWidth: 1.0,
        borderBottomColor: Colors.blackColor,
        width: Screen.width / 5,
        height: Screen.width / 8.5
    }
})