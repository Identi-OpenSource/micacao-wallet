import {object, ref, string} from 'yup'
import {REGEX} from '../../../config/const'
import {MSG_ERROR} from '../../../config/texts/erros'
import {InputTextProps} from '../../../components/input-text/interfaces'
import {InputText} from '../../../components/input-text/InputText'
import {LABELS} from '../../../config/texts/labels'

export interface ValuesInterface {
  pin: string
  rePin: string
}

export const INIT_VALUES: ValuesInterface = {
  pin: '',
  rePin: '',
}

export const INPUTS = [
  {
    name: 'pin',
    label: LABELS.pin,
    placeholder: '******',
    keyboardType: 'numeric',
    secureTextEntry: true,
    component: InputText,
  },
  {
    name: 'rePin',
    label: LABELS.rePin,
    placeholder: '******',
    keyboardType: 'numeric',
    secureTextEntry: true,
    component: InputText,
  },
] as InputTextProps[]

export let RegisterSchema = object({
  pin: string()
    .matches(REGEX.pin, {message: MSG_ERROR.pin})
    .required(MSG_ERROR.required),
  rePin: string()
    .oneOf([ref('pin')], MSG_ERROR.rePin)
    .required(MSG_ERROR.required),
})
