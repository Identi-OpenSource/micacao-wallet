import {Camera, MapView, PointAnnotation, StyleURL} from '@rnmapbox/maps'
import React, {useContext, useEffect, useState} from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import {UsersContext} from '../../../states/UserContext'
import Geolocation from '@react-native-community/geolocation'

// export const TestMap = () => {
//   const user = useContext(UsersContext)
//   const [first, setFirst] = useState([])
//   const [second, setSecond] = useState([])
//   useEffect(() => {
//     if (user.parcel) {
//       setFirst([user.parcel[0].firstPoint[1], user.parcel[0].firstPoint[0]])
//       setSecond([user.parcel[0].secondPoint[1], user.parcel[0].secondPoint[0]])
//     }
//   }, [user])
//   console.log('first', first)

//   return (
//     <View style={styles.page}>
//       <View style={styles.container}>
//         <MapView
//           requestDisallowInterceptTouchEvent={true}
//           styleURL={StyleURL.Satellite}
//           scaleBarEnabled={false}
//           rotateEnabled={false}
//           attributionEnabled={false}
//           compassEnabled={false}
//           logoEnabled={false}
//           style={styles.map}>
//           <Camera zoomLevel={18.5} centerCoordinate={first} />
//           <PointAnnotation
//             key="pointAnnotation1"
//             id="pointAnnotation1"
//             coordinate={first}>
//             <View style={styles.pinR} />
//           </PointAnnotation>
//           <PointAnnotation
//             key="pointAnnotation2"
//             id="pointAnnotation2"
//             coordinate={second}>
//             <View style={styles.pinA} />
//           </PointAnnotation>
//         </MapView>
//       </View>
//     </View>
//   )
// }

export const TestMap = () => {
  const [first, setfirst] = useState<any>('')
  const [second, setsecond] = useState<any>('')

  useEffect(() => {
    const _watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords
        setfirst(`${latitude}, ${longitude}`)
        setsecond(first)
      },
      error => {
        console.log(error)
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 3,
      },
    )

    return () => {
      if (_watchId) {
        Geolocation.clearWatch(_watchId)
      }
    }
  }, [])

  /* Mostrar first y second en la vista */
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.text}>{`Actual:\n${first}`}</Text>
        <Text />
        <Text style={styles.text}>-----------------</Text>
        <Text />
        <Text style={styles.text}>{`Antiguo:\n${second}`}</Text>
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
