/* eslint-disable react-native/no-inline-styles */
import {CommonActions, useNavigation} from '@react-navigation/native'
import {
  Camera,
  CircleLayer,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from '@rnmapbox/maps'
import {activateKeepAwake} from '@sayem314/react-native-keep-awake'
import React, {
  ComponentProps,
  forwardRef,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import Close_Map from '../../../../assets/svg/Close_Map.svg'
import {Btn, BtnIcon} from '../../../../components/button/Button'
import ModalComponent from '../../../../components/modalComponent'
import {storage} from '../../../../config/store/db'
import {COLORS_DF, MP_DF} from '../../../../config/themes/default'
import Toast from 'react-native-toast-message'
import * as turf from '@turf/turf'
import {Add_Location} from '../../../../assets/svg'
import {STORAGE_KEYS, SYNC_UP_TYPES} from '../../../../config/const'
import {Parcel} from '../../../../states/UserContext'
import {LoadingSave} from '../../../../components/loading/LoadinSave'

const heightMap = Dimensions.get('window').height
const widthMap = Dimensions.get('window').width
type Position = [number, number]

const maxAcceptableAccuracy = 100
const maxAcceptableDistance = 50

const lineLayerStyle = {
  lineColor: '#fff',
  lineWidth: 3,
}
const pointLayerStyle = {
  circleColor: '#fff', // Rojo, para que sea visible en la mayoría de los fondos
  circleRadius: 6,
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
      <CircleLayer id="point-layer" style={pointLayerStyle} />
    </ShapeSource>
  )
}

const PolygonR = ({coordinates}: {coordinates: Position[]}) => {
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

function carcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  // Función para calcular la distancia en metros entre dos puntos geográficos (fórmula haversine)
  const R = 6371e3 // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180 // Convertir latitudes a radianes
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const dist = R * c // Distancia en metros
  return dist
}

const GradientLineRecorrer = ({route}: any) => {
  const params = route.params
  const user = JSON.parse(storage.getString(STORAGE_KEYS.user) || '{}')
  const centerPoint = user?.district?.center_point?.split(' ')
  const centerX = centerPoint?.[0]?.replace(/,/g, '.') || 0
  const centerY = centerPoint?.[1]?.replace(/,/g, '.') || 0
  const parcelsList = JSON.parse(
    storage.getString(STORAGE_KEYS.parcels) || '[]',
  )
  const parcel = parcelsList.find((p: Parcel) => p.id === params?.id)
  const parcelIndex = parcelsList.findIndex((p: Parcel) => p.id === params?.id)

  const firstPoint = [Number(centerY), Number(centerX)] as Position
  const [firstPointGps, setFirstPointGps] = useState<[number, number] | null>(
    null,
  )
  const [loadInit, setLoadInit] = useState(false)
  const [coordinates, setCoordinates] = useState<Position[]>([])
  const [cam, setCam] = useState<Position>(firstPoint)
  const [started, setStarted] = useState(false)
  const navigation = useNavigation()
  const [showModal, setShowModal] = useState(false)

  const [polygonReview, setPolygonReview] = useState<Position[]>([])
  const [editActive, setEditActive] = useState<boolean | number>(false)
  const [indexEdit, setIndexEdit] = useState(-1)
  const [centerCoordinate, setCenterCoordinate] = useState(firstPoint)
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint)
  const [crosshairPos, setCrosshairPos] = useState(firstPoint)
  const [parcels, setParcels] = useState(parcel)
  const [gpsError, setGpsError] = useState(false)
  const ref2 = useRef<Camera>(null)

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates]
  }, [coordinates, lastCoordinate])

  const map = useRef<MapView>(null)

  useEffect(() => {
    activateKeepAwake()
    getGps()
  }, [])

  useEffect(() => {
    let watchId: any = null
    if (started) {
      setGpsError(started)
      let lastValidPosition: any = null
      watchId = Geolocation.watchPosition(
        position => {
          // console.log('posición actual:', position)
          const {latitude, longitude, accuracy} = position.coords
          const timestamp = position.timestamp
          if (accuracy <= maxAcceptableAccuracy) {
            if (lastValidPosition === null) {
              // Guardar la primera posición como válida
              lastValidPosition = {latitude, longitude, timestamp}
            } else if (lastValidPosition) {
              const distance = carcularDistancia(
                lastValidPosition?.latitude,
                lastValidPosition?.longitude,
                latitude,
                longitude,
              )
              // calcula el tiempo entre los dos puntos
              // const timeTranscurred =
              //   (timestamp - lastValidPosition?.timestamp) / 1000
              // const velocidad = distance / timeTranscurred
              if (
                distance <= maxAcceptableDistance /* &&
                velocidad >= velocidadMinima &&
                velocidad <= velocidadMaxima */
              ) {
                // Guardar la última posición como válida
                setGpsError(false)
                setCoordinates((prevPositions: any[]) => {
                  const DATA = [...prevPositions, [longitude, latitude]]
                  storage.set(STORAGE_KEYS.polygonTemp, JSON.stringify(DATA))
                  return DATA
                })
                lastValidPosition = {latitude, longitude, timestamp}
              }
            }
          } else {
            console.log('punto no aceptable')
          }
          setCam([longitude, latitude])
        },
        error => {
          setGpsError(true)
          console.log(error)
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5,
          fastestInterval: 5000,
          interval: 5000,
        },
      )
    }

    return () => {
      watchId !== null && Geolocation.clearWatch(watchId)
    }
  }, [started])

  useEffect(() => {
    if (firstPointGps) {
      setCrosshairPos(firstPointGps)
      setCenterCoordinate(firstPointGps)
      setCam(firstPointGps)
      setLastCoordinate(firstPointGps)
      setCrosshairPos(firstPointGps)
    }
  }, [firstPointGps])

  // capture GPS
  const getGps = async () => {
    if (parcel.polygon) {
      setCoordinates(parcel.polygon)
      setTimeout(() => {
        setLoadInit(true)
      }, 5000)
      return
    }
    const poligonT = storage.getString(STORAGE_KEYS.polygonTemp) || ''
    if (poligonT) {
      const coordinateTemp = JSON.parse(poligonT)
      setCenterCoordinate(coordinateTemp[coordinateTemp.length - 1])
      setCam(coordinateTemp[coordinateTemp.length - 1])
      setCoordinates(coordinateTemp)
      setTimeout(() => {
        setLoadInit(true)
      }, 5000)
      return
    }
    gpsFristPoint()
  }

  const gpsFristPoint = () => {
    Geolocation.getCurrentPosition(
      position => {
        const point = [
          position.coords.longitude,
          position.coords.latitude,
        ] as Position
        setFirstPointGps(point)

        setTimeout(() => {
          setLoadInit(true)
        }, 5000)
      },
      error => {
        console.log(error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      },
    )
  }

  const savePoligonAcept = () => {
    setCoordinates(polygonReview)
    const newParcel = {
      ...parcel,
      polygon:
        polygonReview.length !== 0
          ? polygonReview
          : [...coordinatesWithLast, coordinatesWithLast[0]],
    }
    parcelsList[parcelIndex] = newParcel
    storage.set(STORAGE_KEYS.parcels, JSON.stringify(parcelsList))

    const syncUp = JSON.parse(storage.getString(STORAGE_KEYS.syncUp) || '[]')
    const syncUpNew = [
      ...syncUp,
      {type: SYNC_UP_TYPES.parcels, data: newParcel},
    ]
    storage.set(STORAGE_KEYS.syncUp, JSON.stringify(syncUpNew))
    setParcels(parcels)
    setShowModal(true)
  }

  const savePoligon = () => {
    const polygon = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [polygonReview],
      },
    } as any
    const area = turf?.area(polygon)
    const areaInHectares = (area / 10000)?.toFixed(2)
    Toast.show({
      type: 'actionToast',
      text1: 'Revisa y edita el polígono luego ya  no podrá ser editado',
      autoHide: false,
      props: {
        onPress: () => {},
        btnText: 'Editar el polígono',
        exPress: () => savePoligonAcept(),
        btnExPress: 'Guardar',
        title: `Área aproximada: ${areaInHectares} has`,
      },
    })
  }

  const onSubmit = () => {
    console.log('onSubmit')
    if (coordinatesWithLast.length < 5) {
      Toast.show({
        type: 'actionToast',
        autoHide: true,
        visibilityTime: 3000,
        text1: 'El polígono debe tener al menos 4 puntos',
        props: {
          onPress: () => {},
          btnText: 'OK',
          hideCancel: true,
        },
      })
      return
    }
    const polygon = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...coordinatesWithLast, coordinatesWithLast[0]]],
      },
    } as any
    const area = turf?.area(polygon)
    const areaInHectares = (area / 10000)?.toFixed(2)
    Toast.show({
      type: 'actionToast',
      text1: 'Revisa y edita el polígono luego ya  no podrá ser editado',
      autoHide: false,
      props: {
        onPress: () => review(),
        btnText: 'Editar el polígono',
        exPress: () => savePoligonAcept(),
        btnExPress: 'Guardar',
        title: `Área aproximada: ${areaInHectares} has`,
      },
    })
  }

  const review = () => {
    setPolygonReview([...coordinatesWithLast, coordinatesWithLast[0]])
    setEditActive(true)
    Toast.show({
      type: 'modalMapToast',
      text1: '',
      autoHide: false,
    })
  }

  const closeModal = () => {
    setShowModal(false)
    storage.delete(STORAGE_KEYS.polygonTemp)
    // Evitar el retroceso de la pantalla de dibujo
    const currentRoutes = navigation?.getState()?.routes
    const newRoutes: any = currentRoutes?.slice(0, -2)
    newRoutes?.push({
      name: 'DrawPolygonScreen',
      params: {id: params?.id},
    })
    navigation.dispatch(
      CommonActions.reset({
        index: newRoutes.length - 1,
        routes: newRoutes,
      }),
    )
    // addToSync(JSON.stringify(parcels), 'parcels')
  }

  const back = () => {
    // storage.delete(STORAGE_KEYS.polygonTemp)
    navigation.goBack()
  }

  const deletePoint = () => {
    if (coordinates.length > 0) {
      setCoordinates(prev => {
        const newCoordinates = prev.slice(0, -1)
        storage.set(STORAGE_KEYS.polygonTemp, JSON.stringify(newCoordinates))
        return newCoordinates
      })
    }
  }

  const onDragEnd = (index: number, newCoordinate: Position) => {
    setCoordinates(prev => {
      const updatedCoordinates = [...prev]
      updatedCoordinates[index] = newCoordinate
      storage.set(STORAGE_KEYS.polygonTemp, JSON.stringify(updatedCoordinates))
      return updatedCoordinates
    })
  }

  const onSelected = (e: any) => {
    const coordinates = [e[0], e[1]]
    console.log('coordinates', e)

    // setLastCoordinate(e.geometry.coordinates as Position)
    // encontrar el punto en el array de coordenadas
    const index = polygonReview.findIndex(
      (c: Position) => c[0] === coordinates[0] && c[1] === coordinates[1],
    )
    console.log('onSelected', index)
    if (index !== -1) {
      setTimeout(() => {
        setIndexEdit(index)
      }, 500)
    }
  }

  return (
    <>
      {!loadInit && (
        <View style={styles.loading}>
          <LoadingSave msg="" />
        </View>
      )}
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#8F3B06" barStyle="light-content" />

        <ModalComponent
          isVisible={showModal}
          label={'¡El mapa de tu parcela ha sido guardado!'}
          closeModal={closeModal}
          buttonText={'Continuar'}
        />
        <View style={styles.containerButtonUp}>
          <TouchableOpacity onPress={back} style={styles.buttonClose}>
            <Close_Map height={38} width={38} />
          </TouchableOpacity>
          {gpsError && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                alignItems: 'center',
              }}>
              <ActivityIndicator size={18} color={'#fff'} />
              <Text style={styles.searchGps}>Buscando tu ubicación</Text>
            </View>
          )}
        </View>
        <MapView
          ref={map}
          styleURL={StyleURL.Satellite}
          style={styles.map}
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
              if (!editActive) {
                setLastCoordinate(crosshairCoords as Position)
              }
              if (editActive) {
                const newPolygon = polygonReview
                newPolygon[indexEdit] = crosshairCoords as Position
                if (indexEdit === 0 || indexEdit === polygonReview.length - 1) {
                  newPolygon[0] = crosshairCoords as Position
                  newPolygon[polygonReview.length - 1] =
                    crosshairCoords as Position
                } else {
                  newPolygon[indexEdit] = crosshairCoords as Position
                }
                setPolygonReview(newPolygon)
                setLastCoordinate(crosshairCoords as Position)
              }
            }
          }}>
          {!editActive && (
            <>
              {<Polygon coordinates={coordinatesWithLast} />}
              {/* <CrosshairOverlay onCenter={c => setCrosshairPos(c)} /> */}
              {/* {polygonReview.map((c, i) => (
                <PointAnnotation
                  onSelected={e => {
                    if (indexEdit === -1) {
                      setCenterCoordinate([
                        e.geometry.coordinates[0],
                        e.geometry.coordinates[1],
                      ])
                      onSelected(e)
                    }
                  }}
                  key={i.toString()}
                  id={i.toString()}
                  coordinate={[c[0], c[1]]}>
                  <View
                    style={{
                      height: 15,
                      width: 15,
                      backgroundColor: 'white',
                      borderRadius: 5,
                    }}
                  />
                </PointAnnotation>
              ))} */}
              {/* {coordinatesWithLast.map((c, i) => {
                const lastIndex = coordinates.length - 1
                return (
                  <PointAnnotation
                    key={i.toString() + coordinates.length}
                    id={i.toString()}
                    coordinate={[c[0], c[1]]}
                    draggable={i === 0} // Only make the first point draggable
                    onDragEnd={e =>
                      onDragEnd(i, [
                        e.geometry.coordinates[0],
                        e.geometry.coordinates[1],
                      ])
                    }>
                    <View
                      style={{
                        ...styles.pointAnnotation,
                        backgroundColor: lastIndex === i ? 'white' : 'white',
                      }}
                    />
                  </PointAnnotation>
                )
              })} */}
              <Camera
                zoomLevel={18}
                minZoomLevel={14}
                centerCoordinate={cam}
                animationMode="easeTo"
              />
            </>
          )}
          {editActive && (
            <>
              <PolygonR coordinates={polygonReview} />
              <CrosshairOverlay onCenter={c => setCrosshairPos(c)} />
              {polygonReview.map((c, i) => {
                return (
                  <PointAnnotation
                    children={
                      <View
                        style={{
                          height: 12,
                          width: 12,
                          backgroundColor: 'white',
                          position: 'absolute',
                          borderRadius: 10,
                        }}
                      />
                    }
                    onSelected={e => {
                      setCenterCoordinate([c[0], c[1]])
                      onSelected([c[0], c[1]])
                    }}
                    key={i.toString()}
                    id={i.toString()}
                    coordinate={[c[0], c[1]]}
                  />
                )
              })}
              <Camera
                ref={ref2}
                minZoomLevel={14}
                maxZoomLevel={18}
                animationMode={'flyTo'}
                animationDuration={500}
                centerCoordinate={centerCoordinate}
              />
            </>
          )}
        </MapView>
        <View style={styles.containerButton3}>
          {!editActive && (
            <View style={styles.containerButton3A}>
              <BtnIcon
                theme={'transparent'}
                icon={!started ? 'person-walking-arrow-right' : 'hand'}
                size={48}
                iconColor={COLORS_DF.greenAgrayu}
                onPress={() => {
                  !started ? setStarted(true) : setStarted(false)
                }}
              />

              <BtnIcon
                theme={'transparent'}
                icon={'person-walking-arrow-loop-left'}
                size={48}
                iconColor={COLORS_DF.greenAgrayu}
                onPress={() => {
                  deletePoint()
                }}
              />
            </View>
          )}
          {editActive && (
            <View style={styles.containerButton2}>
              <TouchableOpacity
                onPress={() => {
                  if (!editActive) {
                    const DATA = [...coordinates, lastCoordinate]
                    storage.set(STORAGE_KEYS.polygonTemp, JSON.stringify(DATA))
                    setCoordinates(DATA)
                  } else {
                    setIndexEdit(-1)
                  }
                }}
                style={styles.iconButton}>
                <Add_Location />
              </TouchableOpacity>
            </View>
          )}
          <Btn
            title={!editActive ? 'Guardar polígono' : 'Dibujo finalizado'}
            onPress={() => (!editActive ? onSubmit() : savePoligon())}
            theme="agrayu"
          />
        </View>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  pointAnnotation: {
    color: 'white',
  },
  map: {
    height: heightMap,
    width: widthMap,
  },
  loading: {
    height: heightMap,
    width: widthMap,
    position: 'absolute',
    zIndex: 10000000,
    backgroundColor: COLORS_DF.isabelline,
  },
  searchGps: {
    fontSize: 18,
    alignSelf: 'center',
    color: '#fff',
    marginTop: 10,
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 200,
    paddingHorizontal: 25,
  },
  containerButton3: {
    position: 'absolute',
    bottom: MP_DF.large,
    width: '100%',
    minHeight: 50,
    paddingHorizontal: MP_DF.large,
    zIndex: 1000000,
    justifyContent: 'space-between',
  },
  containerButton3A: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: MP_DF.large,
  },
  containerButton2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: MP_DF.large,
  },
  containerButtonUp: {
    position: 'absolute',
    top: 40,
    zIndex: 99999,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: Dimensions.get('window').width,
  },
  buttonClose: {},
  textButtonSave: {
    fontSize: 15,
    alignSelf: 'center',
    color: 'black',
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#D4D7D5',
    height: 60,
    width: 60,
  },
})
export default GradientLineRecorrer
