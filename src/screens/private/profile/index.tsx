import {useFocusEffect} from '@react-navigation/native'
import {Card} from '@rneui/base'
import React, {useCallback, useContext, useEffect, useState} from 'react'
import {
  BackHandler,
  Dimensions,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import * as ImagePicker from 'react-native-image-picker'
import {Arrow_Right, IconProfile, Person} from '../../../assets/svg'
import HeaderComponent from '../../../components/Header'
import {storage} from '../../../config/store/db'
<<<<<<< HEAD
import {COLORS_DF, FONT_FAMILIES} from '../../../config/themes/default'
import {UserInterface, UsersContext} from '../../../states/UserContext'
const ProfileScreen = () => {
  const user: UserInterface = useContext(UsersContext)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  const [wallet, setWallet] = useState<any>(null)
=======
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {useKafeContext} from '../../../states/KafeContext'
import {UserInterface, UsersContext} from '../../../states/UserContext'
import {Btn} from '../../../components/button/Button'
import {PinRequest} from '../../../components/pin-request/PinRequest'
const {width} = Dimensions.get('window')
import Share from 'react-native-share'
import {Buffer} from 'buffer'
import RNFS from 'react-native-fs'
import Toast from 'react-native-toast-message'

const ProfileScreen = () => {
  const user: UserInterface = useContext(UsersContext)
  const {postKafeSistemas, getKafeSistemas} = useKafeContext()
  const [pinAproved, setPinApproved] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showRequestPin, setShowRequestPin] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  //const [wallet, setWallet] = useState<any>(null);
>>>>>>> 37d6256 (feat: :sparkles: Exportar Data en JSON OK solo falta la data real)

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Evita que se ejecute el comportamiento predeterminado de Android
        return true // true para indicar que el evento de retroceso ha sido manejado
      }

      // Agrega un listener para el evento de retroceso de Android
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      )

      // Limpia el listener cuando la pantalla pierde el enfoque
      return () => backHandler.remove()
    }, []),
  )

  useEffect(() => {
    const fetchImageUri = async () => {
      try {
        const imageUri = storage.getString('selectedImageUri') || ''
        if (imageUri) {
          setSelectedImage(imageUri)
        }
      } catch (error) {
        console.error('Error al recuperar la imagen desde MMKV:', error)
      }
    }
<<<<<<< HEAD

    fetchImageUri()
  }, [])
  async function requestGalleryPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Permiso de Acceso a la Galería',
            message:
              'Esta aplicación necesita acceso a tu galería de imágenes.',
            buttonPositive: 'Aceptar',
          },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permiso concedido')
          handleChooseImage()
        } else {
          console.log('Permiso denegado')
=======

    fetchImageUri()
  }, [])

  useEffect(() => {
    if (pinAproved) {
      createAndShareJSON()
      setPinApproved(false)
    }
  }, [pinAproved])

  async function requestGalleryPermission() {
    try {
      if (Platform.OS === 'android') {
        console.log(Platform.Version)

        if (Platform.Version > 30) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Permiso de Acceso a la Galería',
              message:
                'Esta aplicación necesita acceso a tu galería de imágenes.',
              buttonPositive: 'Aceptar',
            },
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permiso concedido')
            handleChooseImage()
          } else {
            console.log('Permiso denegado')
          }
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Permiso de Acceso a la Galería',
              message:
                'Esta aplicación necesita acceso a tu galería de imágenes.',
              buttonPositive: 'Aceptar',
            },
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permiso concedido')
            handleChooseImage()
          } else {
            console.log('Permiso denegado')
            Linking.openSettings()
          }
>>>>>>> 37d6256 (feat: :sparkles: Exportar Data en JSON OK solo falta la data real)
        }
      }
    } catch (err) {
      console.warn('Error al solicitar permiso:', err)
    }
  }
  const handleChooseImage = () => {
    const options = {
      title: 'Seleccionar imagen',
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    }

    ImagePicker.launchImageLibrary(options, async response => {
      if (!response.didCancel) {
        console.log('Respuesta de ImagePicker:', response)
        setSelectedImage(response.assets[0].uri)

        try {
          // Guardar la ruta de la imagen seleccionada en MMKV
          storage.set('selectedImageUri', response.assets[0].uri)
          console.log('Imagen guardada en MMKV')
        } catch (error) {
          console.error('Error al guardar la imagen en MMKV:', error)
        }
      }
    })
  }
