/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : View of entry point of the application
 */

import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import Logo from "../../../assets/svg/initMan.svg";
import { Btn } from "../../../components/button/Button";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { LABELS } from "../../../config/texts/labels";
import { TEXTS } from "../../../config/texts/texts";
import {
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from "../../../config/themes/default";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../config/themes/metrics";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../../states/AuthContext";
import { ConnectionContext } from "../../../states/ConnectionContext";

export const HomeScreen = () => {
  const internetConnection = useContext(ConnectionContext);
  const { isConnected } = internetConnection;

  const navigation = useNavigation();
  const authenticationToken = useContext(AuthContext);
  const { getToken } = authenticationToken;
  /*   const showToast = () => {
    Toast.show({
      type: "syncToast",
      text1: "No se pudo crear la billetera, inténtelo en otro momento",
      onHide: () => {
        console.log("Toast oculto");
      },
    });
  }

  }; */

  return (
    <SafeArea bg={"isabelline"}>
      <Logo width={390} height={390} style={styles.svg} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.textA]}>{TEXTS.textA}</Text>
          <Text style={[styles.textB]}>{TEXTS.textB}</Text>
        </View>
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.createAccount}
            theme="agrayu"
            onPress={() => {
              if (isConnected) {
                getToken();
                navigation.navigate("IamScreen");
              } else {
                Toast.show({
                  type: "syncToast",
                  text1:
                    "¡Recuerda que necesitas estar conectado para crear tu cuenta!",
                  onHide: () => {
                    console.log("Toast oculto");
                  },
                });
              }
            }}
          />
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
  },
  img: {
    width: horizontalScale(306),
    height: verticalScale(306),
    alignSelf: "center",
  },
  textContainer: { flex: 1 },
  textA: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: moderateScale(32),
    fontWeight: "700",
    textAlign: "center",
    color: COLORS_DF.citrine_brown,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: "500",
    textAlign: "center",
    color: COLORS_DF.citrine_brown,
  },
  formBtn: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
  svg: {
    alignSelf: "center",
  },
});
