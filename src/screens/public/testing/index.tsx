import geoViewport from '@mapbox/geo-viewport'
import Mapbox from '@rnmapbox/maps'
import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Config from 'react-native-config'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {TEXTS} from '../../../config/texts/texts'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import {useNavigation} from '@react-navigation/native'
import {useMapContext} from '../../../states/MapContext'
import {Camera, MapView, MarkerView, StyleURL} from '@rnmapbox/maps'
Mapbox.setAccessToken(
  'sk.eyJ1IjoiYWNob3JyZXMiLCJhIjoiY2x0aGNhenRtMDNlYzJpazl2eWF2emZ6ZCJ9.1AbQAkG2QBZyWRGSwgFe-g',
)
const {width, height} = Dimensions.get('window')

export const Test = () => {
  type Position = [number, number]
  const [step, setStep] = useState({step: 0, msg: TEXTS.textH})
  const [mapDownloaded, setMapDownloaded] = useState(false)
  const {map} = useMapContext()
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const navigation = useNavigation()
  const [mapCenter, setMapCenter] = useState<Position | null>(null)

  useEffect(() => {
    initial()
  }, [])

  useEffect(() => {
    console.log('aqui esta la data', map)
  }, [])

  // Inicializa el proceso de registro
  const initial = async () => {
    setStep({
      step: 2,
      msg: 'Descargando mapa...',
    })
    descargarMapaQuito()

    await delay(1000)
  }

  /*   const descargarMapa = async () => {
    const centerLng = (map.minx_point + map.maxx_point) / 2;
    const centerLat = (map.miny_point + map.maxy_point) / 2;
    console.log("minxpoint ", map.minx_point);
    console.log("maxxpoint ", map.maxx_point);
    console.log("miny_point ", map.miny_point);
    console.log("maxy_point ", map.maxy_point);

    const bounds: [number, number, number, number] = geoViewport.bounds(
      [centerLng, centerLat],
      17,
      [width, height],
      512
    );

    const options = {
      name: "JuanjuiMapTest",
      styleURL: Mapbox.StyleURL.Satellite,
      bounds: [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ] as [[number, number], [number, number]],
      minZoom: 10,
      maxZoom: 20,
      metadata: {
        whatIsThat: "foo",
      },
    };
    await Mapbox.offlineManager.createPack(options);
    setMapCenter([(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2]);
  }; */

  const descargarMapaQuito = async () => {
    // Parsear el JSON y asegurarse de que los valores sean números
    const minx = parseFloat(map.minx_point)
    const maxx = parseFloat(map.maxx_point)
    const miny = parseFloat(map.miny_point)
    const maxy = parseFloat(map.maxy_point)

    console.log('minxpoint ', minx)
    console.log('maxxpoint ', maxx)
    console.log('miny_point ', miny)
    console.log('maxy_point ', maxy)

    // Calcular el centro del área del mapa
    const centerLng = (minx + maxx) / 2
    const centerLat = (miny + maxy) / 2

    console.log('latitud', centerLat)
    console.log('longitud', centerLng)

    // Calcular los límites del área del mapa
    const bounds: [number, number, number, number] = geoViewport.bounds(
      [centerLng, centerLat],
      12,
      [width, height],
      512,
    )

    const options = {
      name: 'QuitoMapTest',
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

    // Verificar si el mapa de Quito ya está descargado
    const packs = await Mapbox.offlineManager.getPacks()
    const quitoPack = packs.find(pack => pack.name === 'QuitoMapTest')
    if (quitoPack) {
      setMapDownloaded(true)
    } else {
      await Mapbox.offlineManager.createPack(options)
      setMapDownloaded(true)
    }
  }

  return (
    <SafeArea bg={'isabelline'}>
      {mapDownloaded ? (
        <MapView
          style={{flex: 1}}
          styleURL={Mapbox.StyleURL.Satellite}
          zoomLevel={12}
          centerCoordinate={mapCenter ?? [-78.4678, -0.1807]}>
          {mapCenter && (
            <MarkerView coordinate={mapCenter}>
              <View style={styles.marker}>
                <Text style={styles.markerText}>Zona Descargada</Text>
              </View>
            </MarkerView>
          )}
        </MapView>
      ) : (
        <>
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
        </>
      )}
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
  marker: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
  },
})
