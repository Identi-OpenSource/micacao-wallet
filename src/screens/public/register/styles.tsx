import {StyleSheet} from 'react-native'
import {
  COLORS_DF,
  DWH,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../config/themes/default'

export const styles = StyleSheet.create({
  container: {
    padding: MP_DF.large,
  },
  title: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS_DF.primary,
    paddingVertical: MP_DF.large,
  },
  subtitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS_DF.primary,
  },
  containerForm: {
    paddingVertical: MP_DF.large,
    marginTop: MP_DF.large,
    height: DWH.height * 0.6,
  },
  containerBtn: {},
})
