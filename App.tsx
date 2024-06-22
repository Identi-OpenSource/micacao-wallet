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
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Dimensions,
} from 'react-native'
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from 'react-native-toast-message'
import {
  Error,
  Sad,
  SadYellow,
  Happy,
  Whattsap,
  Edit_Map,
} from './src/assets/svg/index'
import useInternetConnection from './src/OCC/hooks/useInternetConnection'
import {Router} from './src/routers/Router'
import {AuthProvider} from './src/states/AuthContext'
import {ConnectionProvider} from './src/states/ConnectionContext'
import {UserProvider} from './src/states/UserContext'
import {MapProvider} from './src/states/MapContext'
import {KafeProvider} from './src/states/KafeContext'
import {COLORS_DF, FONT_FAMILIES} from './src/config/themes/default'
import {SyncDataProvider} from './src/states/SyncDataContext'
import {GwfProvider} from './src/states/GfwContext'
import {Image} from 'react-native-svg'

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

    dniToast: ({text1}) => (
      <View style={styles.toastContainer}>
        <View>
          <Error height={70} width={70} />
        </View>
        <Text style={styles.toastText}>{text1}</Text>
        <TouchableOpacity
          onPress={linkWhattsap}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS_DF.robin_egg_blue,
            width: '90%',
            height: 30,
            borderRadius: 5,
            marginTop: 20,
            flexDirection: 'row',
          }}>
          <Text style={{color: '#fff', fontSize: 15}}>Solicitar ayuda</Text>
          <View style={styles.buttonContainer}>
            <Whattsap />
          </View>
        </TouchableOpacity>
      </View>
    ),
    sadToast: ({text1}) => (
      <View style={styles.toastContainer}>
        <View>
          <Sad height={70} width={70} />
        </View>
        <Text style={styles.toastText}>{text1}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={hideToast} style={styles.buttonToast}>
            <Text style={{color: '#fff', fontSize: 15}}>Ok </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    syncToast: ({text1}) => (
      <View style={styles.toastContainer}>
        <View>
          <Error height={70} width={70} />
        </View>
        <Text style={styles.toastText}>{text1}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={hideToast} style={styles.buttonToast}>
            <Text style={{color: '#fff', fontSize: 20}}> Ok </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    actionToast: ({text1, props}) => (
      <View style={styles.toastContainer}>
        <View>
          <Error height={70} width={70} />
        </View>
        {props.title && (
          <Text style={styles.toastTextTitle}>{props.title}</Text>
        )}
        <Text style={styles.toastText}>{text1}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              hideToast()
              props?.onPress()
            }}
            style={styles.buttonToast}>
            <Text style={{color: '#fff', fontSize: 20}}> {props.btnText} </Text>
          </TouchableOpacity>
          {props?.exPress && (
            <TouchableOpacity
              onPress={() => {
                hideToast()
                props?.exPress()
              }}
              style={styles.buttonToast}>
              <Text style={{color: '#fff', fontSize: 20}}>
                {props.btnExPress}
              </Text>
            </TouchableOpacity>
          )}
          {!props.hideCancel && (
            <TouchableOpacity
              onPress={hideToast}
              style={[
                styles.buttonToast,
                {
                  marginTop: 20,
                  backgroundColor: COLORS_DF.warning,
                },
              ]}>
              <Text style={{color: '#fff', fontSize: 20}}> Cancelar </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    modalMapToast: ({text1, props}) => (
      <View style={styles.toastContainer}>
        <Edit_Map />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={hideToast} style={[styles.buttonToast]}>
            <Text style={{color: '#fff', fontSize: 20}}> Entendido </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    yellowToast: ({text1, text2}) => (
      <View
        style={{
          height: 180,
          width: '80%',
          backgroundColor: '#FFF',
          padding: 20,
          alignItems: 'center',
          borderRadius: 10,
          elevation: 5,
        }}>
        <View>
          <SadYellow height={70} width={70} />
        </View>
        <Text style={styles.toastTextGFW}>{text1}</Text>
        <Text style={styles.toastTextGFW}>{text2}</Text>
      </View>
    ),
    happyToast: ({text1, text2}) => (
      <View
        style={{
          height: 200,
          width: '80%',
          backgroundColor: '#FFF',
          padding: 20,
          alignItems: 'center',
          borderRadius: 10,
          elevation: 5,
        }}>
        <View>
          <Happy height={70} width={70} />
        </View>
        <Text style={styles.toastTextGFW}>{text1}</Text>
        <Text style={styles.toastTextGFW}>{text2}</Text>
      </View>
    ),
    redSadToast: ({text1, text2}) => (
      <View style={styles.toastContainer}>
        <View>
          <Sad height={70} width={70} />
        </View>
        <Text style={styles.toastTextGFW}>{text1}</Text>
        <Text style={styles.toastTextGFW}>{text2}</Text>
      </View>
    ),
  }

  const hideToast = () => {
    setVisible(false)
    Toast.hide()
  }

  const linkWhattsap = () => {
    Linking.openURL('whatsapp://send?phone=+5117064556').catch(() => {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.whatsapp',
      )
    })
  }
  const internetConnection = useInternetConnection()

  return (
    <ConnectionProvider value={internetConnection}>
      <AuthProvider>
        <SyncDataProvider>
          <UserProvider>
            <MapProvider>
              <GwfProvider>
                <KafeProvider>
                  <NavigationContainer>
                    <Router />
                    <Toast config={toastConfig} />
                  </NavigationContainer>
                </KafeProvider>
              </GwfProvider>
            </MapProvider>
          </UserProvider>
        </SyncDataProvider>
      </AuthProvider>
    </ConnectionProvider>
  )
}
const styles = StyleSheet.create({
  toastContainer: {
    width: Dimensions.get('window').width - 50,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 20,
    alignItems: 'center',
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    elevation: 5,
  },
  toastTextTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    textAlign: 'center',
    marginBottom: 10,
  },
  toastText: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    textAlign: 'center',
    lineHeight: 28,
  },
  toastTextGFW: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    textAlign: 'center',
    lineHeight: 28,
  },
  buttonToast: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS_DF.robin_egg_blue,
    height: 50,
    marginTop: 20,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 10,
  },
})
export default App
