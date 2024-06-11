import { useNavigation } from "@react-navigation/native";
import {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from "@rnmapbox/maps";
import React, {
  ComponentProps,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Add_Location, Delete } from "../../../../assets/svg";
import Close_Map from "../../../../assets/svg/Close_Map.svg";
import ModalComponent from "../../../../components/modalComponent";
import { storage } from "../../../../config/store/db";
import { useSyncData } from "../../../../states/SyncDataContext";

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

const PoligonJoystick = ({ route }: any) => {
  const { index } = route.params;
  const parcel = JSON.parse(storage.getString("parcels") || "[]");

  const firstPoint = [
    Number(parcel[index].firstPoint[1]),
    Number(parcel[index].firstPoint[0]),
  ] as Position;
  const [coordinates, setCoordinates] = useState<Position[]>([]);
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint);
  const [crosshairPos, setCrosshairPos] = useState(firstPoint);
  const [centerCoordinate, setCenterCoordinate] = useState(firstPoint);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const coorInitRef = useRef(null);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const { addToSync } = useSyncData();
  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate];
  }, [coordinates, lastCoordinate]);

  const map = useRef<MapView>(null);
  const ref2 = useRef<Camera>(null);

  useEffect(() => {
    if (parcel[index].polygon) {
      setCoordinates(parcel[index].polygon);
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
      ...parcel[index],
      polygon: [...coordinatesWithLast, coordinatesWithLast[0]],
      syncUp: false,
    };

    let parcels = parcel;
    parcels[index] = newParcel;

    setShowModal(true);

    setTimeout(() => {
      addToSync(JSON.stringify(parcels), "parcels");
      storage.delete("polygonTemp");
    }, 7000);
  };

  const back = () => {
    storage.delete("polygonTemp");
    navigation.goBack();
  };

  const closeModal = () => {
    setShowModal(false);
    navigation.navigate("DrawPolygonScreen", { index });
  };

  /*   useFocusEffect(
    useCallback(() => {
      return () => {
        storage.delete("polygonTemp");
      };
    }, [])
  ); */

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
        <CrosshairOverlay onCenter={(c) => setCrosshairPos(c)} />
        <Polygon coordinates={coordinatesWithLast} />
        {coordinatesWithLast.map((c, i) => (
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
        ))}
        <Camera
          ref={ref2}
          defaultSettings={{
            centerCoordinate: firstPoint,
            zoomLevel: 17,
          }}
          minZoomLevel={14}
          maxZoomLevel={18}
          animationMode={"flyTo"}
          animationDuration={100}
          centerCoordinate={centerCoordinate}
        />
      </MapView>

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
        ></View>

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
    height: "15%",
    alignItems: "center",
    marginBottom: 200,
    paddingHorizontal: 25,
    marginTop: -150,
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
