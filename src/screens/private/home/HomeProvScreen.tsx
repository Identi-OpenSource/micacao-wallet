import React, {useCallback, useContext, useState} from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert as Alerts,
} from 'react-native'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
  getFontSize,
} from '../../../config/themes/default'
import {UserInterface, UsersContext} from '../../../states/UserContext'
import useInternetConnection from '../../../hooks/useInternetConnection'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {LABELS} from '../../../config/texts/labels'
import {Btn, BtnSmall} from '../../../components/button/Button'
import {TEXTS} from '../../../config/texts/texts'
import {imgFrame, imgLayer} from '../../../assets/imgs'
import {storage} from '../../../config/store/db'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {LoadingSave} from '../../../components/loading/LoadinSave'
import {
  fundingWallet,
  // fundingWalletOff,
  newWallet,
  verificarWallet,
  writeTransaction,
  // writeTransaction,
} from '../../../OCC/occ'
import {Alert} from '../../../components/alert/Alert'
/* import {Users} from '../../../models/user'
import {useQuery} from '@realm/react'
import Geolocation from '@react-native-community/geolocation' */

export const HomeProvScreen = () => {
  const navigation = useNavigation()
  const user: UserInterface = useContext(UsersContext)
  const isConnected = useInternetConnection()
  const [syncUp, setSyncUp] = useState(false)
  const [loadinSync, setLoadingSync] = useState(false)
  // const users = useQuery(Users)

  const [wa, setWa] = useState(null) as any

  // console.log('users', users)

  useFocusEffect(
    useCallback(() => {
      // verifySyncUp()
      // if not parcels, go to register parcel
      const parcels = JSON.parse(storage.getString('parcels') || '[]')
      if (parcels.length === 0) {
        setTimeout(() => {
          navigation.navigate('RegisterParcelScreen')
        }, 1000)
      }
    }, [isConnected]),
  )

  // const verifySyncUp = () => {
  //   // asyncData if not syncUp in the last 4 hours
  //   const sync = JSON.parse(storage.getString('syncUp') || '{}')
  //   if (
  //     isConnected &&
  //     sync.isSyncUp &&
  //     sync.lastSyncUp + 14400000 < Date.now()
  //   ) {
  //     setSyncUp(sync.isSyncUp)
  //   }
  // }

  const dataSyncUp = () => {
    setLoadingSync(true)
    setTimeout(() => {
      const newSync = {isSyncUp: false, lastSyncUp: Date.now()}
      storage.set('syncUp', JSON.stringify(newSync))
      setSyncUp(false)
      setLoadingSync(false)
    }, 2500)
  }

  const createWallet = () => {
    const wallet = newWallet()
    console.log('wallet', wallet)
    setWa(wallet)
    Alerts.alert('Wallet Creada', wallet.walletOFC)
  }

  const getFundingWallet = async () => {
    await fundingWallet(wa.walletOFC)
      .then(() => {
        Alerts.alert(
          'Fondos Agregados',
          'Se han agregado fondos a su wallet.' + wa.walletOFC,
        )
      })
      .catch(() => {
        Alerts.alert(
          'Error',
          'No se han podido agregar fondos a su wallet. Parece que la red OCC no está disponible. Intente más tarde.',
        )
      })
    //console.log(f)
  }

  const write = async () => {
    // Wallet prueba:RXp5YtBnAFGCN1DZeChVATR3EEu5c2zjt5
    // WIF:L3nfEsDGad8f74a28f1jrHbZCj5CmmFPmYyDSekrqeFT9tTxpy5q
    // wif2:UvaVYYqF5r6ua7N7KChKcjGn8o8LrsX1Y4M31uYYJMUA3kQ2sjkQ
    await writeTransaction(wa)
  }

  /*  const fundingWalletOffline = async () => {
    await fundingWalletOff(wa.ec_pairs, wa.walletOFC, wa.wifi)
      .then(resp => {
        console.log('fundingWalletOff', resp)
        Alerts.alert(
          'Fondos Fuera de linea Agregados',
          'Se han agregado fondos a su wallet.' + wa,
        )
      })
      .catch(() => {
        Alerts.alert('Error', 'No se han podido agregar fondos a su wallet.')
      })
  } */

  /*  const newTransaction = async () => {
    await fundingWallet(wa)
    //console.log(f)
  } */

  return (
    <SafeArea>
      <ScrollView>
        {!loadinSync ? (
          <View style={styles.container}>
            <ConnectionStatus
              syncUp={syncUp}
              isConnected={isConnected}
              dataSyncUp={dataSyncUp}
            />
            <Header {...user} />
            <Body syncUp={syncUp} />
            <View style={{marginTop: MP_DF.large}}>
              <Text style={styles.titleHeader}>Pruebas Polígono</Text>
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Muestra puntos en el mapa
              </Text>
              <Btn
                title={'Prueba de puntos GPS'}
                theme="agrayu"
                onPress={() => navigation.navigate('TestMap')}
              />
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Capturar polígono primera opción
              </Text>
              <Btn
                title={'Polígono A'}
                theme="agrayu"
                onPress={() => navigation.navigate('DrawPolyline')}
              />
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Capturar polígono segunda opción
              </Text>
              <Btn
                title={'Polígono B'}
                theme="agrayu"
                onPress={() => navigation.navigate('GradientLine')}
              />
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Capturar polígono tercera opción
              </Text>
              <Btn
                title={'Polígono C'}
                theme="agrayu"
                disabled={false}
                onPress={() => navigation.navigate('GradientLineRecorrer')}
              />
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Capturar polígono tercera cuarta opción
              </Text>
              <Btn
                title={'Polígono D'}
                theme="agrayu"
                disabled={false}
                onPress={() => navigation.navigate('GradientLineRecorrerAdd')}
              />

              <Text style={[styles.titleHeader, {marginVertical: 10}]}>
                Pruebas Wallet
              </Text>
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Crea una wallet compatible con OCC
              </Text>
              <Btn
                title={'Nueva Wallet'}
                theme="agrayu"
                onPress={() => createWallet()}
              />
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Agrega fondos a la wallet
              </Text>
              <Btn
                title={'Funding Wallet'}
                theme="agrayu"
                onPress={() => getFundingWallet()}
              />
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Verificar wallet
              </Text>
              <Btn
                title={'Revisar Wallet Online OFC'}
                theme="agrayu"
                onPress={() => verificarWallet(wa.walletOFC)}
              />
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Post Transaction de prueba a la wallet
              </Text>
              <Btn
                title={'Escribir en red OCC'}
                theme="agrayu"
                onPress={() => write()}
              />
              {/*
               <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Agregar fondos fuera de linea a la wallet
              </Text>
              <Btn
                title={'Funding Wallet Offline OFC'}
                theme="agrayu"
                onPress={() => fundingWalletOffline()}
              />
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Get Transaction de prueba a la wallet
              </Text>
              <Btn
                title={'Leer de la red OCC'}
                theme="agrayuDisabled"
                disabled={true}
                onPress={() => verificarWallet(wa)}
              />
               <Btn
                title={'Transaction de prueba a la wallet'}
                theme="agrayu"
                onPress={() => newTransaction()}
              /> */}
            </View>
          </View>
        ) : (
          <LoadingSave msg={TEXTS.textAF} />
        )}
      </ScrollView>
    </SafeArea>
  )
}

