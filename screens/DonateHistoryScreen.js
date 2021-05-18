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
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Card, Icon, ListItem } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import firebase from "firebase";
import db from "../config.js";
import MyHeader from "../components/MyHeader";

//This is analogous to MyDonationScreen
export default class DonateHistoryScreen extends Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      donations: [],
    };
    this.requestRef = null;
  }

  getDonations = () => {
    this.requestRef = db
      .collection("transactions")
      .where("Donor_ID", "==", this.state.userID)
      .where("Type", "==", "Request")
      .where("Status", "!=", "Received")
      .onSnapshot((snapshot) => {
        var donationsArray = [];
        snapshot.docs.map((doc) => {
          var donation = doc.data();
          donation["Document_ID"] = doc.id;
          donationsArray.push(donation);
        });
        this.setState({
          donations: donationsArray,
        });
      });
  };

  componentDidMount = () => {
    this.getDonations();
  };

  componentWillUnmount = () => {
    this.requestRef();
  };

  sendNotification = (details, status) => {
    var transactionID = details.Transaction_ID;
    var donorID = details.Donor_ID;
    db.collection("notifications")
      .where("Transaction_ID", "==", transactionID)
      .where("Sender_ID", "==", donorID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (status === "Sent") {
            message = donorID + " sent you the donation";
          } else {
            message = donorID + " has shown interest in donating";
          }
          db.collection("notifications").doc(doc.id).update({
            Message: message,
            Status: "Unread",
            Date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendDonation = async (details) => {
    if (details.Status === "Sent") {
      var docID;
      var status = "Donor Interested";
      await db
        .collection("transactions")
        .where("Transaction_ID", "==", details.Transaction_ID)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            docID = doc.id;
          });
        });
      db.collection("transactions").doc(docID).update({
        Status: "Donor Interested",
      });
      await db
        .collection("requests")
        .where("Transaction_ID", "==", details.Transaction_ID)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            docID = doc.id;
          });
        });
      db.collection("requests").doc(docID).update({
        Status: "Donor Interested",
      });
      this.sendNotification(details, status);
    } else {
      var docID;
      var status = "Sent";
      await db
        .collection("transactions")
        .where("Transaction_ID", "==", details.Transaction_ID)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            docID = doc.id;
          });
        });
      db.collection("transactions").doc(docID).update({
        Status: "Sent",
      });
      await db
        .collection("requests")
        .where("Transaction_ID", "==", details.Transaction_ID)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            docID = doc.id;
          });
        });
      db.collection("requests").doc(docID).update({
        Status: "Sent",
      });
      this.sendNotification(details, status);
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem key={i} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.Name}</ListItem.Title>
        <ListItem.Subtitle>
          {"Requested By:" + item.Requester_ID + "\n Status: " + item.Status}
        </ListItem.Subtitle>
        <TouchableOpacity
          style={{
            backgroundColor: item.Status === "Sent" ? "green" : "#ff5722",
          }}
          onPress={() => {
            this.sendDonation(item);
          }}
        >
          <Text style={{ color: "#ffff" }}>
            {item.Status === "Sent" ? "Sent" : "Send"}
          </Text>
        </TouchableOpacity>
      </ListItem.Content>
    </ListItem>
  );

  render() {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <MyHeader navigation={this.props.navigation} title="Donate History" />
          <View style={{ flex: 1 }}>
            {this.state.donations.length === 0 ? (
              <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 20 }}>List of all Donations</Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.donations}
                renderItem={this.renderItem}
              />
            )}
          </View>
        </View>
      </SafeAreaProvider>
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
