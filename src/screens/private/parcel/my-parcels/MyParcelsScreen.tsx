import React from 'react'
import {Image, StyleSheet, Text, View} from 'react-native'
import {SafeArea} from '../../../../components/safe-area/SafeArea'
import {Parcel} from '../../../../states/UserContext'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../../config/themes/default'
import {imgCampo} from '../../../../assets/imgs'
import {Btn} from '../../../../components/button/Button'
import {storage} from '../../../../config/store/db'
import {useNavigation} from '@react-navigation/native'

export const MyParcelsScreen = () => {
  const parcels: Parcel[] = JSON.parse(storage.getString('parcels') || '[]')

  return (
    <SafeArea>
      <View style={styles.container}>
        {parcels.map(parcel => CardParcel(parcel))}
      </View>
    </SafeArea>
  )
}

const CardParcel = (props: Parcel) => {
  const navigation = useNavigation()
  return (
    <View style={styles.cardContainer} key={props.name}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderTS}>
          <Text style={styles.cardTitle}>{props.name}</Text>
          <Text
            style={
              styles.cardST
            }>{`Área de parcela: ${props.hectares} Ha`}</Text>
        </View>
        <Image source={imgCampo} style={styles.img} />
      </View>
      <Btn
        title="Falta dibujar mapa"
        onPress={() => navigation.navigate('PolygonScreen')}
        theme="warning"
        style={containerBTN}
      />
      <Btn
        title="Presione para ver más"
        icon={'hand-pointer'}
        onPress={() => navigation.navigate('DrawPolyline')}
        theme="transparent"
        style={containerBTN}
      />
    </View>
  )
}

const containerBTN = {
  container: {
    marginTop: MP_DF.small,
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingTop: MP_DF.medium,
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: MP_DF.medium,
    borderRadius: MP_DF.small,
    marginBottom: MP_DF.medium,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeaderTS: {},
  cardTitle: {
    fontSize: FONT_SIZES.xslarge,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: 'bold',
    color: COLORS_DF.cacao,
    marginBottom: MP_DF.small,
  },
  cardST: {
    fontSize: FONT_SIZES.medium,
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.grayLight,
  },
  img: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
})