const ConnectionStatus = (props: {
  syncUp: boolean
  isConnected: boolean
  dataSyncUp: Function
}) => {
  const isConnected = props.isConnected
  const syncUp = props.syncUp
  const dataSyncUp = props.dataSyncUp
  return (
    <View style={styles.containerConnection}>
      <View style={styles.containerConnectionTitle}>
        <FontAwesomeIcon
          icon={'circle'}
          size={14}
          color={!isConnected ? COLORS_DF.grayLight : COLORS_DF.greenAgrayu}
        />
        <Text style={styles.connectionTitle}>
          {isConnected ? LABELS.online : LABELS.offline}
        </Text>
      </View>
      {!isConnected && (
        <Text style={styles.connectionSubTitle}>{LABELS.offlineMessage}</Text>
      )}
      {isConnected && syncUp && (
        <BtnSmall
          theme={'agrayu'}
          title={LABELS.asyncData}
          icon={'rotate'}
          onPress={() => dataSyncUp()}
        />
      )}
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

const Body = (props: {syncUp: boolean}) => {
  const [alert, setAlert] = useState(false)
  const navigation = useNavigation()
  const syncUp = props.syncUp
  // const onPress = () => {
  //   if (syncUp) {
  //     setAlert(true)
  //     return
  //   }
  // }
  return (
    <View style={styles.bodyContainer}>
      <Alert
        visible={alert}
        onVisible={setAlert}
        icon={'exclamation-triangle'}
        title={TEXTS.textAE}
      />
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
    borderColor: COLORS_DF.cacao,
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
    color: COLORS_DF.cacao,
    marginLeft: MP_DF.small,
  },
  connectionSubTitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(14),
    fontWeight: 'normal',
    color: COLORS_DF.grayLight,
    marginLeft: MP_DF.small,
  },
  header: {
    marginTop: MP_DF.large,
  },
  titleHeader: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xslarge,
    fontWeight: 'bold',
    color: COLORS_DF.cacao,
    marginBottom: MP_DF.small,
  },
  textHeader: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.small,
    color: COLORS_DF.cacao,
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
    color: COLORS_DF.cacao,
    textAlign: 'center',
  },
})
