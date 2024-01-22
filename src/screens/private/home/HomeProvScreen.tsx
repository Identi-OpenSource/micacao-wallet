import React, {useContext} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
  getFontSize,
} from '../../../config/themes/default'
import {UsersContext} from '../../../states/UserContext'
import {storage} from '../../../config/store/db'
import useInternetConnection from '../../../hooks/useInternetConnection'

export const HomeProvScreen = () => {
  const user = useContext(UsersContext)
  const isConnected = useInternetConnection()

  console.log('user', user)

  const dataLOcal = storage.getString('user') || '{}'
  const userLocalObject = JSON.parse(dataLOcal)
  const userLocal = JSON.stringify(userLocalObject, null, 2)
  return (
    <SafeArea>
      <View style={styles.container}>
        <Text style={styles.titleHeader}>Home</Text>
        <Text style={styles.textHeader}>
          Online: {isConnected ? 'true' : 'false'}
        </Text>
        <Text style={styles.textHeader}>Local-OffLine: {userLocal}</Text>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: MP_DF.large,
  },
  header: {},
  titleHeader: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    color: COLORS_DF.primary,
    lineHeight: getFontSize(28),
  },
  textHeader: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(14),
    fontWeight: 'bold',
    color: COLORS_DF.primary,
    lineHeight: getFontSize(28),
  },
  body: {
    marginTop: MP_DF.large,
  },
  cardContainer: {
    backgroundColor: COLORS_DF.white,
    borderRadius: BORDER_RADIUS_DF.medium,
    padding: MP_DF.large,
    shadowColor: COLORS_DF.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: 'bold',
    fontSize: getFontSize(20),
    color: COLORS_DF.primary,
  },
  cardText: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: getFontSize(14),
    lineHeight: getFontSize(20),
    color: COLORS_DF.black,
    marginTop: MP_DF.medium,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS_DF.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
