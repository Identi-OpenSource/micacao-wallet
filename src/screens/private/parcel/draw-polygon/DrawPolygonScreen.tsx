import Mapbox, {
  Camera,
  MapView,
  StyleURL,
  UserTrackingMode,
} from '@rnmapbox/maps'
import React, {useEffect} from 'react'
import {StyleSheet} from 'react-native'
import Config from 'react-native-config'
import {storage} from '../../../../config/store/db'

if (Config.MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)
}

export const DrawPolygonScreen = () => {
  const parcel = JSON.parse(storage.getString('parcels') || '[]')
  const firstPoint = [parcel[0].firstPoint[1], parcel[0].firstPoint[0]]

  useEffect(() => {
    Mapbox.setTelemetryEnabled(false)
  }, [])

  console.log('parcel', firstPoint)
  return (
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
          centerCoordinate: firstPoint,
          zoomLevel: 18,
        }}
        followUserLocation={false}
        followUserMode={UserTrackingMode.Follow}
        followZoomLevel={18}
      />
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
