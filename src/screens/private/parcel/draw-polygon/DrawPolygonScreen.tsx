/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from "@react-navigation/native";
import { Card } from "@rneui/base";
import { CheckBox } from "@rneui/themed";
import Mapbox, {
  Camera,
  FillLayer,
  LineLayer,
  MapView,
  ShapeSource,
  StyleURL,
} from "@rnmapbox/maps";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Config from "react-native-config";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import { Baba, Seco, Add } from "../../../../assets/svg";
import HeaderComponent from "../../../../components/Header";
import { storage } from "../../../../config/store/db";
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
} from "../../../../config/themes/default";
import { ConnectionContext } from "../../../../states/ConnectionContext";
import { useGfwContext } from "../../../../states/GfwContext";
import { useKafeContext } from "../../../../states/KafeContext";
import DrawPolyline from "./DrawPolyline";

if (Config.MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
}
const { width, height } = Dimensions.get("window");
type Position = [number, number];

const lineLayerStyle = {
  lineColor: "#22C55E",
  lineWidth: 2,
};
const fillLayerStyle = {
  fillColor: "#22C55E",
  fillOpacity: 0.5,
};

const Polygon = ({ coordinates }: { coordinates: Position[] }) => {
  const features: GeoJSON.FeatureCollection = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "a-feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
          properties: {},
        } as const,
      ],
    };
  }, [coordinates]);
  return (
    <ShapeSource id="shape-source-id" shape={features}>
      <FillLayer id="fill-layer" style={fillLayerStyle} />
      <LineLayer id="line-layer" style={lineLayerStyle} />
    </ShapeSource>
  );
};

