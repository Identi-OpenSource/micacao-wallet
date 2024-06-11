import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  HeaderActions,
  SafeArea,
} from "../../../components/safe-area/SafeArea";
import { useNavigation } from "@react-navigation/native";
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from "../../../config/themes/default";
import { imgBaba, imgTostado } from "../../../assets/imgs";
import { storage } from "../../../config/store/db";

export const NewSaleOneScreen = () => {
  const navigation = useNavigation();

  const onSubmit = (type: string) => {
    const sale = { type };
    storage.set("saleTemp", JSON.stringify(sale));
    console.log("TIPO DE CACAO", sale);

    navigation.navigate("NewSaleTwoScreen");
  };

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <HeaderActions title={"Paso 1 de 5"} navigation={navigation} />
        <Text style={styles.title}>¿QUÉ VAS A VENDER?</Text>
        <ScrollView style={styles.containerBTN}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSubmit("BABA")}
          >
            <Image source={imgTostado} style={styles.img} />
            <Text style={styles.titleCard}>BABA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSubmit("SECO")}
          >
            <Image source={imgBaba} style={styles.img} />
            <Text style={styles.titleCard}>SECO</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeArea>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingTop: MP_DF.medium,
  },
  title: {
    textAlign: "center",
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,

    marginTop: 50,
  },
  containerBTN: {
    marginTop: MP_DF.large,
  },
  img: {
    width: 250,
    height: 145,
    resizeMode: "contain",
  },
  card: {
    alignSelf: "center",

    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS_DF.white,
    borderRadius: BORDER_RADIUS_DF.medium,
    elevation: 5,
    marginBottom: MP_DF.large,
    height: 250,
  },
  titleCard: {
    textAlign: "center",
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    marginTop: 25,
  },
});
