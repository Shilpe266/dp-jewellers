import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes, Screen, CommomStyles } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const categoryWistItemsList = [
    {
        id: '1',
        jewellaryImage: require('../../assets/images/jewellery/jewellary1.png'),
        jewellaryName: 'Silver Plated Ring',
        amount: 100.00,
    },
    {
        id: '2',
        jewellaryImage: require('../../assets/images/jewellery/jewellary6.png'),
        jewellaryName: 'Diamond Ring',
        amount: 119.50,
    },
    {
        id: '3',
        jewellaryImage: require('../../assets/images/jewellery/jewellary12.png'),
        jewellaryName: 'Silver Ring',
        amount: 120.50,
    },
    {
        id: '4',
        jewellaryImage: require('../../assets/images/jewellery/jewellary10.png'),
        jewellaryName: 'Silver Grace Ring',
        amount: 125.25,
    },
    {
        id: '5',
        jewellaryImage: require('../../assets/images/jewellery/jewellary11.png'),
        jewellaryName: 'Silver Ring',
        amount: 124.50,
    },
    {
        id: '6',
        jewellaryImage: require('../../assets/images/jewellery/jewellary13.png'),
        jewellaryName: 'Platinum Plated Ring',
        amount: 149.50,
    },
    {
        id: '7',
        jewellaryImage: require('../../assets/images/jewellery/jewellary14.png'),
        jewellaryName: 'Diamond Ring',
        amount: 120.50,
    },
    {
        id: '8',
        jewellaryImage: require('../../assets/images/jewellery/jewellary1.png'),
        jewellaryName: 'Silver Ring',
        amount: 124.50,
    },
    {
        id: '9',
        jewellaryImage: require('../../assets/images/jewellery/jewellary6.png'),
        jewellaryName: 'Diamond Ring',
        amount: 119.50,
    },
    {
        id: '10',
        jewellaryImage: require('../../assets/images/jewellery/jewellary12.png'),
        jewellaryName: 'Diamond Ring',
        amount: 119.50,
    },
    {
        id: '11',
        jewellaryImage: require('../../assets/images/jewellery/jewellary10.png'),
        jewellaryName: 'Diamond Ring',
        amount: 119.50,
    },
    {
        id: '12',
        jewellaryImage: require('../../assets/images/jewellery/jewellary11.png'),
        jewellaryName: 'Diamond Ring',
        amount: 119.50,
    },
];

const CategoryWiseProductsScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {itemsListInfo()}
            </View>
        </View>
    )

    function itemsListInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.push('productDetail/productDetailScreen') }}
                style={{ flex: 1, marginBottom: Sizes.fixPadding * 2.0, ...styles.productWrapStyle, }}
            >
                <Image
                    source={item.jewellaryImage}
                    style={styles.productImageStyle}
                />
                <View style={{ backgroundColor: Colors.offWhiteColor, height: 1.0, }} />
                <View style={{ margin: Sizes.fixPadding + 5.0 }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16Regular, lineHeight: 22.0, }}>
                        {item.jewellaryName}
                    </Text>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold, lineHeight: 22.0, }}>
                        {`$`}{item.amount.toFixed(2)}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={categoryWistItemsList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding, paddingTop: Sizes.fixPadding * 2.0, }}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    function header() {
        return (
            <View style={CommomStyles.headerStyle}>
                <MaterialIcons name="keyboard-backspace" size={26} color={Colors.blackColor} onPress={() => { navigation.pop() }} />
                <Text style={{ ...Fonts.blackColor20SemiBold, marginLeft: Sizes.fixPadding * 2.0, }}>
                    Rings
                </Text>
            </View>
        )
    }
}

export default CategoryWiseProductsScreen

const styles = StyleSheet.create({
    productWrapStyle: {
        borderColor: Colors.offWhiteColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        maxWidth: (Screen.width / 2.0) - 30
    },
    productImageStyle: {
        alignSelf: 'center',
        width: Screen.width / 3.5,
        height: Screen.width / 3.5,
        resizeMode: 'contain',
        margin: Sizes.fixPadding + 5.0,
    },
})