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
  FlatList,
  Image,
} from "react-native";
import { Card, ListItem, Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config.js";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";

//This is analogous to BookDonateScreen, but for requests
export default class RequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      donations: [],
    };
    this.donationRef = null;
  }

  getDonations = () => {
    this.donationRef = db
      .collection("donations")
      .where("Status", "!=", "Received")
      .onSnapshot((snapshot) => {
        var donationsArray = snapshot.docs.map((document) => document.data());
        this.setState({
          donations: donationsArray,
        });
      });
  };

  componentDidMount = () => {
    this.getDonations();
  };

  componentWillUnmount = () => {
    this.donationRef();
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.Name}</ListItem.Title>
          <ListItem.Subtitle>{item.Description}</ListItem.Subtitle>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("RequestAccept", {
                details: item,
              });
            }}
          >
            <Text style={{ color: "#ffff" }}>Request</Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Request" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.donations.length === 0 ? (
            <View
              style={{
                flex: 1,
                fontSize: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});
