import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes, Screen } from '../../../constants/styles'
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const popularSearches = [
    'Bracelets', 'Charms', 'Rings', 'Body Jewelry', 'Anklets', 'Necklace'
];

const recentSearchesList = [
    {
        id: '1',
        search: 'Anklets',
    },
    {
        id: '2',
        search: 'Bracelets',
    }
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

const SearchScreen = () => {

    const navigation = useNavigation();

    const [search, setsearch] = useState('');
    const [recentSearches, setrecentSearches] = useState(recentSearchesList)

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <View style={{ flex: 1 }}>
                {searchBarWithFilterIcon()}
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    showsVerticalScrollIndicator={false}
                >
                    {popularSearchesInfo()}
                    {
                        recentSearches.length == 0
                            ?
                            null
                            :
                            recentSearchesInfo()
                    }
                    {recommendedInfo()}
                </ScrollView>
            </View>
        </View>
    )

    function recommendedInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => { navigation.push('productDetail/productDetailScreen') }}
                style={{ ...styles.recommendedItemWrapStyle, width: Screen.width / 2.4, }}
            >
                <Image
                    source={item.jewellaryImage}
                    style={styles.productImageStyle}
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

    function removeRecentSearch({ id }) {
        const copySearches = recentSearches;
        const newSearches = copySearches.filter((item) => item.id != id);
        setrecentSearches(newSearches)
    }

    function recentSearchesInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0, }}>
                <View style={styles.recentSearchesTitleWrapStyle}>
                    <Text numberOfLines={1} style={{ flex: 1, ...Fonts.primaryColor14Medium }}>
                        RECENT SEARCHES
                    </Text>
                    <Text onPress={() => { setrecentSearches([]) }} style={{ ...Fonts.grayColor14Medium }}>
                        Clear all
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: Sizes.fixPadding + 5.0, }}>
                    {
                        recentSearches.map((item, index) => (
                            <View
                                key={`${index}`}
                                style={{ ...styles.searchesWrapStyle, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Text style={{ ...Fonts.blackColor15Regular }}>
                                    {item.search}
                                </Text>
                                <MaterialIcons
                                    name="close"
                                    size={16}
                                    color={Colors.blackColor}
                                    style={{ marginLeft: Sizes.fixPadding - 5.0 }}
                                    onPress={() => { removeRecentSearch({ id: item.id }) }}
                                />
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }

    function popularSearchesInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 3.0 }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.primaryColor14Medium, marginBottom: Sizes.fixPadding }}>
                    POPULAR SEARCHES
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: Sizes.fixPadding + 5.0, }}>
                    {
                        popularSearches.map((item, index) => (
                            <View
                                key={`${index}`}
                                style={styles.searchesWrapStyle}
                            >
                                <Text style={{ ...Fonts.blackColor15Regular }}>
                                    {item}
                                </Text>
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }

    function searchBarWithFilterIcon() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding * 2.0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="search" size={18} color={Colors.blackColor} />
                    <TextInput
                        placeholder='Search'
                        placeholderTextColor={Colors.grayColor}
                        style={{ padding: 0, ...Fonts.blackColor16Regular, flex: 1, marginHorizontal: Sizes.fixPadding }}
                        value={search}
                        onChangeText={(newVal) => { setsearch(newVal) }}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                        numberOfLines={1}
                    />
                    <Feather name="sliders" size={18} color={Colors.blackColor} onPress={() => { navigation.push('filter/filterScreen') }} />
                </View>
                <View style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginTop: Sizes.fixPadding }} />
            </View>
        )
    }
}

export default SearchScreen

const styles = StyleSheet.create({
    searchesWrapStyle: {
        borderColor: Colors.offWhiteColor,
        marginHorizontal: Sizes.fixPadding - 5.0,
        marginBottom: Sizes.fixPadding,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    recentSearchesTitleWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding
    },
    productImageStyle: {
        alignSelf: 'center',
        width: Screen.width / 3.5,
        height: Screen.width / 3.5,
        resizeMode: 'contain',
        margin: Sizes.fixPadding + 5.0,
    },
    recommendedItemWrapStyle: {
        borderColor: Colors.offWhiteColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        maxWidth: (Screen.width / 2.0) - 30
    }
})