export const DrawPolygonScreen = () => {
  const parcel = JSON.parse(storage.getString("parcels") || "[]");
  const firstPoint = [
    Number(parcel[0].firstPoint[1]),
    Number(parcel[0].firstPoint[0]),
  ] as Position;
  const [coordinates, setCoordinates] = useState<Position[]>([firstPoint]);
  const [lastCoordinate] = useState<Position>(firstPoint);
  const [started] = useState(true);
  const navigation = useNavigation();
  const [sumaTotalVentas, setSumaTotalVentas] = useState(0);
  const {
    postGfw,
    getGfw,
    gfwData,
    loadingGfw,
    getData,
    errorGfw,
  } = useGfwContext();
  const {} = useKafeContext();
  const internetConnection = useContext(ConnectionContext);
  const { isConnected } = internetConnection;
  useEffect(() => {
    // Obtener la suma total de ventas del almacenamiento local al cargar el componente
    calcularSumaVentas();
  }, []);
  useEffect(() => {
    // eliminar polygonTemp
    //storage.delete('polygonTemp')
    // si existe el poligono dentro de la parcela
    if (parcel[0].polygon) {
      setCoordinates(parcel[0].polygon);
    } else {
      if (storage.getString("polygonTemp")) {
        const coordinateTemp = JSON.parse(
          storage.getString("polygonTemp") || ""
        );
        console.log("=> polygonTemp", coordinateTemp);
        setCoordinates(coordinateTemp);
      }
    }
  }, []);

  const coordinatesWithLast = useMemo(() => {
    const newCoordinates = [...coordinates, lastCoordinate];
    return [...newCoordinates];
  }, [coordinates]);
  const map = useRef<MapView>(null);

  const calcularSumaVentas = () => {
    const salesString = storage.getString("sales") || "[]";
    const sales = JSON.parse(salesString);

    const sumaPorTipo = sales.reduce((acumulador: any, dato: any) => {
      if (dato.type) {
        acumulador[dato.type] =
          (acumulador[dato.type] || 0) + parseInt(dato.kl);
      }
      return acumulador;
    }, {});

    setSumaTotalVentas(sumaPorTipo);
  };

  const submitPost = () => {
    if (isConnected) {
      postGfw();
    } else {
      Toast.show({
        type: "syncToast",
        text1: "¡Recuerda que necesitas estar conectado a internet !",
      });
    }
  };
  const submitGet = () => {
    if (isConnected) {
      getGfw();
    } else if (JSON.stringify(getData) !== "{}") {
      toastGetData();
    } else {
      Toast.show({
        type: "syncToast",
        text1: "¡Recuerda que necesitas estar conectado a internet !",
      });
    }
  };
  const toastGetData = () => {
    switch (getData.status) {
      case "Pending":
        Toast.show({
          type: "yellowToast",
          text1: "No encontramos respuesta alguna. Intente más tarde",
          visibilityTime: 8000,
        });
        break;

      case "Completed":
        Toast.show({
          type:
            getData.data?.deforestation_kpis[0].IsCoverage === true
              ? "happyToast"
              : "redSadToast",
          text1: "Coeficientes:",
          visibilityTime: 8000,
          text2: `Bosque conservado:${getData.data?.deforestation_kpis[0]["Natural Forest Coverage (HA) (Beta)"]} Bosque perdido:${getData.data?.deforestation_kpis[0]["Natural Forest Loss (ha) (Beta)"]}`,
        });

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    toastGetData();
  }, [getData]);

  useEffect(() => {
    if (errorGfw != null)
      Toast.show({
        type: "syncToast",
        text1: errorGfw.toString(),
      });
  }, [errorGfw]);

  const getKafe = JSON.parse(storage.getString("getKafeData") || "{}");

  const getBackgroundColor = () => {
    switch (getKafe.state) {
      case "ok":
        return "#22C55E"; // verde
      case "notapproved":
        return "#EF4444"; // Rojo
      case "onhold":
      default:
        return "#F59E0B"; // Anaranjado por defecto si está en espera
    }
  };
  const getMessage = () => {
    switch (getKafe.state) {
      case "ok":
        return "Estado de titularidad aprobado ";
      case "not approved":
        return "Estado de titularidad no aprobado ";
      case "on hold":
      default:
        return "Estado de titularidad en espera ";
    }
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLORS_DF.isabelline,
        }}
      >
        <HeaderComponent
          label="Mis parcelas"
          goBack={true}
          goBackNavigation={() => {
            navigation.navigate("HomeProvScreen");
          }}
          backgroundColor="#8F3B06"
          textColor="white"
        />
        <Spinner
          textContent="Enviando Consulta"
          textStyle={{ color: COLORS_DF.citrine_brown }}
          overlayColor="rgba(255, 255, 255, 0.7)" // Aquí se establece el color del overlay
          color="#178B83"
          visible={loadingGfw}
          size={100}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              width: width * 0.9,
              height: height * 0.07,
              justifyContent: "center",
              alignItems: "center",
              borderColor: COLORS_DF.robin_egg_blue,
              borderWidth: 1,
              borderRadius: 5,
              flexDirection: "row",
            }}
            onPress={() => {
              navigation.navigate("RegisterOneScreen");
            }}
          >
            <Text
              style={{
                color: COLORS_DF.robin_egg_blue,
                fontSize: width * 0.045,
                marginRight: 2,
              }}
            >
              Registrar mas parcelas{" "}
            </Text>
            <Add />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            justifyContent: "center",
          }}
        >
          <Text style={styles.title}>Información de ventas</Text>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Card
              containerStyle={{
                width: "45%",
                alignSelf: "center",
                height: 200,
                borderRadius: 7,
                elevation: 5,
                paddingHorizontal: 15,
                marginRight: 1,
              }}
            >
              <View>
                <Text style={styles.kg}>Seco</Text>
              </View>
              <Seco width={40} height={40} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "50%",
                  marginTop: 5,
                }}
              >
                <Text style={styles.kg}>
                  {sumaTotalVentas.SECO}{" "}
                  <Text style={{ fontWeight: "normal", marginLeft: 45 }}>
                    {" "}
                    Kg.
                  </Text>{" "}
                </Text>
              </View>
              <View style={{ marginTop: 15 }}>
                <Text>vendidos a </Text>
              </View>
              <Text style={{ color: COLORS_DF.citrine_brown }}>S/.</Text>
            </Card>
            <Card
              containerStyle={{
                width: "45%",
                alignSelf: "center",
                height: 200,
                borderRadius: 7,
                elevation: 5,
                paddingHorizontal: 20,
                marginRight: 45,
              }}
            >
              <View>
                <Text style={styles.kg}>Baba</Text>
              </View>
              <Baba width={40} height={40} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: 5,
                }}
              >
                <Text style={styles.kg}>
                  {sumaTotalVentas.BABA}{" "}
                  <Text style={{ fontWeight: "normal" }}>Kg.</Text>{" "}
                </Text>
              </View>
              <View style={{ marginTop: 15 }}>
                <Text>vendidos a </Text>
              </View>
              <Text style={{ color: COLORS_DF.citrine_brown }}>S/.</Text>
            </Card>
          </View>
          <Text style={styles.title}>Mapa de parcela</Text>
        </View>
        <View style={styles.containerButtonGFW}>
          <TouchableOpacity
            onPress={submitPost}
            style={{
              backgroundColor:
                JSON.stringify(gfwData) !== "{}"
                  ? COLORS_DF.lightBlue
                  : COLORS_DF.robin_egg_blue,
              height: 44,
              borderRadius: 5,
              justifyContent: "center",
              marginTop: 15,
            }}
            disabled={JSON.stringify(gfwData) !== "{}"}
          >
            <Text style={styles.textGfw}>
              Solicitar verificación No Deforestación
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={submitGet}
            style={{
              backgroundColor:
                JSON.stringify(gfwData) === "{}"
                  ? COLORS_DF.lightBlue
                  : COLORS_DF.robin_egg_blue,
              height: 44,
              borderRadius: 5,
              justifyContent: "center",
              marginTop: 15,
            }}
            disabled={JSON.stringify(gfwData) === "{}"}
          >
            <Text style={styles.textGfw}>
              Consultar verificación No Deforestación
            </Text>
          </TouchableOpacity>
        </View>
        <Card
          containerStyle={{
            borderRadius: 7,
            elevation: 5,
            height: "auto",
          }}
        >
          <View
            style={{
              backgroundColor: getBackgroundColor(),
              alignItems: "center",
              width: "100%",
              borderRadius: 5,
              marginBottom: 15,
              height: 25,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>{getMessage()}</Text>
          </View>
          <MapView
            ref={map}
            // key={coordinates.length}
            styleURL={StyleURL.Satellite}
            scaleBarEnabled={false}
            rotateEnabled={false}
            attributionEnabled={false}
            compassEnabled={false}
            logoEnabled={false}
            style={{
              height: height * 0.4,
              width: width * 0.8,
              alignSelf: "center",
            }}
          >
            <Polygon coordinates={coordinatesWithLast} />
            {started && <Polygon coordinates={coordinatesWithLast} />}
            <Camera
              defaultSettings={{
                centerCoordinate: firstPoint,
                zoomLevel: 17,
              }}
            />
          </MapView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: 200,
            }}
          >
            <View style={{ width: 49 }}>
              <CheckBox
                checkedIcon="dot-circle-o"
                uncheckedIcon="dot-circle-o"
                uncheckedColor="#8F3B06"
                checkedColor="  #8F3B06"
                size={25}
              />
            </View>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.primary,
                color: COLORS_DF.citrine_brown,
                fontSize: 15,
                marginRight: 45,
              }}
            >
              Póligono de área
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZES.large,
    fontFamily: FONT_FAMILIES.bold,

    color: COLORS_DF.citrine_brown,
    top: 10,
  },
  kg: {
    fontSize: FONT_SIZES.small,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: "bold",
    color: COLORS_DF.citrine_brown,
  },
  cacaoProducer: {
    fontSize: FONT_SIZES.small,
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.gray,
    top: 10,
  },
  containerButtonGFW: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  buttonGfw: {
    backgroundColor: COLORS_DF.robin_egg_blue,
    height: 44,
    borderRadius: 5,
    justifyContent: "center",
    marginTop: 15,
  },
  textGfw: {
    textAlign: "center",
    color: "#FFF",
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 16,
  },
});
export default DrawPolyline;

const metadata = {
  title: "Draw Polyline",
  tags: [
    "LineLayer",
    "ShapeSource",
    "onCameraChanged",
    "getCoordinateFromView",
    "Overlay",
  ],
  docs: `This example shows a simple polyline editor. It uses \`onCameraChanged\` to get the center of the map and \`getCoordinateFromView\` 
  to get the coordinates of the crosshair.
  
  The crosshair is an overlay that is positioned using \`onLayout\` and \`getCoordinateFromView\`.
  
  The \`ShapeSource\` is updated with the new coordinates and the \`LineLayer\` is updated with the new coordinates.`,
};

DrawPolyline.metadata = metadata;
