import React from 'react'
import {View, ViewProps, ViewStyle} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {COLORS_DF, MARGIN_DF} from '../../config/themes/default'

export const SafeArea = (props: ViewProps) => {
  const insets = useSafeAreaInsets()
  const {children} = props
  const styles = {
    flex: 1,
    justifyContent: 'space-between',

    // Paddings to handle safe area
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left + MARGIN_DF.medium,
    paddingRight: insets.right + MARGIN_DF.medium,
    backgroundColor: COLORS_DF.lightGray,
  } as ViewStyle

  return <View style={styles}>{children}</View>
}
