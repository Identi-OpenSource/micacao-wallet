import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Sad } from "../../assets/svg";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";
interface TomatoToastProps {
  text1: string;
  props: { uuid: string }; // Define el tipo de `props` que se espera
}

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  error: ({ text1, props }) => (
    <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
      <Sad />
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    height: 52,
  },
  success: {
    backgroundColor: "lightgreen",
  },
  error: {
    backgroundColor: "salmon",
  },
  custom: {
    backgroundColor: "skyblue",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
});
export default toastConfig;
