/* eslint-disable @typescript-eslint/no-shadow */
import Config from 'react-native-config'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import React, {useCallback, useState} from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {imgFrame, imgLayer} from '../../../assets/imgs'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {LABELS} from '../../../config/texts/labels'
import {TEXTS} from '../../../config/texts/texts'
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
  getFontSize,
} from '../../../config/themes/default'
import {UserInterface} from '../../../states/UserContext'
import {storage} from '../../../config/store/db'
import useInternetConnection from '../../../hooks/useInternetConnection'
import {STORAGE_KEYS, SYNC_UP_TYPES} from '../../../config/const'
import useFetchData, {HEADERS} from '../../../hooks/useFetchData'
import {
  fundingWallet,
  getDataWallet,
  newWallet,
  writeTransaction,
} from '../../../OCC/occ'
import Spinner from 'react-native-loading-spinner-overlay'

export const HomeProvScreen = () => {
  const [loadDataAsync, setLoadDataAsync] = useState(false)
  const {isConnected} = useInternetConnection()
  const {loading, fetchData} = useFetchData()
  const user = JSON.parse(storage.getString(STORAGE_KEYS.user) || '{}')
  const wallet = JSON.parse(storage.getString(STORAGE_KEYS.wallet) || '{}')
  // storage.set(STORAGE_KEYS.writeBlockchain, JSON.stringify([]))
  // storage.set(STORAGE_KEYS.sales, JSON.stringify([]))
  useFocusEffect(
    useCallback(() => {
      // console.log('testWallet', newWallet())
      isConnected && init()
    }, [isConnected]),
  )

  const init = async () => {
    await loadData()
    await asyncData()
    await fundingW()
    await writeBlockchain()
  }

  const loadData = async () => {
    // revisar si hay actualización en las variables de env
    const data = JSON.parse(storage.getString(STORAGE_KEYS.loadData) || '{}')
    const urlConfig = Config?.BASE_URL || ''
    const configResp = await fetchData(urlConfig, {
      method: 'GET',
      headers: {
        'app-config-key': Config?.APP_CONFIG_KEY || '',
      },
    })
    if (configResp.isAxiosError || data.update === configResp?.last_update) {
      return
    }
    const url = `${Config?.BASE_URL}/app_config`
    const resp = await fetchData(url, {
      method: 'GET',
      headers: {
        'app-config-key': Config?.APP_CONFIG_KEY || '',
      },
    })
    if (!resp.isAxiosError) {
      storage.set(
        STORAGE_KEYS.loadData,
        JSON.stringify({...resp, update: configResp?.last_update}),
      )
    }
  }

  const fundingW = async () => {
    if (!isConnected) {
      return
    }
    const dataWallet = await getDataWallet(wallet?.wallet?.walletOFC)
    if (dataWallet?.data?.balance > 1000) {
      return
    }
    const funding = await fundingWallet(wallet?.wallet?.walletOFC)
    const isFunding = funding?.status === 200
    storage.set('wallet', JSON.stringify({...wallet, isFunding}))
  }

  const asyncData = async () => {
    if (!isConnected) {
      return
    }
    const indexAsync: number[] = []
    const syncUp = JSON.parse(storage.getString(STORAGE_KEYS.syncUp) || '[]')
    for (let index = 0; index < syncUp?.length; index++) {
      const element = syncUp[index]
      if (element.type === SYNC_UP_TYPES.user) {
        console.log('creando productor =>', element.data)
        // console.log('creando productor =>', 'Start')
        const url = `${Config?.BASE_URL}/create_producer`
        const data = {
          dni: element.data.dni,
          name: element.data.name,
          phone: element.data.phone,
          gender: element.data.gender === 'M' ? 'MALE' : 'FEMALE',
          countryid: element.data.country?.country_id,
        }
        const resp = await sendFetch(url, data)

        if (resp) {
          indexAsync.push(index)
        }
        // console.log('creando productor =>', resp)
      }
      if (element.type === SYNC_UP_TYPES.parcels) {
        // console.log('creando farm =>', 'Start')
        const url = `${Config?.BASE_URL}/create_farm`
        const data = {
          id: element?.data?.id,
          farm_name: element?.data?.name,
          hectares: element?.data?.hectares,
          polygon_coordinates: element?.data?.polygon?.toString(),
          dni_cacao_producer: user.dni,
          countryid: user.country?.country_id,
        }
        const resp = await sendFetch(url, data)
        if (resp) {
          const parcels = JSON.parse(
            storage.getString(STORAGE_KEYS.parcels) || '[]',
          )
          const parcelIndex = parcels.findIndex(
            (parcel: any) => parcel?.id === element?.data?.id,
          )
          if (parcelIndex !== -1) {
            parcels[parcelIndex] = {...parcels[parcelIndex], syncUp: true}
            storage.set(STORAGE_KEYS.parcels, JSON.stringify(parcels))
          }
          indexAsync.push(index)
        }
        // console.log('creando farm =>', resp)
      }
      if (element.type === SYNC_UP_TYPES.sales) {
        // console.log('creando venta =>', 'Start')
        const url = `${Config?.BASE_URL}/create_activities`
        const data = {
          dni_cacao_producer: user.dni,
          id_farm: element?.data?.parcela,
          id_activity_type: 4, // para ventas siempre es 4
          dry_weight: element?.data?.type === 'SECO' ? element?.data?.kl : 0,
          baba_weight: element?.data?.type === 'BABA' ? element?.data?.kl : 0,
          cacao_type: element?.data?.type?.toLowerCase(),
        }
        const resp = await sendFetch(url, data)
        if (resp) {
          const sales = JSON.parse(
            storage.getString(STORAGE_KEYS.sales) || '[]',
          )
          const saleIndex = sales.findIndex(
            (sale: any) => sale?.idSale === element?.data?.idSale,
          )
          if (saleIndex !== -1) {
            sales[saleIndex] = {...sales[saleIndex], syncUp: true}
            storage.set(STORAGE_KEYS.sales, JSON.stringify(sales))
          }

          const writeBlockchain = JSON.parse(
            storage.getString(STORAGE_KEYS.writeBlockchain) || '[]',
          )
          writeBlockchain.push(element)
          storage.set(
            STORAGE_KEYS.writeBlockchain,
            JSON.stringify(writeBlockchain),
          )
          indexAsync.push(index)
        }
        // console.log('creando venta =>', resp)
      }
    }

    const newSyncUp = syncUp?.filter((element: any, index: number) => {
      if (!indexAsync?.includes(index)) {
        return element
      }
    })
    storage.set(STORAGE_KEYS.syncUp, JSON.stringify(newSyncUp))
  }

  const writeBlockchain = async () => {
    const dataWrite = JSON.parse(
      storage.getString(STORAGE_KEYS.writeBlockchain) || '[]',
    )
    const wallet = JSON.parse(storage.getString(STORAGE_KEYS.wallet) || '{}')
    const user = JSON.parse(storage.getString(STORAGE_KEYS.user) || '{}')
    const parcels = JSON.parse(storage.getString(STORAGE_KEYS.parcels) || '[]')
    if (!dataWrite.length || !isConnected || !wallet.isFunding) {
      return
    }
    const write = await writeTransaction({
      wallet,
      dataWrite,
      user,
      parcels,
    })
    console.log('write', write)
  }

  const sendFetch = async (url: string, data: any) => {
    const resp = await fetchData(
      url,
      {method: 'POST', headers: HEADERS(), data},
      true,
    )
    // console.log('sendFetch', data)
    return resp?.response?.status ? false : true
  }

  // pruebas
  // const sales = JSON.parse(storage.getString(STORAGE_KEYS.sales) || '[]')
  // console.log('sales', sales)
  // console.log('user', user)
  // storage.delete(STORAGE_KEYS.parcels)
  // storage.delete(STORAGE_KEYS.sales)
  // storage.delete(STORAGE_KEYS.syncUp)

  return (
    <SafeArea bg={'isabelline'}>
      <ScrollView>
        <View style={styles.container}>
          <ConnectionStatus />
          <Header {...user} />
          <Body />
        </View>
      </ScrollView>
      <Spinner
        color={COLORS_DF.robin_egg_blue}
        visible={loadDataAsync}
        textContent="Sincronizando datos"
        textStyle={{color: COLORS_DF.citrine_brown}}
        overlayColor="rgba(255, 255, 255, 0.9)"
        size={100}
      />
    </SafeArea>
  )
}

