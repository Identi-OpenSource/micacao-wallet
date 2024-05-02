import {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from "@rnmapbox/maps";
import {
  Alert,
  Button,
  Dimensions,
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, {
  useState,
  useRef,
  ComponentProps,
  useMemo,
  forwardRef,
  useEffect,
  useContext,
} from "react";
import { storage } from "../../../../config/store/db";
import { Delete, Add_Location } from "../../../../assets/svg";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ReactNativeJoystick } from "@korsolutions/react-native-joystick";
import { COLORS_DF, THEME_DF } from "../../../../config/themes/default";
import { BtnSmall } from "../../../../components/button/Button";
import { useNavigation } from "@react-navigation/native";
import Close_Map from "../../../../assets/svg/Close_Map.svg";
import ModalComponent from "../../../../components/modalComponent";
import { SyncDataContext } from "../../../../states/SyncDataContext";
const heightMap = Dimensions.get("window").height - 30;
const widthMap = Dimensions.get("window").width;

type Position = [number, number];

type CrosshairProps = {
  size: number;
  w: number;
  onLayout: ComponentProps<typeof View>["onLayout"];
};
const Crosshair = forwardRef<View, CrosshairProps>(
  ({ size, w, onLayout }: CrosshairProps, ref) => (
    <View
      onLayout={onLayout}
      ref={ref}
      style={{
        width: 2 * size + 1,
        height: 2 * size + 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          left: size,
          top: 0,
          bottom: 0,
          borderColor: "white",
          borderWidth: w,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: size,
          left: 0,
          right: 0,
          borderColor: "white",
          borderWidth: w,
        }}
      />
    </View>
  )
);

const CrosshairOverlay = ({
  onCenter,
}: {
  onCenter: (x: [number, number]) => void;
}) => {
  const ref = useRef<View>(null);

  if (ref.current != null) {
    // console.log('=> ref.current', ref.current != null)
  }
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
      pointerEvents="none"
    >
      <Crosshair
        size={20}
        w={1.0}
        ref={ref}
        onLayout={(e) => {
          const { x, y, width, height } = e.nativeEvent.layout;
          onCenter([x + width / 2.0, y + height / 2.0]);
        }}
      />
    </View>
  );
};

const lineLayerStyle = {
  lineColor: "#22C55E",
  lineWidth: 4,
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
  // console.log('=> features', JSON.stringify(features))
  return (
    <ShapeSource id={"shape-source-id-0"} shape={features}>
      <LineLayer id={"line-layer"} style={lineLayerStyle} />
    </ShapeSource>
  );
};

