import { useNavigation } from "@react-navigation/native";
import {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from "@rnmapbox/maps";
import { activateKeepAwake } from "@sayem314/react-native-keep-awake";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import Close_Map from "../../../../assets/svg/Close_Map.svg";
import { Btn, BtnIcon } from "../../../../components/button/Button";
import ModalComponent from "../../../../components/modalComponent";
import { storage } from "../../../../config/store/db";
import { COLORS_DF, MP_DF } from "../../../../config/themes/default";
import { useSyncData } from "../../../../states/SyncDataContext";
type Position = [number, number];

const lineLayerStyle = {
  lineColor: "#22C55E",
  lineWidth: 3,
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
            type: "LineString",
            coordinates,
          },
          properties: {},
        } as const,
      ],
    };
  }, [coordinates]);

  return (
    <ShapeSource id={"shape-source-id-0"} shape={features}>
      <LineLayer id={"line-layer"} style={lineLayerStyle} />
    </ShapeSource>
  );
};

const GradientLineRecorrer = ({ route }: any) => {
  const { index } = route.params;
  const parcel = JSON.parse(storage.getString("parcels") || "[]");
  const firstPoint = [
    Number(parcel[index].firstPoint[1]),
    Number(parcel[index].firstPoint[0]),
  ] as Position;
  const { addToSync } = useSyncData();
  const [coordinates, setCoordinates] = useState<Position[]>([firstPoint]);
  const [cam, setCam] = useState<Position>(firstPoint);
  const [started, setStarted] = useState(false);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(17);

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates];
  }, [coordinates]);

  const map = useRef<MapView>(null);

  const [ejecutado, setEjecutado] = useState(false);

  useEffect(() => {
    if (!ejecutado) {
      activateKeepAwake();
      setEjecutado(true);
    }
  }, [ejecutado]);

  useEffect(() => {
    let watchId: any = null;
    if (started) {
      watchId = Geolocation.watchPosition(
        (position) => {
          console.log("=> position", position);

          setCoordinates((prevPositions: any[]) => {
            const DATA = [
              ...prevPositions,
              [position.coords.longitude, position.coords.latitude],
            ];
            storage.set("polygonTemp", JSON.stringify(DATA));
            return DATA;
          });
          setCam([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
        }
      );
    }

    return () => {
      watchId !== null && Geolocation.clearWatch(watchId);
    };
  }, [started]);

  useEffect(() => {
    // eliminar polygonTemp
    //storage.delete("polygonTemp");

    if (parcel[index].polygon) {
      setCoordinates(parcel[index].polygon);
    } else {
      if (storage.getString("polygonTemp")) {
        const coordinateTemp = JSON.parse(
          storage.getString("polygonTemp") || ""
        );
        setCoordinates(coordinateTemp);
      }
    }
  }, []);

  const onSubmit = () => {
    if (coordinatesWithLast.length < 5) {
      Alert.alert("Error", "El polígono debe tener al menos 4 puntos");
      return;
    }
    // Guardar en la lista de polígonos
    const newParcel = {
      ...parcel[index],
      polygon: [...coordinatesWithLast, coordinatesWithLast[0]],
      syncUp: false,
    };

    setShowModal(true);

    let parcels = parcel;
    parcels[index] = newParcel;

    setTimeout(() => {
      addToSync(JSON.stringify(parcels), "parcels");
      storage.delete("polygonTemp");
    }, 7000);
  };
  const closeModal = () => {
    setShowModal(false);
    navigation.navigate("DrawPolygonScreen", { index });
  };
  const back = () => {
    storage.delete("polygonTemp");
    navigation.goBack();
  };
  const deletePoint = () => {
    if (coordinates.length > 1) {
      setCoordinates((prev) => {
        const newCoordinates = prev.slice(0, -1);
        storage.set("polygonTemp", JSON.stringify(newCoordinates));
        return newCoordinates;
      });
    }
  };

  const onDragEnd = (index: number, newCoordinate: Position) => {
    setCoordinates((prev) => {
      const updatedCoordinates = [...prev];
      updatedCoordinates[index] = newCoordinate;
      storage.set("polygonTemp", JSON.stringify(updatedCoordinates));
      return updatedCoordinates;
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#8F3B06" barStyle="light-content" />
        <ModalComponent
          isVisible={showModal}
          label={"¡El mapa de tu parcela ha sido guardado!"}
          closeModal={closeModal}
          buttonText={"Continuar"}
        />
        <View style={styles.containerButtonUp}>
          <TouchableOpacity onPress={back} style={styles.buttonClose}>
            <Close_Map height={40} width={40} />
          </TouchableOpacity>
        </View>
        <MapView
          ref={map}
          styleURL={StyleURL.Satellite}
          style={{ flex: 1 }}
          scaleBarEnabled={false}
          rotateEnabled={false}
          attributionEnabled={false}
          compassEnabled={false}
          logoEnabled={false}
        >
          {<Polygon coordinates={coordinatesWithLast} />}
          {coordinatesWithLast.map((c, i) => {
            const lastIndex = coordinates.length - 1;
            return (
              <PointAnnotation
                key={i.toString() + coordinates.length}
                id={i.toString()}
                coordinate={[c[0], c[1]]}
                draggable={i === 0} // Only make the first point draggable
                onDragEnd={(e) =>
                  onDragEnd(i, [
                    e.geometry.coordinates[0],
                    e.geometry.coordinates[1],
                  ])
                }
              >
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: lastIndex === i ? "white" : "white",
                    borderRadius: 5,
                  }}
                />
              </PointAnnotation>
            );
          })}
          <Camera zoomLevel={17} minZoomLevel={14} centerCoordinate={cam} />
        </MapView>
        <View
          style={{
            position: "absolute",
            bottom: MP_DF.large,
            width: "100%",
            minHeight: 50,
            paddingHorizontal: MP_DF.large,
            zIndex: 1000000,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: MP_DF.large,
            }}
          >
            <BtnIcon
              theme={"transparent"}
              icon={!started ? "person-walking-arrow-right" : "hand"}
              size={48}
              iconColor={COLORS_DF.greenAgrayu}
              onPress={() => {
                !started ? setStarted(true) : setStarted(false);
              }}
            />

            <BtnIcon
              theme={"transparent"}
              icon={"person-walking-arrow-loop-left"}
              size={48}
              iconColor={COLORS_DF.greenAgrayu}
              onPress={() => {
                deletePoint();
              }}
            />
          </View>
          <Btn
            title={parcel[index].polygon ? "Volver" : "Guardar Polígono"}
            onPress={
              parcel[index].polygon ? navigation.goBack : () => onSubmit()
            }
            theme="agrayu"
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 200,
    paddingHorizontal: 25,
  },

  containerButtonUp: {
    position: "absolute",
    top: 10,
    zIndex: 99999,
    height: 100,
    paddingVertical: 5,
    alignItems: "center",
    marginRight: 25,
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  buttonClose: {
    width: "25%",
    height: "45%",
    alignItems: "center",
    top: 10,
  },
  textButtonSave: {
    fontSize: 15,
    alignSelf: "center",
    color: "black",
  },
});
export default GradientLineRecorrer;
