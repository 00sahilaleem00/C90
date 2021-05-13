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

//This is analogous to ReceiverDetailsScreen, but for donations
export default class DonateAcceptScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      requesterID: this.props.navigation.getParam("details")["User_ID"],
      name: this.props.navigation.getParam("details")["Name"],
      transactionID:
        this.props.navigation.getParam("details")["Transaction_ID"],
      description: this.props.navigation.getParam("details")["Description"],
      requesterName: "",
      requesterContact: "",
      requesterAddress: "",
    };
  }

  componentDidMount = () => {
    this.getRequesterDetails();
  };

  getRequesterDetails = () => {
    db.collection("users")
      .where("Email_ID", "==", this.state.requesterID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            requesterName: doc.data().First_Name + " " + doc.data().Last_Name,
            requesterContact: doc.data().Mobile_Number,
            requesterAddress: doc.data().Address,
          });
        });
      });
  };

  updateStatus = () => {
    db.collection("transactions").add({
      Name: this.state.name,
      Transaction_ID: this.state.transactionID,
      Requester_ID: this.state.requesterName,
      Donor_ID: this.state.userID,
      Status: "Donor Interested",
    });
  };

  addNotification = () => {
    var message = this.state.userID + " has shown interest in donating";
    db.collection("notifications").add({
      Receiver_ID: this.state.requesterID,
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
            Requester Information
          </Text>
          <Text
            style={{
              fontWeight: "400",
              fontSize: RFValue(20),
              marginTop: RFValue(30),
            }}
          >
            Name: {this.state.requesterName}
          </Text>
          <Text>Contact: {this.state.requesterContact}</Text>
          <Text>Address: {this.state.requesterAddress}</Text>
          <View
            style={{
              flex: 0.6,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 200,
            }}
          >
            <Text>ID of Requester: {this.state.requesterID}</Text>
            <Text>Name: {this.state.name}</Text>
            <Text>Description: {this.state.description}</Text>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {this.state.requesterID !== this.state.userID ? (
            <TouchableOpacity
              style={{ margin: 100, marginTop: 500 }}
              onPress={() => {
                this.updateStatus();
                this.addNotification();
                this.props.navigation.navigate("Donate");
              }}
            >
              <Text>I want to Donate</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
