import {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from "@rnmapbox/maps";
import { Button, View } from "react-native";
import React, {
  useState,
  useRef,
  ComponentProps,
  useMemo,
  forwardRef,
} from "react";
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
          borderColor: "red",
          borderWidth: w / 2.0,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: size,
          left: 0,
          right: 0,
          borderColor: "red",
          borderWidth: w / 2.0,
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

  // if (ref.current != null) {
  //   console.log('=> ref.current', ref.current != null)
  // }
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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

const DrawPolyline = () => {
  const parcel = JSON.parse(storage.getString("parcels") || "[]");
  // console.log('parcel', parcel)
  const firstPoint = [
    Number(parcel[0]?.firstPoint[1]),
    Number(parcel[0].firstPoint[0]),
  ];
  const [coordinates, setCoordinates] = useState<Position[]>([firstPoint]);
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint);
  const [started, setStarted] = useState(true);
  const [crosshairPos, setCrosshairPos] = useState(firstPoint);

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate];
  }, [coordinates]);

  const map = useRef<MapView>(null);

  const newLocal = "row";
  return (
    <View style={{ flex: 1 }}>
      {/* <View>
        {!started ? (
          <Button
            title="start"
            onPress={() => {
              setStarted(true)
              setCoordinates([lastCoordinate])
            }}
          />
        ) : (
          <View
            style={{
              flexDirection: newLocal,
              justifyContent: 'center',
              gap: 10,
            }}>
            <Button
              title="add"
              onPress={() => setCoordinates([...coordinates, lastCoordinate])}
            />
            <Button title="stop" onPress={() => setStarted(false)} />
          </View>
        )}
      </View> */}
      <View style={{ flex: 1 }}>
        <MapView
          ref={map}
          styleURL={StyleURL.Satellite}
          style={{ flex: 1 }}
          onPress={async (e) => {
            const lastCoor = [
              e.geometry.coordinates[0],
              e.geometry.coordinates[1],
            ];
            setCoordinates([...coordinates, lastCoor]);
          }}
          /* onCameraChanged={async e => {
            const crosshairCoords = await map.current?.getCoordinateFromView(
              crosshairPos,
            )
            console.log(
              'Crosshair coords: ',
              crosshairCoords,
              'camera center:',
              e.properties.center,
            )
            setLastCoordinate(crosshairCoords as Position)
            if (crosshairCoords && started) {
              setLastCoordinate(crosshairCoords as Position)
            }
          }} */
        >
          {started && <Polygon coordinates={coordinatesWithLast} />}
          <Camera
            defaultSettings={{
              centerCoordinate: firstPoint,
              zoomLevel: 17,
            }}
          />
          {coordinatesWithLast.map((c, i) => {
            // console.log('ssc', c)
            return (
              <PointAnnotation
                key={i + "a"}
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
        </MapView>

        {/* <CrosshairOverlay onCenter={c => setCrosshairPos(c)} /> */}
      </View>
    </View>
  );
};

export default DrawPolyline;

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

DrawPolyline.metadata = metadata;
