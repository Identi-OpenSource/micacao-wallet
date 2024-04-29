import { Field, Formik } from "formik";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { sha256 } from "react-native-sha256";
import Toast from "react-native-toast-message";
import { Confirm_Password_M, Confirm_Password_W } from "../../../assets/svg";
import { Btn } from "../../../components/button/Button";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { LABELS } from "../../../config/texts/labels";
import { ConnectionContext } from "../../../states/ConnectionContext";
import { useSyncData } from "../../../states/SyncDataContext";
import { UsersContext } from "../../../states/UserContext";
import {
  INIT_VALUES_FOURTH,
  INPUTS_FOURTH,
  InterfaceFourth,
  SCHEMA_FOURTH,
} from "./Interfaces";
import { Header } from "./RegisterScreen";
import { styles } from "./styles";
interface ConfirmPasswordScreenProps {
  navigation: any;
  route: any;
}
const ConfirmPasswordScreen: React.FC<ConfirmPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const pin = route.params?.pin;
  if (pin) {
  } else {
    console.log("Parámetro 'pin' no proporcionado.");
  }

  const submit = async (values: InterfaceFourth) => {
    try {
      const pinHash = await sha256(values.pin);
      if (pinHash === pin) {
        addToSync(JSON.stringify({ ...user }), "userSync");

        if (isConnected) {
          // Sync for User
          toSyncData("userSync");
          // mandar a crear producer
          //:TODO si tiene internet registra user caso contrario muestra error y no pasa
          //
          navigation.navigate("RegisterOkScreen");
        } else {
          Toast.show({
            type: "syncToast",
            text1: "¡Recuerda que necesitas estar conectado a internet !",
          });
        }
      } else {
        Toast.show({
          type: "syncToast",
          text1: "¡El pin es incorrecto !",
        });
      }
    } catch (error) {
      console.log("Error al verificar la contraseña:", error);
    }
  };

  const internetConnection = useContext(ConnectionContext);
  const user = useContext(UsersContext);
  const { isConnected } = internetConnection;
  const { addToSync, toSyncData, loadingSync, dataToSync } = useSyncData();

  useEffect(() => {
    console.log("dataToSync confirm password", dataToSync);

    if (dataToSync.user === false) {
    }
  }, [dataToSync]);
  return (
    <SafeArea bg="isabelline" isForm>
      <Spinner color="#178B83" visible={loadingSync} size={100} />
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
                  {/* {error && ( // Mostrar mensaje de error si error es true
                    <Text style={{ color: "red" }}>
                      El PIN ingresado no es correcto.
                    </Text>
                  )} */}
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

export default ConfirmPasswordScreen;
