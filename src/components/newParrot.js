import React, { useState } from "react";
import {
  TextInput,
  View,
  Image,
  Alert,
  Platform,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "../../styles";
import * as ImagePicker from "expo-image-picker";
import { ParrotLocationMap } from "./parrotLocationMap";
import { GEO_API_KEY } from "@env";
import RadioForm from "react-native-simple-radio-button";

const NewParrot = ({ navigation, route }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState();
  const [charity, setCharity] = useState();
  const [species, setSpecies] = useState();
  const [age, setAge] = useState();
  const [location, setLocation] = useState();
  const [gender, setGender] = useState("Female");
  const [bio, setBio] = useState();
  const [specialNeeds, setSpecialNeeds] = useState();
  const [imageUrl, setImageUrl] = useState(null);
  const { userId, userType, sessionId } = route.params;
  const [geocode, setGeocode] = useState({
    latitude: 51.507322,
    longitude: -0.127647,
  });
  const radio_list = [
    { label: "Female   ", value: "Female" },
    { label: "Male   ", value: "Male" },
    { label: "Unknown   ", value: "Unknown" },
  ];

  const checkMediaPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    }
  };

  const pickImage = async () => {
    await checkMediaPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
  };

  const uploadImage = (uri) => {
    const uriArray = uri.split(".");
    const fileType = uriArray[uriArray.length - 1];

    const formData = new FormData();
    formData.append("image", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    uploadToServer(formData);
  };

  const uploadToServer = async (formData) => {
    try {
      await fetch(`https://parrot-party-api.herokuapp.com/api/uploads`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type":
            "multipart/form-data; boundary=---------------------------974767299852498929531610575",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.downloadUrl) {
            setImageUrl(data.downloadUrl);
          } else {
            Alert.alert("Error", data);
          }
        })
        .catch((error) => console.log("error: ", error));
    } catch (error) {}
  };

  const onAddButtonClicked = async () => {
    await getLocationGeocode(location);
    if (
      name == undefined ||
      charity == undefined ||
      species == undefined ||
      age == undefined ||
      location == undefined ||
      gender == undefined ||
      bio == undefined ||
      specialNeeds == undefined
    ) {
      return alert("Ooops... Looks like you've forgotten something!");
    }
    await fetch(`https://parrot-party-api.herokuapp.com/api/parrots`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        charity: charity,
        species: species,
        age: age,
        location: location,
        latitude: geocode.latitude,
        longitude: geocode.longitude,
        gender: gender,
        bio: bio,
        specialNeeds: specialNeeds,
        imageUrl: imageUrl
          ? imageUrl
          : "https://party-parrots-s3-bucket.s3.amazonaws.com/parrot.jpeg",
        user: userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log("error: ", error));
    navigation.push("Parrot List", {
      userType: userType,
      userId: userId,
      sessionId: sessionId,
    });
  };

  // create location specific url for MapQuest API
  const getLocationGeocode = (location) => {
    if (location !== undefined) {
      const geoCoderUrlPrefix = `http://open.mapquestapi.com/geocoding/v1/address?key=${GEO_API_KEY}&location=`;
      location = location.replace(/\s/g, "") + ",GB";
      const url = geoCoderUrlPrefix + location;
      fetchGeocode(url);
    }
  };

  const fetchGeocode = async (url) => {
    const res = await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setGeocode({
          latitude: data.results[0].locations[0].latLng.lat,
          longitude: data.results[0].locations[0].latLng.lng,
        });
      });
  };

  return (
    <ScrollView>
      <View style={styles.formBody}>
        <View style={styles.inputForm}>
          <View
            style={styles.profileImageContainer}
            onStartShouldSetResponder={() => pickImage()}
          >
            <Image
              source={{
                uri: image
                  ? image
                  : "https://party-parrots-s3-bucket.s3.amazonaws.com/camera.png",
              }}
              style={styles.profileImage}
            />
          </View>
          <TextInput
            style={styles.addParrotInputField}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.addParrotInputField}
            placeholder="Charity"
            value={charity}
            onChangeText={setCharity}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.addParrotInputField}
            placeholder="Species (e.g. Timneh African Grey)"
            value={species}
            onChangeText={setSpecies}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.addParrotInputField}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.addParrotInputField}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
          />
          <TouchableOpacity
            style={styles.refresh}
            onPress={() => getLocationGeocode(location)}
          >
            <Text style={styles.refreshText}>Refresh Map</Text>
          </TouchableOpacity>
          <RadioForm
            style={styles.radioForm}
            radio_props={radio_list}
            initial={"Unknown"}
            onPress={(value) => setGender(value)}
            formHorizontal={true}
            buttonSize={12}
            labelStyle={{ fontSize: 15 }}
            buttonColor={"#bf04a3"}
          />
          <TextInput
            style={[styles.addParrotInputField, { height: 100 }]}
            placeholder="All about me..."
            value={bio}
            onChangeText={setBio}
            autoCapitalize="sentences"
            multiline={true}
            numberOfLines={8}
          />
          <TextInput
            style={styles.addParrotInputField}
            placeholder="Does this bird have special needs?"
            value={specialNeeds}
            onChangeText={setSpecialNeeds}
            autoCapitalize="sentences"
          />
          <TouchableOpacity
            style={styles.addParrotButtonContainer}
            onPress={() => onAddButtonClicked()}
          >
            <Text style={styles.addText}>Add parrot</Text>
          </TouchableOpacity>
          <Text style={styles.coords}>
            {"Latitude: " +
              geocode.latitude +
              " Longitude: " +
              geocode.longitude}
          </Text>
          <ParrotLocationMap geocode={geocode} />
        </View>
      </View>
    </ScrollView>
  );
};

export { NewParrot };
