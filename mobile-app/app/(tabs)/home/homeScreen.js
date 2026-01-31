import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes, Screen } from '../../../constants/styles'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const bannersList = [
    {
        id: '1',
        bannerHeader: 'Buy Your Elegant\nJewelry',
        bannerImage: require('../../../assets/images/banner/banner.png')
    },
    {
        id: '2',
        bannerHeader: 'Buy Your Elegant\nJewelry',
        bannerImage: require('../../../assets/images/banner/banner.png')
    },
];

const categoryList = [
    {
        id: '1',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary1.png'),
        jewellaryName: 'Rings',
    },
    {
        id: '2',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary2.png'),
        jewellaryName: 'Bracelets',
    },
    {
        id: '3',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary3.png'),
        jewellaryName: 'Earrings ',
    },
    {
        id: '4',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary4.png'),
        jewellaryName: 'Necklace',
    },
    {
        id: '5',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary1.png'),
        jewellaryName: 'Rings',
    },
    {
        id: '6',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary2.png'),
        jewellaryName: 'Bracelets',
    },
    {
        id: '7',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary3.png'),
        jewellaryName: 'Earrings ',
    },
    {
        id: '8',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary4.png'),
        jewellaryName: 'Necklace',
    },
];

const recommendedList = [
    {
        id: '1',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary1.png'),
        jewellaryName: 'Silver Plated Ring',
        amount: 100.00,
    },
    {
        id: '2',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary5.png'),
        jewellaryName: 'Diamond Earrings',
        amount: 149.50,
    },
    {
        id: '3',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary6.png'),
        jewellaryName: 'Sunshine Ring',
        amount: 299.50,
    },
    {
        id: '4',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary7.png'),
        jewellaryName: 'Diamond Bracelet',
        amount: 249.50,
    },
    {
        id: '5',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary8.png'),
        jewellaryName: 'Silver Earrings',
        amount: 120.00,
    },
    {
        id: '6',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary9.png'),
        jewellaryName: 'Necklace',
        amount: 150.50,
    },
];

const popularItemList = [
    {
        id: '1',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary6.png'),
        jewellaryName: 'Sunshine Ring',
        amount: 299.50,
    },
    {
        id: '2',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary4.png'),
        jewellaryName: 'Necklace',
        amount: 150.50,
    },
    {
        id: '3',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary7.png'),
        jewellaryName: 'Bracelet',
        amount: 199.50,
    },
    {
        id: '4',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary10.png'),
        jewellaryName: 'Silver Ring',
        amount: 100.00,
    },
    {
        id: '5',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary3.png'),
        jewellaryName: 'Silver Earrings',
        amount: 120.00,
    },
    {
        id: '6',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary9.png'),
        jewellaryName: 'Necklace',
        amount: 150.50,
    },
    {
        id: '7',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary2.png'),
        jewellaryName: 'Bracelet',
        amount: 199.50,
    },
    {
        id: '8',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary11.png'),
        jewellaryName: 'Silver Ring',
        amount: 100.00,
    },
];

const HomeScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <View style={{ flex: 1 }}>
                {header()}
                <FlatList
                    ListHeaderComponent={
                        <>
                            {banners()}
                            {categoryInfo()}
                            {recommendedInfo()}
                            {popularInfo()}
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )

    function popularInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => { navigation.push('productDetail/productDetailScreen') }}
                style={{ flex: 1, marginBottom: Sizes.fixPadding * 2.0, ...styles.recommendedAndPopularItemWrapStyle, }}
            >
                <Image
                    source={item.jewellaryImage}
                    style={styles.recommendedAndPopularImageStyle}
                />
                <View style={{ backgroundColor: Colors.offWhiteColor, height: 1.0, }} />
                <View style={{ margin: Sizes.fixPadding + 5.0 }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16Regular }}>
                        {item.jewellaryName}
                    </Text>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
                        {`$`}{item.amount.toFixed(2)}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginTop: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.blackColor18SemiBold, marginBottom: Sizes.fixPadding + 3.0 }}>
                    Popular
                </Text>
                <FlatList
                    data={popularItemList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    numColumns={2}
                    scrollEnabled={false}
                />
            </View>
        )
    }

    function recommendedInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => { navigation.push('productDetail/productDetailScreen') }}
                style={{ ...styles.recommendedAndPopularItemWrapStyle, width: Screen.width / 2.4, }}
            >
                <Image
                    source={item.jewellaryImage}
                    style={styles.recommendedAndPopularImageStyle}
                />
                <View style={{ backgroundColor: Colors.offWhiteColor, height: 1.0, }} />
                <View style={{ margin: Sizes.fixPadding + 5.0 }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16Regular }}>
                        {item.jewellaryName}
                    </Text>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
                        {`$`}{item.amount.toFixed(2)}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginVertical: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor18SemiBold }}>
                    Recommended for You
                </Text>
                <FlatList
                    data={recommendedList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding, paddingTop: Sizes.fixPadding + 3.0 }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function categoryInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => { navigation.push('categoryWiseProducts/categoryWiseProductsScreen') }}
                style={styles.categoryWiseItemWrapStyle}
            >
                <Image
                    source={item.jewellaryImage}
                    style={{ width: Screen.width / 4.5, height: Screen.width / 4.5, resizeMode: 'contain' }}
                />
                <Text numberOfLines={1} style={styles.categoryWiseJewellaryTextStyle}>
                    {item.jewellaryName}
                </Text>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginVertical: Sizes.fixPadding }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor18SemiBold }}>
                    Category
                </Text>
                <FlatList
                    data={categoryList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding, paddingTop: Sizes.fixPadding + 3.0 }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function banners() {
        const renderItem = ({ item }) => (
            <ImageBackground
                source={item.bannerImage}
                style={{ width: Screen.width - 60, height: 155.0, marginHorizontal: Sizes.fixPadding, }}
                borderRadius={Sizes.fixPadding}
            >
                <View style={{ backgroundColor: 'rgba(255,255,255,0.20)', flex: 1, padding: Sizes.fixPadding * 2.0 }}>
                    <Text
                        numberOfLines={2}
                        style={{ ...Fonts.whiteColor22Bold, lineHeight: 26.0, paddingTop: Sizes.fixPadding - 5.0 }}
                    >
                        {item.bannerHeader}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { }}
                        style={styles.getNowButtonStyle}
                    >
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            Get Now
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
        return (
            <View style={{ marginVertical: Sizes.fixPadding * 2.0, }}>
                <FlatList
                    data={bannersList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding, }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialCommunityIcons name="sort-variant" size={22} color={Colors.blackColor} onPress={() => { }} />
                <Text
                    numberOfLines={1}
                    style={styles.headerTextStyle}
                >
                    Featured
                </Text>
                <Feather name="search" size={19} color={Colors.blackColor} onPress={() => { navigation.navigate('search/searchScreen') }} />
            </View>
        )
    }
}

export default HomeScreen

const styles = StyleSheet.create({
    headerTextStyle: {
        marginHorizontal: Sizes.fixPadding + 5.0,
        flex: 1,
        textAlign: 'center',
        ...Fonts.blackColor20SemiBold
    },
    headerWrapStyle: {
        flexDirection: 'row',
        padding: Sizes.fixPadding * 2.0,
        alignItems: 'center',
        borderBottomColor: Colors.offWhiteColor,
        borderBottomWidth: 1.0
    },
    getNowButtonStyle: {
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignSelf: 'flex-start',
        marginTop: Sizes.fixPadding * 1.5,
    },
    categoryWiseItemWrapStyle: {
        borderColor: Colors.offWhiteColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding,
        alignItems: 'center',
    },
    categoryWiseJewellaryTextStyle: {
        maxWidth: Screen.width / 4.5,
        textAlign: 'center',
        ...Fonts.blackColor16Medium,
        marginTop: Sizes.fixPadding
    },
    recommendedAndPopularImageStyle: {
        alignSelf: 'center',
        width: Screen.width / 3.5,
        height: Screen.width / 3.5,
        resizeMode: 'contain',
        margin: Sizes.fixPadding + 5.0,
    },
    recommendedAndPopularItemWrapStyle: {
        borderColor: Colors.offWhiteColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        maxWidth: (Screen.width / 2.0) - 30
    }
})