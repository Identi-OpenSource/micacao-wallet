import React, {useCallback, useContext, useState} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
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
import {Alert} from '../../../components/alert/Alert'
import {LoadingSave} from '../../../components/loading/LoadinSave'

export const HomeProvScreen = () => {
  const navigation = useNavigation()
  const user: UserInterface = useContext(UsersContext)
  const isConnected = useInternetConnection()
  const [syncUp, setSyncUp] = useState(false)
  const [loadinSync, setLoadingSync] = useState(false)

  useFocusEffect(
    useCallback(() => {
      verifySyncUp()
      // if not parcels, go to register parcel
      const parcels = JSON.parse(storage.getString('parcels') || '[]')
      if (parcels.length === 0) {
        setTimeout(() => {
          navigation.navigate('RegisterParcelScreen')
        }, 1000)
      }
    }, [isConnected]),
  )

  const verifySyncUp = () => {
    // asyncData if not syncUp in the last 4 hours
    const sync = JSON.parse(storage.getString('syncUp') || '{}')
    if (
      isConnected &&
      sync.isSyncUp &&
      sync.lastSyncUp + 14400000 < Date.now()
    ) {
      setSyncUp(sync.isSyncUp)
    }
  }

  const dataSyncUp = () => {
    setLoadingSync(true)
    setTimeout(() => {
      const newSync = {isSyncUp: false, lastSyncUp: Date.now()}
      storage.set('syncUp', JSON.stringify(newSync))
      setSyncUp(false)
      setLoadingSync(false)
    }, 2500)
  }

  return (
    <SafeArea>
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
            <Btn
              title={'Prueba de puntos GPS'}
              theme="agrayu"
              onPress={() => navigation.navigate('TestMap')}
            />
          </View>
        </View>
      ) : (
        <LoadingSave msg={TEXTS.textAF} />
      )}
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
  const syncUp = props.syncUp
  const onPress = () => {
    if (syncUp) {
      setAlert(true)
      return
    }
  }
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
          onPress={onPress}>
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
          onPress={onPress}>
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
