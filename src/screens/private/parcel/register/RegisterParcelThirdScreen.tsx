import React, {useContext, useState} from 'react'
import {
  HeaderActions,
  SafeArea,
} from '../../../../components/safe-area/SafeArea'
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native'
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
import {LABELS} from '../../../../config/texts/labels'
import {Btn} from '../../../../components/button/Button'
import {STYLES_GLOBALS} from '../../../../config/themes/stylesGlobals'
import {imgEntrada, imgEntradaF} from '../../../../assets/imgs'
import {
  CameraType,
  MediaType,
  PhotoQuality,
  launchCamera,
} from 'react-native-image-picker'

import Geolocation from 'react-native-geolocation-service'
import {MSG_ERROR} from '../../../../config/texts/erros'
import {storage} from '../../../../config/store/db'
import {UserInterface, UsersContext} from '../../../../states/UserContext'

export const RegisterParcelThirdScreen = ({
  navigation,
}: ScreenProps<'RegisterParcelThirdScreen'>) => {
  const user: UserInterface = useContext(UsersContext)
  const [gps, setGps] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [imgP1, setImgP1] = useState('')

  // capture photo
  const photo = async () => {
    // capture photo
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.5 as PhotoQuality,
      cameraType: 'back' as CameraType,
      includeBase64: true,
      saveToPhotos: false,
    }
    const result = await launchCamera(options)
    if (result.didCancel) {
      return
    }
    if (result.errorMessage) {
      Alert.alert(LABELS.error, result.errorMessage)
      return
    }
    result.assets && getGps(result.assets[0])
  }

  // capture GPS
  const getGps = (img: any) => {
    setLoading(true)
    Geolocation.getCurrentPosition(
      position => {
        setTimeout(() => {
          setImgP1(img.base64)
          setGps(position)
          setLoading(false)
        }, 1500)
      },
      error => {
        console.log(error)
        errorAlert()
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      },
    )
  }

  const errorAlert = () => {
    Alert.alert(LABELS.error, MSG_ERROR.notGps, [
      {
        text: LABELS.cancel,

        onPress: () => console.log('Cancel Pressed'),
      },
      {},
      {
        text: LABELS.capturePhoto,
        onPress: () => {
          photo()
        },
      },
    ])
  }

  const onSubmit = () => {
    if (gps?.coords) {
      const firstPoint = [gps?.coords?.latitude, gps?.coords.longitude]
      const parcelTemp = JSON.parse(storage.getString('parcelTemp') || '{}')
      storage.set(
        'parcelTemp',
        JSON.stringify({...parcelTemp, firstPoint, imgP1}),
      )
      navigation.navigate('RegisterParcelFourthScreen')
    }
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <HeaderActions title={TEXTS.textE} navigation={navigation} />
        <View style={styles.formContainer}>
          <View style={styles.formInput}>
            {!loading ? (
              <ImageBackground
                source={user.gender === 'Mujer' ? imgEntradaF : imgEntrada}
                style={styles.containerImg}
              />
            ) : (
              <View style={styles.containerImg}>
                <ActivityIndicator size={100} color={COLORS_DF.cacao} />
              </View>
            )}

            {!loading && gps === null && (
              <Text style={styles.textUnique}>
                Camina a la <Text style={styles.textUniqueUPPER}>ENTRADA</Text>{' '}
                de tu parcela y toma una foto.
              </Text>
            )}
            {loading && gps === null && (
              <Text style={styles.textUnique}>Guardando foto</Text>
            )}
            {!loading && gps !== null && (
              <Text style={styles.textUnique}>Foto guardada con éxito</Text>
            )}
          </View>
          <View style={STYLES_GLOBALS.formBtn}>
            {
              <Btn
                title={gps === null ? LABELS?.capturePhoto : LABELS.next}
                theme={!loading ? 'agrayu' : 'agrayuDisabled'}
                disabled={loading}
                onPress={gps === null ? photo : onSubmit}
              />
            }
          </View>
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingTop: MP_DF.medium,
  },
  formContainer: {
    flex: 1,
  },
  formInput: {
    flex: 1,
    alignItems: 'center',
    paddingTop: MP_DF.large,
  },
  containerImg: {
    width: DWH.width * 0.8,
    height: DWH.height * 0.4,
    borderRadius: BORDER_RADIUS_DF.large,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  textUnique: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xslarge,
    fontWeight: 'bold',
    lineHeight: FONT_SIZES.xslarge * 1.5,
    color: COLORS_DF.cacao,
    marginTop: MP_DF.xxlarge,
  },
  textUniqueUPPER: {
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
    fontSize: FONT_SIZES.xslarge * 1.2,
  },
})
