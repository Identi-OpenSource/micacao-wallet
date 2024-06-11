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
import { Baba, Seco } from "../../../../assets/svg";
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

export const DrawPolygonScreen = ({ route }: any) => {
  const { index } = route.params;

  const parcel = JSON.parse(storage.getString("parcels") || "[]");
  const firstPoint = [
    Number(parcel[index].firstPoint[1]),
    Number(parcel[index].firstPoint[0]),
  ] as Position;
  const [coordinates, setCoordinates] = useState<Position[]>([firstPoint]);
  const [lastCoordinate] = useState<Position>(firstPoint);
  const [existData, setExistData] = useState<any>(false);
  const [existDataGet, setExistDataGet] = useState<any>(false);
  const [dataGet, setDataGet] = useState<any>({});
  const [started] = useState(true);
  const navigation = useNavigation();
  const [sumaTotalVentas, setSumaTotalVentas] = useState<any>({});
  const [totalVentas, setTotalVentas] = useState<any>({});
  const user = JSON.parse(storage.getString("user") || "{}");
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
    calcularVentas();
  }, []);

  useEffect(() => {
    checkIfDataExists();
    checkIfDataExistsGet();
  }, [getData, gfwData]);
  useEffect(() => {
    // eliminar polygonTemps
    //storage.delete('polygonTemp')
    // si existe el poligono dentro de la parcela
    if (parcel[index].polygon) {
      setCoordinates(parcel[index].polygon);
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
    const sumKlByParcelaAndType = sumKilosByParcelaAndType(sales);
    setSumaTotalVentas(sumKlByParcelaAndType);
  };

  const sumKilosByParcelaAndType = (data: any) => {
    const sumByParcelaAndType = {};

    data.forEach((item) => {
      const key = `${item.parcela}_${item.type}`;
      const kilos = item.kl;

      // Si la clave ya está en el objeto sumByParcelaAndType, agregamos los kilos, de lo contrario, inicializamos con los kilos actuales
      sumByParcelaAndType[key] = sumByParcelaAndType[key]
        ? sumByParcelaAndType[key] + kilos
        : kilos;
    });

    return sumByParcelaAndType;
  };
  const checkIfDataExists = () => {
    let exist_data = false;
    for (let i = 0; i < gfwData.length; i++) {
      if (gfwData[i].index === index) {
        exist_data = true;
      }
    }
    setExistData(exist_data);
  };
  const checkIfDataExistsGet = () => {
    let exist_data_get = false;
    console.log("getdata", getData);
    for (let i = 0; i < getData.length; i++) {
      if (getData[i].index === index) {
        setDataGet(getData[i].data);
        exist_data_get = true;
      }
    }
    setExistDataGet(exist_data_get);
  };
  const sumTotalByParcelaAndType = (data: any) => {
    const sumTotalByParcelaAndType = {};

    data.forEach((item: any) => {
      const key = `${item.parcela}_${item.type}`;
      const total = item.kl * parseFloat(item.precio);

      // Si la clave ya está en el objeto sumByParcelaAndType, agregamos los kilos, de lo contrario, inicializamos con los kilos actuales
      sumTotalByParcelaAndType[key] = sumTotalByParcelaAndType[key]
        ? sumTotalByParcelaAndType[key] + total
        : total;
    });

    return sumTotalByParcelaAndType;
  };

  const calcularVentas = () => {
    const salesString = storage.getString("sales") || "[]";
    const sales = JSON.parse(salesString);

    const sumTlByParcelaAndType = sumTotalByParcelaAndType(sales);

    console.log("sumTlByParcelaAndType", sumTlByParcelaAndType);

    setTotalVentas(sumTlByParcelaAndType);
  };

  const submitPost = () => {
    if (isConnected) {
      postGfw(index);
    } else {
      Toast.show({
        type: "syncToast",
        text1: "¡Recuerda que necesitas estar conectado a internet !",
      });
    }
  };
  const submitGet = () => {
    if (isConnected) {
      getGfw(index);
    } else if (JSON.stringify(dataGet) !== "{}") {
      toastGetData();
    } else {
      Toast.show({
        type: "syncToast",
        text1: "¡Recuerda que necesitas estar conectado a internet !",
      });
    }
  };
  const toastGetData = () => {
    switch (dataGet?.status) {
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
            dataGet.data?.deforestation_kpis[0].IsCoverage === true
              ? "happyToast"
              : "redSadToast",
          text1: "Coeficientes:",
          visibilityTime: 8000,
          text2: `Bosque conservado:${dataGet.data?.deforestation_kpis[0]["Natural Forest Coverage (HA) (Beta)"]} Bosque perdido:${dataGet.data?.deforestation_kpis[0]["Natural Forest Loss (ha) (Beta)"]}`,
        });

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    toastGetData();
  }, [dataGet]);

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
            navigation.goBack();
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
                  {sumaTotalVentas[`${parcel[index]["id"]}_SECO`]}{" "}
                  <Text style={{ fontWeight: "normal", marginLeft: 45 }}>
                    {" "}
                    Kg.
                  </Text>{" "}
                </Text>
              </View>
              <View style={{ marginTop: 15 }}>
                <Text>vendidos a </Text>
              </View>
              <Text style={{ color: COLORS_DF.citrine_brown }}>
                S/.{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {totalVentas[`${parcel[index]["id"]}_SECO`]}
                </Text>
              </Text>
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
                  {sumaTotalVentas[`${parcel[index]["id"]}_BABA`]}{" "}
                  <Text style={{ fontWeight: "normal" }}>Kg.</Text>{" "}
                </Text>
              </View>
              <View style={{ marginTop: 15 }}>
                <Text>vendidos a </Text>
              </View>
              <Text style={{ color: COLORS_DF.citrine_brown }}>
                S/.{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {totalVentas[`${parcel[index]["id"]}_BABA`]}
                </Text>
              </Text>
            </Card>
          </View>
          <Text style={styles.title}>Mapa de parcela</Text>
        </View>
        <View style={styles.containerButtonGFW}>
          <TouchableOpacity
            onPress={submitPost}
            disabled={existData}
            style={{
              backgroundColor: existData
                ? COLORS_DF.lightBlue
                : COLORS_DF.robin_egg_blue,
              height: 44,
              borderRadius: 5,
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <Text style={styles.textGfw}>
              Solicitar verificación No Deforestación
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={submitGet}
            style={{
              backgroundColor: !existData
                ? COLORS_DF.lightBlue
                : COLORS_DF.robin_egg_blue,
              height: 44,
              borderRadius: 5,
              justifyContent: "center",
              marginTop: 15,
            }}
            disabled={!existData}
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
          {user.country?.code === "PE" && (
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
          )}
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
