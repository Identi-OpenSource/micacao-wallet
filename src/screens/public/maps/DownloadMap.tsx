import React, {useContext, useEffect} from 'react'
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native'
import {Loading} from '../../../components/loading/Loading'
import {COLORS_DF} from '../../../config/themes/default'
import {storage} from '../../../config/store/db'
import Mapbox, {offlineManager} from '@rnmapbox/maps'
import {UserDispatchContext} from '../../../states/UserContext'
import Toast from 'react-native-toast-message'
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake'

export const DownloadMap = ({navigation, route}: any) => {
  const params = route.params
  const dispatch = useContext(UserDispatchContext)
  const [loading, setLoading] = React.useState('Descargando mapa 0%')
  const user = JSON.parse(storage.getString('user') || '{}')
  const district = user?.district?.dist_name

  useEffect(() => {
    activateKeepAwake()
    init()
    return () => {
      deactivateKeepAwake()
    }
  }, [])

  const init = async () => {
    await handlePackError()
    await downloadMap()
    Toast.show({
      type: 'msgToast',
      text1: '¡El mapa se ha descargado correctamente!',
      autoHide: false,
    })
    if (params?.toGo) {
      navigation.goBack()
      navigation.navigate(params?.toGo)
    } else {
      dispatch({type: 'login', payload: user})
    }
  }

  const downloadMap = async () => {
    const map = user?.district
    const maxRetries = 3
    let attempt = 0
    while (attempt < maxRetries) {
      console.log('descargando mapa: ', attempt)
      attempt++
      try {
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
        await handlePackError()
        return new Promise<boolean>((resolve, reject) => {
          Mapbox.offlineManager
            .createPack(
              options,
              (region, status) => {
                const percentage = status.percentage.toFixed(2)
                setLoading('Descargando mapa ' + percentage + '%')
                if (status.percentage === 100) {
                  setTimeout(() => {
                    resolve(true)
                  }, 2000)
                }
              },
              error => {
                console.log('Error al crear el pack:', error)
                if (attempt >= maxRetries) {
                  resolve(false)
                }
              },
            )
            .catch(error => {
              console.log('Error al descargar el mapa:', error)
              if (attempt >= maxRetries) {
                handlePackError()
                resolve(false)
              }
            })
        })
      } catch (error) {
        console.log('Error en la función descargarMapa:', error)
        if (attempt >= maxRetries) {
          handlePackError()
          return false
        }
      }
    }
    return false
  }

  const handlePackError = async () => {
    try {
      await offlineManager.resetDatabase()
      await offlineManager.deletePack('MapTests')
    } catch (error) {
      console.log('Error al eliminar packs:', error)
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={100} color={COLORS_DF.citrine_brown} />
      <Text style={styles.text}>{`${loading}\n\n${district}`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: COLORS_DF.citrine_brown,
    textAlign: 'center',
    marginTop: 10,
  },
})
