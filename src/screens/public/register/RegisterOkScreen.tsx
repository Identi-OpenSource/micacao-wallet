import Config from 'react-native-config'
import Mapbox from '@rnmapbox/maps'
import React, {useContext, useEffect, useState} from 'react'
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native'
import {newWallet, fundingWallet} from '../../../OCC/occ'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {storage} from '../../../config/store/db'
import {TEXTS} from '../../../config/texts/texts'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import {UserDispatchContext} from '../../../states/UserContext'
import Toast from 'react-native-toast-message'
import {useNavigation} from '@react-navigation/native'
import {STORAGE_KEYS, SYNC_UP_TYPES} from '../../../config/const'
Mapbox.setAccessToken(Config?.MAPBOX_ACCESS_TOKEN || '')

export const RegisterOkScreen = () => {
  const [step, setStep] = useState({step: 0, msg: TEXTS.textH})
  const dispatch = useContext(UserDispatchContext)
  const user = JSON.parse(storage.getString('user') || '{}')
  const map = user?.district
  const navigation = useNavigation()
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    initial()
  }, [])

  const errorToas = (msg: string) => {
    Toast.show({
      type: 'msgToast',
      autoHide: false,
      text1: msg,
    })
    navigation.goBack()
  }
  const initial = async () => {
    setStep({step: 1, msg: 'Creando billetera'})
    const wallet = newWallet()
    if (wallet.walletOFC === null) {
      errorToas('¡Error al crear la billetera! Por favor, intente de nuevo.')
      return
    }
    await delay(1500)
    setStep({step: 2, msg: 'Agregando fondos'})
    const funding = await fundingWallet(wallet.walletOFC)
    const isFunding = funding.status === 200
    storage.set(STORAGE_KEYS.wallet, JSON.stringify({wallet, isFunding}))
    await delay(1000)
    setStep({step: 3, msg: 'Descargando mapa'})
    await descargarMapa()
    await delay(3000)
    storage.set(STORAGE_KEYS.user, JSON.stringify({...user, isLogin: true}))
    const syncUp = [{type: SYNC_UP_TYPES.user, data: user}]
    storage.set(STORAGE_KEYS.syncUp, JSON.stringify(syncUp))
    setStep({step: 4, msg: 'Inicio de sesión'})
    // Se deveria sincronizar la app con el servidor
    // addToSync(JSON.stringify({...user, isLogin: true, syncUp: true}), 'user')
    await delay(1500)
    const login = JSON.parse(storage.getString('user') || '{}')
    dispatch({type: 'login', payload: login})
  }

  const descargarMapa = async () => {
    const minx_point = parseFloat(map.minx_point.replace(/,/g, '.'))
    const maxx_point = parseFloat(map.maxx_point.replace(/,/g, '.'))
    const miny_point = parseFloat(map.miny_point.replace(/,/g, '.'))
    const maxy_point = parseFloat(map.maxy_point.replace(/,/g, '.'))
    const options = {
      name: 'MapTests',
      styleURL: Mapbox.StyleURL.Satellite,
      bounds: [
        [minx_point, miny_point],
        [maxx_point, maxy_point],
      ] as [[number, number], [number, number]],
      minZoom: 10,
      maxZoom: 24,
    }
    // console.log('map', map)
    // console.log('options', options)
    // console.log('options', options)
    await Mapbox.offlineManager
      .createPack(
        options,
        (region, status) => {
          setStep({
            step: 3,
            msg: 'Descargando mapa ' + status.percentage + '%',
          })
        },
        error => {
          console.log('Error al crear el pack:', error)
        },
      )
      .catch(() => {
        console.log('Error al descargar el mapa')
      })
  }

  return (
    <SafeArea bg={'isabelline'}>
      <ActivityIndicator
        size={moderateScale(86)}
        color={COLORS_DF.citrine_brown}
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
})
