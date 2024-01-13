import {object, string} from 'yup'
import {REGEX} from '../../../config/const'
import {MSG_ERROR} from '../../../config/texts/erros'
import {InputTextProps} from '../../../components/input-text/interfaces'
import {InputText} from '../../../components/input-text/InputText'
import {LABELS} from '../../../config/texts/labels'

export interface ValuesInterface {
  name: string
  phone: string
}

export const INIT_VALUES: ValuesInterface = {
  name: '',
  phone: '',
}

export const INPUTS = [
  {
    name: 'name',
    label: LABELS.name,
    placeholder: LABELS.name,
    keyboardType: 'default',
    component: InputText,
  },
  {
    name: 'phone',
    label: LABELS.phone,
    placeholder: LABELS.phone,
    preFormate: 'phone',
    keyboardType: 'phone-pad',
    component: InputText,
  },
] as InputTextProps[]

export let RegisterSchema = object({
  name: string()
    .matches(REGEX.namePropio, {message: MSG_ERROR.matches})
    .required(MSG_ERROR.required),
  phone: string()
    .matches(REGEX.phone, {message: MSG_ERROR.matches})
    .required(MSG_ERROR.required),
})
