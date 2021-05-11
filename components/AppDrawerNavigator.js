import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Icon } from "react-native-elements";
import SidebarMenu from "./SidebarMenu";
import { AppTabNavigator } from "./AppTabNavigator";
import DonateHistoryScreen from "../screens/DonateHistoryScreen";
import RequestHistoryScreen from "../screens/RequestHistoryScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="font-awesome" />,
      },
    },
    DonateHistory: {
      screen: DonateHistoryScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel: "Donate History",
      },
    },
    RequestHistory: {
      screen: RequestHistoryScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel: "Request History",
      },
    },
    Notifications: {
      screen: NotificationsScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
        drawerLabel: "Notifications",
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        drawerIcon: <Icon name="settings" type="font-awesome" />,
        drawerLabel: "Settings",
      },
    },
  },
  {
    contentComponent: SidebarMenu,
  },
  {
    initialRouteName: "Home",
  }
);