const PoligonJoystick = () => {
  const parcel = JSON.parse(storage.getString("parcels") || "[]");

  const firstPoint = [
    Number(parcel[0].firstPoint[1]),
    Number(parcel[0].firstPoint[0]),
  ] as Position;
  const [coordinates, setCoordinates] = useState<Position[]>([]);
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint);
  const [crosshairPos, setCrosshairPos] = useState(firstPoint);
  const [centerCoordinate, setCenterCoordinate] = useState(firstPoint);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const coorInitRef = useRef(null);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const syncData = useContext(SyncDataContext);
  const { hasDataToSync, addToSync, toSyncData, dataToSync } = syncData;
  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate];
  }, [coordinates, lastCoordinate]);

  const map = useRef<MapView>(null);
  const ref2 = useRef<Camera>(null);
  useEffect(() => {
    // eliminar polygonTemp
    //storage.delete('polygonTemp')
    if (parcel[0].polygon) {
      setCoordinates(parcel[0].polygon);
    } else {
      if (storage.getString("polygonTemp")) {
        const coordinateTemp = JSON.parse(
          storage.getString("polygonTemp") || ""
        );
        setCenterCoordinate(coordinateTemp[coordinateTemp.length - 1]);
        setCoordinates(coordinateTemp);
      }
    }
  }, []);

  useEffect(() => {
    coorInitRef.current = lastCoordinate;
  }, [coordinates]);

  const handleMove = (event) => {
    const { angle, distance } = event;
    const sensitivityFactor = 0.5; // Ajusta el factor de sensibilidad según sea necesario
    const deadZoneRadius = 20; // Ajusta el tamaño de la zona muerta según sea necesario

    // Aplica sensibilidad y zona muerta
    const sensitivityAdjustedDistance = distance * sensitivityFactor;
    const x = Math.cos(angle) * sensitivityAdjustedDistance;
    const y = Math.sin(angle) * sensitivityAdjustedDistance;

    // Actualiza la posición del joystick
    setJoystickPosition({ x, y });

    console.log(`Joystick moved: angle=${angle}, distance=${distance}`);
  };
  const moveMap = (angle, force) => {
    const angleRad = angle.radian;

    const deltaX = Math.cos(angleRad) * ((force * widthMap) / 2);
    const deltaY = Math.sin(angleRad) * ((force * heightMap) / 2);

    const initialLng = coorInitRef.current[0];
    const initialLat = coorInitRef.current[1];

    // Calcular las nuevas coordenadas
    const newLat = initialLat + deltaY / 111111;
    const newLng =
      initialLng + deltaX / (111111 * Math.cos((initialLat * Math.PI) / 180));
    setCenterCoordinate([newLng, newLat]);
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

  const onSubmit = () => {
    if (coordinatesWithLast.length < 5) {
      Alert.alert("Error", "El polígono debe tener al menos 4 puntos");
      return;
    }

    const newParcel = {
      ...parcel[0],
      polygon: [...coordinatesWithLast, coordinatesWithLast[0]],
      syncUp: false,
    };

    setShowModal(true);

    setTimeout(() => {
      addToSync(JSON.stringify([newParcel]), "parcels");
      storage.delete("polygonTemp");
    }, 7000);
  };
  const back = () => {
    navigation.goBack();
  };
  const closeModal = () => {
    setShowModal(false);
    navigation.navigate("DrawPolygonScreen");
  };

  return (
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
        <TouchableOpacity onPress={onSubmit} style={styles.buttonSave}>
          <Text style={styles.textButtonSave}>Guardar</Text>
        </TouchableOpacity>
      </View>
      <MapView
        ref={map}
        styleURL={StyleURL.Satellite}
        style={{
          height: heightMap,
          width: widthMap,
        }}
        scaleBarEnabled={false}
        rotateEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        logoEnabled={false}
        onCameraChanged={async () => {
          const crosshairCoords = await map.current?.getCoordinateFromView(
            crosshairPos
          );
          if (crosshairCoords) {
            setLastCoordinate(crosshairCoords as Position);
          }
        }}
      >
        {<CrosshairOverlay onCenter={(c) => setCrosshairPos(c)} />}
        {<Polygon coordinates={coordinatesWithLast} />}
        {coordinatesWithLast.map((c, i) => {
          return (
            <PointAnnotation
              key={i.toString()}
              id={i.toString()}
              coordinate={[c[0], c[1]]}
            >
              <View
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
              />
            </PointAnnotation>
          );
        })}
        <Camera
          ref={ref2}
          defaultSettings={{
            centerCoordinate: firstPoint,
            zoomLevel: 17,
          }}
          animationMode={"flyTo"}
          animationDuration={100}
          centerCoordinate={centerCoordinate}
        />
      </MapView>
      <GestureHandlerRootView
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: -250,
        }}
      >
        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() => {
              deletePoint();
            }}
            style={styles.iconButton}
          >
            <Delete />
          </TouchableOpacity>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ReactNativeJoystick
              color={"#D4D7D5"}
              radius={75}
              onMove={(data) => {
                if (data.angle && data.force) {
                  moveMap(data.angle, data.force);
                }
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              const DATA = [...coordinates, lastCoordinate];
              storage.set("polygonTemp", JSON.stringify(DATA));
              setCoordinates(DATA);
            }}
            style={styles.iconButton}
          >
            <Add_Location />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </View>
  );
};
const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    backgroundColor: "#D4D7D5",
    width: "10%",
    height: "45%",
    padding: 30,
  },
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 200,
    paddingHorizontal: 25,
  },
  buttonSave: {
    width: "25%",
    height: "45%",
    top: 5,
    justifyContent: "center",
    backgroundColor: "#D4D7D5",
    borderRadius: 7,
    alignItems: "center",
    marginRight: 25,
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
export default PoligonJoystick;
