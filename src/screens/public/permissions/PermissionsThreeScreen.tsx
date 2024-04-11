import React, { useContext } from "react";
import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../config/themes/metrics";
import {
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from "../../../config/themes/default";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { TEXTS } from "../../../config/texts/texts";
import { Btn } from "../../../components/button/Button";
import { LABELS } from "../../../config/texts/labels";
import { useNavigation } from "@react-navigation/native";
import { modal_location, imgGPS } from "../../../assets/imgs";
import { UsersContext } from "../../../states/UserContext";
import { Location_M, Location_W, LocationPermision } from "../../../assets/svg";
import { Header } from "../register/RegisterScreen";

export const PermissionsThreeScreen = () => {
  const navigation = useNavigation();
  // request permission to use location

  const requestPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: TEXTS.textT,
            message: TEXTS.textW,
            buttonNeutral: LABELS.AskMeLater,
            buttonNegative: LABELS.cancel,
            buttonPositive: LABELS.permission,
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          navigation.navigate("PermissionsFourScreen");
        } else {
          console.log("Camera permission denied");
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const user = useContext(UsersContext);
  return (
    <SafeArea bg={"isabelline"}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.textB]}>{""}</Text>
          {user.gender === "M" && <Location_M />}
          {user.gender === "W" && <Location_W />}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LocationPermision style={styles.img} width={350} height={390} />
          </View>
        </View>
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.continue}
            theme="agrayu"
            onPress={() => requestPermission()}
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
    alignSelf: "center",
    marginLeft: 35,
    marginTop: 45,
  },
  textContainer: {
    flex: 1,
  },
  textA: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(32),
    fontWeight: "700",
    textAlign: "left",
    color: COLORS_DF.cacao,
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: "500",
    lineHeight: 36,
    color: COLORS_DF.cacao,
    marginTop: MP_DF.large,
  },
  formBtn: {
    justifyContent: "flex-end",
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
});
