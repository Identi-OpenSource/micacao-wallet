import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { imgCacao } from "../../../assets/imgs";
import { Btn } from "../../../components/button/Button";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { COLORS_DF, MP_DF } from "../../../config/themes/default";
export const HelpScreen = () => {
  const onPress = () => {
    Linking.openURL("whatsapp://send?phone=+5117064556").catch(() => {
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.whatsapp"
      );
    });
  };
  const navigation = useNavigation();
  return (
    <SafeArea bg={"isabelline"}>
      <View style={styles.container}>
        <Text style={styles.subTitle}>¿Cómo te podemos ayudar?</Text>
        <ScrollView
          style={styles.cardContainer}
          showsVerticalScrollIndicator={false}
        >
          {[1, 2, 3, 4].map((i) => (
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
          ))}
          <Btn
            title={"Conversa con un asesor"}
            theme="agrayu"
            icon={"fa-brands fa-whatsapp"}
            onPress={onPress}
            style={{ container: { marginVertical: MP_DF.large } }}
          />
        </ScrollView>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
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
