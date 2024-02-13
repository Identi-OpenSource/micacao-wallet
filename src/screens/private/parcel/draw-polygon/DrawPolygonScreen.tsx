import Mapbox, {MapView, StyleURL} from '@rnmapbox/maps'
import React from 'react'
import {StyleSheet, Text} from 'react-native'
import Config from 'react-native-config'

if (Config.MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)
}

export const DrawPolygonScreen = () => {
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
      <Text>DrawPolygonScreen</Text>
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
