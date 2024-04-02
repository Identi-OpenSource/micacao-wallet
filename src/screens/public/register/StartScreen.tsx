import React, { useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Woman, Welcome_W, Man } from "../../../assets/svg/index";
import { Btn } from "../../../components/button/Button";
import { LABELS } from "../../../config/texts/labels";
import {
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from "../../../config/themes/default";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../config/themes/metrics";
interface SplashScreenProps {
  navigation: any;
}
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { UsersContext } from "../../../states/UserContext";
const StartScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  [];
  const user = useContext(UsersContext);
  return (
    <SafeArea>
      <View style={styles.container}>
        {user.gender == "W" && (
          <View style={styles.containerWelcome_W}>
            <Welcome_W width={490} height={240} />
          </View>
        )}
        {user.gender == "W" && (
          <View style={styles.containerW_andM}>
            <Woman width={200} height={200} />
          </View>
        )}
        {user.gender == "M" && (
          <View style={styles.containerWelcome_W}>
            <Welcome_W width={490} height={240} />
          </View>
        )}
        {user.gender == "M" && (
          <View style={styles.containerW_andM}>
            <Man width={200} height={200} />
          </View>
        )}
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.continue}
            theme="agrayu"
            onPress={() => navigation.navigate("IamFromScreen")}
          />
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

    backgroundColor: "#F6EEEB",
  },
  formBtn: {
    flex: 1,
    marginLeft: 20,
    /*  borderWidth: 1,
    borderColor: "red", */
    width: "90%",
    justifyContent: "flex-end",
    paddingBottom: verticalScale(MP_DF.xlarge),
    alignItems: "center",
  },
  containerWelcome_W: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  containerW_andM: {
    alignItems: "center",
    marginLeft: 120,
  },
});

export default StartScreen;
