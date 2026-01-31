import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors, CommomStyles, Fonts, Screen, Sizes } from '../../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { useNavigation } from 'expo-router';

const favoriteItemsList = [
    {
        id: '1',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary1.png'),
        jewellaryName: 'Silver Plated Ring',
        amount: 100.00,
    },
    {
        id: '2',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary6.png'),
        jewellaryName: 'Diamond Ring',
        amount: 119.50,
    },
    {
        id: '3',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary12.png'),
        jewellaryName: 'Silver Ring',
        amount: 120.50,
    },
    {
        id: '4',
        jewellaryImage: require('../../../assets/images/jewellery/jewellary10.png'),
        jewellaryName: 'Silver Grace Ring',
        amount: 125.25,
    },
];

const FavoriteScreen = () => {

    const navigation = useNavigation();

    const [favorites, setfavorites] = useState(favoriteItemsList);
    const [showSnackBar, setShowSnackBar] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <View style={{ flex: 1 }}>
                {header()}
                {
                    favorites.length == 0
                        ?
                        noFavoriteItemsInfo()
                        :
                        favoritesItemsInfo()
                }
                {snackBar()}
            </View>
        </View>
    )

    function snackBar() {
        return (
            <Snackbar
                visible={showSnackBar}
                onDismiss={() => { setShowSnackBar(false) }}
                elevation={0.0}
                style={CommomStyles.snackBarStyle}
            >
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Removed From Favorite
                </Text>
            </Snackbar>
        )
    }

    function noFavoriteItemsInfo() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="favorite-border" size={26} color={Colors.lightGrayColor} />
                <Text style={{ ...Fonts.lightGrayColor18SemiBold, color: Colors.lightGrayColor, marginTop: Sizes.fixPadding - 5.0 }}>
                    Nothing in Favorite
                </Text>
            </View>
        )
    }

    function removeFormFavorite({ id }) {
        const copyFavorites = favorites;
        const newFavorites = copyFavorites.filter((item) => item.id !== id)
        setfavorites(newFavorites);
        setShowSnackBar(true);
    }

    function favoritesItemsInfo() {
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
                <MaterialIcons
                    name="favorite"
                    size={18}
                    color={Colors.blackColor}
                    style={{ position: 'absolute', right: 10.0, top: 10.0 }}
                    onPress={() => { removeFormFavorite({ id: item.id }) }}
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
                data={favorites}
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
            <View style={{ ...CommomStyles.headerStyle }}>
                <Text style={{ ...Fonts.blackColor20SemiBold }}>
                    Favourite
                </Text>
            </View>
        )
    }
}

export default FavoriteScreen

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