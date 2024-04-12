import React, { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeArea } from "../../../../components/safe-area/SafeArea";
import { ScreenProps } from "../../../../routers/Router";
import { TEXTS } from "../../../../config/texts/texts";
import {
  COLORS_DF,
  DWH,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from "../../../../config/themes/default";
import { imgCampo } from "../../../../assets/imgs";
import { Btn } from "../../../../components/button/Button";
import { LABELS } from "../../../../config/texts/labels";
import { UserInterface, UsersContext } from "../../../../states/UserContext";
import { Card } from "@rneui/base";
import { ParcelColor } from "../../../../assets/svg";
export const RegisterParcelScreen = ({
  navigation,
}: ScreenProps<"RegisterParcelScreen">) => {
  const user: UserInterface = useContext(UsersContext);

  return (
    <SafeArea bg="isabelline">
      <View style={styles.container}>
        <Profile {...user} />
        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterOneScreen")}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "50%",
            marginTop: 25,
          }}
        >
          <Card
            containerStyle={{
              width: "95%",
              height: "90%",
              elevation: 5,
              borderRadius: 7,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ParcelColor style={styles.svg} />
            <Text style={styles.subTitle}>Registra tu parcela</Text>
          </Card>
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
};
const Profile = ({ name }: UserInterface) => {
  const firstName = name.split(" ")[0];
  return <Text style={styles.textName}>Hola {firstName}</Text>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: MP_DF.large,
    paddingVertical: 40,
  },
  title: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "700",
    color: COLORS_DF.citrine_brown,
    textAlign: "center",
  },
  containerImg: {
    marginTop: MP_DF.xxlarge * 1.5,
    width: DWH.width * 0.8,
    height: DWH.height * 0.4,
    resizeMode: "contain",
  },
  subTitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xslarge,
    fontWeight: "700",
    color: COLORS_DF.citrine_brown,
    marginHorizontal: MP_DF.medium,
    marginTop: MP_DF.xxlarge * 1.5,
    textAlign: "center",
  },
  textName: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    fontSize: 30,
  },
  btn: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    marginTop: MP_DF.xxlarge,
  },
  svg: {
    marginLeft: 20,
  },
});
