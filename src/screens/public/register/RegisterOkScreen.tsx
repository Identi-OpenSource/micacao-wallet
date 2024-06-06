import geoViewport from "@mapbox/geo-viewport";
import Mapbox from "@rnmapbox/maps";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Config from "react-native-config";
import { newWallet, fundingWallet } from "../../../OCC/occ";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { storage } from "../../../config/store/db";
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
import { UserDispatchContext, UsersContext } from "../../../states/UserContext";
import { useMapContext } from "../../../states/MapContext";
import { useSyncData } from "../../../states/SyncDataContext";
Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
const { width, height } = Dimensions.get("window");

export const RegisterOkScreen = () => {
  const [step, setStep] = useState({ step: 0, msg: TEXTS.textH });
  const dispatch = useContext(UserDispatchContext);
  const user = useContext(UsersContext);
  const { map } = useMapContext();
  const { addToSync } = useSyncData();
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    initial();
  }, []);
  useEffect(() => {
    console.log("aqui esta la data", map);
  }, []);
  // Inicializa el proceso de registro
  const initial = async () => {
    setStep({ step: 1, msg: "Creando billetera..." });
    const wallet = newWallet();
    await delay(1500);
    setStep({ step: 2, msg: "Agregando fondos..." });
    const funding = await fundingWallet(wallet.walletOFC).catch(() => ({
      status: 500,
    }));
    const isFunding = funding.status === 200;

    console.log({ wallet, isFunding });

    storage.set("wallet", JSON.stringify({ wallet, isFunding }));
    await delay(2000);
    setStep({
      step: 2,
      msg: "Descargando mapa...",
    });
    descargarMapa(), await delay(1000);
    setStep({ step: 3, msg: "Inicio de sesión..." });
    await delay(1500);
    addToSync(JSON.stringify({ ...user, isLogin: true, syncUp: true }), "user");
    await delay(1500);
    const login = JSON.parse(storage.getString("user") || "{}");
    dispatch({ type: "login", payload: login });
  };

  const descargarMapa = async () => {
    const minx = parseFloat(map.minx_point);
    const maxx = parseFloat(map.maxx_point);
    const miny = parseFloat(map.miny_point);
    const maxy = parseFloat(map.maxy_point);

    console.log("minxpoint ", minx);
    console.log("maxxpoint ", maxx);
    console.log("miny_point ", miny);
    console.log("maxy_point ", maxy);
    // Calcular el centro del área del mapa
    const centerLng = (minx + maxx) / 2;
    const centerLat = (miny + maxy) / 2;

    console.log("latitud", centerLat);
    console.log("longitud", centerLng);

    // Calcular los límites del área del mapa
    const bounds: [number, number, number, number] = geoViewport.bounds(
      [centerLng, centerLat],

      17,
      [width, height],
      512
    );

    const options = {
      name: "MapTest",
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
          console.log("=> descargando mapa :", "status: ", status);
        },
        (error) => {
          console.log("=> error callback error:", error);
        }
      )
      .catch(() => {
        console.log("=> Mapa descargado");
      });
  };
  /*  const descargarMapaQuito = async () => {
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
  }; */

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
