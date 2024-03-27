import {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from '@rnmapbox/maps'
import {Button, Dimensions, View} from 'react-native'
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
  const [centerCoordinate, setCenterCoordinate] = useState(firstPoint)
  const coorInitRef = useRef(null)

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate]
  }, [coordinates, lastCoordinate])

  const map = useRef<MapView>(null)
  const ref2 = useRef<Camera>(null)

  useEffect(() => {
    coorInitRef.current = lastCoordinate
  }, [coordinates])

  const moveMap = (angle, force) => {
    // Supongamos que el mapa tiene un tamaño específico y queremos mapear el rango del joystick al tamaño del mapa
    const mapWidth = 500 // Ancho del mapa en unidades arbitrarias
    const mapHeight = 500 // Alto del mapa en unidades arbitrarias

    // Convertir el ángulo en radianes
    const angleRad = angle.radian

    // Calcular las nuevas coordenadas del marcador
    const deltaX = Math.cos(angleRad) * ((force * mapWidth) / 2)
    const deltaY = Math.sin(angleRad) * ((force * mapHeight) / 2)

    // Supongamos que las coordenadas iniciales del marcador son el centro del mapa
    const initialLng = coorInitRef.current[0] // Longitud inicial
    const initialLat = coorInitRef.current[1] // Latitud inicial

    // Calcular las nuevas coordenadas
    const newLat = initialLat + deltaY / 111111 // 1 grado de latitud es aproximadamente 111111 metros
    const newLng =
      initialLng + deltaX / (111111 * Math.cos((initialLat * Math.PI) / 180)) // 1 grado de longitud varía dependiendo de la latitud
    setCenterCoordinate([newLng, newLat])
  }

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
          style={{height: 500, width: 500}}
          onCameraChanged={async () => {
            const crosshairCoords = await map.current?.getCoordinateFromView(
              crosshairPos,
            )
            if (crosshairCoords && started) {
              setLastCoordinate(crosshairCoords as Position)
            }
          }}>
          {started && <CrosshairOverlay onCenter={c => setCrosshairPos(c)} />}
          {<Polygon coordinates={coordinatesWithLast} />}
          {coordinatesWithLast.map((c, i) => {
            return (
              <PointAnnotation
                key={i.toString()}
                id={i.toString()}
                coordinate={[c[0], c[1]]}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}
                />
              </PointAnnotation>
            )
          })}
          <Camera
            ref={ref2}
            defaultSettings={{
              centerCoordinate: firstPoint,
              zoomLevel: 17,
            }}
            animationMode={'flyTo'}
            animationDuration={100}
            centerCoordinate={centerCoordinate}
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
                console.log('=> data', data)
                if (data.angle && data.force) {
                  moveMap(data.angle, data.force)
                }
                // moveMarker(data.angle, data.force)
              }}
              onStart={() => {
                setJoystickStart(true)
              }}
              onStop={() => {
                setJoystickStart(false)
              }}
            />
          </GestureHandlerRootView>
        </View>
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
