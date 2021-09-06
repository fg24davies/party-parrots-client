import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../../styles";
import { ParrotInfoItem } from "./parrotInfoItem";

const ParrotApplication = ({
  parrotId,
  applicationId,
  applicant,
  message,
  approved,
  showApprove,
  onApproveSubmitted,
}) => {
  const [newApproved, setNewApproved] = useState(approved);

  const onApproveButtonClicked = async () => {
    const response = await fetch(
      `https://parrot-party-api.herokuapp.com/api/parrots/${parrotId}/applications/${applicationId}`,
      {
        method: "PATCH",
      }
    );

    if (response.status === 200) {
      Alert.alert("Application approved successfully");
      setNewApproved(true);
    } else if (response.status === 400) {
      Alert.alert("Parrot application already approved");
    } else {
      Alert.alert("Unsuccessful approval");
    }
    onApproveSubmitted();
  };

  return (
    <View style={styles.applicationContainer}>
      <View style={styles.applicationStatus}>
        <ParrotInfoItem
          label="Status: "
          info={newApproved ? "Approved" : showApprove ? "NA" : "Declined"}
        />
        <View style={styles.approveButton}>
          {showApprove && (
            <TouchableOpacity
              style={styles.smallButtonContainer}
              onPress={() => onApproveButtonClicked()}
            >
              <Text style={styles.smallButtonText}> APPROVE</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.applicationContent}>
        <Text style={styles.infoLabel}>{applicant}</Text>
        <Text style={styles.infoText}>{message}</Text>
      </View>
    </View>
  );
};

export { ParrotApplication };
