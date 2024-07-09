import React from 'react'
import {Modal, StyleSheet, Text, View} from 'react-native'
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  FONT_SIZES,
  MP_DF,
} from '../../config/themes/default'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {Btn} from '../button/Button'

export const Alert = (props: {
  title?: string
  message?: string
  icon?: IconProp
  visible?: boolean
  onVisible?: Function
  iconColor?: string
}) => {
  const {title, message, icon, iconColor, visible, onVisible} = props
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent>
      <View style={styles.modal}>
        <View style={styles.container}>
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              size={64}
              color={iconColor || COLORS_DF.warning}
            />
          )}
          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.msg}>{message}</Text>}
          {onVisible && (
            <View style={styles.btns}>
              <Btn
                title="OK"
                theme="agrayu"
                onPress={() => onVisible(!visible)}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    margin: MP_DF.large,
    padding: MP_DF.large,
    borderRadius: BORDER_RADIUS_DF.medium,
    elevation: 20,
    minHeight: 150,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xslarge,
    textAlign: 'center',
    fontWeight: '500',
    marginVertical: MP_DF.large,
    color: COLORS_DF.cacao,
    lineHeight: FONT_SIZES.xslarge + 10,
  },
  btns: {
    width: '100%',
    marginTop: MP_DF.large,
  },
  msg: {},
})
