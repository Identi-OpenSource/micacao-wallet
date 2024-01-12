import React from 'react'
import {StatusBar, View, ViewStyle} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {COLORS_DF} from '../../config/themes/default'
import {SafeAreaProps} from './interfaces'

export const SafeArea = (props: SafeAreaProps) => {
  const insets = useSafeAreaInsets()
  const {children} = props
  const styles = {
    flex: 1,
    justifyContent: 'space-between',

    // Paddings to handle safe area
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
    backgroundColor: COLORS_DF[props.bg || 'lightGray'],
  } as ViewStyle

  return (
    <View style={styles}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={props.barStyle || 'dark-content'}
      />
      {children}
    </View>
  )
}
