import React from "react";
import { Image } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import DonateScreen from "../screens/DonateScreen";
import DonateAcceptScreen from "../screens/DonateAcceptScreen";

export const DonateStackNavigator = createStackNavigator(
  {
    Donate: {
      screen: DonateScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    DonateAccept: {
      screen: DonateAcceptScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  { initialRouteName: "Donate" }
);
