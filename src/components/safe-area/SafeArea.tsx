import React from 'react'
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {COLORS_DF} from '../../config/themes/default'
import {SafeAreaProps} from './interfaces'

export const SafeArea = ({
  isForm = false,
  children,
  ...props
}: SafeAreaProps) => {
  const insets = useSafeAreaInsets()
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

  return isForm ? (
    <View style={styles}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={props.barStyle || 'dark-content'}
      />
      <KeyboardAvoidingView
        behavior={'height'}
        style={{height: Dimensions.get('window').height}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {children}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  ) : (
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
