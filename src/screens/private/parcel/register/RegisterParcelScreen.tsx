import { Card } from "@rneui/base";
import React, { useContext, useEffect, useState } from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { ParcelColor } from "../../../../assets/svg";
import { SafeArea } from "../../../../components/safe-area/SafeArea";
import {
  COLORS_DF,
  DWH,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from "../../../../config/themes/default";
import { UserInterface, UsersContext } from "../../../../states/UserContext";
const { width, height } = Dimensions.get("window");

interface RegisterParcelScreenProps {
  navigation: any;
}

const RegisterParcelScreen: React.FC<RegisterParcelScreenProps> = ({
  navigation,
}) => {
  const user: UserInterface = useContext(UsersContext);
  const [ejecutado, setEjecutado] = useState(false);
  useEffect(() => {
    if (!ejecutado) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        }
      );

      setEjecutado(true);

      return () => {
        backHandler.remove();
      };
    }
  }, [ejecutado]);

  return (
    <SafeArea bg="isabelline">
      <View style={styles.container}>
        <Profile {...user} />
        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterOneScreen")}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: height * 0.42,
            marginTop: 25,
          }}
        >
          <Card
            containerStyle={{
              width: "95%",
              height: height * 0.42,
              elevation: 5,
              borderRadius: 7,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ParcelColor style={styles.svg} />
            <Text style={styles.subTitle}>Registra tu parcela</Text>
          </Card>
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
};

const Profile = ({ name }: UserInterface) => {
  const firstName = name.split(" ")[0];
  return <Text style={styles.textName}>Hola {firstName}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: MP_DF.large,
    paddingVertical: 40,
  },
  title: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "700",
    color: COLORS_DF.citrine_brown,
    textAlign: "center",
  },
  containerImg: {
    marginTop: MP_DF.xxlarge * 1.5,
    width: DWH.width * 0.8,
    height: DWH.height * 0.4,
    resizeMode: "contain",
  },
  subTitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xslarge,
    fontWeight: "700",
    color: COLORS_DF.citrine_brown,
    marginHorizontal: MP_DF.medium,

    textAlign: "center",
  },
  textName: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    fontSize: 30,
  },
  btn: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    marginTop: MP_DF.xxlarge,
  },
  svg: {
    marginLeft: 20,
  },
});

export default RegisterParcelScreen;
