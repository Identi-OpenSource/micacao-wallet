import {
  Camera,
  LineLayer,
  Location,
  MapView,
  ShapeSource,
  StyleURL,
  UserLocation,
} from "@rnmapbox/maps";
import React, {
  ComponentProps,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, View } from "react-native";
import { storage } from "../../../../config/store/db";

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
  lineColor: "#fff",
  lineWidth: 3,
};

const Polygon = ({ coordinates }: { coordinates: Position[] }) => {
  console.log("=> coordinatessssss", coordinates);
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

const GradientLineRecorrerAdd = () => {
  const parcel = JSON.parse(storage.getString("parcels") || "[]");
  const firstPoint = [
    Number(parcel[0].firstPoint[1]),
    Number(parcel[0].firstPoint[0]),
  ] as Position;
  console.log("=> firstPoint", firstPoint);
  const [coordinates, setCoordinates] = useState<Position[]>([firstPoint]);
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint);
  const [location, setLocation] = useState<Location>();

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate];
  }, [coordinates, lastCoordinate]);

  const map = useRef<MapView>(null);

  console.log("=> coordinates", coordinatesWithLast);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Button
          title={"Agregar punto"}
          onPress={() => {
            setCoordinates((precoordinates) => [
              ...precoordinates,
              [location.coords.longitude, location.coords.latitude],
            ]);
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <MapView ref={map} styleURL={StyleURL.Satellite} style={{ flex: 1 }}>
          {<Polygon coordinates={coordinatesWithLast} />}
          <UserLocation
            visible={true}
            animated={true}
            onUpdate={(newLocation) => {
              setLocation(newLocation);
            }}
          />
          <Camera
            defaultSettings={{
              centerCoordinate: firstPoint,
              zoomLevel: 16,
            }}
            followUserLocation
            followZoomLevel={16}
          />
        </MapView>
        {/* {<CrosshairOverlay onCenter={c => setCrosshairPos(c)} />} */}
      </View>
    </View>
  );
};

export default GradientLineRecorrerAdd;

/* end-example-doc */

/** @type ExampleWithMetadata['metadata'] */
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

GradientLineRecorrerAdd.metadata = metadata;
