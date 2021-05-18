import React, { useState, useEffect } from "react";
import { View, FlatList, Button, SafeAreaView } from "react-native";
import Parrot from "./parrotItem";
import styles from "../../styles";
import { Headbar } from "./headbar";

const ParrotList = ({ navigation, route }) => {
  const { userName, userType, userId } = route.params;
  const [parrots, setParrots] = useState([]);
  useEffect(() => {
    const fetchParrots = async () => {
      console.log("fetch data in use effect");
      const res = await fetch(`http://localhost:3000/api/parrots`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setParrots(data);
          // console.log(data);
        });
    };
    fetchParrots();
  }, []);

  return (
    <View>
      <Button
        title="Map View"
        onPress={() => navigation.navigate("Map View")}
      />
      <Button
        title="Add Parrot"
        onPress={() =>
          navigation.navigate("Add Parrot", {
            userName: userName,
            userType: userType,
            userId: userId,
          })
        }
      />
      <FlatList
        data={parrots}
        renderItem={({ item }) =>
          (userType !== "admin" || userId === item.user) && (
            <Parrot
              key={item._id}
              id={item._id}
              name={item.name}
              location={item.location}
              age={item.age}
              gender={item.gender}
              imgUrl={
                item.imageUrl
                  ? item.imageUrl
                  : "https://party-parrots-s3-bucket.s3.amazonaws.com/parrot.jpeg"
              }
              navigation={navigation}
              userName={userName}
              userType={userType}
              userId={userId}
            />
          )
        }
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export { ParrotList };
