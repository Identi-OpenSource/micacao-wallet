import React, {useState} from 'react'
import {
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import HeaderComponent from '../../../components/Header'
import {Btn} from '../../../components/button/Button'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../config/themes/default'
import {useNavigation} from '@react-navigation/native'
import Config from 'react-native-config'
import Mapbox, {Camera, MapView, StyleURL} from '@rnmapbox/maps'
import {storage} from '../../../config/store/db'
import useFetchData, {HEADERS} from '../../../hooks/useFetchData'
import Toast from 'react-native-toast-message'
import {STORAGE_KEYS} from '../../../config/const'
import Spinner from 'react-native-loading-spinner-overlay'
export const HelpScreen = () => {
  const [mapVisible, setMapVisible] = useState(false)
  const [loadDataMap, setLoadDataMap] = useState(false)
  const user = JSON.parse(storage.getString('user') || '{}')
  const centerDistrict = user?.district?.center_point?.split(' ')
  const centerCoordinate = centerDistrict?.map((center: any) => Number(center))
  const navigation = useNavigation()
  const {loading, fetchData} = useFetchData()
  const onPress = () => {
    Linking.openURL('whatsapp://send?phone=+5117064556').catch(() => {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.whatsapp',
      )
    })
  }
  const asyncMap = async () => {
    setLoadDataMap(true)
    await handlePackError()
    const district = user?.district?.dist_id
    const url = `${Config?.BASE_URL}/coordinates/${district}`
    const resp = await fetchData(url, {
      method: 'GET',
      headers: HEADERS(),
    })
    if (!resp?.center_point) {
      setLoadDataMap(false)
      Toast.show({
        type: 'msgToast',
        text1: 'Error en la sincronización, por favor intente mas tarde',
        autoHide: false,
      })
      return
    }
    storage.set(
      STORAGE_KEYS.user,
      JSON.stringify({...user, district: {...district, ...resp}}),
    )
    setTimeout(() => {
      setLoadDataMap(false)
      Toast.show({
        type: 'msgToast',
        text1: 'Datos sincronizados con éxito',
        autoHide: false,
      })
    }, 2000)
  }

  const handlePackError = async () => {
    try {
      // Eliminar todos los packs
      const packs = await Mapbox.offlineManager.getPacks()
      for (let index = 0; index < packs.length; index++) {
        const pack = packs[index]
        await Mapbox.offlineManager.deletePack(pack.name)
      }
    } catch (error) {
      console.log('Error al eliminar packs:', error)
    }
  }

  return (
    <View style={styles.container}>
      <HeaderComponent
        label="Ayuda"
        goBack={true}
        goBackNavigation={() => navigation.navigate('HomeProvScreen')}
        backgroundColor="#8F3B06"
        textColor="white"
      />
      <View style={{paddingHorizontal: 24, paddingVertical: 25}}>
        <Btn
          title={'Conversa con un asesor'}
          theme="agrayu"
          icon={'fa-brands fa-whatsapp'}
          onPress={onPress}
          style={{container: {marginVertical: MP_DF.small}}}
        />
        <View style={styles.separator} />
        <Btn
          title={'Sincronizar mapa'}
          theme="agrayu"
          icon={'fa-solid fa-map-location'}
          onPress={() => asyncMap()}
          style={{container: {marginVertical: MP_DF.small}}}
        />
        <View style={styles.separator} />
        <Btn
          title={'Ver mapa'}
          theme="agrayu"
          icon={'fa-solid fa-map'}
          onPress={() => setMapVisible(true)}
          style={{container: {marginVertical: MP_DF.small}}}
        />
        <ScrollView
          style={{flex: 1, minHeight: Dimensions.get('window').height / 2}}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.separator} />
          {/* <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text> */}
          <View style={styles.separatorEnd} />
        </ScrollView>
        <Text style={styles.version}>MiCacao v{Config.VERSION_NAME}</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={mapVisible}
        onRequestClose={() => setMapVisible(false)}>
        <View style={styles.modal}>
          <View style={styles.containerTop}>
            <Text style={styles.titles}>{user?.district?.dist_name}</Text>
          </View>
          <MapView
            // key={coordinates.length}
            styleURL={StyleURL.Satellite}
            scaleBarEnabled={false}
            rotateEnabled={false}
            attributionEnabled={false}
            compassEnabled={false}
            logoEnabled={false}
            style={styles.map}>
            <Camera
              minZoomLevel={14}
              maxZoomLevel={18}
              centerCoordinate={centerCoordinate}
              zoomLevel={17}
              // animationDuration={700}
              animationMode={'easeTo'}
            />
          </MapView>
          <View style={styles.btnBottom}>
            <Btn
              title={'Cerrar'}
              theme="agrayu"
              onPress={() => setMapVisible(false)}
            />
          </View>
        </View>
      </Modal>
      <Spinner
        color={COLORS_DF.robin_egg_blue}
        visible={loadDataMap}
        textContent={'Sincronizando datos'}
        textStyle={{color: COLORS_DF.citrine_brown}}
        overlayColor="rgba(255, 255, 255, 0.9)"
        size={100}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  containerTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingHorizontal: MP_DF.large,
    marginTop: MP_DF.large,
    justifyContent: 'flex-start',
    zIndex: 99999,
  },
  titles: {
    fontSize: FONT_SIZES.large,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: 'bold',
    color: COLORS_DF.white,
    textAlign: 'center',
    marginBottom: MP_DF.medium,
  },
  btnBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: MP_DF.large,
    marginBottom: MP_DF.large,
    justifyContent: 'flex-end',
    zIndex: 99999,
  },
  map: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  modal: {
    backgroundColor: COLORS_DF.isabelline,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 20,
  },
  separatorEnd: {
    height: 300,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS_DF.isabelline,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS_DF.gray,
    marginTop: MP_DF.medium,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
  },
  cardContainer: {
    marginTop: MP_DF.large,
  },
  cardContenedor: {
    height: 100,
    backgroundColor: COLORS_DF.white,
    padding: MP_DF.medium,
    borderRadius: 10,
    elevation: 3,
    marginBottom: MP_DF.medium,
  },
  titleCard: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
  },
  actionsCard: {
    paddingVertical: MP_DF.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
  version: {
    fontSize: 10,
    color: COLORS_DF.citrine_brown,
    textAlign: 'center',
    marginTop: MP_DF.medium,
  },
})
