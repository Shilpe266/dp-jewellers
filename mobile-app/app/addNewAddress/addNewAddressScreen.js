import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes, CommomStyles } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const addressTypeList = ['Home', 'Office', 'Other'];

const AddNewAddressScreen = () => {

    const navigation = useNavigation();

    const [areaName, setareaName] = useState('');
    const [completeAddress, setcompleteAddress] = useState('');
    const [contactNumber, setcontactNumber] = useState('');
    const [addressType, setaddressType] = useState('');

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {areaNameInfo()}
                    {completeAddressInfo()}
                    {contactNumberInfo()}
                    {addressTypeInfo()}
                </ScrollView>
            </View>
            {addButton()}
        </View>
    )

    function addButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.pop() }}
                style={CommomStyles.buttonStyle}
            >
                <Text style={{ ...Fonts.whiteColor19Medium }}>
                    Add
                </Text>
            </TouchableOpacity>
        )
    }

    function addressTypeInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginVertical: Sizes.fixPadding * 2.8 }}>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    Address Type
                </Text>
                <SelectDropdown
                    data={addressTypeList}
                    onSelect={(selectedItem, index) => { setaddressType(selectedItem); }}
                    renderButton={(selectedItem, isOpened) => {
                        return (
                            <View style={styles.dropDownWrapStyle}>
                                <Text numberOfLines={1} style={{ ...selectedItem ? { ...Fonts.blackColor17Regular } : { ...Fonts.grayColor17Regular }, flex: 1 }}>
                                    {(selectedItem && selectedItem) || 'Select your address type'}
                                </Text>
                                <MaterialIcons name={isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color={Colors.blackColor} size={24} />
                            </View>
                        )
                    }}
                    dropdownStyle={{ backgroundColor: Colors.whiteColor }}
                    renderItem={(item) => {
                        return (
                            <View style={{ backgroundColor: Colors.whiteColor, paddingHorizontal: Sizes.fixPadding * 2.0, paddingVertical: Sizes.fixPadding }}>
                                <Text style={{ ...Fonts.blackColor17Regular }}>
                                    {item}
                                </Text>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }

    function contactNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    Contact Number
                </Text>
                <TextInput
                    placeholder='Contact Number'
                    placeholderTextColor={Colors.grayColor}
                    value={contactNumber}
                    onChangeText={(newVal) => setcontactNumber(newVal)}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    keyboardType="phone-pad"
                    numberOfLines={1}
                />
            </View>
        )
    }

    function completeAddressInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginVertical: Sizes.fixPadding * 2.8 }}>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    Complete Address
                </Text>
                <TextInput
                    placeholder='Complete Address'
                    placeholderTextColor={Colors.grayColor}
                    value={completeAddress}
                    onChangeText={(newVal) => setcompleteAddress(newVal)}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function areaNameInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.grayColor15Regular }}>
                    Area Name
                </Text>
                <TextInput
                    placeholder='Area Name'
                    placeholderTextColor={Colors.grayColor}
                    value={areaName}
                    onChangeText={(newVal) => setareaName(newVal)}
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
            <View style={CommomStyles.headerStyle}>
                <MaterialIcons name="keyboard-backspace" size={26} color={Colors.blackColor} onPress={() => { navigation.pop() }} />
                <Text numberOfLines={1} style={{ ...Fonts.blackColor20SemiBold, marginLeft: Sizes.fixPadding * 2.0, }}>
                    Add New Address
                </Text>
            </View>
        )
    }
}

export default AddNewAddressScreen

const styles = StyleSheet.create({
    textFieldStyle: {
        ...Fonts.blackColor17Regular,
        borderBottomColor: Colors.blackColor,
        borderBottomWidth: 1.0,
        padding: 0,
        paddingBottom: Sizes.fixPadding
    },
    dropDownWrapStyle: {
        borderBottomColor: Colors.blackColor,       
        paddingBottom: Sizes.fixPadding,
        borderBottomWidth: 1.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})