import React from "react";
import { Image } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import RequestScreen from "../screens/RequestScreen";
import RequestAcceptScreen from "../screens/RequestAcceptScreen";

export const RequestStackNavigator = createStackNavigator(
  {
    Request: {
      screen: RequestScreen,
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
  { initialRouteName: "Request" }
);
