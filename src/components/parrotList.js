import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import Parrot from "./parrotItem";
import styles from "../../styles";

const ParrotList = ({ navigation, route }) => {
  const [parrots, setParrots] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const { userType, userId, sessionId } = route.params;

  useEffect(() => {
    const fetchParrots = async () => {
      console.log("fetch data in use effect");
      const res = await fetch(
        `https://parrot-party-api.herokuapp.com/api/parrots`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setParrots(data.parrots);
          setApprovedApplications(data.approvedApplications);
        });
    };
    fetchParrots();
  }, []);

  // set the navigation bar for every page here
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => onSignOutButtonClicked()}>
          <Text style={styles.logOutButton}>Log Out{` `} </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, onSignOutButtonClicked]);

  const isParrotApproved = (parrotId) => {
    const parrotApproved = approvedApplications.filter(
      (application) => application.parrot === parrotId
    );
    return parrotApproved.length > 0;
  };

  const onSignOutButtonClicked = async () => {
    await fetch(
      `https://parrot-party-api.herokuapp.com/api/sessions/${sessionId}`,
      {
        method: "DELETE",
        withCredentials: true,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        Alert.alert(data.message);
        if (data.message === "Successfully Logged Out")
          navigation.navigate("Sign In");
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.pageBody}>
      <FlatList
        style={{ marginVertical: 20, flex: 5 }}
        data={parrots}
        renderItem={({ item }) =>
          (userType !== "admin" || userId === item.user) && (
            <Parrot
              key={item._id}
              parrotId={item._id}
              name={item.name}
              location={item.location}
              age={item.age}
              gender={item.gender}
              imgUrl={
                item.imageUrl
                  ? item.imageUrl
                  : "https://party-parrots-s3-bucket.s3.amazonaws.com/parrot.jpeg"
              }
              approved={isParrotApproved(item._id)}
              navigation={navigation}
              userType={userType}
              userId={userId}
            />
          )
        }
        keyExtractor={(item) => item._id}
      />
      <View style={{ flex: 0.2 }}>
        {userType === "admin" && (
          <TouchableOpacity
            style={styles.addParrotButton}
            onPress={() =>
              navigation.navigate("Add Parrot", {
                userId: userId,
                userType: userType,
                sessionId: sessionId,
              })
            }
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ flex: 0.005 }}>
        {userType !== "admin" && (
          <TouchableOpacity
            style={styles.mapViewIconContainer}
            onPress={() =>
              navigation.navigate("Map View", {
                userType: userType,
                userId: userId,
              })
            }
          >
            <Image
              source={require("../images/mapViewIconFinal.png")}
              style={styles.mapViewIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export { ParrotList };
