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

const {width, height} = Dimensions.get('window')

export const MyParcelsScreen = () => {
  const navigation = useNavigation()
  const [parcels, setParcels] = useState([] as Parcel[])

  useFocusEffect(
    useCallback(() => {
      const parc: Parcel[] = JSON.parse(storage.getString('parcels') || '[]')
      setParcels(parc)
    }, []),
  )

  return (
    <SafeArea>
      <ScrollView style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            /*   borderColor: "red",
            borderWidth: 1, */
            marginBottom: 4,
          }}>
          <Text style={styles.title}>Lista de parcelas</Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              width: width * 0.9,
              height: height * 0.07,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: COLORS_DF.robin_egg_blue,
              borderWidth: 1,
              borderRadius: 5,
              flexDirection: 'row',
            }}
            onPress={() => {
              if (parcels.length < 4 && parcels.length > 0) {
                navigation.navigate('RegisterParcel')
              } else {
                Toast.show({
                  type: 'sadToast',
                  text1: 'Sólo se puede crear 4 parcelas',
                })
              }
            }}>
            <Text
              style={{
                color: COLORS_DF.robin_egg_blue,
                fontSize: width * 0.045,
                marginRight: 2,
              }}>
              Registrar mas parcelas{' '}
            </Text>
            <Add />
          </TouchableOpacity>
        </View>
        {parcels.map((parcel, index) => CardParcel(parcel, navigation, index))}
      </ScrollView>
    </SafeArea>
  )
}

const CardParcel = (props: Parcel, navigation: any, index: any) => {
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
      </View>

      {
        <Btn
          title={!props.polygon ? 'Falta dibujar mapa' : 'Ver polígono en mapa'}
          onPress={() =>
            !props.polygon
              ? navigation.navigate('PolygonScreen', {index})
              : navigation.navigate('DrawPolygonScreen', {index})
          }
          theme="warning"
          style={containerBTN}
        />
      }
      {/*       {props.polygon && (
        <>
          <Btn
            title="Solicitar certificado Propiedad"
            onPress={() => certificateND()}
            theme="agrayu"
            style={containerBTN}
          />
        </>
      )} */}

      <TouchableOpacity
        onPress={() => {
          !props.polygon
            ? navigation.navigate('PolygonScreen', {index})
            : navigation.navigate('DrawPolygonScreen', {index})
        }}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        {!props.polygon ? <Parcels /> : <ParcelColor />}
      </TouchableOpacity>

      {/*         <Btn
          title="Presione para dibujar"
          icon={"hand-pointer"}
          onPress={() => {}}
          theme="transparent"
          style={containerBTN}
      /> */}
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
})
