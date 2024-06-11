import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import React, {useCallback, useContext, useEffect, useState} from 'react'
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {writeTransaction, newWallet, fundingWallet} from '../../../OCC/occ'
import {imgFrame, imgLayer} from '../../../assets/imgs'
import {LoadingSave} from '../../../components/loading/LoadinSave'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {storage} from '../../../config/store/db'
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
import {useAuth} from '../../../states/AuthContext'
import {ConnectionContext} from '../../../states/ConnectionContext'
import {useKafeContext} from '../../../states/KafeContext'
import {useSyncData} from '../../../states/SyncDataContext'
import {UserInterface, UsersContext} from '../../../states/UserContext'
import Config from 'react-native-config'

export const HomeProvScreen = () => {
  const user: UserInterface = useContext(UsersContext)
  const internetConnection = useContext(ConnectionContext)
  const wallet = JSON.parse(storage.getString('wallet') || '{}')

  const {isConnected} = internetConnection
  const {toSyncData, dataToSync, loadingSync} = useSyncData()
  const {
    postKafeSistemas,
    getKafeSistemas,
    postKafeData,
    getKafeData,
    loadingKafe,
  } = useKafeContext()
  const {accessToken} = useAuth()
  const [syncUp, setSyncUp] = useState(false)
  const [loadinSync, setLoadingSync] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Evita que se ejecute el comportamiento predeterminado de Android
        return true // true para indicar que el evento de retroceso ha sido manejado
      }

      // Agrega un listener para el evento de retroceso de Android
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      )

      if (Object.keys(wallet).length > 0) {
        console.log('wallet', wallet.isFunding)
        if (wallet.isFunding) {
          write()
        } else {
          funding()
        }
      }

      // Limpia el listener cuando la pantalla pierde el enfoque
      return () => backHandler.remove()
    }, []),
  )

  useEffect(() => {
    if (isConnected) {
      if (dataToSync.parcels && !loadingSync) {
        toSyncData('createFarm')
      }
      if (dataToSync.sales) {
        toSyncData('createSale')
      }
    }
  }, [isConnected, dataToSync.parcels, dataToSync.sales])

  const getWallet = () => {
    // Create Wallet
    // const wallet = {
    //   isFunding: true,
    //   wallet: {
    //     walletOFC: 'R9vNe1TJLJta1srkqNo8WBrGN4JDJpTCDQ',
    //     wif: 'L2e3T9u1ph4nceszGLqpCmwZ8soZf19hnonUNfiFywwL2bNADxwC',
    //   },
    // }
    //Testing Wallet
    // const wallet = newWallet()
    // const isFunding = true
    // const walletObj = {wallet, isFunding}
    // console.log(walletObj)
    // setWa(walletObj.wallet)
  }

  const writeWallet = () => {
    write()
  }

  const write = async () => {
    const userData = JSON.parse(storage.getString('user') || '{}')
    const parcels_array = JSON.parse(storage.getString('parcels') || '[]')
    const sales = JSON.parse(storage.getString('sales') || '[]')
    const [TX, newSales] = await writeTransaction(wallet.wallet.wif, {
      userData,
      parcels_array,
      sales,
    })
    console.log(TX)
    storage.set('sales', JSON.stringify(newSales))
  }

  const funding = async () => {
    const funding = await fundingWallet(wallet.wallet.walletOFC).catch(() => ({
      status: 500,
    }))

    const isFunding = funding.status === 200

    const wallet_a = wallet.wallet

    storage.set('wallet', JSON.stringify({wallet: wallet_a, isFunding}))
  }

  // const createHash = async (dni: string) => {
  //   //console.log('DNI', dni)
  //   const date = new Date()
  //   const paddedDNI = dni.padStart(16, '0') + date
  //   const utf8Key = CryptoJS.enc.Utf8.parse(Config.KEY_CIFRADO_KAFE_SISTEMAS)
  //   const utf8DNI = CryptoJS.enc.Utf8.parse(paddedDNI)
  //   const encrypted = CryptoJS.AES.encrypt(utf8DNI, utf8Key, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7,
  //   })
  //   const hexResult = encrypted.ciphertext.toString(CryptoJS.enc.Hex)
  //   return {hash: hexResult.substr(0, 32), hashAll: hexResult}
  // }

  return (
    <SafeArea bg={'isabelline'}>
      <ScrollView>
        {!loadinSync ? (
          <View style={styles.container}>
            <ConnectionStatus isConnected={isConnected || false} />
            <Header {...user} />
            <Body
              syncUp={syncUp}
              accessToken={accessToken}
              getWallet={getWallet}
              writeWallet={writeWallet}
              isConnected={isConnected || false}
            />
          </View>
        ) : (
          <LoadingSave msg={TEXTS.textAF} />
        )}
      </ScrollView>
    </SafeArea>
  )
}

const ConnectionStatus = (props: {isConnected: boolean}) => {
  const isConnected = props.isConnected

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
  const firstName = name.split(' ')[0]

  return (
    <View style={styles.header}>
      <Text style={styles.titleHeader}>
        {TEXTS.textL} {firstName}
      </Text>

      <Text style={styles.textHeader}>{TEXTS.textK}</Text>
    </View>
  )
}

const Body = (props: {
  syncUp: boolean
  accessToken: string
  getWallet: any
  writeWallet: any
  isConnected: boolean
  Parcel: any
  polygon: any
  postGfw: any
  getGfw: any
}) => {
  const navigation = useNavigation()

  const syncUp = props.syncUp

  const accessToken = props.accessToken
  const getWallet = props.getWallet
  const writeWallet = props.writeWallet
  const isConnected = props.isConnected

  return (
    <View style={styles.bodyContainer}>
      {/* Primer card */}
      <View style={[styles.bodyCardContainerFull]}>
        <TouchableOpacity
          style={[styles.bodyCard]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('MyParcelsScreen')}>
          <Image source={imgLayer} style={syncUp && styles.filter} />
          <Text style={[styles.titleCard, syncUp && styles.filter]}>
            {LABELS.viewMyParcels}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.bodyCardContainerFull]}>
        <TouchableOpacity
          style={[styles.bodyCard]}
          activeOpacity={0.9}
          onPress={() => {
            navigation.navigate('NewSaleOneScreen')
          }}>
          <Image source={imgFrame} style={syncUp && styles.filter} />
          <Text style={[styles.titleCard, syncUp && styles.filter]}>
            {LABELS.registerVenta}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
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
