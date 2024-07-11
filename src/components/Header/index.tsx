import React from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import {Header} from '@rneui/themed'
import {Icon} from '@rneui/base'
import {COLORS_DF} from '../../config/themes/default'
import {FONT_FAMILIES} from '../../config/themes/default'
import {useNavigation} from '@react-navigation/native'

// Definición de los tipos de las props
interface HeaderProps {
  label: string
  goBack?: boolean
  goBackNavigation?: any
  backgroundColor?: string // Prop para el color de fondo
  textColor?: string // Prop para el color del texto
}

const HeaderComponent: React.FC<HeaderProps> = ({
  label,
  goBack,
  goBackNavigation,
  backgroundColor = COLORS_DF.isabelline, // Valor por defecto del color de fondo
  textColor = COLORS_DF.citrine_brown, // Valor por defecto del color del texto
}) => {
  const navigation = useNavigation()

  return (
    <Header
      containerStyle={{
        height: 100,
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      statusBarProps={{
        barStyle: 'light-content',
        backgroundColor: backgroundColor,
      }}
      leftComponent={
        goBack && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: 1,
              width: 120,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (goBackNavigation) {
                  goBackNavigation()
                } else {
                  navigation.goBack()
                }
              }}>
              <Icon name="chevron-left" color={textColor} size={50} />
            </TouchableOpacity>
          </View>
        )
      }
      centerComponent={
        <Text
          style={{
            color: textColor,
            fontSize: 18,
            fontFamily: FONT_FAMILIES.primary,
          }}>
          {label}
        </Text>
      }
    />
  )
}

const styles = StyleSheet.create({})

export default HeaderComponent
