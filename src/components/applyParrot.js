import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "../../styles";

const ApplyParrot = ({ parrotId, userId }) => {
  const [message, setMessage] = useState();
  const [applied, setApplied] = useState(false);

  const onApplyButtonClicked = async () => {
    if (message !== undefined) {
      await fetch(
        `https://parrot-party-api.herokuapp.com/api/parrots/${parrotId}/applications`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            message: message,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data._id) setApplied(true);
        })
        .catch((error) => console.log("error: ", error));
    } else {
      Alert.alert("Please enter message");
    }
  };

  return (
    <View>
      <View style={styles.applicationContainer}>
        {!applied && (
          <View style={styles.applyInputForm}>
            <TextInput
              style={styles.applyInputField}
              placeholder="Write a message and apply for this parrot"
              keyboardType="default"
              value={message}
              onChangeText={setMessage}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.buttonPinkContainer}
              onPress={() => onApplyButtonClicked()}
            >
              <Text style={styles.buttonText}> APPLY</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {applied && (
        <Text style={styles.redBoldFont}>
          Application Status: Waiting for response
        </Text>
      )}
    </View>
  );
};

export { ApplyParrot };
