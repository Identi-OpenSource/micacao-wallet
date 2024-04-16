import React, { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  HeaderActions,
  SafeArea,
} from "../../../components/safe-area/SafeArea";
import { styles as ST } from "./NewSaleOneScreen";
import { useNavigation } from "@react-navigation/native";
import { Btn } from "../../../components/button/Button";
import {
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from "../../../config/themes/default";
import { storage } from "../../../config/store/db";

export const NewSaleTwoScreen = () => {
  const navigation = useNavigation();
  const [kl, setKl] = useState("");
  const ref = useRef<TextInput>(null);

  const onSubmit = () => {
    ref.current?.blur();
    // kl es un numero y mayor a 0
    if (isNaN(Number(kl)) || Number(kl) <= 0) {
      Alert.alert("Error", "El valor ingresado no es válido");
      return;
    }
    const saleTemp = JSON.parse(storage.getString("saleTemp") || "{}");
    const sale = { ...saleTemp, kl };
    storage.set("saleTemp", JSON.stringify(sale));
    console.log("Peso", sale);
    navigation.navigate("NewSaleThreeScreen");
  };
  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <HeaderActions title={"Paso 2 de 3"} navigation={navigation} />
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
          <Btn
            theme={kl === "" ? "agrayuDisabled" : "agrayu"}
            title="CONFIRMAR"
            onPress={() => onSubmit()}
          />
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
