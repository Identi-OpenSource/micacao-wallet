import {useFocusEffect, useNavigation} from '@react-navigation/native'
import React, {useCallback, useState} from 'react'
import Toast from 'react-native-toast-message'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {Add, ParcelColor, Parcels} from '../../../../assets/svg'
import {Btn} from '../../../../components/button/Button'
import {SafeArea} from '../../../../components/safe-area/SafeArea'
import {storage} from '../../../../config/store/db'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../../config/themes/default'
import {Parcel} from '../../../../states/UserContext'
import {STORAGE_KEYS} from '../../../../config/const'

const {width} = Dimensions.get('window')

export const MyParcelsScreen = () => {
  const [parcels, setParcels] = useState([] as Parcel[])
  const navigation = useNavigation()

  useFocusEffect(
    useCallback(() => {
      const parc: Parcel[] = JSON.parse(
        storage.getString(STORAGE_KEYS.parcels) || '[]',
      )
      setParcels(parc)
    }, []),
  )

  return (
    <SafeArea>
      <ScrollView style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            marginBottom: 4,
          }}>
          <Text style={styles.title}>Lista de parcelas</Text>
          {parcels.length < 4 ? (
            <TouchableOpacity
              style={styles.btnAdd}
              onPress={() => {
                navigation.navigate('RegisterParcel')
              }}>
              <Text
                style={{
                  color: COLORS_DF.robin_egg_blue,
                  fontSize: width * 0.045,
                  marginRight: 2,
                }}>
                Registrar más parcelas
              </Text>
              <Add />
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                color: '#EE7B34',
                fontSize: width * 0.037,
                marginVertical: 10, // Espacio vertical adicional
                fontFamily: FONT_FAMILIES.bold,
              }}>
              Has completado el límite de parcelas registradas
            </Text>
          )}
        </View>
        {parcels.map(parcel => CardParcel(parcel, navigation))}
      </ScrollView>
    </SafeArea>
  )
}

const CardParcel = (parcel: Parcel, navigation: any) => {
  return (
    <View style={styles.cardContainer} key={parcel.id}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderTS}>
          <Text style={styles.cardTitle}>{parcel.name}</Text>
          <Text
            style={
              styles.cardST
            }>{`Área de parcela: ${parcel.hectares} Ha`}</Text>
        </View>
      </View>

      {
        <Btn
          title={
            !parcel.polygon ? 'Falta dibujar mapa' : 'Ver polígono en mapa'
          }
          onPress={() =>
            !parcel.polygon
              ? navigation.navigate('PolygonScreen', {id: parcel?.id})
              : navigation.navigate('DrawPolygonScreen', {id: parcel?.id})
          }
          theme="warning"
          style={containerBTN}
        />
      }

      <TouchableOpacity
        onPress={() => {
          !parcel.polygon
            ? navigation.navigate('PolygonScreen', {id: parcel?.id})
            : navigation.navigate('DrawPolygonScreen', {id: parcel?.id})
        }}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        {!parcel.polygon ? <Parcels /> : <ParcelColor />}
      </TouchableOpacity>
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
    color: COLORS_DF.citrine_brown,
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
  title: {
    fontSize: FONT_SIZES.large,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
    marginBottom: MP_DF.small,
  },
  btnAdd: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: 62,
    marginBottom: MP_DF.small,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS_DF.robin_egg_blue,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
  },
})
