import React from 'react'
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../config/themes/default'
import {SafeAreaProps} from './interfaces'
import {BtnIcon} from '../button/Button'
import {NavigationProp} from '@react-navigation/native'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../config/themes/metrics'

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

// Componente Header

export const HeaderActions = (props: InterfaceHeader) => {
  const {navigation, title} = props
  return (
    <View style={styles.header}>
      <BtnIcon
        theme="transparent"
        icon="angle-left"
        size={moderateScale(30)}
        style={{container: styles.btnIcon}}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

interface InterfaceHeader {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  title: string
}

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
})
