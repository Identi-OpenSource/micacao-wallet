import {object, string} from 'yup'
import {REGEX} from '../../../config/const'
import {MSG_ERROR} from '../../../config/texts/erros'
import {InputTextProps} from '../../../components/input-text/interfaces'
import {InputText} from '../../../components/input-text/InputText'
import {LABELS} from '../../../config/texts/labels'

// first step
export interface InterfaceOne {
  dni: string
}

export const INIT_VALUES_ONE: InterfaceOne = {
  dni: '',
}

export const INPUTS_ONE = [
  {
    name: 'dni',
    label: LABELS.registerDni,
    placeholder: LABELS.dni,
    keyboardType: 'numeric',
    autoFocus: true,
    component: InputText,
  },
] as InputTextProps[]

export let SCHEMA_ONE = object({
  dni: string()
    .matches(REGEX.dniPeruOColombia, {message: MSG_ERROR.dni})
    .required(MSG_ERROR.required),
})

// second step
export interface InterfaceTwo {
  phone: string
}

export const INIT_VALUES_TWO: InterfaceTwo = {
  phone: '',
}

export const INPUTS_TWO = [
  {
    name: 'phone',
    label: LABELS.phoneRegister,
    placeholder: LABELS.phone,
    preFormate: 'phone',
    keyboardType: 'phone-pad',
    component: InputText,
  },
] as InputTextProps[]

export let SCHEMA_TWO = object({
  phone: string()
    .matches(REGEX.phone, {message: MSG_ERROR.matches})
    .required(MSG_ERROR.required),
})

// third step
export interface InterfaceThree {
  pin: string
}

export const INIT_VALUES_THREE: InterfaceThree = {
  pin: '',
}

export const INPUTS_THREE = [
  {
    name: 'pin',
    label: LABELS.pin,
    placeholder: LABELS.pin,
    keyboardType: 'numeric',
    component: InputText,
  },
] as InputTextProps[]

export let SCHEMA_THREE = object({
  pin: string()
    .matches(REGEX.pin, {message: MSG_ERROR.pin})
    .required(MSG_ERROR.required),
})
