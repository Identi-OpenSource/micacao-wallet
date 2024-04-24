import geoViewport from "@mapbox/geo-viewport";
import Mapbox from "@rnmapbox/maps";
import CryptoJS from "crypto-js";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Config from "react-native-config";
import { fundingWallet, newWallet } from "../../../OCC/occ";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { storage } from "../../../config/store/db";
import { TEXTS } from "../../../config/texts/texts";
import {
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from "../../../config/themes/default";
import { useNavigation } from "@react-navigation/native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../config/themes/metrics";
import { UserDispatchContext, UsersContext } from "../../../states/UserContext";
import { SyncDataContext } from "../../../states/SyncDataContext";
Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
const { width, height } = Dimensions.get("window");

export const RegisterOkScreen = () => {
  const [step, setStep] = useState({ step: 0, msg: TEXTS.textH });
  const dispatch = useContext(UserDispatchContext);
  const user = useContext(UsersContext);
  const syncData = useContext(SyncDataContext);
  const { addToSync, toSyncData } = syncData;
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const navigation = useNavigation();

  useEffect(() => {
    initial();
  }, []);

  // Inicializa el proceso de registro
  const initial = async () => {
    await delay(1000);
    setStep({ step: 1, msg: "Encriptando datos..." });
    const dni = await certificateND(user.dni);
    await delay(2000);
    setStep({ step: 2, msg: "Guardando datos..." });
    addToSync(JSON.stringify({ ...user, ...dni }), "userSync");
    await delay(2000);
    setStep({ step: 3, msg: "Sincronizando datos..." });
    toSyncData("userSync");
    await delay(1000);
    setStep({ step: 4, msg: "Creando wallet..." });
    const wallet = newWallet();
    await delay(1500);
    setStep({ step: 5, msg: "Agregando fondos..." });
    const funding = await fundingWallet(wallet.walletOFC).catch(() => ({
      status: 500,
    }));
    const isFunding = funding.status === 200;
    storage.set("wallet", JSON.stringify({ wallet, isFunding }));
    await delay(2000);
    setStep({ step: 6, msg: "Descargando mapa..." });
    descargarMapaTarapoto();
    descargarMapaQuito();
    await delay(1000);
    setStep({ step: 7, msg: "Inicio de sesión..." });
    await delay(1500);
    addToSync(JSON.stringify({ ...user, ...dni, isLogin: true }), "user");
    await delay(1500);
    const login = JSON.parse(storage.getString("user") || "{}");
    dispatch({ type: "login", payload: login });
  };

  // Encripta el DNI
  const certificateND = async (dni: string) => {
    const paddedDNI = dni.padStart(16, "0");
    const utf8Key = CryptoJS.enc.Utf8.parse(Config.KEY_CIFRADO_KAFE_SISTEMAS);
    const utf8DNI = CryptoJS.enc.Utf8.parse(paddedDNI);
    const encrypted = CryptoJS.AES.encrypt(utf8DNI, utf8Key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const hexResult = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return { dni: hexResult.substr(0, 32), dniAll: hexResult };
  };

  const descargarMapaTarapoto = async () => {
    const bounds: [number, number, number, number] = geoViewport.bounds(
      [-78.5442722, -0.1861084],
      17,
      [width, height],
      512
    );

    const options = {
      name: "TarapotoMapTest",
      styleURL: Mapbox.StyleURL.Satellite,
      bounds: [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ] as [[number, number], [number, number]],
      minZoom: 10,
      maxZoom: 20,
      metadata: {
        whatIsThat: "foo",
      },
    };
    await Mapbox.offlineManager
      .createPack(
        options,
        (region, status) => {
          console.log("=> progress callback region:", "status: ", status);
        },
        (error) => {
          console.log("=> error callback error:", error);
        }
      )
      .catch(() => {
        console.log("=> Mapa descargado");
      });
  };
  const descargarMapaQuito = async () => {
    const bounds: [number, number, number, number] = geoViewport.bounds(
      [-78.4678, -0.1807],
      12,
      [width, height],
      512
    );

    const options = {
      name: "QuitoMapTest",
      styleURL: Mapbox.StyleURL.Satellite,
      bounds: [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ] as [[number, number], [number, number]],
      minZoom: 10,
      maxZoom: 20,
      metadata: {
        whatIsThat: "foo",
      },
    };
    await Mapbox.offlineManager
      .createPack(
        options,
        (region, status) => {
          console.log("=> progress callback region:", "status: ", status);
          console.log(
            "Progreso de descarga:",
            status.percentage + "% completado"
          );
        },
        (error) => {
          console.log("=> error callback error:", error);
        }
      )
      .catch(() => {
        console.log("=> Mapa Quito descargado");
      });
  };

  return (
    <SafeArea bg={"isabelline"}>
      <ActivityIndicator
        size={moderateScale(86)}
        color={COLORS_DF.citrine_brown}
        style={styles.indicador}
      />
      <View style={[styles.container]}>
        <View style={styles.textContainer}>
          <Text style={[styles.textA]}>{TEXTS.textG}</Text>
          <Text style={[styles.textB]}>{step.msg}</Text>
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
  indicador: {
    marginTop: verticalScale(MP_DF.xxlarge * 2),
    marginBottom: verticalScale(MP_DF.large),
  },
  img: {
    width: 120,
    height: 120,
    alignSelf: "center",
  },
  textContainer: { flex: 1 },
  textA: {
    fontFamily: FONT_FAMILIES.primary,
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
});
