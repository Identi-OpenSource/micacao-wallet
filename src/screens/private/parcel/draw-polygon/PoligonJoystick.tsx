import {Camera, LineLayer, MapView, ShapeSource, StyleURL} from '@rnmapbox/maps'
import {Button, View} from 'react-native'
import React, {
  useState,
  useRef,
  ComponentProps,
  useMemo,
  forwardRef,
  useEffect,
} from 'react'
import {storage} from '../../../../config/store/db'

import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {ReactNativeJoystick} from '@korsolutions/react-native-joystick'

type Position = [number, number]

type CrosshairProps = {
  size: number
  w: number
  onLayout: ComponentProps<typeof View>['onLayout']
}
const Crosshair = forwardRef<View, CrosshairProps>(
  ({size, w, onLayout}: CrosshairProps, ref) => (
    <View
      onLayout={onLayout}
      ref={ref}
      style={{
        width: 2 * size + 1,
        height: 2 * size + 1,
      }}>
      <View
        style={{
          position: 'absolute',
          left: size,
          top: 0,
          bottom: 0,
          borderColor: 'white',
          borderWidth: w,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size,
          left: 0,
          right: 0,
          borderColor: 'white',
          borderWidth: w,
        }}
      />
    </View>
  ),
)

const CrosshairOverlay = ({
  onCenter,
}: {
  onCenter: (x: [number, number]) => void
}) => {
  const ref = useRef<View>(null)

  if (ref.current != null) {
    // console.log('=> ref.current', ref.current != null)
  }
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      pointerEvents="none">
      <Crosshair
        size={20}
        w={1.0}
        ref={ref}
        onLayout={e => {
          const {x, y, width, height} = e.nativeEvent.layout
          onCenter([x + width / 2.0, y + height / 2.0])
        }}
      />
    </View>
  )
}

const lineLayerStyle = {
  lineColor: '#fff',
  lineWidth: 3,
}

const Polygon = ({coordinates}: {coordinates: Position[]}) => {
  const features: GeoJSON.FeatureCollection = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'a-feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {},
        } as const,
      ],
    }
  }, [coordinates])
  // console.log('=> features', JSON.stringify(features))
  return (
    <ShapeSource id={'shape-source-id-0'} shape={features}>
      <LineLayer id={'line-layer'} style={lineLayerStyle} />
    </ShapeSource>
  )
}

const PoligonJoystick = () => {
  const parcel = JSON.parse(storage.getString('parcels') || '[]')
  const firstPoint = [
    Number(parcel[0].firstPoint[1]),
    Number(parcel[0].firstPoint[0]),
  ] as Position
  const [coordinates, setCoordinates] = useState<Position[]>([])
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint)
  const [started, setStarted] = useState(false)
  const [joystickStart, setJoystickStart] = useState(false)
  const [josAngle, setJosAngle] = useState(0)
  const [crosshairPos, setCrosshairPos] = useState(firstPoint)

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate]
  }, [coordinates, lastCoordinate])

  const map = useRef<MapView>(null)
  const ref2 = useRef<Camera>(null)

  useEffect(() => {
    let distance = 0.0000001 // Ajusta esta distancia según tus necesidades
    // setInterval para que se mueva el mapa con el joystick si está activo
    const interval = setInterval(() => {
      console.log('=> josAngle', josAngle)
      if (joystickStart) {
        distance += 0.00001
        const dx = distance * Math.cos(josAngle)
        const dy = distance * Math.sin(josAngle)
        ref2.current?.setCamera({
          centerCoordinate: [lastCoordinate[0] + dx, lastCoordinate[1] + dy],
        })
      }
    }, 300)

    if (!joystickStart) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [joystickStart, josAngle])

  const newLocal = 'row'
  return (
    <View style={{flex: 1}}>
      <View>
        {!started ? (
          <Button
            title="Iniciar poligono"
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
              title="Marcar Punto"
              onPress={() => setCoordinates([...coordinates, lastCoordinate])}
            />
            <Button title="Listo" onPress={() => setStarted(false)} />
          </View>
        )}
      </View>
      <View style={{flex: 1}}>
        <MapView
          ref={map}
          styleURL={StyleURL.Satellite}
          style={{flex: 1}}
          onCameraChanged={async () => {
            const crosshairCoords = await map.current?.getCoordinateFromView(
              crosshairPos,
            )
            if (crosshairCoords && started) {
              setLastCoordinate(crosshairCoords as Position)
            }
          }}>
          {<Polygon coordinates={coordinatesWithLast} />}
          <Camera
            ref={ref2}
            defaultSettings={{
              centerCoordinate: firstPoint,
              zoomLevel: 17,
            }}
            centerCoordinate={lastCoordinate}
          />
        </MapView>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 10,
            height: 150,
          }}>
          <GestureHandlerRootView
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ReactNativeJoystick
              color="#06b6d4"
              radius={75}
              onMove={data => {
                setJosAngle(data.angle.degree)
              }}
              onStart={() => {
                setJoystickStart(true)
              }}
              onStop={() => {
                console.log('=> onStop')
                setJoystickStart(false)
              }}
            />
          </GestureHandlerRootView>
        </View>
        {/* <View
          style={{
            alignItems: 'center',
            paddingVertical: 10,
          }}>
           <ReactNativeJoystick
            color="#06b6d4"
            radius={75}
            onMove={(data: any) => {
              // angle: {
              //   radian: number;
              //   degree: number;
              // }
              console.log('=> data', data)
              const distance = 0.001 // Ajusta esta distancia según tus necesidades
              const dx = distance * Math.cos(data.angle.radian)
              const dy = distance * Math.sin(data.angle.radian)

              ref2.current?.setCamera({
                centerCoordinate: [
                  lastCoordinate[0] + dx,
                  lastCoordinate[1] + dy,
                ],
                animationDuration: 0,
                animationMode: 'flyTo',
                zoomLevel: 17,
              })
            }}
            // onMove={(data: any) => {
            //   // angle: {
            //   //   radian: number;
            //   //   degree: number;
            //   // }

            //   ref2.current?.setCamera({
            //     centerCoordinate: [
            //       crosshairPos[0] + data.position.x / 100000,
            //       crosshairPos[1] + data.position.y / 100000,
            //     ],
            //     animationDuration: 0,
            //     animationMode: 'flyTo',
            //     zoomLevel: 17,
            //   })

            //   console.log('=> data', data)
            //   console.log('=> lastCoordinate', lastCoordinate)
            //   console.log('=> coordinates', coordinates)
            // }}
          />
        </View>*/}
        {started && <CrosshairOverlay onCenter={c => setCrosshairPos(c)} />}
      </View>
    </View>
  )
}

export default PoligonJoystick

/* end-example-doc */

/** @type ExampleWithMetadata['metadata'] */
const metadata = {
  title: 'Draw Polyline',
  tags: [
    'LineLayer',
    'ShapeSource',
    'onCameraChanged',
    'getCoordinateFromView',
    'Overlay',
  ],
  docs: `This example shows a simple polyline editor. It uses \`onCameraChanged\` to get the center of the map and \`getCoordinateFromView\` 
  to get the coordinates of the crosshair.
  
  The crosshair is an overlay that is positioned using \`onLayout\` and \`getCoordinateFromView\`.
  
  The \`ShapeSource\` is updated with the new coordinates and the \`LineLayer\` is updated with the new coordinates.`,
}

PoligonJoystick.metadata = metadata