const ConnectionStatus = () => {
  const {isConnected} = useInternetConnection()

  return (
    <View style={styles.containerConnection}>
      <View style={styles.containerConnectionTitle}>
        <FontAwesomeIcon
          icon={'circle'}
          size={14}
          color={!isConnected ? COLORS_DF.grayLight : COLORS_DF.robin_egg_blue}
        />
        <Text style={styles.connectionTitle}>
          {isConnected ? LABELS.online : LABELS.offline}
        </Text>
      </View>
    </View>
  )
}

const Header = ({name}: UserInterface) => {
  const firstName = name?.split(' ')[0]
  return (
    <View style={styles.header}>
      <Text style={styles.titleHeader}>
        {TEXTS.textL} {firstName}
      </Text>
      <Text style={styles.textHeader}>{TEXTS.textK}</Text>
    </View>
  )
}

const Body = () => {
  const parcels = JSON.parse(storage.getString(STORAGE_KEYS.parcels) || '[]')

  const navigation = useNavigation()

  // const syncUp = props.syncUp

  // const accessToken = props.accessToken
  // const getWallet = props.getWallet
  // const writeWallet = props.writeWallet
  // const isConnected = props.isConnected

  return (
    <View style={styles.bodyContainer}>
      <View style={[styles.bodyCardContainerFull]}>
        <TouchableOpacity
          style={[styles.bodyCard]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('MyParcelsScreen')}>
          <Image source={imgLayer} />
          <Text style={[styles.titleCard]}>{LABELS.viewMyParcels}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.bodyCardContainerFull]}>
        <TouchableOpacity
          style={[styles.bodyCard]}
          activeOpacity={0.9}
          disabled={parcels.length === 0}
          onPress={() => {
            navigation.navigate('NewSaleOneScreen')
          }}>
          <Image
            source={imgFrame}
            style={parcels.length === 0 && styles.filter}
          />
          <Text
            style={[styles.titleCard, parcels.length === 0 && styles.filter]}>
            {LABELS.registerVenta}
          </Text>
        </TouchableOpacity>

        {/*  <TouchableOpacity
          style={[styles.bodyCard]}
          activeOpacity={0.9}
          onPress={() => getWallet()}>
          <Text style={[styles.titleCard, syncUp && styles.filter]}>
            {'get Wallet'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bodyCard]}
          activeOpacity={0.9}
          onPress={() => writeWallet()}>
          <Text style={[styles.titleCard, syncUp && styles.filter]}>
            {'write Wallet'}
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  filter: {
    opacity: 0.3,
  },
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingVertical: MP_DF.medium,
  },
  containerConnection: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS_DF.citrine_brown,
    borderRadius: BORDER_RADIUS_DF.small,
    backgroundColor: COLORS_DF.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MP_DF.small,
  },
  containerConnectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionTitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
    marginLeft: MP_DF.small,
  },
  connectionSubTitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(14),
    fontWeight: 'normal',
    color: COLORS_DF.white,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: MP_DF.large,
  },
  titleHeader: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xslarge,
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
    marginBottom: MP_DF.small,
  },
  textHeader: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.small,
    color: COLORS_DF.citrine_brown,
  },
  bodyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: MP_DF.large,
  },
  bodyCardContainer: {
    width: '50%',
    padding: MP_DF.small,
    marginTop: MP_DF.large,
  },
  bodyCardContainerFull: {
    width: '100%',
    padding: MP_DF.small,
    marginTop: MP_DF.medium,
  },
  bodyCard: {
    maxHeight: 200,
    paddingHorizontal: MP_DF.small,
    paddingVertical: MP_DF.large,
    backgroundColor: COLORS_DF.white,
    borderRadius: BORDER_RADIUS_DF.medium,
    elevation: 3,
    alignItems: 'center',
  },
  titleCard: {
    paddingHorizontal: MP_DF.medium,
    marginTop: MP_DF.medium,
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
    textAlign: 'center',
  },
  buttonReload: {
    width: 135,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_DF.robin_egg_blue,
    borderRadius: 5,
    flexDirection: 'row',
  },
})
