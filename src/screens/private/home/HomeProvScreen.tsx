import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {useNavigation} from '@react-navigation/native'
import React from 'react'
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
import {STORAGE_KEYS} from '../../../config/const'

export const HomeProvScreen = () => {
  const user = JSON.parse(storage.getString(STORAGE_KEYS.user) || '{}')
  // pruebas
  // storage.delete(STORAGE_KEYS.parcels)
  return (
    <SafeArea bg={'isabelline'}>
      <ScrollView>
        <View style={styles.container}>
          <ConnectionStatus />
          <Header {...user} />
          <Body />
        </View>
      </ScrollView>
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

// export const HomeProvScreen = () => {
//   const user: UserInterface = useContext(UsersContext)
//   const internetConnection = useContext(ConnectionContext)
//   const wallet = JSON.parse(storage.getString('wallet') || '{}')

//   const {isConnected} = internetConnection
//   const {toSyncData, dataToSync, loadingSync} = useSyncData()
//   const {
//     postKafeSistemas,
//     getKafeSistemas,
//     postKafeData,
//     getKafeData,
//     loadingKafe,
//   } = useKafeContext()
//   const {accessToken} = useAuth()
//   const [syncUp, setSyncUp] = useState(false)
//   const [loadinSync, setLoadingSync] = useState(false)
//   const [wa, setWa] = useState(null) as any

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         // Evita que se ejecute el comportamiento predeterminado de Android
//         return true // true para indicar que el evento de retroceso ha sido manejado
//       }

//       // Agrega un listener para el evento de retroceso de Android
//       const backHandler = BackHandler.addEventListener(
//         'hardwareBackPress',
//         onBackPress,
//       )

//       if (Object.keys(wallet).length > 0) {
//         if (wallet.isFunding) {
//           //  writeWallet()
//         } else {
//           //  funding()
//         }
//       }

//       // Limpia el listener cuando la pantalla pierde el enfoque
//       return () => backHandler.remove()
//     }, []),
//   )

//   const funding = async () => {
//     const funding = await fundingWallet(wallet.wallet.walletOFC).catch(
//       error => {
//         console.log(error)
//         return error
//       },
//     )
//     const isFunding = funding.status === 200
//     const wallet_a = wallet.wallet
//     storage.set('wallet', JSON.stringify({wallet: wallet_a, isFunding}))
//   }

//   // useEffect(() => {
//   //   //Test KS
//   //   // testKS()

//   //   if (isConnected && dataToSync.parcels) {
//   //     toSyncData('createFarm')
//   //   }
//   // }, [isConnected, dataToSync?.parcels])

//   // useEffect(() => {
//   //   //Test KS
//   //   // testKS()
//   //   if (isConnected && dataToSync.sales) {
//   //     toSyncData('createSale')
//   //   }
//   // }, [isConnected, dataToSync?.sales])

//   // const testKS = async () => {
//   //   const dni = '2222222'
//   //   const encrypted = await dniEncrypt(dni)
//   //   console.log('encrypted', encrypted)
//   //   const dniDecrypt = await dniText(encrypted.dni)
//   //   // const dniDecrypt = await dniText(dniDecrypt)
//   //   console.log('dniDecrypt', dniDecrypt)
//   //   /* TEST:
//   //   para el hash 6d4cf5ae259c7efdae041e7ac6ac41d7 es 98765432
//   //   para el hash 46143ba1e97976f3cb1abcdfc99924f3 es 2222222
//   //   */
//   // }

//   const getWallet = () => {
//     const wallet = newWallet()
//     const isFunding = true
//     const walletObj = {wallet, isFunding}
//     setWa(walletObj.wallet)
//   }

//   const writeWallet = async () => {
//     const userData = JSON.parse(storage.getString('user') || '{}')
//     const parcels_array = JSON.parse(storage.getString('parcels') || '[]')
//     const sales = JSON.parse(storage.getString('sales') || '[]')
//     const [TX, newSales] = await writeTransaction(wallet.wallet.wif, {
//       userData,
//       parcels_array,
//       sales,
//     }).catch(error => {
//       console.log(error)
//       return [null, null]
//     })
//     if (TX) {
//       console.log(TX)
//       storage.set('sales', JSON.stringify(newSales))
//     }
//   }

//   // useEffect(() => {
//   //   if (
//   //     !loadingKafe &&
//   //     Object.keys(postKafeData).length === 0 &&
//   //     isConnected &&
//   //     user.country?.code === 'PE'
//   //   ) {
//   //     postKafeSistemas()
//   //   }
//   // }, [isConnected])

//   /*
//   useEffect(() => {
//     let interval;

//     interval = setInterval(() => {
//       if (!loadingKafe && isConnected && user.country?.code === "PE") {
//         getKafeSistemas();
//       }
//     }, 300000);
//     return () => clearInterval(interval);
//   }, [isConnected]); */

//   return (
//     <SafeArea bg={'isabelline'}>
//       <ScrollView>
//         {!loadinSync ? (
//           <View style={styles.container}>
//             <ConnectionStatus isConnected={isConnected || false} />
//             <Header {...user} />
//             <Body
//               syncUp={syncUp}
//               accessToken={accessToken}
//               getWallet={getWallet}
//               writeWallet={writeWallet}
//               isConnected={isConnected || false}
//             />
//           </View>
//         ) : (
//           <LoadingSave msg={TEXTS.textAF} />
//         )}
//       </ScrollView>
//     </SafeArea>
//   )
// }
