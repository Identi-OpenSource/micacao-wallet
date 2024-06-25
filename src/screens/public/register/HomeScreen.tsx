/**
 * @component HomeScreen - Componente de entrada a la app
 * @description Componente de vista
 * Funciones:
 * En este componente se inicializa la sesión de la app
 * Se obtienen los tokens de acceso y las variables de la app
 * Se guardan en el almacenamiento local encriptados
 */
import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-toast-message'
import Logo from '../../../assets/svg/initMan.svg'
import {Btn} from '../../../components/button/Button'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {LABELS} from '../../../config/texts/labels'
import {TEXTS} from '../../../config/texts/texts'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import useInternetConnection from '../../../hooks/useInternetConnection'
import useFetchData, {
  HEADERS,
  HEADERS_FORM_DATA,
} from '../../../hooks/useFetchData'
import Config from 'react-native-config'
import {storage} from '../../../config/store/db'
import {STORAGE_KEYS} from '../../../config/const'

export const HomeScreen = () => {
  const {isConnected} = useInternetConnection()
  const {loading, fetchData} = useFetchData()
  const navigation = useNavigation()

  const submit = async () => {
    if (!isConnected) {
      Toast.show({
        type: 'msgToast',
        autoHide: false,
        text1:
          '¡Recuerda que necesitas estar conectado a internet para crear tu cuenta!',
      })
      return
    }
    await postTokens()
  }

  // Obtener token de acceso
  const postTokens = async () => {
    const url = Config.BASE_URL + '/token'
    const formData = new FormData()
    formData.append('username', Config.USERNAME)
    formData.append('password', Config.PASSWORD)
    const resp = await fetchData(url, {
      method: 'POST',
      headers: HEADERS_FORM_DATA,
      data: formData,
    })
    if (resp?.access_token) {
      storage.set(STORAGE_KEYS.accessToken, resp.access_token)
      postVariables()
    }
  }

  // Obtener las variables de la app
  const postVariables = async () => {
    const token = storage.getString('accessToken')
    const url = Config.BASE_URL + '/app_config'
    // @Braudin: Corregir esto
    // const resp = await fetchData(url, {
    //   method: 'GET',
    //   headers: HEADERS,
    // })
    if (true) {
      storage.set(STORAGE_KEYS.loadData, JSON.stringify(MUESTRA))
      navigation.navigate('IamScreen')
    }
  }

  return (
    <SafeArea bg={'isabelline'}>
      <Spinner color={COLORS_DF.robin_egg_blue} visible={loading} size={100} />
      <Logo width={390} height={390} style={styles.svg} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.textA]}>{TEXTS.textA}</Text>
          <Text style={[styles.textB]}>{TEXTS.textB}</Text>
        </View>
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.createAccount}
            theme="agrayu"
            onPress={() => submit()}
          />
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
  },
  img: {
    width: horizontalScale(306),
    height: verticalScale(306),
    alignSelf: 'center',
  },
  textContainer: {flex: 1},
  textA: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: moderateScale(32),
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS_DF.citrine_brown,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: '500',
    textAlign: 'center',
    color: COLORS_DF.citrine_brown,
  },
  formBtn: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
  svg: {
    alignSelf: 'center',
  },
})

const MUESTRA = {
  ks: {
    key_cifrado: 'llavesecretakafesistemasidenti12',
    api_key: 'fec9eecf43ac2f75f3f6f3edc70bcaf043729409fc2faeee8ce6821d5666c2e4',
    kafe_sistemas_key:
      'cFZmeGpSOUdWUUI0UXpYcWc2Y0swaFRMUXM4aDBDMkxPRVRrSnRWc0wwSldoMjR0WXBSZzk5dVNFUzdXYVRrdg',
    api: 'http://148.113.174.223:5001/api/v1/pe/land-request/polygon',
  },
  gfw: {
    api: 'https://geip5oadr5.execute-api.us-east-2.amazonaws.com',
    api_key: '',
  },
  blockchain: {
    funding:
      'http://v1.funding.coingateways.com/fund.php?PROJECT=occs&RADDRESS=',
  },
  settings: {
    write_allways: 'on',
    app_version: '1.0.1',
  },
}
