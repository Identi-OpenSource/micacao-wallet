import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS_DF } from "../../../config/themes/default";

const Maps = () => {
  const [value, setValue] = useState<string>();
  const [isFocus, setIsFocus] = useState(false);
  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];

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
        <Text
          style={{
            fontSize: 18,
            color: COLORS_DF.citrine_brown,
            fontWeight: "bold",
          }}
        >
          Escoja el mapa de su distrito
        </Text>
      </View>
      <View>
        <Dropdown
          style={[
            styles.dropdown,
            isFocus && { borderColor: COLORS_DF.citrine_brown },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={data}
          autoScroll
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Dropdown 1" : "..."}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 16,
    backgroundColor: COLORS_DF.isabelline,
  },
  dropdown: {
    height: 50,
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
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 4023,
    fontSize: 16,
  },
});
export default Maps;
