import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors, CommomStyles, Fonts, Screen, Sizes } from '../../../constants/styles';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const cartsList = [
    {
        id: '1',
        jewelleryImage: require('../../../assets/images/jewellery/jewellary1.png'),
        jewelleryName: 'Silver Plated Ring',
        size: 48,
        amount: 120.00,
        qty: 2,
    },
    {
        id: '2',
        jewelleryImage: require('../../../assets/images/jewellery/jewellary10.png'),
        jewelleryName: 'Silver Grace Ring',
        size: 46,
        amount: 125.25,
        qty: 1,
    },
    {
        id: '3',
        jewelleryImage: require('../../../assets/images/jewellery/jewellary3.png'),
        jewelleryName: 'Diamond Earrings',
        size: 'M',
        amount: 149.50,
        qty: 1,
    },
];

const CartScreen = () => {

    const navigation = useNavigation();

    const [cart, setcart] = useState(cartsList);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <View style={{ flex: 1 }}>
                {header()}
                {
                    cart.length == 0
                        ?
                        noCartItemsInfo()
                        :
                        cartItems()
                }

            </View>
        </View>
    )

    function noCartItemsInfo() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="shopping-outline" size={26} color={Colors.lightGrayColor} />
                <Text style={{ ...Fonts.lightGrayColor18SemiBold, color: Colors.lightGrayColor, marginTop: Sizes.fixPadding - 5.0 }}>
                    Cart is Empty
                </Text>
            </View>
        )
    }

    function cartItems() {
        return (
            <FlatList
                ListHeaderComponent={
                    <>
                        {cartItemsInfo()}
                        {totalInfo()}
                        {proceedToCheckoutButton()}
                    </>
                }
                showsVerticalScrollIndicator={false}
            />
        )
    }

    function proceedToCheckoutButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.push('selectAddress/selectAddressScreen') }}
                style={{ ...CommomStyles.buttonStyle, marginTop: Sizes.fixPadding * 2.0 }}
            >
                <Text style={{ ...Fonts.whiteColor19Medium }}>
                    Proceed to Checkout
                </Text>
            </TouchableOpacity>
        )
    }

    function totalInfo() {
        const subTotal = cart.reduce((acc, item) => acc + item.qty * item.amount, 0);
        const deliveryCharge = 0;
        const total = subTotal + deliveryCharge;
        return (
            <View style={styles.totalInfoWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding, }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16Regular, flex: 1, }}>
                        Sub Total
                    </Text>
                    <Text style={{ textAlign: 'right', ...Fonts.blackColor16Regular, marginTop: Sizes.fixPadding - 5.0 }}>
                        {`$`}{subTotal}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding, }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16Regular, flex: 1, }}>
                        Delivery
                    </Text>
                    <Text style={{ textAlign: 'right', ...Fonts.blackColor16Regular, }}>
                        Free
                    </Text>
                </View>
                <View style={styles.dashedLineStyle} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding, }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold, flex: 1, }}>
                        Total
                    </Text>
                    <Text style={{ textAlign: 'right', ...Fonts.blackColor16SemiBold, }}>
                        ${total}
                    </Text>
                </View>
            </View>
        )
    }

    function updateQty({ action, id }) {
        const copyCart = cart;
        const newCart = copyCart.map((item) => {
            if (item.id == id) {
                return { ...item, qty: action == 'add' ? item.qty + 1 : item.qty - 1 }
            }
            else {
                return item
            }
        })
        setcart(newCart);
    }

    function removeItem({ id }) {
        const copyCart = cart;
        const newCart = copyCart.filter((item) => item.id !== id)
        setcart(newCart);
    }

    function cartItemsInfo() {
        const renderItem = ({ item }) => (
            <View style={styles.cartItemWrapStyle}>
                <View style={{ flexDirection: 'row', flex: 1, }}>
                    <View style={styles.jewelleryImageWrapStyle}>
                        <Image
                            source={item.jewelleryImage}
                            style={{ width: '80%', resizeMode: 'contain', height: '80%', }}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 3.0, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Sizes.fixPadding - 13.0, }}>
                            <Text numberOfLines={1} style={{ flex: 1, ...Fonts.blackColor16Regular, marginRight: Sizes.fixPadding - 5.0 }}>
                                {item.jewelleryName}
                            </Text>
                            <Text style={{ ...Fonts.blackColor16Regular }}>
                                {`$`}{item.amount.toFixed(2)}
                            </Text>
                        </View>
                        <Text style={{ ...Fonts.grayColor14Regular, marginTop: -2.0 }}>
                            Size: 48
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Sizes.fixPadding - 4.0 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => { item.qty > 1 ? updateQty({ action: 'remove', id: item.id }) : null }}
                                    style={styles.addRemoveBoxStyle}
                                >
                                    <MaterialIcons name="remove" size={15} color={Colors.blackColor} />
                                </TouchableOpacity>
                                <Text style={{ ...Fonts.blackColor14Bold, marginHorizontal: Sizes.fixPadding + 5.0, }}>
                                    {item.qty}
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => { updateQty({ action: 'add', id: item.id }) }}
                                    style={styles.addRemoveBoxStyle}
                                >
                                    <MaterialIcons name="add" size={15} color={Colors.blackColor} />
                                </TouchableOpacity>
                            </View>
                            <Feather name="trash-2" size={18} color={Colors.blackColor} onPress={() => { removeItem({ id: item.id }) }} />
                        </View>
                    </View>
                </View>
            </View>
        )
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0, }}>
                <FlatList
                    data={cart}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={{ ...CommomStyles.headerStyle }}>
                <Text style={{ ...Fonts.blackColor20SemiBold }}>
                    Shopping Cart
                </Text>
            </View>
        )
    }
}

export default CartScreen

const styles = StyleSheet.create({
    addRemoveBoxStyle: {
        borderColor: Colors.offWhiteColor,
        borderWidth: 1.0,
        width: 26.0,
        height: 26.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    jewelleryImageWrapStyle: {
        width: Screen.width / 4.8,
        height: 80.0,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding,
    },
    cartItemWrapStyle: {
        flexDirection: 'row',
        borderColor: Colors.offWhiteColor,
        borderWidth: 1.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding
    },
    dashedLineStyle: {
        borderColor: Colors.offWhiteColor,
        borderStyle: 'dashed',
        borderWidth: 1.0,
        marginVertical: Sizes.fixPadding - 3.0,
    },
    totalInfoWrapStyle: {
        borderColor: Colors.offWhiteColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding - 5.0,
        paddingBottom: Sizes.fixPadding - 3.0
    }
})