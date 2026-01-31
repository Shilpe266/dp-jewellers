import { SafeAreaView, StatusBar } from "react-native";
import React from "react";
import { Colors } from "../constants/styles";

const MyStatusBar = () => {
  return (
    <SafeAreaView style={{ backgroundColor: Colors.whiteColor }}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.whiteColor}
        barStyle={"dark-content"}
      />
    </SafeAreaView>
  );
};

export default MyStatusBar;