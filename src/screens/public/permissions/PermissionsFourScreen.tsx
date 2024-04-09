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
import { modal_camara } from "../../../assets/imgs";
import { UsersContext } from "../../../states/UserContext";
import { RootStackParamList } from "../../../routers/Router";
import { Camera_M, Camera_W } from "../../../assets/svg";
export const PermissionsFourScreen = () => {
  const user = useContext(UsersContext);
  const navigation = useNavigation();
  // request permission to use location

  const requestPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: TEXTS.textU,
            message: TEXTS.textX,
            buttonNeutral: LABELS.AskMeLater,
            buttonNegative: LABELS.cancel,
            buttonPositive: LABELS.permission,
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          let initialRouteName: keyof RootStackParamList = "TabPrivate";
          if (!user.isLogin) {
            initialRouteName = "RegisterScreen";
          }
          if (user.isLogin && user?.parcel?.length === 0) {
            initialRouteName = "RegisterParcelScreen";
          }
          console.log("initialRouteName", initialRouteName);
          navigation.navigate(initialRouteName);
        } else {
          console.log("Camera permission denied");
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <SafeArea bg={"neutral"}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.textB]}>{""}</Text>
          {user.gender === "M" && <Camera_M />}
          {user.gender === "W" && <Camera_W />}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "75%",
              width: "100%",
            }}
          >
            <Image source={modal_camara} style={styles.img} />
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
    width: "100%",
    height: "60%",
    alignSelf: "center",
    marginLeft: 25,
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
