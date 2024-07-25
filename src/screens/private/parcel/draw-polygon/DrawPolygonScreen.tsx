/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config'
import {useNavigation} from '@react-navigation/native'
import {Card} from '@rneui/base'
import {CheckBox} from '@rneui/themed'
import Mapbox, {
  Callout,
  Camera,
  CircleLayer,
  FillLayer,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from '@rnmapbox/maps'
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-toast-message'
import {Baba, Error, Happy, Sad, Seco} from '../../../../assets/svg'
import HeaderComponent from '../../../../components/Header'
import {storage} from '../../../../config/store/db'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
  THEME_DF,
} from '../../../../config/themes/default'
import {ConnectionContext} from '../../../../states/_ConnectionContext'
import {useGfwContext} from '../../../../states/GfwContext'
import {useKafeContext} from '../../../../states/KafeContext'
import DrawPolyline from './DrawPolyline'
import * as turf from '@turf/turf'
import {Parcel} from '../../../../states/UserContext'
import {KF_STATES, STORAGE_KEYS} from '../../../../config/const'
import useFetchData from '../../../../hooks/useFetchData'
import {dniEncrypt} from '../../../../OCC/occ'

// if (Config.MAPBOX_ACCESS_TOKEN) {
Mapbox.setAccessToken(Config?.MAPBOX_ACCESS_TOKEN || '')

// }
const {width, height} = Dimensions.get('window')
type Position = [number, number]

const lineLayerStyle = {
  lineColor: COLORS_DF.isabelline,
  lineWidth: 1.5,
}
const fillLayerStyle = {
  fillColor: '#22C55E',
  fillOpacity: 0.4,
}
const circleLayerStyle = {
  circleColor: COLORS_DF.isabelline,
  circleRadius: 5,
}

const formateNumber = (num: number) => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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
      <CircleLayer id="circle-layer" style={circleLayerStyle} />
    </ShapeSource>
  )
}

