import React, { useContext } from "react";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { View } from "react-native";
import { Btn } from "../../../components/button/Button";
import { TEXTS } from "../../../config/texts/texts";
import { UsersContext } from "../../../states/UserContext";
import { Field, Formik } from "formik";
import {
  INIT_VALUES_TWO,
  INPUTS_TWO,
  InterfaceTwo,
  SCHEMA_TWO,
} from "./Interfaces";
import { LABELS } from "../../../config/texts/labels";
import { styles } from "./styles";
import { ScreenProps } from "../../../routers/Router";
import { Header } from "./RegisterScreen";
import { storage } from "../../../config/store/db";
import { Cellphone_M, Cellphone_W } from "../../../assets/svg";
export const RegisterSecondScreen = ({
  navigation,
}: ScreenProps<"RegisterSecondScreen">) => {
  const user = useContext(UsersContext);
  const storedUser = JSON.parse(storage.getString("user") || "{}");

  const userInfo = Object.keys(storedUser).length > 0 ? storedUser : user;

  const submit = (values: InterfaceTwo) => {
    const phone = userInfo?.country?.phoneCode + "-" + values.phone;
    storage.set("user", JSON.stringify({ ...userInfo, phone }));
    navigation.navigate("RegisterThirdScreen");
  };

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={""} />
        {user.gender == "M" && <Cellphone_M />}
        {user.gender == "W" && <Cellphone_W />}
        <Formik
          initialValues={INIT_VALUES_TWO}
          onSubmit={(values) => submit(values)}
          validationSchema={SCHEMA_TWO}
        >
          {({ handleSubmit, isValid, dirty }) => (
            <>
              <View style={styles.formContainer}>
                <View style={styles.formInput}>
                  {INPUTS_TWO(userInfo?.country?.phoneCode).map((i) => (
                    <Field key={i.name} {...i} />
                  ))}
                </View>
                <View style={styles.formBtn}>
                  <Btn
                    title={LABELS.next}
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