<<<<<<< HEAD

  return (
    <ScrollView style={styles.container}>
      <HeaderComponent label={'Perfil'} />

      <TouchableOpacity
        onPress={requestGalleryPermission}
        style={{alignSelf: 'center'}}>
        {selectedImage ? (
          <Image source={{uri: selectedImage}} style={styles.image} />
        ) : (
          <Person width={150} height={150} />
        )}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>{user.name}</Text>
        <Text style={styles.textFarmer}>Agricultor</Text>
        {!showInfo && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '80%',
              alignItems: 'center',
              marginTop: 30,
            }}
            onPress={() => {
              setShowInfo(true)
            }}>
            <IconProfile height={50} width={50} />
            <Text style={styles.textInformation}>Información Personal</Text>
            <Arrow_Right height={30} width={30} />
          </TouchableOpacity>
        )}
        {showInfo && (
          <>
            {/*  <View style={{ marginRight: 280 }}>
=======

  const createAndShareJSON = async () => {
    const data = {
      user: {},
      parcels: [],
      sales: [],
    }

    // Convertir los datos a JSON
    const jsonString = JSON.stringify(data)

    const path = RNFS.DownloadDirectoryPath + '/mi_data_miCacao.json'

    // Crear un objeto de opciones para compartir
    const options = {
      title: 'Compartir o descargar mi datos',
      url: 'file://' + path,
      type: 'application/json',
      message: 'Compartir o descargar mi datos',
      filename: 'mi_data_miCacao.json',
    }

    try {
      // Guardar el archivo JSON
      await RNFS.writeFile(path, jsonString, 'utf8')
      Toast.show({
        type: 'syncToast',
        text1: 'El archivo JSON se ha guardado en la carpeta de descargas',
      })
      console.log('Archivo JSON guardado en:', path)
      // Compartir el archivo JSON
      await Share.open(options)

      Toast.show({
        type: 'syncToast',
        text1: 'El archivo JSON se ha guardado en la carpeta de descargas',
      })
    } catch (error) {
      console.error('Error al compartir el archivo JSON:', error)
    }
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderComponent label={'Perfil'} goBackNavigation={false} />

        <TouchableOpacity
          onPress={requestGalleryPermission}
          style={{alignSelf: 'center'}}>
          {selectedImage ? (
            <Image source={{uri: selectedImage}} style={styles.image} />
          ) : (
            <Person width={150} height={150} />
          )}
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.textName}>{user.name}</Text>
          <Text style={styles.textFarmer}>Agricultor</Text>
          {!showInfo && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '80%',
                alignItems: 'center',
                marginTop: 30,
              }}
              onPress={() => {
                setShowInfo(true)
              }}>
              <IconProfile height={50} width={50} />
              <Text style={styles.textInformation}>Información Personal</Text>
              <Arrow_Right height={30} width={30} />
            </TouchableOpacity>
          )}
          {showInfo && (
            <>
              {/*  <View style={{ marginRight: 280 }}>
>>>>>>> 37d6256 (feat: :sparkles: Exportar Data en JSON OK solo falta la data real)
              <Text style={styles.textUpCard}>DNI</Text>
            </View>
            <Card containerStyle={styles.card}>
              <Text style={styles.textCard}>{user.dni}</Text>
            </Card> */}
<<<<<<< HEAD
            <View style={{marginRight: 250, marginTop: 25}}>
              <Text style={styles.textUpCard}>Telefóno</Text>
            </View>
            <Card containerStyle={styles.card}>
              <Text style={styles.textCard}>{user.phone}</Text>
            </Card>
            <View style={{marginRight: 270, marginTop: 25}}>
              <Text style={styles.textUpCard}>País</Text>
            </View>
            <Card containerStyle={styles.card}>
              <Text style={styles.textCard}>{user.country.name}</Text>
            </Card>
          </>
        )}
      </View>
    </ScrollView>
=======
              <View style={{marginRight: 250, marginTop: 25}}>
                <Text style={styles.textUpCard}>Telefóno</Text>
              </View>
              <Card containerStyle={styles.card}>
                <Text style={styles.textCard}>{user.phone}</Text>
              </Card>
              <View style={{marginRight: 270, marginTop: 25}}>
                <Text style={styles.textUpCard}>País</Text>
              </View>
              <Card containerStyle={styles.card}>
                <Text style={styles.textCard}>{user.country.name}</Text>
              </Card>
              <Btn
                title="Exportar Data"
                theme="agrayu"
                onPress={() => setShowRequestPin(true)}
                style={{container: {width: '80%', marginTop: MP_DF.xxlarge}}}
              />
            </>
          )}
        </View>
      </ScrollView>
      {showRequestPin && (
        <PinRequest
          setShowRequestPin={setShowRequestPin}
          setPinApproved={setPinApproved}
        />
      )}
    </>
>>>>>>> 37d6256 (feat: :sparkles: Exportar Data en JSON OK solo falta la data real)
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_DF.isabelline,
    paddingVertical: 15,
  },
  card: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  textName: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: 25,
  },
  textFarmer: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: 15,
  },
  textUpCard: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: width * 0.04,
  },
  textInformation: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    fontSize: 20,
  },
  textCard: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.black,
    fontSize: width * 0.038,
  },
  image: {
    width: 150,
    height: 150,
  },
})

export default ProfileScreen
