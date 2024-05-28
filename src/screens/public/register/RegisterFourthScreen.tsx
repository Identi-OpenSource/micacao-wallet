import { Field, Formik } from "formik";
import React, { useContext } from "react";
import { View } from "react-native";
import { sha256 } from "react-native-sha256";
import { Password_M, Password_W } from "../../../assets/svg";
import { Btn } from "../../../components/button/Button";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { storage } from "../../../config/store/db";
import { LABELS } from "../../../config/texts/labels";
import { UserDispatchContext, UsersContext } from "../../../states/UserContext";
import {
  INIT_VALUES_FOURTH,
  INPUTS_FOURTH,
  InterfaceFourth,
  SCHEMA_FOURTH,
} from "./Interfaces";
import { Header } from "./RegisterScreen";
import { styles } from "./styles";

interface RegisterFourthScreenProps {
  navigation: any;
}
const RegisterFourthScreen: React.FC<RegisterFourthScreenProps> = ({
  navigation,
}) => {
  const submit = (values: InterfaceFourth) => {
    sha256(values.pin)
      .then((pinHash) => {
        storage.set("security", JSON.stringify({ pin: pinHash }));
        dispatch({ type: "setUser", payload: { ...user, pin: pinHash } });

        navigation.navigate("ConfirmPasswordScreen", { pin: pinHash });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const user = useContext(UsersContext);
  const dispatch = useContext(UserDispatchContext);

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {user.gender == "M" && <Password_M />}
          {user.gender == "W" && <Password_W />}
        </View>
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
export default RegisterFourthScreen;
