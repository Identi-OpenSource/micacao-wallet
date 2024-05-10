import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { District_M, District_W } from "../../../assets/svg";
import { Btn } from "../../../components/button/Button";
import { COLORS_DF } from "../../../config/themes/default";
import { useMapContext } from "../../../states/MapContext";
import { UsersContext } from "../../../states/UserContext";

interface Maps {
  navigation: any;
}
const Maps: React.FC<Maps> = ({ navigation }) => {
  const [isFocus, setIsFocus] = useState(false);
  const { districts, getDistricts, district, saveDistrict } = useMapContext();
  const user = useContext(UsersContext);

  useEffect(() => {
    const country_id = user.country?.code === "CO" ? 1 : 2;
    getDistricts(country_id);
  }, [user.country?.code]);

  useEffect(() => {
    // console.log("districts", districts);
  }, [districts]);

  useEffect(() => {
    console.log("district", district);
  }, [district]);

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 25,
          marginBottom: 45,
        }}
      >
        {user.gender === "W" ? <District_W /> : <District_M />}
      </View>
      <View>
        <Dropdown
          style={[
            styles.dropdown,
            isFocus && { borderColor: COLORS_DF.citrine_brown },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemSelect}
          iconStyle={styles.iconStyle}
          data={districts}
          autoScroll
          itemContainerStyle={styles.itemContainer}
          labelField="dist_name"
          valueField="dist_id"
          placeholder={!isFocus ? "Selecciona tu departamento" : "..."}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item: any) => {
            saveDistrict(item);
            setIsFocus(false);
          }}
        />
      </View>
      <View style={styles.formBtn}>
        <Btn
          title={"Continuar"}
          theme="agrayu"
          onPress={() => navigation.navigate("RegisterScreen")}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: COLORS_DF.isabelline,
  },
  dropdown: {
    height: 65,
    backgroundColor: "#fff",
    borderColor: COLORS_DF.citrine_brown,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 34,
  },
  placeholderStyle: {
    fontSize: 20,
  },
  selectedTextStyle: {
    fontSize: 20,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 4023,
    fontSize: 16,
  },
  formBtn: {
    flex: 1,
    marginLeft: 20,
    /*  borderWidth: 1,
    borderColor: "red", */
    width: "90%",
    justifyContent: "flex-end",
    paddingBottom: 20,
    alignItems: "center",
  },
  itemSelect: {
    fontWeight: "bold",
    fontSize: 17,
    color: COLORS_DF.citrine_brown,
  },
  itemContainer: {
    borderColor: COLORS_DF.citrine_brown,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 8,
    borderTopColor: COLORS_DF.citrine_brown,
  },
});
export default Maps;
