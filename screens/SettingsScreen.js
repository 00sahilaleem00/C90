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
import { Input } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";
import db from "../config.js";
import MyHeader from "../components/MyHeader";

export default class SettingsScreen extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      contactNumber: "",
      address: "",
      docID: "",
    };
  }

  getUserDetails = () => {
    var user = firebase.auth().currentUser;
    var email = user.email;
    db.collection("users")
      .where("Email_ID", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailID: data.Email_ID,
            firstName: data.First_Name,
            lastName: data.Last_Name,
            contactNumber: data.Mobile_Number,
            address: data.Address,
            docID: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection("users")
      .doc(this.state.docID)
      .update({
        First_Name: this.state.firstName,
        Last_Name: this.state.lastName,
        Mobile_Number: this.state.contactNumber,
        Address: this.state.address,
      })
      .then(() => {
        Alert.alert("User details successfully updated");
      });
  };

  componentDidMount = () => {
    this.getUserDetails();
  };

  render() {
    return (
      <View style={{ flex: 0.9 }}>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <TextInput
          placeholder={"First Name"}
          style={{
            width: "90%",
            height: RFValue(50),
            padding: RFValue(10),
            borderWidth: 1,
            borderRadius: 2,
            borderColor: "yellow",
            marginBottom: RFValue(20),
            marginLeft: RFValue(20),
          }}
          onChangeText={(text) => {
            this.setState({
              firstName: text,
            });
          }}
          value={this.state.firstName}
        />
        <TextInput
          placeholder={"Last Name"}
          style={{
            width: "90%",
            height: RFValue(50),
            padding: RFValue(10),
            borderWidth: 1,
            borderRadius: 2,
            borderColor: "yellow",
            marginBottom: RFValue(20),
            marginLeft: RFValue(20),
          }}
          onChangeText={(text) => {
            this.setState({
              lastName: text,
            });
          }}
          value={this.state.lastName}
        />
        <TextInput
          placeholder={"Contact"}
          style={{
            width: "90%",
            height: RFValue(50),
            padding: RFValue(10),
            borderWidth: 1,
            borderRadius: 2,
            borderColor: "yellow",
            marginBottom: RFValue(20),
            marginLeft: RFValue(20),
          }}
          keyboardType={"numeric"}
          maxLength={10}
          onChangeText={(text) => {
            this.setState({
              contactNumber: text,
            });
          }}
          value={this.state.contactNumber}
        />
        <TextInput
          placeholder={"Address"}
          style={{
            width: "90%",
            height: RFValue(50),
            padding: RFValue(10),
            borderWidth: 1,
            borderRadius: 2,
            borderColor: "yellow",
            marginBottom: RFValue(20),
            marginLeft: RFValue(20),
          }}
          multiline={true}
          onChangeText={(text) => {
            this.setState({
              address: text,
            });
          }}
          value={this.state.address}
        />
        <TouchableOpacity
          style={{
            alignItems: "center",
          }}
          onPress={() => {
            this.updateUserDetails();
          }}
        >
          <Text
            style={{
              fontSize: RFValue(23),
              fontWeight: "bold",
              color: "red",
            }}
          >
            Save the Details
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  inputBox: {
    margin: 10,
    borderWidth: 2,
  },
  modalContainer: {
    margin: 10,
  },
  keyboardAvoidingView: {
    margin: 10,
  },
  modalTitle: {
    backgroundColor: "red",
  },
});
