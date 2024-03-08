/* eslint-disable react-native/no-inline-styles */
import Mapbox, {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from '@rnmapbox/maps'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Alert, View} from 'react-native'
import Config from 'react-native-config'
import {storage} from '../../../../config/store/db'
import DrawPolyline from './DrawPolyline'
import {Btn} from '../../../../components/button/Button'
import {MP_DF} from '../../../../config/themes/default'
import {useNavigation} from '@react-navigation/native'

if (Config.MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)
}

type Position = [number, number]

// type CrosshairProps = {
//   size: number
//   w: number
//   onLayout: ComponentProps<typeof View>['onLayout']
// }

// const CrosshairOverlay = ({
//   onCenter,
// }: {
//   onCenter: (x: [number, number]) => void
// }) => {
//   const ref = useRef<View>(null)

//   // if (ref.current != null) {
//   //   console.log('=> ref.current', ref.current != null)
//   // }
//   return (
//     <View
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         alignContent: 'center',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//       pointerEvents="none">
//       <Crosshair
//         size={20}
//         w={1.0}
//         ref={ref}
//         onLayout={e => {
//           const {x, y, width, height} = e.nativeEvent.layout
//           onCenter([x + width / 2.0, y + height / 2.0])
//         }}
//       />
//     </View>
//   )
// }

const lineLayerStyle = {
  lineColor: '#fff',
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
  return (
    <ShapeSource id={'shape-source-id-0'} shape={features}>
      <LineLayer id={'line-layer'} style={lineLayerStyle} />
    </ShapeSource>
  )
}

export const DrawPolygonScreen = () => {
  const parcel = JSON.parse(storage.getString('parcels') || '[]')
  const firstPoint = [
    Number(parcel[0].firstPoint[1]),
    Number(parcel[0].firstPoint[0]),
  ] as Position
  const [coordinates, setCoordinates] = useState<Position[]>([firstPoint])
  const [lastCoordinate] = useState<Position>(firstPoint)
  const [started] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    // si existe el poligono dentro de la parcela
    if (parcel[0].polygon) {
      setCoordinates(parcel[0].polygon)
    }
  }, [])

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate]
  }, [coordinates])
  const map = useRef<MapView>(null)

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
    // navegar a la pantalla de parcelas
    navigation.navigate('MyParcelsScreen')
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{flex: 1}}>
        <MapView
          ref={map}
          styleURL={StyleURL.Satellite}
          scaleBarEnabled={false}
          rotateEnabled={false}
          attributionEnabled={false}
          compassEnabled={false}
          logoEnabled={false}
          style={{flex: 1}}
          onPress={async e => {
            const last = [
              (e.geometry as GeoJSON.Point).coordinates[0],
              (e.geometry as GeoJSON.Point).coordinates[1],
            ] as Position
            setCoordinates([...coordinates, last])
          }}>
          {started && <Polygon coordinates={coordinatesWithLast} />}
          <Camera
            defaultSettings={{
              centerCoordinate: firstPoint,
              zoomLevel: 17,
            }}
          />
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
        </MapView>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: MP_DF.large,
          width: '100%',
          paddingHorizontal: MP_DF.large,
        }}>
        <Btn
          title={parcel[0].polygon ? 'Volver' : 'Guardar Polígono'}
          onPress={parcel[0].polygon ? navigation.goBack : () => onSubmit()}
          theme="agrayu"
        />
      </View>
    </View>
  )
}

export default DrawPolyline

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

DrawPolyline.metadata = metadata
