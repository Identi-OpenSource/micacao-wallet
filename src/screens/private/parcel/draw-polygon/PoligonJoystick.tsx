import {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from '@rnmapbox/maps'
import {Alert, Button, Dimensions, View} from 'react-native'
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
import {COLORS_DF, THEME_DF} from '../../../../config/themes/default'
import {BtnSmall} from '../../../../components/button/Button'
import {useNavigation} from '@react-navigation/native'

const heightMap = Dimensions.get('window').height - 140
const widthMap = Dimensions.get('window').width

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
  const [crosshairPos, setCrosshairPos] = useState(firstPoint)
  const [centerCoordinate, setCenterCoordinate] = useState(firstPoint)
  const coorInitRef = useRef(null)
  const navigation = useNavigation()

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate]
  }, [coordinates, lastCoordinate])

  const map = useRef<MapView>(null)
  const ref2 = useRef<Camera>(null)
  useEffect(() => {
    // eliminar polygonTemp
    //storage.delete('polygonTemp')
    if (parcel[0].polygon) {
      setCoordinates(parcel[0].polygon)
    } else {
      if (storage.getString('polygonTemp')) {
        const coordinateTemp = JSON.parse(
          storage.getString('polygonTemp') || '',
        )
        setCenterCoordinate(coordinateTemp[coordinateTemp.length - 1])
        setCoordinates(coordinateTemp)
      }
    }
  }, [])

  useEffect(() => {
    coorInitRef.current = lastCoordinate
  }, [coordinates])

  const moveMap = (angle, force) => {
    // Supongamos que el mapa tiene un tamaño específico y queremos mapear el rango del joystick al tamaño del mapa

    // Convertir el ángulo en radianes
    const angleRad = angle.radian

    // Calcular las nuevas coordenadas del marcador
    const deltaX = Math.cos(angleRad) * ((force * widthMap) / 2)
    const deltaY = Math.sin(angleRad) * ((force * heightMap) / 2)

    // Supongamos que las coordenadas iniciales del marcador son el centro del mapa
    const initialLng = coorInitRef.current[0] // Longitud inicial
    const initialLat = coorInitRef.current[1] // Latitud inicial

    // Calcular las nuevas coordenadas
    const newLat = initialLat + deltaY / 111111 // 1 grado de latitud es aproximadamente 111111 metros
    const newLng =
      initialLng + deltaX / (111111 * Math.cos((initialLat * Math.PI) / 180)) // 1 grado de longitud varía dependiendo de la latitud
    setCenterCoordinate([newLng, newLat])
  }

  const deletePoint = () => {
    if (coordinates.length > 1) {
      setCoordinates(prev => {
        const newCoordinates = prev.slice(0, -1)
        storage.set('polygonTemp', JSON.stringify(newCoordinates))
        return newCoordinates
      })
    }
  }

  const onSubmit = () => {
    if (coordinatesWithLast.length < 5) {
      Alert.alert('Error', 'El polígono debe tener al menos 4 puntos')
      return
    }
    // Guardar en la lista de polígonos
    const newParcel = {
      ...parcel[0],
      polygon: [...coordinatesWithLast, coordinatesWithLast[0]],
    }
    storage.set('parcels', JSON.stringify([newParcel]))
    storage.delete('polygonTemp')
    navigation.navigate('MyParcelsScreen')
  }

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          position: 'absolute',
          top: 10,
          zIndex: 99999,
          width: widthMap,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <BtnSmall
          title="Punto"
          icon="minus"
          theme="agrayu"
          onPress={() => {
            deletePoint()
          }}
        />
        <BtnSmall
          title="Guardar"
          theme="agrayu"
          icon="floppy-disk"
          onPress={() => onSubmit()}
        />
        <BtnSmall
          title="Punto"
          icon="plus"
          theme="agrayu"
          onPress={() => {
            const DATA = [...coordinates, lastCoordinate]
            storage.set('polygonTemp', JSON.stringify(DATA))
            setCoordinates(DATA)
          }}
        />
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
            crosshairPos,
          )
          if (crosshairCoords) {
            setLastCoordinate(crosshairCoords as Position)
          }
        }}>
        {<CrosshairOverlay onCenter={c => setCrosshairPos(c)} />}
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
      <GestureHandlerRootView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -180,
        }}>
        <ReactNativeJoystick
          color={COLORS_DF.greenAgrayu}
          radius={75}
          onMove={data => {
            if (data.angle && data.force) {
              moveMap(data.angle, data.force)
            }
          }}
        />
      </GestureHandlerRootView>
    </View>
  )
}

export default PoligonJoystick
