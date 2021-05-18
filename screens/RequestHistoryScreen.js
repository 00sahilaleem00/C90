import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  FlatList,
  Header,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config.js";
import MyHeader from "../components/MyHeader";

//This is analogous to MyReceivedBooksScreen
export default class RequestHistoryScreen extends Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      receivedRequestsList: [],
    };
    this.requestRef = null;
  }

  getReceivedRequestsList = () => {
    this.requestRef = db
      .collection("requests")
      .where("User_ID", "==", this.state.userID)
      .where("Status", "==", "Received")
      .onSnapshot((snapshot) => {
        var receivedRequestsList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          receivedRequestsList: receivedRequestsList,
        });
      });
  };

  componentDidMount() {
    this.getReceivedRequestsList();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem key={i} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.Name}</ListItem.Title>
        <ListItem.Subtitle>{item.Status}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Request History" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.receivedRequestsList.length === 0 ? (
            <View>
              <Text style={{ fontSize: 20 }}>
                List of All Received Requests
              </Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.receivedRequestsList}
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
