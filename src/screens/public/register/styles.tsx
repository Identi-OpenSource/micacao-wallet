import {StyleSheet} from 'react-native'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingTop: verticalScale(MP_DF.medium),
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  btnIcon: {
    alignSelf: 'flex-start',
    marginLeft: -6,
  },
  title: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: COLORS_DF.cacao,
    marginTop: verticalScale(MP_DF.medium),
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
})
