import {object, string} from 'yup'
import {REGEX} from '../../../config/const'
import {MSG_ERROR} from '../../../config/texts/erros'
import {InputTextProps} from '../../../components/input-text/interfaces'
import {InputText} from '../../../components/input-text/InputText'
import {LABELS} from '../../../config/texts/labels'

export interface ValuesInterface {
  pin: string
}

export const INIT_VALUES: ValuesInterface = {
  pin: '',
}

export const INPUT = {
  name: 'pin',
  label: LABELS.pin,
  placeholder: '',
  preFormate: 'pin',
  keyboardType: 'numeric',
  autoFocus: true,
  component: InputText,
} as InputTextProps

export let RegisterSchema = object({
  pin: string()
    .matches(REGEX.pin, {message: MSG_ERROR.pin})
    .required(MSG_ERROR.required),
})
