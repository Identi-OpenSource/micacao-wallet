import React, {useContext, useRef, useState} from 'react'
import {
  HeaderActions,
  SafeArea,
} from '../../../../components/safe-area/SafeArea'
import {StyleSheet, View} from 'react-native'
import {BORDER_RADIUS_DF, DWH, MP_DF} from '../../../../config/themes/default'
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
import {storage} from '../../../../config/store/db'
import {UserDispatchContext} from '../../../../states/UserContext'

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN || '')
// MapboxGL.setConnected(false)

export const RegisterParcelSixthScreen = ({
  navigation,
  route,
}: ScreenProps<'RegisterParcelSixthScreen'>) => {
  const [location, setLocation] = useState([0, 0])
  const dispatch = useContext(UserDispatchContext)
  const [save, setSave] = useState(false)
  const pointAnnotation = useRef<PointAnnotation>(null)
  const onSubmit = () => {
    const data = storage.getString('user')
    const user = JSON.parse(data || '{}')
    const userLogin = {
      ...user,
      parcel: [{...route.params, secondPoint: location}],
    }

    storage.set('user', JSON.stringify(userLogin))

    if (userLogin) {
      dispatch({type: 'login', payload: userLogin})
    }

    setSave(true)
  }

  return (
    <SafeArea bg="neutral" isForm>
      {!save ? (
        <View style={styles.container}>
          <HeaderActions title={TEXTS.textP} navigation={navigation} />
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
                    draggable={false}
                    selected={false}
                    onSelected={() => {
                      console.log('onSelected')
                    }}
                    onDeselected={() => {
                      console.log('onDeselected')
                    }}
                    onDrag={() => {
                      console.log('onDrag')
                    }}
                    onDragEnd={() => {
                      console.log('onDragEnd')
                    }}
                    onDragStart={() => {
                      console.log('onDragStart')
                    }}
                    coordinate={location}
                    children={<></>}
                  />
                )}
              </MapboxGL.MapView>
            </View>
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
          onPress={() => navigation.navigate('TabPrivate')}
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
})
