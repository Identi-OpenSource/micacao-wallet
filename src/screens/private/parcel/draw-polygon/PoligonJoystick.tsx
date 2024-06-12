import {useNavigation} from '@react-navigation/native'
import {
  Camera,
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
  Alert,
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
import {useSyncData} from '../../../../states/SyncDataContext'
import Toast from 'react-native-toast-message'
import {setIn} from 'formik'

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

const PoligonJoystick = ({route}: any) => {
  const {index} = route.params
  const parcel = JSON.parse(storage.getString('parcels') || '[]')

  const firstPoint = [
    Number(parcel[index].firstPoint[1]),
    Number(parcel[index].firstPoint[0]),
  ] as Position
  const [coordinates, setCoordinates] = useState<Position[]>([])
  const [lastCoordinate, setLastCoordinate] = useState<Position>(firstPoint)
  const [crosshairPos, setCrosshairPos] = useState(firstPoint)
  const [centerCoordinate, setCenterCoordinate] = useState(firstPoint)
  const [joystickPosition, setJoystickPosition] = useState({x: 0, y: 0})
  const coorInitRef = useRef(null)
  const navigation = useNavigation()
  const [showModal, setShowModal] = useState(false)
  const [editActive, setEditActive] = useState<boolean | number>(false)
  const [indexEdit, setIndexEdit] = useState(-1)
  const {addToSync} = useSyncData()
  const [polygonReview, setPolygonReview] = useState<Position[]>([])
  const coordinatesWithLast = useMemo(() => {
    return [...coordinates, lastCoordinate]
  }, [coordinates, lastCoordinate])

  const map = useRef<MapView>(null)
  const ref2 = useRef<Camera>(null)

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

  // useEffect(() => {
  //   coorInitRef.current = lastCoordinate
  // }, [coordinates])

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
    Toast.show({
      type: 'actionToast',
      text1:
        'Revisa y ajusta los puntos del polígono, recuerda que después de guardar el polígono no podrás editarlo',
      autoHide: false,
      props: {
        onPress: () => review(),
        btnText: 'Revisar el polígono',
      },
    })
    // INICIO DEL POLIGONO
    // const newParcel = {
    //   ...parcel[index],
    //   polygon: [...coordinatesWithLast, coordinatesWithLast[0]],
    //   syncUp: false,
    // }

    // let parcels = parcel
    // parcels[index] = newParcel

    // setShowModal(true)

    // setTimeout(() => {
    //   addToSync(JSON.stringify(parcels), 'parcels')
    //   storage.delete('polygonTemp')
    // }, 7000)
    // FIN DEL POLIGONO
  }

  const review = () => {
    console.log('review')
    setPolygonReview([...coordinatesWithLast, coordinatesWithLast[0]])
    setEditActive(true)
  }

  const back = () => {
    storage.delete('polygonTemp')
    navigation.goBack()
  }

  const closeModal = () => {
    setShowModal(false)
    navigation.navigate('DrawPolygonScreen', {index})
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

  /*   useFocusEffect(
    useCallback(() => {
      return () => {
        storage.delete("polygonTemp");
      };
    }, [])
  ); */

  console.log('setIndexEdit', indexEdit)

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
          <Close_Map height={40} width={40} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSubmit} style={styles.buttonSave}>
          <Text style={styles.textButtonSave}>Dibujo finalizado</Text>
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
            <Polygon coordinates={coordinatesWithLast} />
            {coordinatesWithLast.map((c, i) => (
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
              minZoomLevel={14}
              maxZoomLevel={18}
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
                  setCenterCoordinate([
                    e.geometry.coordinates[0],
                    e.geometry.coordinates[1],
                  ])
                  onSelected(e)
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
    </View>
  )
}

const styles = StyleSheet.create({
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
    marginTop: -100,
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
  buttonClose: {
    top: 10,
  },
  buttonSave: {
    top: 10,
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
