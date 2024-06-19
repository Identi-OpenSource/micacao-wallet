import {CommonActions, useNavigation} from '@react-navigation/native'
import {
  Camera,
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
type Position = [number, number]

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

const GradientLineRecorrer = ({route}: any) => {
  const {index} = route.params
  const parcel = JSON.parse(storage.getString('parcels') || '[]')
  const firstPoint = [
    Number(parcel[index].firstPoint[1]),
    Number(parcel[index].firstPoint[0]),
  ] as Position
  const {addToSync} = useSyncData()
  const [coordinates, setCoordinates] = useState<Position[]>([firstPoint])
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
    if (parcel[index].polygon) {
      setCoordinates(parcel[index].polygon)
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
    let watchId: any = null
    if (started) {
      watchId = Geolocation.watchPosition(
        position => {
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
    //storage.delete("polygonTemp");

    if (parcel[index].polygon) {
      setCoordinates(parcel[index].polygon)
    } else {
      if (storage.getString('polygonTemp')) {
        const coordinateTemp = JSON.parse(
          storage.getString('polygonTemp') || '',
        )
        setCoordinates(coordinateTemp)
      }
    }
  }, [])

  const savePoligonAcept = () => {
    setCoordinates(polygonReview)
    const newParcel = {
      ...parcel[index],
      polygon: polygonReview,
      syncUp: false,
    }
    let parcels = parcel
    parcels[index] = newParcel
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
      autoHide: false,
      text1:
        'Vamos a guardar el polígono\nNo podrás editarlo\n\n¿Deseas continuar?',
      props: {
        title: `Area aproximada: ${areaInHectares} has`,
        onPress: () => savePoligonAcept(),
        btnText: 'Guardar',
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
      text1: 'Revisa y edita el poligono\nLuego ya no podrá ser editado',
      autoHide: false,
      props: {
        onPress: () => review(),
        btnText: 'Revisar el polígono',
        title: `Area aproximada: ${areaInHectares} has`,
      },
    })
  }

  const review = () => {
    setPolygonReview([...coordinatesWithLast, coordinatesWithLast[0]])
    setEditActive(true)
  }

  // const onSubmit = () => {
  //   if (coordinatesWithLast.length < 5) {
  //     Alert.alert('Error', 'El polígono debe tener al menos 4 puntos')
  //     return
  //   }
  //   // Guardar en la lista de polígonos
  //   const newParcel = {
  //     ...parcel[index],
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
    storage.delete('polygonTemp')
    // Evitar el retroceso de la pantalla de dibujo
    const currentRoutes = navigation?.getState()?.routes
    const newRoutes: any = currentRoutes?.slice(0, -2)
    newRoutes?.push({
      name: 'DrawPolygonScreen',
      params: {index},
    })
    navigation.dispatch(
      CommonActions.reset({
        index: newRoutes.length - 1,
        routes: newRoutes,
      }),
    )
    addToSync(JSON.stringify(parcels), 'parcels')
  }
  const back = () => {
    storage.delete('polygonTemp')
    navigation.goBack()
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

  const onDragEnd = (index: number, newCoordinate: Position) => {
    setCoordinates(prev => {
      const updatedCoordinates = [...prev]
      updatedCoordinates[index] = newCoordinate
      storage.set('polygonTemp', JSON.stringify(updatedCoordinates))
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
                  storage.set('polygonTemp', JSON.stringify(DATA))
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
