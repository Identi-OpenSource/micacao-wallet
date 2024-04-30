import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import React, {useCallback, useContext, useEffect, useState} from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import {newWallet, writeTransaction} from '../../../OCC/occ'
import {imgFrame, imgLayer} from '../../../assets/imgs'
import {LoadingSave} from '../../../components/loading/LoadinSave'
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
import useInternetConnection from '../../../hooks/useInternetConnection'
import {useAuth} from '../../../states/AuthContext'
import {ConnectionContext} from '../../../states/ConnectionContext'
import {SyncDataContext} from '../../../states/SyncDataContext'
import {UserInterface, UsersContext} from '../../../states/UserContext'

export const HomeProvScreen = () => {
  const user: UserInterface = useContext(UsersContext)
  const internetConnection = useContext(ConnectionContext)
  const syncData = useContext(SyncDataContext)
  const {isConnected} = internetConnection
  const {hasDataToSync, addToSync, toSyncData, dataToSync} = syncData

  const {accessToken} = useAuth()
  const [syncUp, setSyncUp] = useState(false)
  const [loadinSync, setLoadingSync] = useState(false)
  const [wa, setWa] = useState(null) as any

  useEffect(() => {
    if (isConnected) {
      if (dataToSync.parcels) toSyncData('createFarm')
      if (dataToSync.sales) toSyncData('createSale')
    }
  }, [isConnected, dataToSync])

  useFocusEffect(
    useCallback(() => {
      // verifySyncUp()
      // const usesr = JSON.parse(storage.getString('user') || '[]')
    }, [isConnected]),
  )

  const getWallet = () => {
    // Create Wallet
    // const wallet = JSON.parse(storage.getString("wallet") || "{}");
    // setWa(wallet);

    //Testing Wallet
    const wallet = newWallet()
    const isFunding = true

    const walletObj = {wallet, isFunding}

    console.log(walletObj)

    setWa(walletObj.wallet)
  }

  const writeWallet = () => {
    write()
  }

  const write = async () => {
    // Wallet prueba:RXp5YtBnAFGCN1DZeChVATR3EEu5c2zjt5
    // WIF:L3nfEsDGad8f74a28f1jrHbZCj5CmmFPmYyDSekrqeFT9tTxpy5q
    // wif2:UvaVYYqF5r6ua7N7KChKcjGn8o8LrsX1Y4M31uYYJMUA3kQ2sjkQ
    console.log(wa.wif)
    await writeTransaction(wa.wif)
  }

  return (
    <SafeArea bg={'isabelline'}>
      <ScrollView>
        {!loadinSync ? (
          <View style={styles.container}>
            <ConnectionStatus
              hasDataToSync={hasDataToSync || false}
              isConnected={isConnected || false}
              dataSyncUp={() => {} /* dataSyncUp */}
            />
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

const ConnectionStatus = (props: {
  hasDataToSync: boolean
  isConnected: boolean
  dataSyncUp: Function
}) => {
  const isConnected = props.isConnected
  const hasDataToSync = props.hasDataToSync
  const dataSyncUp = props.dataSyncUp

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
      {/* {hasDataToSync && isConnected && (
        <TouchableOpacity style={styles.buttonReload} onPress={() => {}}>
          <Reloading />
          <Text style={styles.connectionSubTitle}>{"Guardar Datos"}</Text>
        </TouchableOpacity>
      )} */}
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
      <Toast />
    </View>
  )
}

const Body = (props: {
  syncUp: boolean
  accessToken: string
  getWallet: any
  writeWallet: any
  isConnected: boolean
}) => {
  const navigation = useNavigation()
  const {isVisibleModal, setIsVisibleModal} = useInternetConnection()

  const syncUp = props.syncUp

  const accessToken = props.accessToken
  const getWallet = props.getWallet
  const writeWallet = props.writeWallet
  const isConnected = props.isConnected
  useEffect(() => {}, [])

  return (
    <View style={styles.bodyContainer}>
      {/* <ModalComponent
        isVisible={isVisibleModal && existSyncData}
        label={"Tienes información pendiente por guardar"}
        buttonText={"Aceptar"}
        closeModal={() => {
          syncData(accessToken);
          setIsVisibleModal(false);
        }}
      /> */}

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
          onPress={() => navigation.navigate('NewSaleOneScreen')}>
          <Image source={imgFrame} style={syncUp && styles.filter} />
          <Text style={[styles.titleCard, syncUp && styles.filter]}>
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
