import React, { useCallback, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeArea } from "../../../../components/safe-area/SafeArea";
import { Parcel } from "../../../../states/UserContext";
import { Parcels } from "../../../../assets/svg";
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from "../../../../config/themes/default";
import { imgCampo } from "../../../../assets/imgs";
import { Btn } from "../../../../components/button/Button";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { storage } from "../../../../config/store/db";
import { TouchableOpacity } from "react-native";
export const MyParcelsScreen = () => {
  const navigation = useNavigation();
  const [parcels, setParcels] = useState([] as Parcel[]);

  useFocusEffect(
    useCallback(() => {
      const parc: Parcel[] = JSON.parse(storage.getString("parcels") || "[]");
      setParcels(parc);
    }, [])
  );

  return (
    <SafeArea>
      <View style={styles.container}>
        {parcels.map((parcel) => CardParcel(parcel, navigation))}
      </View>
    </SafeArea>
  );
};

const CardParcel = (props: Parcel, navigation: any) => {
  //  const user: UserInterface = useContext(UsersContext)

  const certificateND = async () => {};

  return (
    <View style={styles.cardContainer} key={props.name}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderTS}>
          <Text style={styles.cardTitle}>{props.name}</Text>
          <Text
            style={styles.cardST}
          >{`Área de parcela: ${props.hectares} Ha`}</Text>
        </View>
      </View>

      {
        <Btn
          title={!props.polygon ? "Falta dibujar mapa" : "Ver polígono en mapa"}
          onPress={() =>
            !props.polygon
              ? navigation.navigate("PolygonScreen")
              : navigation.navigate("DrawPolygonScreen")
          }
          theme="warning"
          style={containerBTN}
        />
      }
      {props.polygon && (
        <>
          <Btn
            title="Solicitar certificado Propiedad"
            onPress={() => certificateND()}
            theme="agrayu"
            style={containerBTN}
          />
        </>
      )}
      <TouchableOpacity
        /*   onPress={() => {
          navigation.navigate("DrawPolygonScreen");
        }} */
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Parcels></Parcels>
      </TouchableOpacity>
      <Btn
        title="Presione para dibujar"
        icon={"hand-pointer"}
        onPress={() => {}}
        theme="transparent"
        style={containerBTN}
      />
    </View>
  );
};

const containerBTN = {
  container: {
    marginTop: MP_DF.small,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingTop: MP_DF.medium,
  },
  cardContainer: {
    backgroundColor: "white",
    padding: MP_DF.medium,
    borderRadius: MP_DF.small,
    marginBottom: MP_DF.medium,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardHeaderTS: {},
  cardTitle: {
    fontSize: FONT_SIZES.xslarge,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: "bold",
    color: COLORS_DF.citrine_brown,
    marginBottom: MP_DF.small,
  },
  cardST: {
    fontSize: FONT_SIZES.medium,
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.grayLight,
  },
  img: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
});
