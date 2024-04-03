import {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from '@rnmapbox/maps'
import {Alert, Button, View} from 'react-native'
import React, {
  useState,
  useRef,
  ComponentProps,
  useMemo,
  forwardRef,
  useEffect,
} from 'react'
import {storage} from '../../../../config/store/db'
import Geolocation from 'react-native-geolocation-service'
import {Btn, BtnIcon, BtnSmall} from '../../../../components/button/Button'
import {useNavigation} from '@react-navigation/native'
import {MP_DF} from '../../../../config/themes/default'
import {BTN_THEME} from '../../../../components/button/interfaces'

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

const GradientLineRecorrer = () => {
  const parcel = JSON.parse(storage.getString('parcels') || '[]')
  const firstPoint = [
    Number(parcel[0].firstPoint[1]),
    Number(parcel[0].firstPoint[0]),
  ] as Position
  const [coordinates, setCoordinates] = useState<Position[]>([firstPoint])
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint)
  const [cam, setCam] = useState<Position>(firstPoint)
  const [started, setStarted] = useState(false)
  const [crosshairPos, setCrosshairPos] = useState(firstPoint)
  const navigation = useNavigation()

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate]
  }, [coordinates, lastCoordinate])

  const map = useRef<MapView>(null)

  useEffect(() => {
    let watchId: any = null
    if (started) {
      watchId = Geolocation.watchPosition(
        position => {
          console.log('=> position', position)

          setCoordinates((prevPositions: any[]) => {
            const DATA = [
              ...prevPositions,
              [position.coords.longitude, position.coords.latitude],
            ]
            storage.set('polygonTemp', JSON.stringify(DATA))
            return DATA
          })
          setCam([position.coords.longitude, position.coords.latitude])
        },
        error => {
          console.log(error)
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
        },
      )
    }

    return () => {
      watchId !== null && Geolocation.clearWatch(watchId)
    }
  }, [started])

  useEffect(() => {
    // eliminar polygonTemp
    // storage.delete('polygonTemp')
    // si existe el poligono dentro de la parcela
    if (parcel[0].polygon) {
      setCoordinates(parcel[0].polygon)
    } else {
      if (storage.getString('polygonTemp')) {
        const coordinateTemp = JSON.parse(
          storage.getString('polygonTemp') || '',
        )
        console.log('=> polygonTemp', coordinateTemp)
        setCoordinates(coordinateTemp)
      }
    }
  }, [])

  const onSubmit = () => {
    if (coordinatesWithLast.length < 5) {
      Alert.alert('Error', 'El polígono debe tener al menos 4 puntos')
      return
    }
    // Guardar en la lista de polígonos
    const newParcel = {
      ...parcel[0],
      polygon: coordinatesWithLast,
    }
    storage.set('parcels', JSON.stringify([newParcel]))
    storage.delete('polygonTemp')
    navigation.navigate('MyParcelsScreen')
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

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <MapView ref={map} styleURL={StyleURL.Satellite} style={{flex: 1}}>
          {<Polygon coordinates={coordinatesWithLast} />}
          {coordinatesWithLast.map((c, i) => {
            // buscar ultimo index en coordinates
            const lastIndex = coordinates.length - 1
            return (
              <PointAnnotation
                key={i.toString() + coordinates.length}
                id={i.toString()}
                coordinate={[c[0], c[1]]}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: lastIndex === i ? 'red' : 'white',
                    borderRadius: 5,
                  }}
                />
              </PointAnnotation>
            )
          })}
          <Camera
            defaultSettings={{
              centerCoordinate: firstPoint,
              zoomLevel: 16,
            }}
            centerCoordinate={cam}
          />
        </MapView>
        <View
          style={{
            position: 'absolute',
            bottom: MP_DF.large,
            width: '100%',
            minHeight: 50,
            paddingHorizontal: MP_DF.large,
            zIndex: 1000000,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: MP_DF.large,
            }}>
            <BtnIcon
              theme={'transparent'}
              icon={!started ? 'circle-play' : 'circle-pause'}
              size={36}
              onPress={() => {
                !started ? setStarted(true) : setStarted(false)
              }}
            />
            <BtnIcon
              theme={'transparent'}
              icon={'delete-left'}
              size={36}
              onPress={() => {
                deletePoint()
              }}
            />
          </View>
          <Btn
            title={parcel[0].polygon ? 'Volver' : 'Guardar Polígono'}
            onPress={parcel[0].polygon ? navigation.goBack : () => onSubmit()}
            theme="agrayu"
          />
        </View>
      </View>
    </View>
  )
}

export default GradientLineRecorrer

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

GradientLineRecorrer.metadata = metadata
