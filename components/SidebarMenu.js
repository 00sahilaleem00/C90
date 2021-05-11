import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Header, Icon, Avatar } from "react-native-elements";
import { DrawerItems } from "react-navigation-drawer";
import { RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase";
import db from "../config";

export default class SideBarMenu extends Component {
  state = {
    image: "#",
    userID: firebase.auth().currentUser.email,
    name: "",
    documentID: "",
  };

  //This chooses the user's picture from their device calls for it to be uploaded to cloud storage
  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.setState({
        image: uri,
      });
      this.uploadImage(uri, this.state.userID);
    }
  };

  //This uploads the image to the cloud storage
  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  //This gets the user's data so their name can be displayed in the drawer
  getUserProfile() {
    db.collection("users")
      .where("User_ID", "==", this.state.userID)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().First_Name + " " + doc.data().Last_name,
          });
        });
      });
  }

  //This fetches the user's profile picture from the cloud storage
  fetchImage = async (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    storageRef.getDownloadURL().then((url) => {
      try {
        this.setState({
          image: url,
        });
      } catch (error) {
        console.log(error.message);
        this.setState({
          image: "#",
        });
      }
    });
  };

  componentDidMount() {
    this.getUserProfile();
    this.fetchImage(this.state.userID);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Avatar
          rounded
          source={{ uri: this.state.image }}
          size="medium"
          onPress={() => {
            this.selectPicture();
          }}
          showEditButton
        />
        <Text style={{ fontWeight: "bold", fontSize: 20, padding: 5 }}>
          {this.state.name}
        </Text>
        <DrawerItems {...this.props} />
        <View
          style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 30 }}
        >
          <TouchableOpacity
            style={{
              justifyContent: "center",
              padding: 10,
              height: 30,
              width: "100%",
            }}
            onPress={() => {
              this.props.navigation.navigate("RegisterScreen");
              firebase.auth().signOut();
            }}
          >
            <Icon
              name="logout"
              type="antdesign"
              size={RFValue(20)}
              iconStyle={{ marginBottom: 10 }}
            />
            <Text
              style={{
                fontSize: RFValue(10),
                fontWeight: "bold",
                marginLeft: RFValue(30),
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
