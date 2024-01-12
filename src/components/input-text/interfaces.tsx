import {FieldProps} from 'formik'
import {KeyboardTypeOptions} from 'react-native'

export interface InputTextProps extends FieldProps {
  name: string
  label?: string
  keyboardType?: KeyboardTypeOptions
  placeholder?: string
  preFormate?: 'phone'
  valueInitial?: string
  secureTextEntry?: boolean
  component: <T>(props: T) => JSX.Element
}
