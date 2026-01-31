import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Colors, CommomStyles, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import RangeSlider from 'rn-range-slider';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const featuresList = [
    {
        id: '1',
        filter: 'Below 25mm',
        selected: false,
    },
    {
        id: '2',
        filter: 'Between 25-35mm',
        selected: false,
    },
    {
        id: '3',
        filter: '35mm and above',
        selected: true,
    },
    {
        id: '4',
        filter: 'Plugs',
        selected: false,
    },
    {
        id: '5',
        filter: 'Tunnels',
        selected: false,
    }
];

const brandsList = [
    {
        id: '1',
        brand: 'Sukkhi',
        selected: false,
    },
    {
        id: '2',
        brand: 'YouBella',
        selected: false,
    },
    {
        id: '3',
        brand: 'Peora',
        selected: true,
    },
    {
        id: '4',
        brand: 'Zaveri Pearls',
        selected: false,
    },
    {
        id: '5',
        brand: 'Zeneme',
        selected: false,
    },
    {
        id: '6',
        brand: 'Karatcart',
        selected: false,
    },
    {
        id: '7',
        brand: 'Mansiyaorange',
        selected: false,
    },
    {
        id: '8',
        brand: 'Lucky Jewellery',
        selected: false,
    },
];

const materialsList = [
    {
        id: '1',
        material: 'Brass',
        selected: false,
    },
    {
        id: '2',
        material: 'Yello Gold',
        selected: false,
    },
    {
        id: '3',
        material: 'Rose Gold',
        selected: true,
    },
    {
        id: '4',
        material: 'Silver',
        selected: false,
    },
    {
        id: '5',
        material: 'Platinum',
        selected: false,
    },
    {
        id: '6',
        material: 'White Gold',
        selected: false,
    },
];

const FilterScreen = () => {

    const navigation = useNavigation();

    const [features, setfeatures] = useState(featuresList);
    const [brands, setbrands] = useState(brandsList);
    const [materials, setmaterials] = useState(materialsList);
    const [lowRange, setlowRange] = useState(0);
    const [highRange, sethighRange] = useState(120);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {featuresInfo()}
                    {brandInfo()}
                    {materialInfo()}
                    {priceRangeInfo()}
                </ScrollView>
                {applyButton()}
            </View>
        </View>
    )

    function applyButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.pop() }}
                style={{ ...CommomStyles.buttonStyle }}
            >
                <Text style={{ ...Fonts.whiteColor19Medium }}>
                    Apply
                </Text>
            </TouchableOpacity>
        )
    }

    function priceRangeInfo() {
        const renderThumb = useCallback(() => <View style={styles.sliderThumbStyle} />, []);
        const renderRail = useCallback(() => <View style={{ backgroundColor: Colors.lightGrayColor, ...styles.sliderStyle }} />, []);
        const renderRailSelected = useCallback(() => <View style={{ backgroundColor: Colors.blackColor, ...styles.sliderStyle }} />, []);
        const renderNotch = useCallback(() => <View />, []);
        const handleValueChange = useCallback((low, high) => {
            setlowRange(low);
            sethighRange(high);
        }, []);
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.primaryColor14Medium }}>
                    PRICE RANGE
                </Text>
                <RangeSlider
                    style={{ marginVertical: Sizes.fixPadding }}
                    min={0}
                    max={200}
                    step={1}
                    high={highRange}
                    renderThumb={renderThumb}
                    renderRail={renderRail}
                    renderRailSelected={renderRailSelected}
                    renderNotch={renderNotch}
                    onValueChanged={handleValueChange}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor15Regular }}>
                        {`$`}{lowRange.toFixed(2)}
                    </Text>
                    <Text style={{ ...Fonts.grayColor15Regular }}>
                        {`$`}{highRange.toFixed(2)}
                    </Text>
                </View>
            </View>
        )
    }

    function changeMaterials({ id }) {
        const copyMaterials = materials;
        const newMaterials = copyMaterials.map((item) => {
            if (item.id == id) {
                return { ...item, selected: !item.selected }
            }
            else {
                return item
            }
        })
        setmaterials(newMaterials);
    }

    function materialInfo() {
        return (
            <View style={{ marginVertical: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.primaryColor14Medium, marginBottom: Sizes.fixPadding }}>
                    MATERIAL
                </Text>
                <View style={{ marginHorizontal: Sizes.fixPadding + 5.0, flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        materials.map((item) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { changeMaterials({ id: item.id }) }}
                                key={`${item.id}`}
                                style={{
                                    ...styles.searchesWrapStyle,
                                    backgroundColor: item.selected ? Colors.blackColor : 'transparent'
                                }}
                            >
                                <Text style={item.selected ? { ...Fonts.whiteColor15Regular } : { ...Fonts.blackColor15Regular }}>
                                    {item.material}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        )
    }

    function changeBrand({ id }) {
        const copyBrands = brands;
        const newBrands = copyBrands.map((item) => {
            if (item.id == id) {
                return { ...item, selected: !item.selected }
            }
            else {
                return item
            }
        })
        setbrands(newBrands);
    }

    function brandInfo() {
        return (
            <View>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.primaryColor14Medium, marginBottom: Sizes.fixPadding }}>
                    BRAND
                </Text>
                <View style={{ marginHorizontal: Sizes.fixPadding + 5.0, flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        brands.map((item) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { changeBrand({ id: item.id }) }}
                                key={`${item.id}`}
                                style={{
                                    ...styles.searchesWrapStyle,
                                    backgroundColor: item.selected ? Colors.blackColor : 'transparent'
                                }}
                            >
                                <Text style={item.selected ? { ...Fonts.whiteColor15Regular } : { ...Fonts.blackColor15Regular }}>
                                    {item.brand}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        )
    }

    function changeFeatures({ id }) {
        const copyFeatures = features;
        const newFeatures = copyFeatures.map((item) => {
            if (item.id == id) {
                return { ...item, selected: !item.selected }
            }
            else {
                return item
            }
        })
        setfeatures(newFeatures);
    }

    function featuresInfo() {
        return (
            <View style={{ marginVertical: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.primaryColor14Medium, marginBottom: Sizes.fixPadding }}>
                    FEATURES
                </Text>
                <View style={{ marginHorizontal: Sizes.fixPadding + 5.0, flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        features.map((item) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { changeFeatures({ id: item.id }) }}
                                key={`${item.id}`}
                                style={{
                                    ...styles.searchesWrapStyle,
                                    backgroundColor: item.selected ? Colors.blackColor : 'transparent'
                                }}
                            >
                                <Text style={item.selected ? { ...Fonts.whiteColor15Regular } : { ...Fonts.blackColor15Regular }}>
                                    {item.filter}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        )
    }

    function header() {
        return (
            <View style={CommomStyles.headerStyle}>
                <MaterialIcons name="keyboard-backspace" size={26} color={Colors.blackColor} onPress={() => { navigation.pop() }} />
                <Text style={{ ...Fonts.blackColor20SemiBold, marginLeft: Sizes.fixPadding * 2.0, }}>
                    Filters
                </Text>
            </View>
        )
    }
}

export default FilterScreen;

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
    sliderThumbStyle: {
        elevation: 2.0,
        borderWidth: 2.0,
        borderColor: Colors.whiteColor,
        width: 17.0,
        height: 17.0,
        borderRadius: 8.5,
        backgroundColor: Colors.blackColor
    },
    sliderStyle: {
        borderRadius: Sizes.fixPadding,
        width: '100%',
        height: 6.0,
    }
})