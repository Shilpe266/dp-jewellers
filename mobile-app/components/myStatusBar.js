import { StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/styles";

const MyStatusBar = () => {
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.whiteColor }}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.whiteColor}
        barStyle={"dark-content"}
      />
    </SafeAreaView>
  );
};

export default MyStatusBar;
