import {FieldProps} from 'formik'
import {TextInputProps} from 'react-native'

export interface InputTextProps extends FieldProps, TextInputProps {
  name: string
  ref?: <T>(props: T) => JSX.Element
  label?: string
  valueInitial?: string
  component: <T>(props: T) => JSX.Element
}
