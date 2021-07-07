import React, { useState } from "react";
import {
  TextInput,
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "../../styles";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [userType, setUserType] = useState();
  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();
  const radio_list = [
    {
      label: "I work with a charity and have parrots to rehome",
      value: "admin",
    },
    { label: "I have a home to give to a parrot in need", value: "standard" },
  ];

  const onSignUpButtonClicked = async () => {
    if (password !== password2) {
      return alert("Passwords do not match");
    }

    if (
      firstName == undefined ||
      lastName == undefined ||
      username == undefined ||
      email == undefined ||
      userType == undefined ||
      password == undefined
    ) {
      return alert("Ooops... Looks like you've forgotten something!");
    }

    await fetch(`https://parrot-party-api.herokuapp.com/api/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        forename: firstName,
        lastname: lastName,
        username: username,
        email: email,
        password: password,
        type: userType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.username === username) {
          navigation.navigate("Sign In");
        }
      })
      .catch((error) => {
        alert("That username already exists, please choose another");
        console.log("error: ", error);
      });
  };

  return (
    <View style={styles.formBody}>
      <View style={styles.signUpCircleImageContainer}>
        <Image
          source={require("../images/gify-parrot.gif")}
          style={styles.signUpCircleImage}
        />
      </View>
      <View style={styles.radioInputForm}>
        <TextInput
          style={styles.inputField}
          placeholder="First Name"
          keyboardType="default"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Last Name"
          keyboardType="default"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Username"
          keyboardType="default"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          keyboardType="default"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          keyboardType="default"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={true}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          keyboardType="default"
          value={password2}
          onChangeText={setPassword2}
          autoCapitalize="none"
          secureTextEntry={true}
        />
        <RadioForm
          radio_props={radio_list}
          initial={"admin"}
          onPress={(value) => setUserType(value)}
          buttonColor={"#bf04a3"}
          buttonSize={10}
        />
      </View>
      <View style={{ flex: 0.7 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSignUpButtonClicked()}
        >
          <Text style={styles.text}> Sign Up! </Text>
        </TouchableOpacity>
      </View>

      {/* <View
            style={styles.buttonContainer}
            onStartShouldSetResponder={() => onSignUpButtonClicked()}
          >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </View> */}
    </View>
  );
};

export { SignUp };
