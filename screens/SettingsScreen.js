import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Header,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Card } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config.js";
import firebase from "firebase";

//This is analogous to SettingsScreen
export default class SettingsScreen extends Component {
  render() {
    return (
      <View style={{ marginTop: 100 }}>
        <Text>SettingsScreen</Text>
      </View>
    );
  }
}
