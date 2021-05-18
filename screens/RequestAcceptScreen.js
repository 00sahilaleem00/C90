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

//This is analogous to ReceiverDetailsScreen
export default class RequestAcceptScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      donorID: this.props.navigation.getParam("details")["User_ID"],
      name: this.props.navigation.getParam("details")["Name"],
      transactionID:
        this.props.navigation.getParam("details")["Transaction_ID"],
      description: this.props.navigation.getParam("details")["Description"],
      donorName: "",
      donorContact: "",
      donorAddress: "",
    };
  }

  componentDidMount = () => {
    this.getDonorDetails();
  };

  getDonorDetails = () => {
    db.collection("users")
      .where("Email_ID", "==", this.state.donorID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().First_Name + " " + doc.data().Last_Name,
            donorContact: doc.data().Mobile_Number,
            donorAddress: doc.data().Address,
          });
        });
      });
  };

  updateStatus = () => {
    db.collection("transactions").add({
      Name: this.state.name,
      Transaction_ID: this.state.transactionID,
      Requester_ID: this.state.userID,
      Donor_ID: this.state.donorID,
      Status: "Requester Interested",
      Type: "Donation",
    });
  };

  addNotification = () => {
    var message = this.state.userID + " has shown interest in requesting";
    db.collection("notifications").add({
      Receiver_ID: this.state.donorID,
      Sender_ID: this.state.userID,
      Transaction_ID: this.state.transactionID,
      Name: this.state.name,
      Date: firebase.firestore.FieldValue.serverTimestamp(),
      Status: "Unread",
      Message: message,
    });
  };

  render() {
    return (
      <View style={{ marginTop: 100 }}>
        <View style={{ flex: 0.7 }}>
          <Text style={{ fontWeight: "500", fontSize: RFValue(30) }}>
            Donor Information
          </Text>
          <Text
            style={{
              fontWeight: "400",
              fontSize: RFValue(20),
              marginTop: RFValue(30),
            }}
          >
            Name: {this.state.donorName}
          </Text>
          <Text>Contact: {this.state.donorContact}</Text>
          <Text>Address: {this.state.donorAddress}</Text>
          <View
            style={{
              flex: 0.6,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 200,
            }}
          >
            <Text>ID of Donor: {this.state.donorID}</Text>
            <Text>Name: {this.state.name}</Text>
            <Text>Description: {this.state.description}</Text>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {this.state.donorID !== this.state.userID ? (
            <TouchableOpacity
              style={{ margin: 100, marginTop: 500 }}
              onPress={() => {
                this.updateStatus();
                this.addNotification();
                this.props.navigation.navigate("Request");
              }}
            >
              <Text>I want to Request</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
