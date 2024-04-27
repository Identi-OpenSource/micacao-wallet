import {library} from '@fortawesome/fontawesome-svg-core'
import {faWhatsapp, fab} from '@fortawesome/free-brands-svg-icons'
import {
  faAngleLeft,
  faAngleRight,
  faArrowDown,
  faArrowLeft,
  faArrowLeftLong,
  faArrowRight,
  faArrowUp,
  faCircle,
  faCirclePause,
  faCirclePlay,
  faCircleQuestion,
  faCircleUser,
  faDeleteLeft,
  faExclamation,
  faFloppyDisk,
  faHand,
  faHandPointer,
  faHouse,
  faMinus,
  faPersonWalkingArrowLoopLeft,
  faPersonWalkingArrowRight,
  faPlus,
  faRotate,
  faTrash,
  faTree,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import {NavigationContainer} from '@react-navigation/native'
import React, {useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from 'react-native-toast-message'
import {Error, Sad} from './src/assets/svg/index'
import useInternetConnection from './src/hooks/useInternetConnection'
import useSyncData from './src/hooks/useSyncData'
import {Router} from './src/routers/Router'
import {AuthProvider} from './src/states/AuthContext'
import {ConnectionProvider} from './src/states/ConnectionContext'
import {UserProvider} from './src/states/UserContext'

import {COLORS_DF, FONT_FAMILIES} from './src/config/themes/default'
import {SyncDataProvider} from './src/states/SyncDataContext'

function App(): React.JSX.Element {
  // biblioteca de iconos
  const [visible, setVisible] = useState(false)
  library.add(
    fab,
    faArrowLeftLong,
    faArrowRight,
    faArrowLeft,
    faArrowUp,
    faArrowDown,
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
    faHandPointer,
    faTrash,
    faDeleteLeft,
    faCirclePlay,
    faCirclePause,
    faPersonWalkingArrowRight,
    faPersonWalkingArrowLoopLeft,
    faHand,
    faPlus,
    faMinus,
    faFloppyDisk,
  )

  const toastConfig: ToastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={{borderLeftColor: 'pink'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 15,
          fontWeight: '400',
        }}
      />
    ),
    error: props => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),

    sadToast: ({text1, onPress}) => (
      <View style={styles.toastContainer}>
        <View>
          <Sad height={70} width={70} />
        </View>
        <Text style={styles.toastText}>{text1}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.buttonToast}>
          <Text style={{color: '#fff', fontSize: 15}}>Ok</Text>
        </TouchableOpacity>
      </View>
    ),
    syncToast: ({text1, props, onPress}) => (
      <View style={styles.toastContainer}>
        <View>
          <Error height={70} width={70} />
        </View>
        <Text style={styles.toastText}>{text1}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.buttonToast}>
          <Text style={{color: '#fff', fontSize: 20}}>Ok</Text>
        </TouchableOpacity>
      </View>
    ),
  }
  const hideToast = () => {
    setVisible(false)
    Toast.hide()
  }
  const internetConnection = useInternetConnection()
  const syncData = useSyncData()

  return (
    <ConnectionProvider value={internetConnection}>
      <AuthProvider>
        <SyncDataProvider value={syncData}>
          <UserProvider>
            <NavigationContainer>
              <Router />
              <>
                <Toast config={toastConfig} />
              </>
            </NavigationContainer>
          </UserProvider>
        </SyncDataProvider>
      </AuthProvider>
    </ConnectionProvider>
  )
}
const styles = StyleSheet.create({
  toastContainer: {
    height: 200,
    width: '80%',
    backgroundColor: '#FFF',
    padding: 25,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  toastText: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    textAlign: 'center',
  },
  buttonToast: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS_DF.robin_egg_blue,
    width: '90%',
    height: 30,
    borderRadius: 5,
    marginTop: 5,
  },
})
export default App
