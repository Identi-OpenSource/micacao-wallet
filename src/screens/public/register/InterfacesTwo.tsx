import {object, string} from 'yup'
import {REGEX} from '../../../config/const'
import {MSG_ERROR} from '../../../config/texts/erros'
import {InputTextProps} from '../../../components/input-text/interfaces'
import {InputText} from '../../../components/input-text/InputText'
import {LABELS} from '../../../config/texts/labels'

export interface ValuesInterface {
  password: string
  rePassword: string
}

export const INIT_VALUES: ValuesInterface = {
  password: '',
  rePassword: '',
}

export const INPUTS = [
  {
    name: 'password',
    label: LABELS.password,
    placeholder: LABELS.password,
    keyboardType: 'default',
    secureTextEntry: true,
    component: InputText,
  },
  {
    name: 'rePassword',
    label: LABELS.rePassword,
    placeholder: LABELS.rePassword,
    keyboardType: 'default',
    secureTextEntry: true,
    component: InputText,
  },
] as InputTextProps[]

export let RegisterSchema = object({
  password: string()
    .matches(REGEX.phone, {message: MSG_ERROR.matches})
    .required(MSG_ERROR.required),
  rePassword: string()
    .matches(REGEX.phone, {message: MSG_ERROR.matches})
    .required(MSG_ERROR.required),
})
