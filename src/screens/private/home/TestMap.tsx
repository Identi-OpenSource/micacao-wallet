import React, {useEffect, useState} from 'react'
import {Dimensions, StyleSheet, View} from 'react-native'
import {storage} from '../../../config/store/db'
import Mapbox, {
  Camera,
  MapView,
  PointAnnotation,
  StyleURL,
  UserTrackingMode,
} from '@rnmapbox/maps'
import Config from 'react-native-config'

Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)

export const TestMap = () => {
  const [first, setFirst] = useState<any>([])
  const [second, setSecond] = useState<any>([])
  useEffect(() => {
    const parcels = JSON.parse(storage.getString('parcels') || '[]')
    const parcel = parcels[0]
    if (parcel) {
      setFirst([parcel?.firstPoint[1], parcel?.firstPoint[0]])
      setSecond([parcel?.secondPoint[1], parcel?.secondPoint[0]])
    }
  }, [])

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {first.length > 0 && second.length > 0 && (
          <MapView
            requestDisallowInterceptTouchEvent={true}
            styleURL={StyleURL.Satellite}
            scaleBarEnabled={false}
            rotateEnabled={false}
            attributionEnabled={false}
            compassEnabled={false}
            logoEnabled={false}
            style={styles.map}>
            <Camera
              defaultSettings={{
                centerCoordinate: first,
                zoomLevel: 18,
              }}
              followUserLocation={false}
              followUserMode={UserTrackingMode.Follow}
              followZoomLevel={18}
            />
            <PointAnnotation
              key="pointAnnotation1"
              id="pointAnnotation1"
              coordinate={first}>
              <View style={styles.pinR} />
            </PointAnnotation>
            <PointAnnotation
              key="pointAnnotation2"
              id="pointAnnotation2"
              coordinate={second}>
              <View style={styles.pinA} />
            </PointAnnotation>
          </MapView>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  map: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  pinR: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
    borderRadius: 20 / 2,
  },
  pinA: {
    height: 20,
    width: 20,
    backgroundColor: 'blue',
    borderRadius: 20 / 2,
  },
})
