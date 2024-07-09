/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native'
import {Card} from '@rneui/base'
import {CheckBox} from '@rneui/themed'
import Mapbox, {
  Camera,
  FillLayer,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from '@rnmapbox/maps'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Config from 'react-native-config'
import {Cacao} from '../../../../assets/svg'
import HeaderComponent from '../../../../components/Header'
import {storage} from '../../../../config/store/db'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
} from '../../../../config/themes/default'
import DrawPolyline from './DrawPolyline'
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
  lineColor: '#22C55E',
  lineWidth: 2,
}
const fillLayerStyle = {
  fillColor: '#22C55E',
  fillOpacity: 0.5,
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
            type: 'Polygon',
            coordinates: [coordinates],
          },
          properties: {},
        } as const,
      ],
    }
  }, [coordinates])
  return (
    <ShapeSource id="shape-source-id" shape={features}>
      <FillLayer id="fill-layer" style={fillLayerStyle} />
      <LineLayer id="line-layer" style={lineLayerStyle} />
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
  const [sumaTotalVentas, setSumaTotalVentas] = useState(0)
  useEffect(() => {
    // Obtener la suma total de ventas del almacenamiento local al cargar el componente
    calcularSumaVentas()
  }, [])
  useEffect(() => {
    // eliminar polygonTemp
    //storage.delete('polygonTemp')
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

  const coordinatesWithLast = useMemo(() => {
    const newCoordinates = [...coordinates, lastCoordinate]
    return [...newCoordinates]
  }, [coordinates])
  const map = useRef<MapView>(null)

  const calcularSumaVentas = () => {
    const salesString = storage.getString('sales') || '[]'
    const sales = JSON.parse(salesString)

    const sumaPorTipo = sales.reduce((acumulador: any, dato: any) => {
      if (dato.type) {
        acumulador[dato.type] = (acumulador[dato.type] || 0) + parseInt(dato.kl)
      }
      return acumulador
    }, {})

    setSumaTotalVentas(sumaPorTipo)
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS_DF.isabelline,
        }}>
        <HeaderComponent
          label="Mis parcelas"
          goBack={true}
          goBackNavigation={() => {
            navigation.navigate('HomeProvScreen')
          }}
          backgroundColor="#8F3B06"
          textColor="white"
        />
        <View style={{paddingHorizontal: 16, justifyContent: 'center'}}>
          <Text style={styles.title}>Datos de tu producción en el mes</Text>
          <View style={{justifyContent: 'center'}}>
            <Card
              containerStyle={{
                width: '100%',
                alignSelf: 'center',
                height: 200,
                borderRadius: 7,
                elevation: 5,
                paddingHorizontal: 20,
              }}>
              <Cacao width={40} height={40} />

              {Object.entries(sumaTotalVentas).map(([tipo, suma]) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '50%',
                    marginTop: 25,
                  }}>
                  <Text key={tipo} style={styles.kg}>
                    Tipo: {tipo} {suma} Kg.{' '}
                  </Text>
                  <Text style={styles.cacaoProducer}>de cacao producido</Text>
                </View>
              ))}
            </Card>
          </View>
          <Text style={styles.title}>Mapa de parcela</Text>
        </View>

        <Card
          containerStyle={{
            borderRadius: 7,
            elevation: 5,
            height: 408,
          }}>
          <View
            style={{
              backgroundColor: '#F59E0B',
              alignItems: 'center',
              width: '100%',
              borderRadius: 5,
              marginBottom: 15,
              height: 25,
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff'}}>Estado de titularidad en espera</Text>
          </View>
          <MapView
            ref={map}
            // key={coordinates.length}
            styleURL={StyleURL.Satellite}
            scaleBarEnabled={false}
            rotateEnabled={false}
            attributionEnabled={false}
            compassEnabled={false}
            logoEnabled={false}
            style={{height: 300, width: 350, alignSelf: 'center'}}
            /* onPress={async (e) => {
              const last = [
                (e.geometry as GeoJSON.Point).coordinates[0],
                (e.geometry as GeoJSON.Point).coordinates[1],
              ] as Position;
              storage.set(
                "polygonTemp",
                JSON.stringify([...coordinates, last])
              );
              setCoordinates([...coordinates, last]);
            }} */
          >
            <Polygon coordinates={coordinatesWithLast} />
            {started && <Polygon coordinates={coordinatesWithLast} />}
            <Camera
              defaultSettings={{
                centerCoordinate: firstPoint,
                zoomLevel: 17,
              }}
            />
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
          </MapView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 200,
            }}>
            <View style={{width: 49}}>
              <CheckBox
                checkedIcon="dot-circle-o"
                uncheckedIcon="dot-circle-o"
                uncheckedColor="#8F3B06"
                checkedColor="  #8F3B06"
                size={25}
              />
            </View>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.primary,
                color: COLORS_DF.citrine_brown,
                fontSize: 15,
                marginRight: 45,
              }}>
              Póligono de área
            </Text>
          </View>
        </Card>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZES.large,
    fontFamily: FONT_FAMILIES.bold,

    color: COLORS_DF.citrine_brown,
    top: 10,
  },
  kg: {
    fontSize: FONT_SIZES.small,
    fontFamily: FONT_FAMILIES.bold,

    color: COLORS_DF.citrine_brown,
    top: 10,
  },
  cacaoProducer: {
    fontSize: FONT_SIZES.small,
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.gray,
    top: 10,
  },
})
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
