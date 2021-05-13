import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { DonateStackNavigator } from "./DonateStackNavigator";
import { RequestStackNavigator } from "./RequestStackNavigator";
import SubmissionScreen from "../screens/SubmissionScreen";

export const AppTabNavigator = createBottomTabNavigator({
  Donate: {
    screen: DonateStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/donateimage.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Donate",
    },
  },
  Request: {
    screen: RequestStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/requestimage.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Request",
    },
  },
  Submit: {
    screen: SubmissionScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/submitimage.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Submit",
    },
  },
});
