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

//This is analogous to BookDonateScreen
export default class DonateScreen extends Component {
  constructor() {
    super();
    this.state = {
      requests: [],
    };
    this.requestRef = null;
  }

  getRequests = () => {
    this.requestRef = db.collection("requests").onSnapshot((snapshot) => {
      var requestsArray = snapshot.docs.map((document) => document.data());
      this.setState({
        requests: requestsArray,
      });
    });
  };

  componentDidMount = () => {
    this.getRequests();
  };

  componentWillUnmount = () => {
    this.requestRef();
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
              this.props.navigation.navigate("DonateAccept", {
                details: item,
              });
            }}
          >
            <Text style={{ color: "#ffff" }}>Donate</Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {this.state.requests.length === 0 ? (
            <View
              style={{
                flex: 1,
                fontSize: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>List of all Requests</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requests}
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
