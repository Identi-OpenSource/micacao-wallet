import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Header } from "@rneui/themed";
import { Icon } from "@rneui/base";
import { COLORS_DF } from "../../config/themes/default";
import { FONT_FAMILIES } from "../../config/themes/default";
import { useNavigation } from "@react-navigation/native";
const HeaderComponent: React.FC<HeaderProps> = ({ label, goBack }) => {
  const navigation = useNavigation();
  return (
    <Header
      containerStyle={{
        height: 100,
        backgroundColor: COLORS_DF.isabelline,
        justifyContent: "center",
        alignItems: "center",
      }}
      statusBarProps={{
        barStyle: "light-content",
        backgroundColor: COLORS_DF.isabelline,
      }}
      /* leftComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon
              name="chevron-left"
              color={COLORS_DF.citrine_brown}
              size={50}
            />
          </TouchableOpacity>
        } */
      centerComponent={
        <Text
          style={{
            color: COLORS_DF.citrine_brown,
            fontSize: 30,
            fontFamily: FONT_FAMILIES.primary,
          }}
        >
          {label}
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({});

export default HeaderComponent;
