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
import React, {
  ComponentProps,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {Add_Location, Delete} from '../../../../assets/svg'
import Close_Map from '../../../../assets/svg/Close_Map.svg'
import ModalComponent from '../../../../components/modalComponent'
import {storage} from '../../../../config/store/db'
import Toast from 'react-native-toast-message'
import * as turf from '@turf/turf'
import {Parcel} from '../../../../states/UserContext'
import {STORAGE_KEYS, SYNC_UP_TYPES} from '../../../../config/const'
import Geolocation from 'react-native-geolocation-service'
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake'
import {LoadingSave} from '../../../../components/loading/LoadinSave'
import {COLORS_DF} from '../../../../config/themes/default'

const heightMap = Dimensions.get('window').height
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
  // console.log('=> features', JSON.stringify(features))
  return (
    <ShapeSource id={'shape-source-id-0'} shape={features}>
      <CircleLayer id="point-layer" style={pointLayerStyle} />
      <LineLayer id={'line-layer'} style={lineLayerStyle} />
    </ShapeSource>
  )
}

const PoligonJoystick = ({route}: any) => {
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
  const [parcels, setParcels] = useState(parcel)
  const [firstPointGps, setFirstPointGps] = useState<[number, number] | null>(
    null,
  )
  const [loadInit, setLoadInit] = useState(false)
  const [coordinates, setCoordinates] = useState<Position[]>([])
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint)
  const [crosshairPos, setCrosshairPos] = useState(firstPoint)
  const [centerCoordinate, setCenterCoordinate] = useState(firstPoint)
  const navigation = useNavigation()
  const [showModal, setShowModal] = useState(false)
  const [editActive, setEditActive] = useState<boolean | number>(false)
  const [indexEdit, setIndexEdit] = useState(-1)
  const [polygonReview, setPolygonReview] = useState<Position[]>([])
  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate]
  }, [coordinates, lastCoordinate])

  const map = useRef<MapView>(null)
  const ref2 = useRef<Camera>(null)

  useEffect(() => {
    activateKeepAwake()
    getGps()
    return () => {
      deactivateKeepAwake()
    }
  }, [])

  useEffect(() => {
    if (firstPointGps) {
      setLastCoordinate(firstPointGps)
      setCoordinates([firstPointGps])
      setCenterCoordinate(firstPointGps)
    }
  }, [firstPointGps])

  // capture GPS
  const getGps = async () => {
    if (parcel.polygon) {
      setCoordinates(parcel.polygon)
      setTimeout(() => {
        setLoadInit(true)
      }, 3000)
      return
    }
    const poligonT = storage.getString(STORAGE_KEYS?.polygonTemp) || '[]'
    const coordinateTemp = JSON.parse(poligonT)

    if (coordinateTemp.length > 0) {
      setCenterCoordinate(coordinateTemp[coordinateTemp.length - 1])
      setCoordinates(coordinateTemp)
      setTimeout(() => {
        setLoadInit(true)
      }, 3000)
      return
    }
    Geolocation.getCurrentPosition(
      position => {
        const point = [
          position.coords.longitude,
          position.coords.latitude,
        ] as Position
        setFirstPointGps(point)
        setTimeout(() => {
          setLoadInit(true)
        }, 3000)
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

  const deletePoint = () => {
    if (coordinates.length > 0) {
      setCoordinates(prev => {
        const newCoordinates = prev.slice(0, -1)
        storage.set(STORAGE_KEYS.polygonTemp, JSON.stringify(newCoordinates))
        return newCoordinates
      })
    }
  }

  const savePoligonAcept = () => {
    //setCoordinates(polygonReview)
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
    const syncUpNew = {...syncUp, parcels: false}
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

  const back = () => {
    navigation.goBack()
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

  return (
    <>
      {!loadInit && (
        <View style={styles.loading}>
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
          <TouchableOpacity
            onPress={editActive ? savePoligon : onSubmit}
            style={styles.buttonSave}>
            <Text style={styles.textButtonSave}>
              {editActive ? 'Guardar polígono' : 'Dibujo finalizado'}
            </Text>
          </TouchableOpacity>
        </View>
        <MapView
          ref={map}
          styleURL={StyleURL.Satellite}
          // styleURL="https://api.maptiler.com/maps/satellite/style.json?key=fh2hRVLtuNuRzkTOINtk"
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
              {coordinatesWithLast.length > 1 && (
                <Polygon coordinates={coordinatesWithLast} />
              )}
              {coordinatesWithLast.length < 3 &&
                coordinatesWithLast.map((c, i) => (
                  <PointAnnotation
                    // onSelected={onSelected}
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
                defaultSettings={{
                  centerCoordinate: firstPoint,
                  zoomLevel: 17,
                }}
                minZoomLevel={12}
                maxZoomLevel={20}
                animationMode={'flyTo'}
                animationDuration={100}
                centerCoordinate={centerCoordinate}
              />
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
                // defaultSettings={{
                //   centerCoordinate: polygonReview[indexEdit],
                //   zoomLevel: 17,
                // }}
                minZoomLevel={14}
                maxZoomLevel={18}
                animationMode={'flyTo'}
                animationDuration={500}
                centerCoordinate={centerCoordinate}
              />
            </>
          )}
        </MapView>

        <View style={styles.containerButton}>
          {!editActive ? (
            <TouchableOpacity
              onPress={() => {
                deletePoint()
              }}
              style={styles.iconButton}>
              <Delete />
            </TouchableOpacity>
          ) : (
            <View />
          )}
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
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  loading: {
    height: heightMap,
    width: widthMap,
    position: 'absolute',
    zIndex: 10000000,
    backgroundColor: COLORS_DF.isabelline,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#D4D7D5',
    height: 60,
    width: 60,
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    height: 40,
    paddingHorizontal: 25,
    marginTop: -130,
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
  buttonSave: {
    top: 0,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    borderBottomEndRadius: 7,
    borderBottomStartRadius: 7,
    backgroundColor: '#D4D7D5',
  },
  textButtonSave: {
    fontSize: 15,
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
})

export default PoligonJoystick
