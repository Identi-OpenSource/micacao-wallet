/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : View of entry point of the application
 */

import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { Card, CheckBox } from "@rneui/themed";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import { Btn } from "../../../components/button/Button";
import { Iamfrom_m, Iamfrom_w } from "../../../assets/svg";
import { imgCO, imgPE } from "../../../assets/imgs";
import { COUNTRY } from "../../../config/const";
import { storage } from "../../../config/store/db";
import { LABELS } from "../../../config/texts/labels";
import {
  BORDER_RADIUS_DF,
  BTN_THEME,
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from "../../../config/themes/default";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../config/themes/metrics";
import { UsersContext } from "../../../states/UserContext";
import { Header } from "./RegisterScreen";

interface CardProps {
  img: ImageSourcePropType;
  title: string;
  value: object;
  selectedCountry: object | null;
  handleCountrySelection: (value: object) => void;
}

export const IamFromScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useContext(UsersContext);
  const [selectedCountry, setSelectedCountry] = useState<object | null>(null);

  const cards = [
    {
      img: imgCO,
      title: COUNTRY.colombia.name,
      value: COUNTRY.colombia,
    },
    {
      img: imgPE,
      title: COUNTRY.peru.name,
      value: COUNTRY.peru,
    },
  ];

  useEffect(() => {
    console.log("user", user);
  }, []);

  const handleCountrySelection = (countryValue: object) => {
    setSelectedCountry(countryValue);
  };

  const submit = () => {
    const user = JSON.parse(storage.getString("user") || "{}");
    storage.set("user", JSON.stringify({ ...user, country: selectedCountry }));
    navigation.navigate("RegisterScreen");
  };

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={""} />
        {user.gender === "M" && <Iamfrom_m />}
        {user.gender === "W" && <Iamfrom_w />}

        <View style={styles.bodyContainer}>
          {cards.map((c, i) => (
            <Card1
              img={c.img}
              title={c.title}
              value={c.value}
              key={i}
              selectedCountry={selectedCountry}
              handleCountrySelection={handleCountrySelection}
            />
          ))}
        </View>
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.continue}
            theme="agrayu"
            onPress={submit}
            disabled={!selectedCountry}
          />
        </View>
      </View>
    </SafeArea>
  );
};

const Card1: React.FC<CardProps> = ({
  img,
  title,
  value,
  selectedCountry,
  handleCountrySelection,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.bodyCardContainerFull}>
      <View style={{ alignItems: "center" }}>
        <Card
          containerStyle={{
            borderRadius: 10,
            width: "100%",
            borderColor: selectedCountry === value ? "#ff5722" : "transparent",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 60,
            }}
            onPress={() => handleCountrySelection(value)}
          >
            <Image source={img} style={styles.img} />
            <Text style={styles.titleCard}>{title}</Text>
            <View style={styles.icon}>
              <CheckBox
                containerStyle={{}}
                checked={selectedCountry === value}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#ff5722"
                onPress={() => handleCountrySelection(value)}
              />
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
  },
  bodyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: MP_DF.xlarge,
  },
  bodyCardContainerFull: {
    width: "100%",
  },
  bodyCard: {
    paddingHorizontal: MP_DF.large,
    paddingVertical: MP_DF.medium,
    backgroundColor: COLORS_DF.white,
    borderRadius: BORDER_RADIUS_DF.medium,
    elevation: 5,
    borderColor: COLORS_DF.cacao,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  titleCard: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS_DF.cacao,
  },
  img: {
    width: horizontalScale(32),
    height: verticalScale(32),
    resizeMode: "contain",
    marginRight: MP_DF.large,
  },
  icon: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
  },
  textA: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(32),
    fontWeight: "700",
    textAlign: "center",
    color: COLORS_DF.cacao,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: "500",
    textAlign: "center",
    color: COLORS_DF.cacao,
  },
  formBtn: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
});

export default IamFromScreen;
