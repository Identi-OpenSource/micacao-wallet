import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import HeaderComponent from "../../../components/Header";
import { Btn } from "../../../components/button/Button";
import { COLORS_DF, MP_DF } from "../../../config/themes/default";
export const HelpScreen = () => {
  const onPress = () => {
    Linking.openURL("whatsapp://send?phone=+5117064556").catch(() => {
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.whatsapp"
      );
    });
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        label="Ayuda"
        goBack={true}
        backgroundColor="#8F3B06"
        textColor="white"
      />
      <View style={{ paddingHorizontal: 24, paddingVertical: 25 }}>
        <Text style={styles.subTitle}>¿Cómo te podemos ayudar?</Text>

        {/* {[1, 2, 3, 4].map((i) => (
            <View style={styles.cardContenedor} key={i}>
              <Text style={styles.titleCard}>FAQ Nº {i}</Text>
              <View style={styles.actionsCard}>
                <FontAwesomeIcon
                  icon="arrow-right"
                  color={COLORS_DF.citrine_brown}
                />
                <Image source={imgCacao} style={styles.img} />
              </View>
            </View>
          ))} */}
        <Btn
          title={"Conversa con un asesor"}
          theme="agrayu"
          icon={"fa-brands fa-whatsapp"}
          onPress={onPress}
          style={{ container: { marginVertical: MP_DF.large } }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_DF.isabelline,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS_DF.citrine_brown,
  },
  cardContainer: {
    marginTop: MP_DF.large,
  },
  cardContenedor: {
    height: 100,
    backgroundColor: COLORS_DF.white,
    padding: MP_DF.medium,
    borderRadius: 10,
    elevation: 3,
    marginBottom: MP_DF.medium,
  },
  titleCard: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS_DF.citrine_brown,
  },
  actionsCard: {
    paddingVertical: MP_DF.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  img: {
    width: 30,
    height: 30,
  },
});
