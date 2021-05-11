import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { AppDrawerNavigator } from "./components/AppDrawerNavigator";

import RegisterScreen from "./screens/RegisterScreen.js";

export default function App() {
  return <AppContainer />;
}

const SwitchNavigator = createSwitchNavigator({
  RegisterScreen: { screen: RegisterScreen },
  Drawer: { screen: AppDrawerNavigator },
});

const AppContainer = createAppContainer(SwitchNavigator);
