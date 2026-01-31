import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes, Screen, CommomStyles } from '../../constants/styles'
import CollapsibleToolbar from 'react-native-collapsible-toolbar';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { FlatListSlider } from 'react-native-flatlist-slider';
import { Snackbar } from 'react-native-paper';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const productColors = [
    {
        id: '1',
        color: '#F7D000',
    },
    {
        id: '2',
        color: '#DCDCDE',
    },
];
const productSizes = ['46', '48', '50', '52', '56', '58', '60',];

const productDescriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscingelit. Volutpat eu tortor quis nunc lectus faucibus sit vitae auctor faucibus. Consectetur nec amet varius dui dui non et ante.',
    'Volutpat eu tortor quis nunc lectus faucibus sit vitae auctor faucibus. Consectetur nec amet varius dui dui non et ante.',
    'Lorem ipsum dolor sit amet, consectetur adipiscingelit. Volutpat eu tortor quis nunc lectus faucibus sit vitae auctor faucibus. Consectetur nec amet varius dui dui non et ante.',
    'Volutpat eu tortor quis nunc lectus faucibus sit vitae auctor faucibus. Consectetur nec amet varius dui dui non et ante.',
];

const ProductDetailScreen = () => {

    const navigation = useNavigation();

    const [selectedColorId, setselectedColorId] = useState(productColors[1].id);
    const [selectedSize, setselectedSize] = useState('');
    const [isFavorite, setisFavorite] = useState(false);
    const [showSnackBar, setshowSnackBar] = useState(false);

    const images = [
        { image: require('../../assets/images/jewellery/jewellary15.png') },
        { image: require('../../assets/images/jewellery/jewellary15.png') },
        { image: require('../../assets/images/jewellery/jewellary15.png') },
        { image: require('../../assets/images/jewellery/jewellary15.png') }
    ];

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                <CollapsibleToolbar
                    renderContent={pageContent}
                    renderNavBar={header}
                    renderToolBar={productImage}
                    collapsedNavBarBackgroundColor={Colors.whiteColor}
                    translucentStatusBar={false}
                    toolBarHeight={Screen.height / 2.8}
                    showsVerticalScrollIndicator={false}
                />
                {addToCartButton()}
                {snackBar()}
            </View>
        </View>
    )

    function snackBar() {
        return (
            <Snackbar
                visible={showSnackBar}
                onDismiss={() => { setshowSnackBar(false) }}
                elevation={0.0}
                style={CommomStyles.snackBarStyle}
            >
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    {isFavorite ? 'Added To Favorite' : 'Removed From Favorite'}
                </Text>
            </Snackbar>
        )
    }

    function addToCartButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => { navigation.navigate('(tabs)', { screen: 'cart/cartScreen' }) }}
                style={CommomStyles.buttonStyle}
            >
                <Text style={{ ...Fonts.whiteColor19Medium }}>
                    Add to Cart
                </Text>
            </TouchableOpacity>
        )
    }

    function productImage() {
        const ImageView = ({ item }) => {
            return (
                <View style={{ width: Screen.width }}>
                    <Image
                        source={item.image}
                        style={styles.productImageStyle}
                    />
                </View>
            );
        };
        return (
            <View style={{ height: Screen.height / 2.8 }}>
                <FlatListSlider
                    data={images}
                    height={Screen.height / 3.8}
                    indicatorContainerStyle={{ position: 'absolute', bottom: -40 }}
                    indicatorActiveColor={Colors.lightGrayColor}
                    indicatorInActiveColor={'#F0F0F0'}
                    indicatorStyle={{ ...styles.dotStyle }}
                    indicatorActiveWidth={10}
                    animation
                    onPress={item => { }}
                    autoscroll={true}
                    timer={4000}
                    local={true}
                    component={<ImageView />}
                />
            </View>
        )
    }

    function pageContent() {
        return (
            <View style={{ flex: 1, }}>
                {divider()}
                {productNameAndPriceInfo()}
                {productColorInfo()}
                {productSizeInfo()}
                {productDescriptionInfo()}
            </View>
        )
    }

    function productDescriptionInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium, marginBottom: Sizes.fixPadding }}>
                    Description
                </Text>
                {
                    productDescriptions.map((item, index) => (
                        <Text
                            key={`${index}`}
                            style={{ ...Fonts.grayColor15Regular, lineHeight: 23.0, marginBottom: Sizes.fixPadding - 5.0 }}
                        >
                            {item}
                        </Text>
                    ))
                }
            </View>
        )
    }

    function productSizeInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { setselectedSize(item) }}
                style={{
                    ...styles.productSizeBoxStyle,
                    backgroundColor: selectedSize == item ? Colors.primaryColor : 'transparent'
                }}>
                <Text style={selectedSize == item ? { ...Fonts.whiteColor15Regular } : { ...Fonts.grayColor15Regular, }}>
                    {item}
                </Text>
            </TouchableOpacity >
        )
        return (
            <View>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Medium, marginBottom: Sizes.fixPadding, }}>
                    Size
                </Text>
                <FlatList
                    data={productSizes}
                    keyExtrator={(item, index) => { `${item}${index}` }}
                    renderItem={renderItem}
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding + 3.0 }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function productColorInfo() {
        return (
            <View style={{ flexDirection: 'row', marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        Color
                    </Text>
                    <View style={styles.productColorsWrapStyle}>
                        {
                            productColors.map((item) => (
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => { setselectedColorId(item.id) }}
                                    key={`${item.id}`}
                                    style={{
                                        ...styles.productColorCircleStyle,
                                        backgroundColor: item.color,
                                        borderWidth: selectedColorId == item.id ? 1.5 : 0.0,
                                        elevation: selectedColorId == item.id ? 3.0 : 0.0,
                                        shadowOpacity: selectedColorId == item.id ? 0.2 : 0
                                    }}>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                    <MaterialIcons name="star" size={18} color={Colors.primaryColor} />
                    <Text style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding - 5.0 }}>
                        4.2 (350 reviews)
                    </Text>
                </View>
            </View>
        )
    }

    function productNameAndPriceInfo() {
        return (
            <View style={{ flexDirection: 'row', margin: Sizes.fixPadding * 2.0, }}>
                <View style={{ flex: 1, marginRight: Sizes.fixPadding }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor18Medium }}>
                        Attract Ring Round Silver Plated
                    </Text>
                    <Text style={{ ...Fonts.grayColor13Medium }}>
                        GIVA RINGS
                    </Text>
                </View>
                <Text style={{ ...Fonts.primaryColor18Bold }}>
                    $120.00
                </Text>
            </View>
        )
    }

    function divider() {
        return (
            <View style={{ backgroundColor: Colors.offWhiteColor, height: 1.0, }} />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="keyboard-backspace"
                    size={26}
                    color={Colors.blackColor}
                    onPress={() => { navigation.pop() }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name={isFavorite ? "favorite" : "favorite-border"}
                        size={23}
                        color={Colors.blackColor}
                        style={{ marginRight: Sizes.fixPadding * 2.0 }}
                        onPress={() => { setshowSnackBar(true), setisFavorite(!isFavorite) }}
                    />
                    <Feather name="share-2" size={20} color={Colors.blackColor} />
                </View>
            </View>
        )
    }
}

export default ProductDetailScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Platform.OS == 'ios' ? 0 : Sizes.fixPadding + 10.0
    },
    dotStyle: {
        marginHorizontal: Sizes.fixPadding - 5.0,
        width: 10.0,
        height: 10.0,
        borderRadius: 2.0,
    },
    productImageStyle: {
        width: Screen.width / 1.8,
        height: Screen.height / 3.8,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    productColorCircleStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 24.0,
        height: 24.0,
        borderRadius: 12.0,
        marginHorizontal: Sizes.fixPadding - 3.0,
        marginTop: Sizes.fixPadding - 5.0,
        borderColor: Colors.whiteColor,
        shadowColor: Colors.blackColor,
        shadowOffset: { width: 0, height: 0 }
    },
    productColorsWrapStyle: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: Sizes.fixPadding - 3.0
    },
    productSizeBoxStyle: {
        borderColor: Colors.offWhiteColor,
        borderWidth: 1.0,
        paddingHorizontal: Sizes.fixPadding - 2.0,
        paddingVertical: Sizes.fixPadding - 7.0,
        marginHorizontal: Sizes.fixPadding - 3.0,
        borderRadius: Sizes.fixPadding - 5.0,
    },
})