import { StyleSheet } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../config/themes/metrics";
import {
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from "../../../config/themes/default";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingTop: 35,
  },
  header: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  btnIcon: {
    alignSelf: "flex-start",
    marginLeft: -6,
  },
  title: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(25),
    fontWeight: "600",
    color: COLORS_DF.citrine_brown,
  },
  formContainer: {
    marginTop: verticalScale(MP_DF.xlarge),
    flex: 1,
  },
  formLabel: {},
  formInput: {
    flex: 1,
  },
  formBtn: {
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
});
