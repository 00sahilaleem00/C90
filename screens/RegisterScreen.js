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
  Image,
} from "react-native";
import db from "../config.js";
import firebase from "firebase";
import { Input, Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default class RegisterScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailID: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      address: "",
      mobileNumber: "",
      isModalVisible: false,
    };
  }

  //This logs an existing user in
  userLogin(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        //Once we create other screens we have to navigate to them here
        return Alert.alert("Login Successful");
      })
      .catch((error) => {
        var errorMessage = error.message;
        console.log(errorMessage);
        return Alert.alert(errorMessage);
      });
  }

  //This creates the credentials for a new user
  userSignUp(email, password, confirmPassword) {
    if (password != confirmPassword) {
      Alert.alert("Passwords Must Match!");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("users").add({
            Address: this.state.address,
            First_Name: this.state.firstName,
            Last_Name: this.state.lastName,
            Mobile_Number: this.state.mobileNumber,
            Email_ID: this.state.emailID,
            Is_Request_Active: false,
          });
          return Alert.alert("User Added Successfully", "", [
            {
              text: "OK",
              onPress: () => {
                this.setState({
                  //This makes it so that the registration form disappears
                  isModalVisible: false,
                });
              },
            },
          ]);
        })
        .catch((error) => {
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  }

  //This is the registration form
  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <ScrollView style={{ backgroundColor: "white" }}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
              <Text style={styles.modalTitle}>REGISTRATION</Text>
              <View style={{ flex: 1 }}>
                <Input
                  style={styles.inputBox}
                  placeholder={"emailID@example.com"}
                  label={"emailID@example.com"}
                  keyboardType="email-address"
                  onChangeText={(text) => {
                    this.setState({
                      emailID: text,
                    });
                  }}
                />
                <Input
                  label={"Password"}
                  placeholder={"Password"}
                  style={styles.inputBox}
                  secureTextEntry={true}
                  onChangeText={(text) => {
                    this.setState({
                      password: text,
                    });
                  }}
                />
                <Input
                  label={"Confirm Password"}
                  placeholder={"Confirm Password"}
                  style={styles.inputBox}
                  secureTextEntry={true}
                  onChangeText={(text) => {
                    this.setState({
                      confirmPassword: text,
                    });
                  }}
                />
                <Input
                  style={styles.inputBox}
                  label={"First Name"}
                  placeholder={"First Name"}
                  onChangeText={(text) => {
                    this.setState({
                      firstName: text,
                    });
                  }}
                />
                <Input
                  style={styles.inputBox}
                  label={"Last Name"}
                  placeholder={"Last Name"}
                  onChangeText={(text) => {
                    this.setState({
                      lastName: text,
                    });
                  }}
                />
                <Input
                  style={styles.inputBox}
                  label={"Address"}
                  placeholder={"Address"}
                  onChangeText={(text) => {
                    this.setState({
                      address: text,
                    });
                  }}
                />
                <Input
                  style={styles.inputBox}
                  label={"Contact"}
                  placeholder={"Contact"}
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={(text) => {
                    this.setState({
                      mobileNumber: text,
                    });
                  }}
                />
                <Icon
                  type={"materialicon"}
                  name={"cancel"}
                  size={RFValue(40)}
                  color={"red"}
                  onPress={() => {
                    this.setState({ isModalVisible: false });
                  }}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.userSignUp(
                      this.state.emailID,
                      this.state.password,
                      this.state.confirmPassword
                    );
                  }}
                >
                  <Text style={{ color: "white" }}>REGISTER</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </Modal>
    );
  };

  //This is where you log in
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>{this.showModal()}</View>
        <View style={styles.container}>
          <Text>COVID SAVER</Text>
        </View>
        <View style={styles.container}>
          <TextInput
            style={styles.inputBox}
            placeholder={"emailID@example.com"}
            keyboardType="email-address"
            onChangeText={(text) => {
              this.setState({
                emailID: text,
              });
            }}
          />
          <TextInput
            style={styles.inputBox}
            secureTextEntry={true}
            placeholder={"password"}
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.userLogin(this.state.emailID, this.state.password);
            }}
          >
            <Text style={{ color: "white" }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({
                isModalVisible: true,
              });
            }}
          >
            <Text style={{ color: "white" }}>Sign Up</Text>
          </TouchableOpacity>
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
    margin: 5,
    borderWidth: 2,
  },
  modalContainer: {
    margin: 10,
    flex: 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    margin: 10,
  },
  modalTitle: {
    backgroundColor: "red",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  button: {
    alignSelf: "center",
    backgroundColor: "blue",
    borderWidth: 2,
    borderRadius: 5,
  },
});
