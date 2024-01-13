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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'

export const HomeProvScreen = () => {
  const user = useContext(UsersContext)
  const firstName = user.name.split(' ')[0]
  return (
    <SafeArea>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleHeader}>Hola, {firstName}</Text>
          <Text style={styles.textHeader}>
            Selecciona la opción que deseas realizar
          </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.cardContainer}>
            <View style={styles.icon}>
              <FontAwesomeIcon icon="tree" size={36} color={COLORS_DF.black} />
            </View>
            <Text style={styles.cardTitle}>Registrar mi parcela</Text>
            <Text style={styles.cardText}>
              Quiero hacer visible mi parcela al mundo y empezar a vender.
            </Text>
          </View>
        </View>
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
