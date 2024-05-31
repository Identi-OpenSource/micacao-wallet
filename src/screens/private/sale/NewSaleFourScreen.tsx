import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { imgCheque } from "../../../assets/imgs";
import { Btn } from "../../../components/button/Button";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from "../../../config/themes/default";
import { styles as ST } from "./NewSaleOneScreen";

export const NewSaleFourScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <View style={styles.containerSpiner}>
          <Image source={imgCheque} style={styles.img} />
          <Text style={[styles.title2, { marginBottom: 30 }]}>
            Venta guardada
          </Text>
          <Btn
            theme="agrayu"
            title="VOLVER AL INICIO"
            onPress={() => navigation.navigate("HomeProvScreen")}
          />
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  ...ST,
  containerBTN: {
    marginTop: MP_DF.large,
    justifyContent: "space-between",
    flex: 1,
    paddingBottom: MP_DF.large,
  },
  select: {
    backgroundColor: COLORS_DF.citrine_brown,
    borderRadius: MP_DF.small,
    padding: MP_DF.small,
    margin: MP_DF.small,
    flex: 1,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  textSelect: {
    color: COLORS_DF.white,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: "bold",
  },
  containerSpiner: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: MP_DF.xxxlarge * 2,
  },
  colorSpiner: {
    color: COLORS_DF.robin_egg_blue,
  },
  spiner: {},
  title2: {
    textAlign: "center",
    fontSize: FONT_SIZES.xslarge,
    fontWeight: "bold",
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    marginTop: MP_DF.large,
  },
  img: {
    width: 250,
    height: 140,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: MP_DF.large,
  },
});
