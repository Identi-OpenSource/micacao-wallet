import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Btn } from "../../../components/button/Button";
import {
  HeaderActions,
  SafeArea,
} from "../../../components/safe-area/SafeArea";
import { storage } from "../../../config/store/db";
import {
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from "../../../config/themes/default";
import { styles as ST } from "./NewSaleOneScreen";

export const NewSaleTwoScreen = () => {
  const navigation = useNavigation();
  const [kl, setKl] = useState("");
  const ref = useRef<TextInput>(null);

  const decimals = (numero: any) => {
    return /^(0|[1-9]\d{0,3})(\.\d{2})?$/.test(numero.trim());
  };

  const onSubmit = () => {
    ref.current?.blur();
    // kl es un numero y mayor a 0
    if (isNaN(Number(kl)) || Number(kl) <= 0 || !decimals(kl)) {
      Toast.show({
        type: "syncToast",
        text1: "¡Número Inválido!",
      });
      return;
    }
    const saleTemp = JSON.parse(storage.getString("saleTemp") || "{}");
    console.log("saletemp", saleTemp);

    const sale = { ...saleTemp, kl };
    storage.set("saleTemp", JSON.stringify(sale));
    console.log("PESO DEL CACAO", sale);
    navigation.navigate("SaleScreen");
  };
  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <HeaderActions title={"Paso 2 de 5"} navigation={navigation} />
        <Text style={styles.title}>¿CUÁNTO VAS A VENDER?</Text>
        <View style={styles.containerBTN}>
          <TouchableOpacity
            style={styles.containerKL}
            activeOpacity={1}
            onPress={() => (ref.current as any)?.focus()}
          >
            <Text style={styles.KLV}>{kl}</Text>
            <Text style={styles.KL}>Kg.</Text>
          </TouchableOpacity>
          <View style={{ marginBottom: 25 }}>
            <Btn
              theme={kl === "" ? "agrayuDisabled" : "agrayu"}
              title="CONFIRMAR"
              onPress={() => onSubmit()}
            />
          </View>
        </View>
        <TextInput
          ref={ref}
          style={styles.input}
          placeholder="Kilogramos"
          value={kl}
          onChangeText={(text) => {
            text = text.replace(/,/g, ".");
            text = text.replace(/(\..*)\./g, "$1");
            setKl(text);
          }}
          keyboardType="numeric"
          autoFocus
        />
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  ...ST,
  containerBTN: {
    marginTop: MP_DF.large,
    justifyContent: "space-between",
    flex: 1,
    paddingBottom: MP_DF.large,
  },
  input: {
    height: 0,
  },
  containerKL: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: MP_DF.xlarge,
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
