import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Btn } from "../../../components/button/Button";
import {
  HeaderActions,
  SafeArea,
} from "../../../components/safe-area/SafeArea";
import {
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from "../../../config/themes/default";
import { styles as ST } from "./NewSaleOneScreen";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";
import { storage } from "../../../config/store/db";
const { width, height } = Dimensions.get("window");

export const FiveSaleScreen = () => {
  const parcels = JSON.parse(storage.getString("parcels") || "[]");

  console.log("parcels", parcels);

  const navigation = useNavigation();
  const [parcela, setParcela] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const onSubmit = () => {
    // Si no se ha seleccionado una parcela, mostrar un mensaje de error y retornar
    if (!parcela) {
      Toast.show({
        type: "syncToast",
        text1: "¡Por favor selecciona una parcela!",
      });
      return;
    }
    const saleTemp = JSON.parse(storage.getString("saleTemp") || "{}");
    console.log("saletemp precio", saleTemp);
    const sale = { ...saleTemp, parcela };
    storage.set("saleTemp", JSON.stringify(sale));
    console.log("DE QUE PARCELA SALE EL CACAO", sale);
    // Navegar a la siguiente pantalla
    navigation.navigate("NewSaleThreeScreen");
  };

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <HeaderActions title={"Paso 4 de 5"} navigation={navigation} />
        <View
          style={{
            width: width * 0.8,
            marginLeft: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>¿DE QUÉ PARCELA LO COSECHASTE?</Text>
        </View>
        <View style={styles.containerBTN}>
          <View>
            <Dropdown
              style={[
                styles.dropdown,
                isFocus && { borderColor: COLORS_DF.citrine_brown },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemSelect}
              iconStyle={styles.iconStyle}
              data={parcels}
              autoScroll
              itemContainerStyle={styles.itemContainer}
              labelField="name"
              valueField="id"
              placeholder={!isFocus ? "Selecciona Parcela" : "..."}
              value={parcela} // Añadir el valor seleccionado
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item: any) => {
                setParcela(item.id); // Guardar el id de la parcela seleccionada
                setIsFocus(true);
              }}
            />
          </View>
          <View style={{ marginBottom: height * 0.09 }}>
            <Btn
              theme={parcela === "" ? "agrayuDisabled" : "agrayu"}
              title="CONFIRMAR"
              onPress={() => onSubmit()}
            />
          </View>
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  ...ST,
  dropdown: {
    height: 60,
    backgroundColor: "#fff",
    borderColor: COLORS_DF.light,
    borderWidth: 0.7,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 34,
  },
  placeholderStyle: {
    fontSize: 20,
    color: COLORS_DF.citrine_brown,
  },
  selectedTextStyle: {
    fontSize: 20,
    color: COLORS_DF.citrine_brown,
    fontFamily: FONT_FAMILIES.bold,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 4023,
    fontSize: 16,
  },
  formBtn: {
    flex: 1,
    marginLeft: 20,
    /*  borderWidth: 1,
    borderColor: "red", */
    width: "90%",
    justifyContent: "flex-end",
    paddingBottom: 20,
    alignItems: "center",
  },
  itemSelect: {
    fontWeight: "bold",
    fontSize: 17,
    color: COLORS_DF.citrine_brown,
  },
  itemContainer: {
    borderColor: COLORS_DF.citrine_brown,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 8,
    borderTopColor: COLORS_DF.citrine_brown,
  },
  containerBTN: {
    marginTop: MP_DF.large,
    justifyContent: "space-between",
    flex: 1,
    paddingBottom: MP_DF.large,
  },
  input: {
    height: height * 0.09,
    width: width * 0.5,
    borderBottomWidth: 1,
    color: COLORS_DF.citrine_brown,
    fontSize: 30,
    borderBottomColor: COLORS_DF.citrine_brown,
    textAlign: "center",
    textAlignVertical: "center",
  },
  containerKL: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: MP_DF.xlarge,
    borderWidth: 1,
  },
  KLV: {
    fontSize: 30,
    textAlign: "center",
    borderBottomWidth: 1,
    width: 250,
    color: COLORS_DF.citrine_brown,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: "bold",
  },
  KL: {
    fontSize: 30,
    textAlign: "center",
    marginLeft: 10,
    color: COLORS_DF.citrine_brown,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: "bold",
  },
});
