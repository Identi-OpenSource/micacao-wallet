import {CommonActions, useNavigation} from '@react-navigation/native'
import {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
  StyleURL,
} from '@rnmapbox/maps'
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake'
import React, {
  ComponentProps,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import Close_Map from '../../../../assets/svg/Close_Map.svg'
import {Btn, BtnIcon} from '../../../../components/button/Button'
import ModalComponent from '../../../../components/modalComponent'
import {storage} from '../../../../config/store/db'
import {COLORS_DF, MP_DF} from '../../../../config/themes/default'
import {useSyncData} from '../../../../states/SyncDataContext'
import Toast from 'react-native-toast-message'
import * as turf from '@turf/turf'
import {Add_Location} from '../../../../assets/svg'
import {STORAGE_KEYS, SYNC_UP_TYPES} from '../../../../config/const'
import {Parcel} from '../../../../states/UserContext'
import {LoadingSave} from '../../../../components/loading/LoadinSave'
type Position = [number, number]

const maxAcceptableAccuracy = 50 // meters
const maxAcceptableDistance = 30 // meters
const velocidadMinima = 0.5 // m/s
const velocidadMaxima = 10 // m/s

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

  return (
    <ShapeSource id={'shape-source-id-0'} shape={features}>
      <LineLayer id={'line-layer'} style={lineLayerStyle} />
    </ShapeSource>
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
  const {addToSync} = useSyncData()
  const [coordinates, setCoordinates] = useState<Position[]>([])
  const [cam, setCam] = useState<Position>(firstPoint)
  const [started, setStarted] = useState(false)
  const navigation = useNavigation()
  const [showModal, setShowModal] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(17)

  const [polygonReview, setPolygonReview] = useState<Position[]>([])
  const [editActive, setEditActive] = useState<boolean | number>(false)
  const [indexEdit, setIndexEdit] = useState(-1)
  const [centerCoordinate, setCenterCoordinate] = useState(firstPoint)
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint)
  const [crosshairPos, setCrosshairPos] = useState(firstPoint)
  const [parcels, setParcels] = useState(parcel)
  const ref2 = useRef<Camera>(null)

  const heightMap = Dimensions.get('window').height
  const widthMap = Dimensions.get('window').width

  const coordinatesWithLast = useMemo(() => {
    return [...coordinates]
  }, [coordinates, lastCoordinate])

  const map = useRef<MapView>(null)

  const [ejecutado, setEjecutado] = useState(false)

  useEffect(() => {
    if (!ejecutado) {
      activateKeepAwake()
      setEjecutado(true)
    }
  }, [ejecutado])

  useEffect(() => {
    if (parcel.polygon) {
      setCoordinates(parcel.polygon)
    } else {
      if (storage.getString(STORAGE_KEYS.polygonTemp)) {
        const coordinateTemp = JSON.parse(
          storage.getString(STORAGE_KEYS.polygonTemp) || '',
        )
        setCenterCoordinate(coordinateTemp[coordinateTemp.length - 1])
        setCoordinates(coordinateTemp)
      }
    }
  }, [])

  useEffect(() => {
    let watchId: any = null
    if (started) {
      let lastValidPosition: any = null
      watchId = Geolocation.watchPosition(
        position => {
          console.log('posición actual:', position)
          const {latitude, longitude, accuracy} = position.coords
          const timestamp = position.timestamp
          if (accuracy <= maxAcceptableAccuracy) {
            if (lastValidPosition === null) {
              // Guardar la primera posición como válida
              lastValidPosition = {latitude, longitude, timestamp}
              console.log(
                `Primera posición válida registrada: Latitud: ${latitude}, Longitud: ${longitude}`,
              )
            } else if (lastValidPosition) {
              console.log('lastValidPosition', lastValidPosition)
              const distance = carcularDistancia(
                lastValidPosition?.latitude,
                lastValidPosition?.longitude,
                latitude,
                longitude,
              )
              // calcula el tiempo entre los dos puntos
              const timeTranscurred =
                (timestamp - lastValidPosition?.timestamp) / 1000
              const velocidad = distance / timeTranscurred
              if (
                distance <= maxAcceptableDistance &&
                velocidad >= velocidadMinima &&
                velocidad <= velocidadMaxima
              ) {
                // Guardar la última posición como válida
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
          console.log(error)
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 3,
          fastestInterval: 5000,
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
    //storage.delete("polygonTemp");
    getGps()

    // if (parcel.polygon) {
    //   setCoordinates(parcel.polygon)
    // } else {
    //   if (storage.getString(STORAGE_KEYS.polygonTemp)) {
    //     const coordinateTemp = JSON.parse(
    //       storage.getString(STORAGE_KEYS.polygonTemp) || '',
    //     )
    //     setCoordinates(coordinateTemp)
    //   }
    // }
  }, [])

  useEffect(() => {
    if (firstPointGps) {
      setLastCoordinate(firstPointGps)
      setCrosshairPos(firstPointGps)
      setCenterCoordinate(firstPointGps)
      setCam(firstPointGps)
      setLastCoordinate(firstPointGps)
      setCrosshairPos(firstPointGps)
      setTimeout(() => {
        setLoadInit(true)
      }, 5000)
    }
  }, [firstPointGps])

  // capture GPS
  const getGps = async () => {
    if (parcel.polygon) {
      setCoordinates(parcel.polygon)
      setLoadInit(true)
      return
    }
    const poligonT = storage.getString(STORAGE_KEYS.polygonTemp) || ''
    if (poligonT) {
      const coordinateTemp = JSON.parse(poligonT)
      setCenterCoordinate(coordinateTemp[coordinateTemp.length - 1])
      setCam(coordinateTemp[coordinateTemp.length - 1])
      setCoordinates(coordinateTemp)
      setLoadInit(true)
      return
    }
    Geolocation.getCurrentPosition(
      position => {
        const point = [
          position.coords.longitude,
          position.coords.latitude,
        ] as Position
        setFirstPointGps(point)
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

  // const onSubmit = () => {
  //   if (coordinatesWithLast.length < 5) {
  //     Alert.alert('Error', 'El polígono debe tener al menos 4 puntos')
  //     return
  //   }
  //   // Guardar en la lista de polígonos
  //   const newParcel = {
  //     ...parcel,
  //     polygon: [...coordinatesWithLast, coordinatesWithLast[0]],
  //     syncUp: false,
  //   }

  //   setShowModal(true)

  //   let parcels = parcel
  //   parcels[index] = newParcel

  //   setTimeout(() => {
  //     addToSync(JSON.stringify(parcels), 'parcels')
  //     storage.delete('polygonTemp')
  //   }, 7000)
  // }

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
    const coordinates = e.geometry.coordinates

    // setLastCoordinate(e.geometry.coordinates as Position)
    // encontrar el punto en el array de coordenadas
    const index = polygonReview.findIndex(
      (c: Position) => c[0] === coordinates[0] && c[1] === coordinates[1],
    )
    if (index !== -1) {
      setTimeout(() => {
        setIndexEdit(index)
      }, 500)
    }
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

  const lineLayerStyle = {
    lineColor: '#fff',
    lineWidth: 4,
  }

  return (
    <>
      {!loadInit && (
        <View
          style={{
            height: heightMap,
            width: widthMap,
            position: 'absolute',
            zIndex: 10000000,
            backgroundColor: COLORS_DF.isabelline,
          }}>
          <LoadingSave msg="Buscando tu ubicación" />
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
              <CrosshairOverlay onCenter={c => setCrosshairPos(c)} />
              {<Polygon coordinates={coordinatesWithLast} />}
              {polygonReview.map((c, i) => (
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
              ))}
              {coordinatesWithLast.map((c, i) => {
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
                        height: 10,
                        width: 10,
                        backgroundColor: lastIndex === i ? 'white' : 'white',
                        borderRadius: 5,
                      }}
                    />
                  </PointAnnotation>
                )
              })}
              <Camera zoomLevel={17} minZoomLevel={14} centerCoordinate={cam} />
            </>
          )}
          {editActive && (
            <>
              <Polygon coordinates={polygonReview} />
              {polygonReview.map((c, i) => (
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
              ))}
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
        <View
          style={{
            position: 'absolute',
            bottom: MP_DF.large,
            width: '100%',
            minHeight: 50,
            paddingHorizontal: MP_DF.large,
            zIndex: 1000000,
            justifyContent: 'space-between',
          }}>
          {!editActive && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: MP_DF.large,
              }}>
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: MP_DF.large,
              }}>
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
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 200,
    paddingHorizontal: 25,
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
