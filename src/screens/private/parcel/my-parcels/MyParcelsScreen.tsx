import React, {useContext} from 'react'
import {Image, StyleSheet, Text, View} from 'react-native'
import {SafeArea} from '../../../../components/safe-area/SafeArea'
import {
  Parcel,
  UserInterface,
  UsersContext,
} from '../../../../states/UserContext'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../../config/themes/default'
import {imgCampo} from '../../../../assets/imgs'
import {Btn} from '../../../../components/button/Button'
import {useNavigation} from '@react-navigation/native'
import {storage} from '../../../../config/store/db'
import {Position} from '@rnmapbox/maps/lib/typescript/src/types/Position'
import Config from 'react-native-config'
import axios from 'axios'
import Aes from 'react-native-aes-crypto'

const API_KAFE_SISTEMAS = Config.KAFE_SISTEMAS || ''

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
  const user: UserInterface = useContext(UsersContext)

  const encryptData = (text: string, key: string) => {
    return Aes.randomKey(16).then(iv => {
      return Aes.encrypt(text, key, iv, 'aes-128-cbc').then(cipher => ({
        cipher,
        iv,
      }))
    })
  }

  const certificateND = async () => {
    const polygon = `POLYGON((${props.polygon
      .map((coordinate: Position[]) => `${coordinate[0]} ${coordinate[1]}`)
      .join(',')}))`
    const key = await Aes.randomKey(16)
    let DNI = await encryptData(user.dni, key)
    const payload = {
      dni: Buffer.from(DNI.cipher, 'base64').toString('hex'),
      polygon,
      departamento: 'San Martin',
    }
    console.log(payload.dni.length, '086971ab2b6c1d22e239cef071319380'.length)
    console.log('=> payload', payload)
    console.log('=> URL', API_KAFE_SISTEMAS)
    const resp = await axios.post(API_KAFE_SISTEMAS, payload)
    console.log('=> resp', resp.data)
  }
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
      {
        <Btn
          title={!props.polygon ? 'Falta dibujar mapa' : 'Ver polígono en mapa'}
          onPress={() =>
            !props.polygon
              ? navigation.navigate('PolygonScreen')
              : navigation.navigate('DrawPolygonScreen')
          }
          theme="warning"
          style={containerBTN}
        />
      }
      {props.polygon && (
        <Btn
          title="Solicitar certificado ND"
          onPress={() => certificateND()}
          theme="agrayu"
          style={containerBTN}
        />
      )}
      <Btn
        title="Presione para ver más"
        icon={'hand-pointer'}
        onPress={() => {}}
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
