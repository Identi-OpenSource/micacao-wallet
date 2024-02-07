/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : Main component of the application
 **/
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {Router} from './src/routers/Router'
import {library} from '@fortawesome/fontawesome-svg-core'

import {
  faAngleLeft,
  faAngleRight,
  faArrowLeftLong,
  faArrowRight,
  faCircle,
  faCircleQuestion,
  faCircleUser,
  faExclamation,
  faHouse,
  faRotate,
  faTree,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import {UserProvider} from './src/states/UserContext'
import {faWhatsapp, fab} from '@fortawesome/free-brands-svg-icons'
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'

function App(): React.JSX.Element {
  // biblioteca de iconos
  library.add(
    fab,
    faArrowLeftLong,
    faTree,
    faAngleLeft,
    faAngleRight,
    faCircle,
    faRotate,
    faUser,
    faCircleUser,
    faHouse,
    faArrowRight,
    faCircleQuestion,
    faWhatsapp,
    faExclamation,
    faExclamationTriangle,
  )

  // useEffect(() => {
  //   getPermission()
  // }, [])

  // const getPermission = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         PermissionsAndroid.PERMISSIONS.CAMERA,
  //       ])
  //     }
  //   } catch (err) {
  //     console.warn(err)
  //   }
  // }

  return (
    <UserProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </UserProvider>
  )
}

export default App
