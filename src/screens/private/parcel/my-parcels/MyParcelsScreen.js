import React, {useContext} from 'react'
import {Alert, Image, NativeModules, StyleSheet, Text, View} from 'react-native'
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
import axios from 'axios'
const Aes = NativeModules.Aes
import CryptoJS from 'crypto-js'

const API_KAFE_SISTEMAS =
  'http://148.113.174.223/api/v1/pe/land-request/polygon'
const KEY = 'llavesecretakafesistemasidenti12'

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

  // const encryptData = async (text, key) => {
  //   const iv = await Aes.randomKey(16)
  //   const cipher = await Aes.encrypt(text, key, iv, 'aes-128-cbc')
  //   return {cipher, iv}
  // }

  const certificateND = async () => {
    const key = 'llavesecretakafesistemasidenti12'
    const DNI = '12345678'
    // Rellenar el DNI con ceros a la izquierda para que sea de 16 caracteres
    const paddedDNI = DNI.padStart(16, '0')

    // Convertir la clave y el DNI a UTF-8 para usar con AES
    const utf8Key = CryptoJS.enc.Utf8.parse(key)
    const utf8DNI = CryptoJS.enc.Utf8.parse(paddedDNI)

    // Cifrar el DNI usando AES
    const encrypted = CryptoJS.AES.encrypt(paddedDNI, utf8Key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })

    // Convertir el resultado del cifrado a formato hexadecimal
    const hexResult = encrypted.ciphertext.toString(CryptoJS.enc.Hex)

    // Tomar los primeros 32 caracteres para obtener 32 caracteres en hexadecimal
    const truncatedHexResult = hexResult.substr(0, 32)
    console.log('Texto cifrado:', truncatedHexResult)

    const polygon = `POLYGON((${props.polygon
      .map((coordinate: Position[]) => `${coordinate[0]} ${coordinate[1]}`)
      .join(',')}))`
    const payload = {
      dni: truncatedHexResult,
      polygon,
      departamento: 'San Martin',
    }
    console.log('=> payload', payload)
    const resp = await axios.post(API_KAFE_SISTEMAS, payload)
    Alert.alert('Respuesta', 'Estado de la solicitud: ' + resp.data.State)
    console.log('=> resp', resp.data)
  }

  // const desCipher = async () => {
  //   const key = 'llavesecretakafesistemasidenti12' // Tomando los primeros 16 caracteres
  //   const encryptedHex = '9b6e8dd9656f735094b7b9b2fa775a8c' // Texto cifrado

  //   // Convertir la clave a un formato compatible
  //   const utf8Key = CryptoJS.enc.Utf8.parse(key)

  //   // Convertir el texto cifrado de hexadecimal a un formato de bytes comprensible por CryptoJS
  //   const encryptedBytes = CryptoJS.enc.Hex.parse(encryptedHex)

  //   // Descifrar el texto utilizando AES en modo ECB
  //   const decrypted = CryptoJS.AES.decrypt(
  //     {ciphertext: encryptedBytes},
  //     utf8Key,
  //     {
  //       mode: CryptoJS.mode.ECB,
  //       padding: CryptoJS.pad.Pkcs7,
  //     },
  //   )

  //   // Convertir el resultado a texto legible (UTF-8)
  //   const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)

  //   console.log('Texto descifrado:', decryptedText)
  // }

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
        <>
          <Btn
            title="Solicitar certificado Propiedad"
            onPress={() => certificateND()}
            theme="agrayu"
            style={containerBTN}
          />
        </>
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
