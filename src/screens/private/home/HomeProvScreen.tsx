import React, {useContext, useEffect} from 'react'
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
import {useNavigation} from '@react-navigation/native'

export const HomeProvScreen = () => {
  const navigation = useNavigation()
  const user: UserInterface = useContext(UsersContext)
  const firstPoint =
    user?.parcel[0]?.firstPoint[0] + ', ' + user?.parcel[0]?.firstPoint[1]
  const centerPoint =
    user?.parcel[0]?.secondPoint[0] + ', ' + user?.parcel[0]?.secondPoint[1]
  // const isConnected = useInternetConnection()

  useEffect(() => {
    if (user.parcel?.length === 0) {
      setTimeout(() => {
        navigation.navigate('RegisterParcelScreen')
      }, 100)
    }
  }, [])

  const dataLOcal = storage.getString('user') || '{}'
  console.log('dataLOcal', JSON.parse(dataLOcal))
  // const userLocalObject = JSON.parse(dataLOcal)
  //  const userLocal = JSON.stringify(userLocalObject, null, 2)

  return (
    <SafeArea>
      <View style={styles.container}>
        <ConnectionStatus />
        <Header {...user} />
        <Body />
        <Text> Entrada: {firstPoint} </Text>
        <Text> Centro: {centerPoint} </Text>
        <View style={{marginTop: MP_DF.large}}>
          <Btn
            title={'Prueba de puntos GPS'}
            theme="agrayu"
            onPress={() => navigation.navigate('TestMap')}
          />
        </View>
      </View>
    </SafeArea>
  )
}

const ConnectionStatus = () => {
  const isConnected = useInternetConnection()
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
      {isConnected && (
        <BtnSmall
          theme={'agrayu'}
          title={LABELS.asyncData}
          icon={'rotate'}
          onPress={() => console.log('asyncData')}
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

const Body = () => {
  return (
    <View style={styles.bodyContainer}>
      {/* Primer card */}
      <View style={[styles.bodyCardContainerFull]}>
        <TouchableOpacity style={[styles.bodyCard]} activeOpacity={0.9}>
          <Image source={imgLayer} />
          <Text style={styles.titleCard}>{LABELS.viewMyParcels}</Text>
        </TouchableOpacity>
      </View>
      {/* Segundo card */}
      {/* <View style={[styles.bodyCardContainer]}>
        <TouchableOpacity style={[styles.bodyCard]} activeOpacity={0.9}>
          <Image source={imgIllustration} />
          <Text style={styles.titleCard}>{LABELS.registerCosecha}</Text>
        </TouchableOpacity>
      </View> */}
      {/* Tercer card */}
      <View style={[styles.bodyCardContainerFull]}>
        <TouchableOpacity style={[styles.bodyCard]} activeOpacity={0.9}>
          <Image source={imgFrame} />
          <Text style={styles.titleCard}>{LABELS.registerVenta}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
