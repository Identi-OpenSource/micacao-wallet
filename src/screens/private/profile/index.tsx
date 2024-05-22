import { useFocusEffect } from "@react-navigation/native";
import { Card } from "@rneui/base";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { Arrow_Right, IconProfile, Person } from "../../../assets/svg";
import HeaderComponent from "../../../components/Header";
import { storage } from "../../../config/store/db";
import { COLORS_DF, FONT_FAMILIES } from "../../../config/themes/default";
import { UserInterface, UsersContext } from "../../../states/UserContext";
import { useKafeContext } from "../../../states/KafeContext";
const ProfileScreen = () => {
  const user: UserInterface = useContext(UsersContext);
  const { postKafeSistemas } = useKafeContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  //const [wallet, setWallet] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Evita que se ejecute el comportamiento predeterminado de Android
        return true; // true para indicar que el evento de retroceso ha sido manejado
      };

      // Agrega un listener para el evento de retroceso de Android
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // Limpia el listener cuando la pantalla pierde el enfoque
      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    const fetchImageUri = async () => {
      try {
        const imageUri = storage.getString("selectedImageUri") || "";
        if (imageUri) {
          setSelectedImage(imageUri);
        }
      } catch (error) {
        console.error("Error al recuperar la imagen desde MMKV:", error);
      }
    };

    fetchImageUri();
  }, []);
  async function requestGalleryPermission() {
    try {
      if (Platform.OS === "android") {
        console.log(Platform.Version);

        if (Platform.Version > 30) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: "Permiso de Acceso a la Galería",
              message:
                "Esta aplicación necesita acceso a tu galería de imágenes.",
              buttonPositive: "Aceptar",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permiso concedido");
            handleChooseImage();
          } else {
            console.log("Permiso denegado");
          }
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: "Permiso de Acceso a la Galería",
              message:
                "Esta aplicación necesita acceso a tu galería de imágenes.",
              buttonPositive: "Aceptar",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permiso concedido");
            handleChooseImage();
          } else {
            console.log("Permiso denegado");
            Linking.openSettings();
          }
        }
      }
    } catch (err) {
      console.warn("Error al solicitar permiso:", err);
    }
  }
  const handleChooseImage = () => {
    const options = {
      title: "Seleccionar imagen",
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    ImagePicker.launchImageLibrary(options, async (response) => {
      if (!response.didCancel) {
        console.log("Respuesta de ImagePicker:", response);
        setSelectedImage(response.assets[0].uri);

        try {
          // Guardar la ruta de la imagen seleccionada en MMKV
          storage.set("selectedImageUri", response.assets[0].uri);
          console.log("Imagen guardada en MMKV");
        } catch (error) {
          console.error("Error al guardar la imagen en MMKV:", error);
        }
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderComponent label={"Perfil"} />

      <TouchableOpacity
        onPress={requestGalleryPermission}
        style={{ alignSelf: "center" }}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
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
              flexDirection: "row",
              justifyContent: "space-between",
              width: "80%",
              alignItems: "center",
              marginTop: 30,
            }}
            onPress={() => {
              setShowInfo(true);
            }}
          >
            <IconProfile height={50} width={50} />
            <Text style={styles.textInformation}>Información Personal</Text>
            <Arrow_Right height={30} width={30} />
          </TouchableOpacity>
        )}
        {showInfo && (
          <>
            {/*  <View style={{ marginRight: 280 }}>
              <Text style={styles.textUpCard}>DNI</Text>
            </View>
            <Card containerStyle={styles.card}>
              <Text style={styles.textCard}>{user.dni}</Text>
            </Card> */}
            <View style={{ marginRight: 250, marginTop: 25 }}>
              <Text style={styles.textUpCard}>Telefóno</Text>
            </View>
            <Card containerStyle={styles.card}>
              <Text style={styles.textCard}>{user.phone}</Text>
            </Card>
            <View style={{ marginRight: 270, marginTop: 25 }}>
              <Text style={styles.textUpCard}>País</Text>
            </View>
            <Card containerStyle={styles.card}>
              <Text style={styles.textCard}>{user.country.name}</Text>
            </Card>
          </>
        )}
        <TouchableOpacity
          style={{
            width: "80%",
            alignItems: "center",
            marginTop: 30,
            backgroundColor: "#123456",
          }}
          onPress={() => {
            postKafeSistemas();
          }}
        >
          <Text>TEST</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_DF.isabelline,
    paddingVertical: 15,
  },
  card: {
    width: "80%",
    height: 50,

    justifyContent: "center",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 16,
  },
  textInformation: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    fontSize: 20,
  },
  textCard: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.black,
    fontSize: 15,
  },
  image: {
    width: 150,
    height: 150,
  },
});

export default ProfileScreen;
