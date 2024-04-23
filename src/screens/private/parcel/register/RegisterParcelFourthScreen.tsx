import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import {
  CameraType,
  MediaType,
  PhotoQuality,
  launchCamera,
} from "react-native-image-picker";
import { imgCentro, imgCentroF } from "../../../../assets/imgs";
import { Center_Parcel_M, Center_Parcel_W } from "../../../../assets/svg";
import { Btn } from "../../../../components/button/Button";
import {
  HeaderActions,
  SafeArea,
} from "../../../../components/safe-area/SafeArea";
import { storage } from "../../../../config/store/db";
import { MSG_ERROR } from "../../../../config/texts/erros";
import { LABELS } from "../../../../config/texts/labels";
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  DWH,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from "../../../../config/themes/default";
import { STYLES_GLOBALS } from "../../../../config/themes/stylesGlobals";
import { UserInterface, UsersContext } from "../../../../states/UserContext";

interface RegisterParcelFourthScreenProps {
  navigation: any;
}
const RegisterParcelFourthScreen: React.FC<RegisterParcelFourthScreenProps> = ({
  navigation,
}) => {
  const user: UserInterface = useContext(UsersContext);
  const [gps, setGps] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imgP2, setImgP2] = useState("");

  // capture photo
  const photo = async () => {
    // capture photo
    const options = {
      mediaType: "photo" as MediaType,
      quality: 0.5 as PhotoQuality,
      cameraType: "back" as CameraType,
      includeBase64: true,
      saveToPhotos: false,
    };
    const result = await launchCamera(options);
    if (result.didCancel) {
      return;
    }
    if (result.errorMessage) {
      Alert.alert(LABELS.error, result.errorMessage);
      return;
    }
    result.assets && getGps(result.assets[0]);
  };

  // capture GPS
  const getGps = (img: any) => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          setImgP2(img.base64);
          setLoading(false);
          setGps(position);
        }, 1500);
      },
      (error) => {
        console.log(error);
        errorAlert();
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  };

  const errorAlert = () => {
    Alert.alert(LABELS.error, MSG_ERROR.notGps, [
      {
        text: LABELS.cancel,
        onPress: () => console.log("Cancel Pressed"),
      },
      {},
      {
        text: LABELS.capturePhoto,
        onPress: () => {
          photo();
        },
      },
    ]);
  };

  const onSubmit = () => {
    const parcelTemp = JSON.parse(storage.getString("parcelTemp") || "{}");
    const parcels = JSON.parse(storage.getString("parcels") || "[]");
    const secondPoint = [gps?.coords?.latitude, gps?.coords.longitude];
    const addParcel = [
      ...parcels,
      { ...parcelTemp, secondPoint /* imgP2,  */ },
    ];
    storage.set("parcels", JSON.stringify(addParcel));
    navigation.navigate("TabPrivate");
  };

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <HeaderActions title={""} navigation={navigation} />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {user.gender == "M" && <Center_Parcel_M />}
          {user.gender == "W" && <Center_Parcel_W />}
        </View>
        <View style={styles.formContainer}>
          <View style={styles.formInput}>
            {!loading ? (
              <ImageBackground
                source={user.gender === "W" ? imgCentroF : imgCentro}
                style={styles.containerImg}
              />
            ) : (
              <View style={styles.containerImg}>
                <ActivityIndicator
                  size={100}
                  color={COLORS_DF.robin_egg_blue}
                />
              </View>
            )}

            {loading && gps === null && (
              <Text style={styles.textUnique}>Guardando foto</Text>
            )}
            {!loading && gps !== null && (
              <Text style={styles.textUnique}>Foto guardada con éxito</Text>
            )}
          </View>
          <View style={STYLES_GLOBALS.formBtn}>
            <Btn
              title={gps === null ? LABELS.capturePhoto : LABELS.next}
              theme={!loading ? "agrayu" : "agrayuDisabled"}
              disabled={loading}
              onPress={gps === null ? photo : onSubmit}
            />
          </View>
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingTop: MP_DF.small,
  },
  formContainer: {
    flex: 1,
  },
  formInput: {
    flex: 1,
    alignItems: "center",
    paddingTop: MP_DF.large,
  },
  containerImg: {
    width: DWH.width * 0.8,
    height: DWH.height * 0.4,
    borderRadius: BORDER_RADIUS_DF.large,
    overflow: "hidden",
    justifyContent: "center",
  },
  textUnique: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xslarge,
    fontWeight: "bold",
    lineHeight: FONT_SIZES.xslarge * 1.5,
    color: COLORS_DF.citrine_brown,
    marginTop: MP_DF.xxlarge,
  },
  textUniqueUPPER: {
    textTransform: "uppercase",
    textDecorationLine: "underline",
    fontSize: FONT_SIZES.xslarge * 1.2,
  },
});

export default RegisterParcelFourthScreen;
