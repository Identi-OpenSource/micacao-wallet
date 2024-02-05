import {FieldProps} from 'formik'
import {KeyboardTypeOptions, TextInputProps} from 'react-native'

export interface InputTextProps extends FieldProps, TextInputProps {
  name: string
  ref?: <T>(props: T) => JSX.Element
  label?: string
  keyboardType?: KeyboardTypeOptions
  placeholder?: string
  preFormate?: 'phone' | 'pin' | 'decimal'
  valueInitial?: string
  secureTextEntry?: boolean
  component: <T>(props: T) => JSX.Element
}
