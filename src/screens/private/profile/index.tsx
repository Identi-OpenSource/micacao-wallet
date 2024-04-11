import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import HeaderComponent from "../../../components/Header";
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
} from "../../../config/themes/default";
import { UserInterface, UsersContext } from "../../../states/UserContext";
import { Person } from "../../../assets/svg";

const ProfileScreen = () => {
  const user: UserInterface = useContext(UsersContext);
  return (
    <View style={styles.container}>
      <HeaderComponent label={"Perfil"} />
      <TouchableOpacity style={{ alignSelf: "center" }}>
        <Person width={150} height={150} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Profile {...user} />

        <Text style={styles.textFarmer}>Agricultor</Text>
      </View>
    </View>
  );
};
const Profile = ({ name }: UserInterface) => {
  const firstName = name.split(" ")[0];
  return <Text style={styles.textName}>{firstName}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_DF.isabelline,
    paddingVertical: 15,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  textName: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: 30,
  },
  textFarmer: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: 15,
  },
});

export default ProfileScreen;
