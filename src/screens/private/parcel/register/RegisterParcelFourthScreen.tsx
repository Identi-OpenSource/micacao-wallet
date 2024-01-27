import React, {useRef, useState} from 'react'
import {
  HeaderActions,
  SafeArea,
} from '../../../../components/safe-area/SafeArea'
import {StyleSheet, Text, View} from 'react-native'
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  DWH,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../../config/themes/default'
import {TEXTS} from '../../../../config/texts/texts'
import {ScreenProps} from '../../../../routers/Router'
import {Btn} from '../../../../components/button/Button'
import {STYLES_GLOBALS} from '../../../../config/themes/stylesGlobals'
import MapboxGL, {
  Camera,
  LocationPuck,
  PointAnnotation,
  UserLocation,
} from '@rnmapbox/maps'

import Config from 'react-native-config'
import {LABELS} from '../../../../config/texts/labels'
import {Loading} from '../../../../components/loading/Loading'

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN || '')
// MapboxGL.setConnected(false)

export const RegisterParcelFourthScreen = ({
  navigation,
  route,
}: ScreenProps<'RegisterParcelFourthScreen'>) => {
  const [location, setLocation] = useState([0, 0])
  const [locationUser, setLocationUser] = useState([0, 0])
  const [save, setSave] = useState(false)
  const [steep, setSteep] = useState(0)
  const pointAnnotation = useRef<PointAnnotation>(null)
  const onSubmit = () => {
    setSave(true)
  }

  return (
    <SafeArea bg="neutral" isForm>
      {!save ? (
        <View style={styles.container}>
          <HeaderActions title={TEXTS.textN} navigation={navigation} />
          <View style={styles.formInput}>
            <View style={styles.containerMap}>
              <MapboxGL.MapView
                style={styles.map}
                styleURL={MapboxGL.StyleURL.Satellite}
                requestDisallowInterceptTouchEvent={true}
                scaleBarEnabled={false}
                rotateEnabled={false}
                attributionEnabled={false}
                compassEnabled={false}
                logoEnabled={false}>
                <UserLocation
                  visible={false}
                  requestsAlwaysUse
                  onUpdate={newLocation => {
                    setLocation([
                      newLocation.coords.longitude,
                      newLocation.coords.latitude,
                    ])
                    setLocationUser([
                      newLocation.coords.longitude,
                      newLocation.coords.latitude,
                    ])
                  }}
                />
                <Camera zoomLevel={16} centerCoordinate={location} />
                <LocationPuck
                  topImage="topImage"
                  visible={true}
                  scale={[
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10,
                    1.0,
                    20,
                    4.0,
                  ]}
                  pulsing={{
                    isEnabled: true,
                    color: 'teal',
                    radius: 50.0,
                  }}
                />
                {location[0] !== 0 && (
                  <PointAnnotation
                    ref={pointAnnotation}
                    id="uniqueId"
                    draggable={true}
                    selected={true}
                    onSelected={() => {
                      setSteep(1)
                    }}
                    onDeselected={() => {
                      setSteep(0)
                    }}
                    onDragEnd={e => {
                      console.log('onDragEnd')
                      setLocationUser(e.geometry.coordinates)
                    }}
                    coordinate={location}
                    children={<></>}
                  />
                )}
              </MapboxGL.MapView>
            </View>
            {steep === 0 && (
              <Text style={styles.textSteep}>
                Si el pin rojo no esta en el punto exacto de tu entrada, tócalo
                por favor
              </Text>
            )}
            {steep === 1 && (
              <Text style={styles.textSteep}>
                Ahora mantén presionado el pin rojo y sin soltarlo arrástralo
                para colócalo en el lugar exacto tu entrada
              </Text>
            )}
          </View>
          <View style={STYLES_GLOBALS.formBtn}>
            <Btn
              title={LABELS.saveGps}
              theme={'agrayu'}
              onPress={() => onSubmit()}
            />
          </View>
        </View>
      ) : (
        <Loading
          msg={TEXTS.textO}
          onPress={() =>
            navigation.navigate('RegisterParcelFifthScreen', {
              firstPoint: locationUser,
              ...route.params,
            })
          }
        />
      )}
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingTop: MP_DF.medium,
  },
  formInput: {
    flex: 1,
  },
  containerMap: {
    borderRadius: BORDER_RADIUS_DF.large,
    width: DWH.width * 0.9,
    height: DWH.height * 0.5,
    overflow: 'hidden',
    marginTop: MP_DF.large,
  },
  map: {
    width: DWH.width * 0.9,
    height: DWH.height * 0.5,
    borderRadius: BORDER_RADIUS_DF.large,
  },
  textSteep: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    lineHeight: FONT_SIZES.large * 1.3,
    color: COLORS_DF.cacao,
    marginTop: MP_DF.large,
    textAlign: 'center',
  },
})
