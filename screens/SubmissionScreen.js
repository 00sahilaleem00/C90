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
  TouchableHighlight,
  FlatList,
} from "react-native";
import { Card, Input } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";
import db from "../config.js";

//This is analogous to BookRequestScreen
//"name" refers to the name of the donation/request
//donations can be done whenever, but requests can only be done when one is not out. may change this later depending on difficulty
export default class SubmissionScreen extends Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      name: "",
      description: "",
      transactionID: "",
      status: "",
      isRequestActive: "",
      documentID: "",
    };
  }

  createUniqueID() {
    return Math.random().toString(36).substring(7);
  }

  getRequest = () => {
    var request = db
      .collection("requests")
      .where("User_ID", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().Status !== "Received") {
            this.setState({
              transactionID: doc.data().Transaction_ID,
              name: doc.data().Name,
              status: doc.data().Status,
              documentID: doc.id,
            });
          }
        });
      });
  };

  getDonation = () => {
    var donation = db
      .collection("donations")
      .where("User_ID", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().Status !== "Received") {
            this.setState({
              transactionID: doc.data().Transaction_ID,
              name: doc.data().Name,
              status: doc.data().Status,
              documentID: doc.id,
            });
          }
        });
      });
  };

  getIsRequestActive = () => {
    db.collection("users")
      .where("Email_ID", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            isRequestActive: doc.data().Is_Request_Active,
          });
        });
      });
  };

  componentDidMount = () => {
    this.getRequest();
    this.getDonation();
    this.getIsRequestActive();
  };

  addRequest = async () => {
    var randomRequestID = this.createUniqueID();
    db.collection("requests").add({
      User_ID: this.state.userID,
      Name: this.state.name,
      description: this.state.description,
      Transaction_ID: randomRequestID,
      Date: firebase.firestore.FieldValue.serverTimestamp(),
      Status: "Requested",
    });
    await this.getRequest();
    db.collection("users")
      .where("Email_ID", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            Is_Request_Active: true,
          });
        });
        this.setState({ isRequestActive: true });
      });
    this.setState({
      name: "",
      description: "",
    });
    return Alert.alert("Requested Successfully");
  };

  addDonation = async () => {
    var randomDonationID = this.createUniqueID();
    db.collection("donations").add({
      User_ID: this.state.userID,
      Name: this.state.name,
      Description: this.state.description,
      Transaction_ID: randomDonationID,
      Date: firebase.firestore.FieldValue.serverTimestamp(),
      Status: "Requested",
    });
    await this.getDonation();
    this.setState({
      name: "",
      description: "",
    });
    return Alert.alert("Donation Requested Successfully");
  };

  sendRequestNotification = () => {
    db.collection("users")
      .where("Email_ID", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var firstName = doc.data().First_Name;
          var lastName = doc.data().Last_Name;
          db.collection("notifications")
            .where("Transaction_ID", "==", this.state.transactionID)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var receiverID = doc.data().Sender_ID;
                var name = doc.data().Name;
                db.collection("notifications").add({
                  Receiver_ID: receiverID,
                  Message:
                    firstName + " " + lastName + " received the donation",
                  Sender_ID: this.state.userID,
                  Date: firebase.firestore.FieldValue.serverTimestamp(),
                  Status: "Unread",
                  Name: name,
                  Transaction_ID: this.state.transactionID,
                });
              });
            });
        });
      });
    db.collection("requests")
      .where("Transaction_ID", "==", this.state.transactionID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var docID = doc.id;
          db.collection("requests").doc(docID).update({
            Status: "Received",
          });
        });
      });
    db.collection("users")
      .where("Email_ID", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            Is_Request_Active: false,
          });
        });
        this.setState({ isRequestActive: false });
      });
  };

  sendDonationNotification = () => {
    db.collection("users")
      .where("Email_ID", "==", this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var firstName = doc.data().First_Name;
          var lastName = doc.data().Last_Name;
          db.collection("notifications")
            .where("Transaction_ID", "==", this.state.transactionID)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var receiverID = doc.data().Sender_ID;
                var name = doc.data().Name;
                db.collection("notifications").add({
                  Receiver_ID: receiverID,
                  Message:
                    firstName + " " + lastName + " has sent you the donation",
                  Sender_ID: this.state.userID,
                  Date: firebase.firestore.FieldValue.serverTimestamp(),
                  Status: "Unread",
                  Name: name,
                  Transaction_ID: this.state.transactionID,
                });
              });
            });
        });
      });
    db.collection("donations")
      .where("Transaction_ID", "==", this.state.transactionID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var docID = doc.id;
          db.collection("donations").doc(docID).update({
            Status: "Received",
          });
        });
      });
  };

  render() {
    if (this.state.isRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "red",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text>Name</Text>
            <Text>{this.state.name}</Text>
          </View>
          <View
            style={{
              borderColor: "blue",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text>Status</Text>
            <Text>{this.state.status}</Text>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "orange",
              width: 300,
              alignSelf: "center",
            }}
            onPress={() => {
              this.sendRequestNotification();
            }}
          >
            <Text>I recieved the donation</Text>
          </TouchableOpacity>
          <Input
            style={styles.formTextInput}
            containerStyle={{ marginTop: RFValue(60) }}
            label={"Enter Name"}
            placeholder="Enter Name"
            value={this.state.name}
            onChangeText={(text) => {
              this.setState({
                name: text,
              });
            }}
          />
          <Input
            style={styles.formTextInput}
            containerStyle={{ marginTop: RFValue(30) }}
            label={"Description"}
            placeholder="Enter Description"
            value={this.state.description}
            multiline
            numberOfLines={10}
            onChangeText={(text) => {
              this.setState({
                description: text,
              });
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.addDonation();
            }}
          >
            <Text>Add Donation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "green",
              width: 300,
              alignSelf: "center",
            }}
            onPress={() => {
              this.sendDonationNotification();
            }}
          >
            <Text>I sent the donation</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ marginTop: 100 }}>
          <KeyboardAvoidingView style={styles.keyboardStyle}>
            <Input
              style={styles.formTextInput}
              containerStyle={{ marginTop: RFValue(60) }}
              label={"Enter Name"}
              placeholder="Enter Name"
              value={this.state.name}
              onChangeText={(text) => {
                this.setState({
                  name: text,
                });
              }}
            />
            <Input
              style={styles.formTextInput}
              containerStyle={{ marginTop: RFValue(30) }}
              label={"Description"}
              placeholder="Enter Description"
              value={this.state.description}
              multiline
              numberOfLines={10}
              onChangeText={(text) => {
                this.setState({
                  description: text,
                });
              }}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addRequest();
              }}
            >
              <Text>Add Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addDonation();
              }}
            >
              <Text>Add Donation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "green",
                width: 300,
                alignSelf: "center",
                marginTop: 20,
              }}
              onPress={() => {
                this.sendDonationNotification();
              }}
            >
              <Text>I sent the donation</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
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
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 5,
    marginTop: 10,
    padding: 5,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "blue",
    shadowColor: "white",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
    marginTop: 10,
  },
});
