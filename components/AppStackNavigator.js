import React from "react";
import { Image } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import DonateScreen from "../screens/DonateScreen";
import RequestAcceptScreen from "../screens/RequestAcceptScreen";

export const AppStackNavigator = createStackNavigator(
  {
    Donate: {
      screen: DonateScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    RequestAccept: {
      screen: RequestAcceptScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  { initialRouteName: "Donate" }
);
