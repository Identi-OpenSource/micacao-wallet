/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : Pantalla de confirmación de contraseña de la aplicación
 */

import { Field, Formik } from "formik";
import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import { sha256 } from "react-native-sha256";
import { Confirm_Password_M, Confirm_Password_W } from "../../../assets/svg";
import { Btn } from "../../../components/button/Button";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { LABELS } from "../../../config/texts/labels";
import { ScreenProps } from "../../../routers/Router";
import { UsersContext } from "../../../states/UserContext";
import {
  INIT_VALUES_FOURTH,
  INPUTS_FOURTH,
  InterfaceFourth,
  SCHEMA_FOURTH,
} from "./Interfaces";
import { Header } from "./RegisterScreen";
import { styles } from "./styles";
export const ConfirmPasswordScreen = ({
  navigation,
  route,
}: ScreenProps<"ConfirmPasswordScreen">) => {
  const pin = route.params?.pin;
  const [error, setError] = useState(false);
  if (pin) {
    console.log("el pin es ", pin);
  } else {
    console.log("Parámetro 'pin' no proporcionado.");
  }

  const submit = async (values: InterfaceFourth) => {
    try {
      const pinHash = await sha256(values.pin); // Obtener el hash de la contraseña ingresada
      if (pinHash === pin) {
        navigation.navigate("RegisterOkScreen"); // Navegar a la siguiente pantalla si el PIN es correcto
      } else {
        setError(true); // Establecer estado de error a true
      }
    } catch (error) {
      console.log("Error al verificar la contraseña:", error);
      setError(true); // En caso de error, establecer estado de error a true
    }
  };

  const user = useContext(UsersContext);

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={" "} />
        {user.gender === "M" ? <Confirm_Password_M /> : <Confirm_Password_W />}

        <Formik
          initialValues={INIT_VALUES_FOURTH}
          onSubmit={(values) => submit(values)}
          validationSchema={SCHEMA_FOURTH}
        >
          {({ handleSubmit, isValid, dirty }) => (
            <>
              <View style={styles.formContainer}>
                <View style={styles.formInput}>
                  {INPUTS_FOURTH.map((i) => (
                    <Field key={i.name} {...i} />
                  ))}
                  {error && ( // Mostrar mensaje de error si error es true
                    <Text style={{ color: "red" }}>
                      El PIN ingresado no es correcto.
                    </Text>
                  )}
                </View>
                <View style={styles.formBtn}>
                  <Btn
                    title={LABELS.confirm}
                    theme={isValid && dirty ? "agrayu" : "agrayuDisabled"}
                    onPress={handleSubmit}
                    disabled={!isValid || !dirty}
                  />
                </View>
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeArea>
  );
};
