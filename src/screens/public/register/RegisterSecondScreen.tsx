import { Field, Formik } from "formik";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { Cellphone_M, Cellphone_W } from "../../../assets/svg";
import { Btn } from "../../../components/button/Button";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { LABELS } from "../../../config/texts/labels";
import { UserDispatchContext, UsersContext } from "../../../states/UserContext";
import {
  INIT_VALUES_TWO,
  INPUTS_TWO,
  InterfaceTwo,
  SCHEMA_TWO,
  SCHEMA_CO,
  SCHEMA_PE,
} from "./Interfaces";
import { Header } from "./RegisterScreen";
import { styles } from "./styles";

interface RegisterSecondScreenProps {
  navigation: any;
}

const RegisterSecondScreen: React.FC<RegisterSecondScreenProps> = ({
  navigation,
}) => {
  const user = useContext(UsersContext);
  const dispatch = useContext(UserDispatchContext);

  useEffect(() => {
    console.log(user.country);
  }, []);

  const submit = (values: InterfaceTwo) => {
    const phone = values.phone;

    dispatch({
      type: "setUser",
      payload: {
        ...user,
        phone,
      },
    });

    navigation.navigate("RegisterThirdScreen");
  };

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={""} />
        {user.gender == "M" && <Cellphone_M />}
        {user.gender == "W" && <Cellphone_W />}
        <Formik
          initialValues={INIT_VALUES_TWO}
          onSubmit={(values) => submit(values)}
          validationSchema={
            user?.country?.code === "CO" ? SCHEMA_CO : SCHEMA_PE
          }
        >
          {({ handleSubmit, isValid, dirty }) => (
            <>
              <View style={styles.formContainer}>
                <View style={styles.formInput}>
                  {INPUTS_TWO(user?.country?.phoneCode).map((i) => (
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

export default RegisterSecondScreen;
