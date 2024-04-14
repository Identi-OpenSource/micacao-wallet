import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  PermissionsAndroid,
  Platform,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { storage } from "../../../config/store/db";
import HeaderComponent from "../../../components/Header";
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
} from "../../../config/themes/default";
import { UserInterface, UsersContext } from "../../../states/UserContext";
import { Person, IconProfile, Arrow_Right } from "../../../assets/svg";

const ProfileScreen = () => {
  const user: UserInterface = useContext(UsersContext);
  const [selectedImage, setSelectedImage] = useState(null);

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
    <View style={styles.container}>
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
        <Profile {...user} />
        <Text style={styles.textFarmer}>Agricultor</Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <IconProfile height={50} width={50} />
          <Text style={styles.textInformation}>Información Personal</Text>
          <Arrow_Right height={30} width={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Profile = ({ name }: UserInterface) => {
  const firstName = name.split(" ")[0];
  return <Text style={styles.textName}>{firstName}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_DF.isabelline,
    paddingVertical: 15,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  textName: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: 30,
  },
  textFarmer: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: 15,
  },
  textInformation: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    fontSize: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
});

export default ProfileScreen;
