import geoViewport from '@mapbox/geo-viewport'
import Mapbox from '@rnmapbox/maps'
import React, {useContext, useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Config from 'react-native-config'
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
Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN || '')
const {width, height} = Dimensions.get('window')

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
    const minx = parseFloat(map.minx_point + 35)
    const maxx = parseFloat(map.maxx_point)
    const miny = parseFloat(map.miny_point)
    const maxy = parseFloat(map.maxy_point)

    const centerLng = (minx + maxx) / 2
    const centerLat = (miny + maxy) / 2

    // Calcular los límites del área del mapa
    const bounds: [number, number, number, number] = geoViewport.bounds(
      [centerLng, centerLat],

      17,
      [width, height],
      512,
    )

    const options = {
      name: 'MapTests',
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
          setStep({
            step: 3,
            msg: 'Descargando mapa ' + status.percentage + '%',
          })
          console.log('=> descargando mapa :', 'status: ', status)
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
