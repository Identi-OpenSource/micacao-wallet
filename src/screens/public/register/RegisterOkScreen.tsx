import React, {useContext, useEffect, useRef, useState} from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {Btn} from '../../../components/button/Button'
import {TEXTS} from '../../../config/texts/texts'
import {LABELS} from '../../../config/texts/labels'
import {imgCheque} from '../../../assets/imgs'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import {storage} from '../../../config/store/db'
import {UserDispatchContext} from '../../../states/UserContext'
import geoViewport from '@mapbox/geo-viewport'
import {fundingWallet, newWallet} from '../../../OCC/occ'
import CryptoJS from 'crypto-js'
import Config from 'react-native-config'
import Mapbox from '@rnmapbox/maps'
Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)
const {width, height} = Dimensions.get('window')

export const RegisterOkScreen = () => {
  const [step, setStep] = useState({step: 0, msg: TEXTS.textH})
  const dispatch = useContext(UserDispatchContext)
  const user = JSON.parse(storage.getString('user') || '{}')
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    initial()
  }, [])

  // Inicializa el proceso de registro
  const initial = async () => {
    await delay(1000)
    setStep({step: 1, msg: 'Encriptando datos...'})
    const dni = await certificateND(user.dni)
    await delay(1000)
    setStep({step: 2, msg: 'Guardando datos...'})
    storage.set('user', JSON.stringify({...user, ...dni, isLogin: true}))
    await delay(1000)
    setStep({step: 3, msg: 'Creando wallet...'})
    const wallet = newWallet()
    await delay(1500)
    setStep({step: 4, msg: 'Agregando fondos...'})
    const funding = await fundingWallet(wallet.walletOFC).catch(() => ({
      status: 500,
    }))
    const isFunding = funding.status === 200
    storage.set('wallet', JSON.stringify({wallet, isFunding}))
    await delay(2000)
    setStep({step: 5, msg: 'Descargando mapa...'})
    descargarMapaTarapoto()
    await delay(1000)
    setStep({step: 6, msg: 'Inicio de sesión...'})
    await delay(1500)
    const login = JSON.parse(storage.getString('user') || '{}')
    dispatch({type: 'login', payload: login})
  }

  // Encripta el DNI
  const certificateND = async (dni: string) => {
    const paddedDNI = dni.padStart(16, '0')
    const utf8Key = CryptoJS.enc.Utf8.parse(Config.KEY_CIFRADO_KAFE_SISTEMAS)
    const utf8DNI = CryptoJS.enc.Utf8.parse(paddedDNI)
    const encrypted = CryptoJS.AES.encrypt(utf8DNI, utf8Key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    const hexResult = encrypted.ciphertext.toString(CryptoJS.enc.Hex)
    return {dni: hexResult.substr(0, 32), dniAll: hexResult}
  }

  // Descargar Mapa offline
  const descargarMapaTarapoto = async () => {
    const bounds: [number, number, number, number] = geoViewport.bounds(
      [-78.5442722, -0.1861084],
      17,
      [width, height],
      512,
    )

    const options = {
      name: 'TarapotoMapTest',
      styleURL: Mapbox.StyleURL.Satellite,
      bounds: [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ] as [[number, number], [number, number]],
      minZoom: 10,
      maxZoom: 20,
      metadata: {
        whatIsThat: 'foo',
      },
    }
    await Mapbox.offlineManager
      .createPack(
        options,
        (region, status) => {
          console.log('=> progress callback region:', 'status: ', status)
        },
        error => {
          console.log('=> error callback error:', error)
        },
      )
      .catch(() => {
        console.log('=> Mapa descargado')
      })
  }

  return (
    <SafeArea bg={'neutral'}>
      <ActivityIndicator
        size={moderateScale(86)}
        color={COLORS_DF.cacao}
        style={styles.indicador}
      />
      <View style={[styles.container]}>
        <View style={styles.textContainer}>
          <Text style={[styles.textA]}>{TEXTS.textG}</Text>
          <Text style={[styles.textB]}>{step.msg}</Text>
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
  indicador: {
    marginTop: verticalScale(MP_DF.xxlarge * 2),
    marginBottom: verticalScale(MP_DF.large),
  },
  img: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  textContainer: {flex: 1},
  textA: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(32),
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS_DF.cacao,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: '500',
    textAlign: 'center',
    color: COLORS_DF.cacao,
  },
  formBtn: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
})