export const DrawPolygonScreen = ({route, navigation}: any) => {
  const params = route.params
  const id = params?.id
  const user = JSON.parse(storage.getString(STORAGE_KEYS.user) || '{}')
  const parcels = JSON.parse(storage.getString(STORAGE_KEYS.parcels) || '[]')
  const parcel = parcels.find((p: Parcel) => p.id === id)
  const indexParcel = parcels.findIndex((p: Parcel) => p.id === id)
  const centerPoint = user?.district?.center_point?.split(' ')
  const centerX = centerPoint?.[0]?.replace(/,/g, '.') || 0
  const centerY = centerPoint?.[1]?.replace(/,/g, '.') || 0
  const firstPoint = [Number(centerY), Number(centerX)] as Position
  const secondPoint = [Number(centerY), Number(centerX)] as Position

  const [centerCoordinate, setCenterCoordinate] = useState<Position>(firstPoint)
  const [zoomLevel, setZoomLevel] = useState(17)
  const {loading, fetchData} = useFetchData()
  const map = useRef<MapView>(null)

  const salesList = JSON.parse(storage.getString(STORAGE_KEYS.sales) || '[]')
  const salesParcel = salesList.filter(
    (sale: any) => sale.parcela === parcel.id,
  )
  const salesBaba = salesParcel.filter((sale: any) => sale.type === 'BABA')
  const salesSeco = salesParcel.filter((sale: any) => sale.type === 'SECO')
  const sumKgBaba = formateNumber(
    salesBaba.reduce((acc: any, sale: any) => {
      return acc + Number(sale.kl)
    }, 0),
  )
  const sumKgSeco = formateNumber(
    salesSeco.reduce((acc: any, sale: any) => {
      return acc + Number(sale.kl)
    }, 0),
  )
  const sumSalesBaba = formateNumber(
    salesBaba.reduce((acc: any, sale: any) => {
      return acc + Number(sale.precio) * Number(sale.kl)
    }, 0),
  )
  const sumSalesSeco = formateNumber(
    salesSeco.reduce((acc: any, sale: any) => {
      return acc + Number(sale.precio) * Number(sale.kl)
    }, 0),
  )
  const coordinatesWithLast = parcel?.polygon || [firstPoint, secondPoint]

  useEffect(() => {
    centerMap()
    postKafeSistemas()
    getKafeSistemas()
    rePostGfw()
  }, [])

  const centerMap = () => {
    const feature = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'a-feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinatesWithLast],
          },
          properties: {},
        } as const,
      ],
    } as any

    const bbox = turf.bbox(feature)
    const center = turf.center(feature).geometry.coordinates
    const [minLng, minLat, maxLng, maxLat] = bbox
    const lngDelta = maxLng - minLng
    const latDelta = maxLat - minLat
    const padding = 0.1 // Optional padding to add some margin around the polygon

    const zoom =
      Math.min(Math.log2(360 / lngDelta), Math.log2(180 / latDelta)) - padding
    // zoom comvertir en enteros

    const zoomLevel = Math.round(zoom)
    if (zoomLevel > 10 && zoomLevel < 24) {
      setZoomLevel(zoomLevel)
    }
    setCenterCoordinate([center[0], center[1]])
  }

  // console.log('parcel', parcel)

  const rePostGfw = async () => {
    const send = new Date(parcel?.gfw?.send)
    const now = new Date()
    const diferencia = now?.getTime() - send?.getTime()
    const horas = diferencia / (1000 * 60 * 60)

    if (
      parcel?.gfw === 'undefined' ||
      parcel?.gfw?.status !== 'Pending' ||
      horas < 24
    ) {
      return
    }
    //@braudin debe venir desde el servidor
    const url = `${Config?.URL_GFW}/upload`
    const formData = {
      coordinates: parcel.polygon
        .map((coordenada: Position) => `${coordenada[0]} ${coordenada[1]}`)
        .join(';'),
      start_date: '2020-01-01',
      end_date: new Date().toISOString().split('T')[0],
    }
    const resp = await fetchData(
      url,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: formData,
      },
      true,
    )

    if (resp?.response?.status) {
      return
    }
    // agregar la respuesta a la parcela
    const updatedParcel = {
      ...parcel,
      gfw: {...resp, send: new Date().toISOString()},
    }
    parcels[indexParcel] = updatedParcel
    storage.set(STORAGE_KEYS.parcels, JSON.stringify(parcels))
    navigation.navigate('DrawPolygonScreen', {id: id})
  }

  const postGfw = async () => {
    //@braudin debe venir desde el servidor
    const url = `${Config?.URL_GFW}/upload`
    const formData = {
      coordinates: parcel.polygon
        .map((coordenada: Position) => `${coordenada[0]} ${coordenada[1]}`)
        .join(';'),
      start_date: '2020-01-01',
      end_date: new Date().toISOString().split('T')[0],
    }
    const resp = await fetchData(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      data: formData,
    })
    if (resp?.response?.status) {
      return
    }
    // agregar la respuesta a la parcela
    const updatedParcel = {
      ...parcel,
      gfw: {...resp, send: new Date().toISOString()},
    }
    parcels[indexParcel] = updatedParcel
    storage.set(STORAGE_KEYS.parcels, JSON.stringify(parcels))
    Toast.show({
      type: 'msgToast',
      text1: 'Solicitud enviada. Puedes verificar el estado más tarde.',
      autoHide: false,
      props: {
        onPress: () => {},
        btnText: 'OK',
      },
    })
    // recargar el componente
    navigation.navigate('DrawPolygonScreen', {id: id})
  }

  const getGfw = async () => {
    //@braudin debe venir desde el servidor
    const idlistId = parcel?.gfw?.listId
    const url = `${Config?.URL_GFW}/${idlistId}`
    const resp = await fetchData(
      url,
      {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      },
      true,
    )

    if (resp?.listId && resp.status !== 'Pending') {
      const updatedParcel = {
        ...parcel,
        gfw: resp,
      }
      parcels[indexParcel] = updatedParcel
      storage.set(STORAGE_KEYS.parcels, JSON.stringify(parcels))

      Toast.show({
        type: 'msgToast',
        text1: 'El estado de la solicitud es: ' + resp.status,
        autoHide: false,
        props: {
          onPress: () => {},
          btnText: 'OK',
        },
      })
    }
    if (resp?.response?.status === 422) {
      const msg = resp.response?.data?.errors?.error
      const updatedParcel = {
        ...parcel,
        gfw: {...parcel.gfw, status: 'Error ' + resp.response?.data?.type, msg},
      }
      parcels[indexParcel] = updatedParcel
      storage.set(STORAGE_KEYS.parcels, JSON.stringify(parcels))
    }
    navigation.navigate('DrawPolygonScreen', {id: id})
  }

  const optionsUiKs = () => {
    switch (parcel?.kf?.Code) {
      case KF_STATES.accepted:
        return ['#22C55E', 'Estado de titularidad aprobado']
      case KF_STATES.rejected:
        return ['#EF4444', 'Estado de titularidad no aprobado']
      case KF_STATES.failure:
        return ['#EF4444', 'Estado de titularidad fallido']
      case KF_STATES.pending:
      default:
        return ['#F59E0B', 'Estado de titularidad en espera ']
    }
  }

  const optionsUiGFW = (): [string, string, any] => {
    if (parcel?.gfw?.status === 'Completed') {
      const NFL =
        parcel?.gfw?.data?.deforestation_kpis?.[0]?.[
          'Natural Forest Loss (ha) (Beta)'
        ] || null
      if (Number(NFL) < 6) {
        return [
          '#22C55E',
          'Validación no deforestación Aprobado',
          <Happy width={70} height={70} />,
        ]
      }
      return [
        '#22C55E',
        'Validación no deforestación No Aprobado',
        <Happy width={70} height={70} />,
      ]

      // const classify = classifyDeforestation(
      //   Number(
      //     parcel?.gfw?.data?.deforestation_kpis?.[0]?.[
      //       'Natural Forest Coverage (HA) (Beta)'
      //     ],
      //   ),
      //   Number(
      //     parcel?.gfw?.data?.deforestation_kpis?.[0][
      //       'Natural Forest Loss (ha) (Beta)'
      //     ],
      //   ),
      //   Number(
      //     parcel?.gfw?.data?.deforestation_kpis?.[0]['Negligible Risk (%)'],
      //   ),
      // )

      // return [
      //   classify[1],
      //   'Validación no deforestación ' + classify[0],
      //   classify[2],
      // ]
    }
    if (parcel?.gfw?.status?.includes('Error')) {
      return [
        '#EF4444',
        'Validación no deforestación ' + 'No Aceptado',
        <Sad height={70} width={70} />,
      ]
    }
    return [
      '#F59E0B',
      'Validación no deforestación Pendiente',
      <Error width={70} height={70} />,
    ]
  }

  // const classifyDeforestation = (
  //   coberturaBosque: number,
  //   perdidaBosque: number,
  //   riesgoInsignificante: number,
  // ): [string, string, any] => {
  //   // Clasificación de la cobertura de bosque natural
  //   let coberturaClasificacion
  //   if (coberturaBosque > 0) {
  //     coberturaClasificacion = 'Alta'
  //   } else {
  //     coberturaClasificacion = 'Baja'
  //   }

  //   // Clasificación de la pérdida de bosque natural
  //   let perdidaClasificacion
  //   if (perdidaBosque === 0) {
  //     perdidaClasificacion = 'Ninguna'
  //   } else {
  //     perdidaClasificacion = 'Alta'
  //   }

  //   // Clasificación del riesgo insignificante
  //   let riesgoClasificacion
  //   if (riesgoInsignificante === 0) {
  //     riesgoClasificacion = 'Aceptado'
  //   } else {
  //     riesgoClasificacion = 'No Aceptado'
  //   }

  //   // Clasificación final basada en los tres indicadores
  //   if (
  //     coberturaClasificacion === 'Alta' &&
  //     perdidaClasificacion === 'Ninguna' &&
  //     riesgoClasificacion === 'Aceptado'
  //   ) {
  //     return ['Aceptado', '#22C55E', <Happy width={70} height={70} />]
  //   } else {
  //     return ['No Aceptado', '#EF4444', <Sad width={70} height={70} />]
  //   }
  // }

  const btnGFW = () => {
    if (parcel?.gfw?.status === 'Pending') {
      return true
    }
    if (
      parcel?.gfw?.status === 'Completed' ||
      parcel?.gfw?.status?.includes('Error')
    ) {
      return false
    }
    return true
  }

  const calculateDeforestationPercentage = (
    coberturaBosque: number,
    perdidaBosque: number,
  ) => {
    // console.log('coberturaBosque', coberturaBosque)
    // console.log('perdidaBosque', perdidaBosque)
    if (coberturaBosque === 0) {
      return 0
    }
    return (perdidaBosque / coberturaBosque) * 100
  }

  const toasMessage = (msg: string, icon?: any) => {
    Toast.show({
      type: 'msgToast',
      text1: msg,
      autoHide: false,
      props: {
        icon: icon,
        onPress: () => {},
        btnText: 'OK',
      },
    })
  }

  const postKafeSistemas = async () => {
    if (parcel?.kf !== undefined) {
      return
    }
    const polygonCoordinates = parcel.polygon
      .map((coordenada: Position) => `${coordenada[1]} ${coordenada[0]}`)
      .join(', ')
    const wktPolygon = `POLYGON((${polygonCoordinates}))`
    // @braudin debe venir desde el servidor
    const url = Config?.API_KAFE_SISTEMAS || ''
    const API_KEY_KAFE_SISTEMAS = Config?.API_KEY_KAFE_SISTEMAS || ''

    const resp = await fetchData(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY_KAFE_SISTEMAS,
        },
        data: {
          dni: user.dni,
          polygon: wktPolygon,
          departamento: user?.district?.dist_name,
        },
      },
      true,
    )
    console.log('resp', resp)
    if (resp?.response?.status) {
      return
    }
    // agregar la respuesta a la parcela
    const updatedParcel = {
      ...parcel,
      kf: {...resp, send: new Date().toISOString()},
    }
    parcels[indexParcel] = updatedParcel
    storage.set(STORAGE_KEYS.parcels, JSON.stringify(parcels))
    navigation.navigate('DrawPolygonScreen', {id: id})
  }
  const getKafeSistemas = async () => {
    // hacer esto solo si se hizo el post y send es mayor a 24 horas y si  statys es On Hold
    if (
      parcel?.kf === undefined ||
      parcel?.kf?.Code === 2 ||
      Date.now() - new Date(parcel?.kf?.send).getTime() < 24 * 60 * 60 * 1000
    ) {
      return
    }

    const url = `${Config?.BASE_URL}/field_state/${user.dni}`
    const KAFE_SISTEMAS_KEY = Config?.KAFE_SISTEMAS_KEY || ''
    const resp = await fetchData(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'kafe-sistemas-key': KAFE_SISTEMAS_KEY,
        },
      },
      true,
    )
    if (resp?.response?.status) {
      return
    }
    const updatedParcel = {
      ...parcel,
      kf: {...resp, send: new Date().toISOString()},
    }
    parcels[indexParcel] = updatedParcel
    storage.set(STORAGE_KEYS.parcels, JSON.stringify(parcels))
    navigation.navigate('DrawPolygonScreen', {id: id})
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLORS_DF.isabelline,
        }}>
        <HeaderComponent
          label="Mis parcelas"
          goBack={true}
          goBackNavigation={() => {
            navigation.goBack()
          }}
          backgroundColor="#8F3B06"
          textColor="white"
        />
        <Spinner
          textContent="Enviando Consulta"
          textStyle={{color: COLORS_DF.citrine_brown}}
          overlayColor="rgba(255, 255, 255, 0.8)"
          color="#178B83"
          visible={loading}
          size={100}
        />

        <View
          style={{
            paddingHorizontal: 16,
            justifyContent: 'center',
          }}>
          <Text style={styles.title}>Información de ventas</Text>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Card
              containerStyle={{
                flex: 1,
                alignSelf: 'center',
                minHeight: 200,
                borderRadius: 7,
                elevation: 5,
                paddingHorizontal: 15,
                marginRight: 1,
              }}>
              <View>
                <Text style={styles.kg}>Seco</Text>
              </View>
              <Seco width={42} height={42} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={styles.kg}>{sumKgSeco} </Text>
                <Text style={{color: COLORS_DF.citrine_brown, marginLeft: 10}}>
                  Kg.
                </Text>
              </View>
              <View style={{marginTop: 15}}>
                <Text>Total en ventas</Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Text
                  style={{color: COLORS_DF.citrine_brown, fontWeight: 'bold'}}>
                  {sumSalesSeco}
                </Text>
              </View>
            </Card>
            <Card
              containerStyle={{
                flex: 1,
                alignSelf: 'center',
                minHeight: 200,
                borderRadius: 7,
                elevation: 5,
                paddingHorizontal: 15,
                marginRight: 1,
              }}>
              <View>
                <Text style={styles.kg}>Baba</Text>
              </View>
              <Baba width={42} height={42} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={styles.kg}>{sumKgBaba} </Text>
                <Text style={{color: COLORS_DF.citrine_brown, marginLeft: 10}}>
                  Kg.
                </Text>
              </View>
              <View style={{marginTop: 15}}>
                <Text>Total en ventas</Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Text
                  style={{color: COLORS_DF.citrine_brown, fontWeight: 'bold'}}>
                  {sumSalesBaba}
                </Text>
              </View>
            </Card>
          </View>
          <Text style={styles.title}>Mapa de parcela {parcel?.name}</Text>
        </View>
        {btnGFW() && (
          <View style={styles.containerButtonGFW}>
            <TouchableOpacity
              onPress={() => (parcel?.gfw === undefined ? postGfw() : getGfw())}
              activeOpacity={0.8}
              style={{
                backgroundColor: COLORS_DF.robin_egg_blue,
                height: 52,
                borderRadius: 5,
                justifyContent: 'center',
                marginTop: 15,
              }}>
              <Text style={styles.textGfw}>
                {parcel?.gfw === undefined
                  ? 'Solicitar verificación No Deforestación'
                  : 'Consultar verificación No Deforestación'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <Card
          containerStyle={{
            borderRadius: 7,
            elevation: 5,
            marginBottom: MP_DF.xlarge,
          }}>
          {user.country?.code === 'PE' && (
            <View
              style={{
                backgroundColor: optionsUiKs()[0],
                alignItems: 'center',
                borderRadius: 5,
                marginBottom: 15,
                height: 32,
                justifyContent: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                {optionsUiKs()[1]}
              </Text>
            </View>
          )}
          {parcel?.gfw && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (parcel?.gfw?.status?.includes('Error')) {
                  toasMessage(parcel?.gfw?.msg, <Sad height={70} width={70} />)
                  return
                }
                if (parcel?.gfw?.status === 'Completed') {
                  toasMessage(
                    'Validación de no deforestación aprobada, perdida de bosque natural: ' +
                      calculateDeforestationPercentage(
                        Number(
                          parcel?.gfw?.data?.deforestation_kpis[0][
                            'Natural Forest Coverage (HA) (Beta)'
                          ],
                        ),
                        Number(
                          parcel?.gfw?.data?.deforestation_kpis[0][
                            'Natural Forest Loss (ha) (Beta)'
                          ],
                        ),
                      ).toFixed(2) +
                      '%',
                    optionsUiGFW()[2],
                  )
                  return
                }
              }}
              style={{
                backgroundColor: optionsUiGFW()[0],
                alignItems: 'center',
                borderRadius: 5,
                marginBottom: 15,
                height: 32,
                justifyContent: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                {optionsUiGFW()[1]}
              </Text>
            </TouchableOpacity>
          )}
          <MapView
            ref={map}
            // key={coordinates.length}
            styleURL={StyleURL.Satellite}
            scaleBarEnabled={false}
            rotateEnabled={false}
            attributionEnabled={false}
            compassEnabled={false}
            logoEnabled={false}
            style={{
              height: height * 0.4,
              width: width * 0.8,
              alignSelf: 'center',
            }}>
            <Polygon coordinates={coordinatesWithLast} />
            <Camera
              minZoomLevel={14}
              maxZoomLevel={18}
              defaultSettings={{
                centerCoordinate: firstPoint,
                zoomLevel: 12,
              }}
              centerCoordinate={centerCoordinate}
              zoomLevel={zoomLevel}
              animationDuration={700}
              animationMode={'easeTo'}
            />
          </MapView>
          {/* <Text style={styles.textData}>Área: {parcel?.hectares || 0} Has</Text>
          <Text style={styles.textData}>Propiedad: Pendiente</Text>
          <Text style={styles.textData}>
            Deforestación: {parcel?.gfw?.status}
          </Text> */}
        </Card>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  textData: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: 15,
    marginRight: 45,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    marginTop: 20,
  },
  kg: {
    fontSize: FONT_SIZES.medium,
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontWeight: 'bold',
  },
  cacaoProducer: {
    fontSize: FONT_SIZES.small,
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.gray,
    top: 10,
  },
  containerButtonGFW: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  buttonGfw: {
    backgroundColor: COLORS_DF.robin_egg_blue,
    height: 44,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 15,
  },
  textGfw: {
    textAlign: 'center',
    color: '#FFF',
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 16,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  annotationFill: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: 'blue',
    transform: [{scale: 0.6}],
  },
})
export default DrawPolyline
