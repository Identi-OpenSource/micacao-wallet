import { object, string } from "yup";
import { REGEX } from "../../../config/const";
import { MSG_ERROR } from "../../../config/texts/erros";
import { InputTextProps } from "../../../components/input-text/interfaces";
import { InputText } from "../../../components/input-text/InputText";
import { LABELS } from "../../../config/texts/labels";
import { NavigationProp } from "@react-navigation/native";
import { InputOTP } from "../../../components/input-otp/InputOTP";
import { InputPhone } from "../../../components/input-text/InputPhone";

// interface header
export interface InterfaceHeader {
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  title: string;
}

// first step
export interface InterfaceOne {
  dni: string;
}

export const INIT_VALUES_ONE: InterfaceOne = {
  dni: "",
};

export const INPUTS_ONE = [
  {
    name: "dni",
    label: LABELS.registerDni,
    placeholder: LABELS.dni,
    keyboardType: "numeric",
    autoFocus: true,
    component: InputText,
  },
] as InputTextProps[];

export let SCHEMA_ONE = object({
  dni: string()
    .matches(REGEX.dniPeruOColombia, { message: MSG_ERROR.dni })
    .required(MSG_ERROR.required),
});

// second step
export interface InterfaceTwo {
  phone: string;
}

export const INIT_VALUES_TWO: InterfaceTwo = {
  phone: "",
};

export const INPUTS_TWO = (code: string) =>
  [
    {
      name: "phone",
      label: LABELS.phoneRegister,
      placeholder: LABELS.phone,
      preFormate: "phone",
      keyboardType: "phone-pad",
      code,
      component: InputPhone,
    },
  ] as InputTextProps[];

export let SCHEMA_TWO = object({
  phone: string()
    .matches(REGEX.phone, { message: MSG_ERROR.matches })
    .required(MSG_ERROR.required),
});

// third step
export interface InterfaceThree {
  name: string;
}

export const INIT_VALUES_THREE: InterfaceThree = {
  name: "",
};

export const INPUTS_THREE = [
  {
    name: "name",
    label: LABELS.namePersonal,

    component: InputText,
  },
] as InputTextProps[];

export let SCHEMA_THREE = object({
  name: string()
    .matches(REGEX.namePropio, { message: MSG_ERROR.namePropio })
    .required(MSG_ERROR.required),
});

// fourth step
export interface InterfaceFourth {
  pin: string;
}

export const INIT_VALUES_FOURTH: InterfaceFourth = {
  pin: "",
};

export const INPUTS_FOURTH = [
  {
    name: "pin",
    label: LABELS.pin,
    placeholder: LABELS.pin,
    keyboardType: "numeric",

    component: InputOTP,
  },
] as InputTextProps[];

export let SCHEMA_FOURTH = object({
  pin: string()
    .matches(REGEX.pin, { message: MSG_ERROR.pin })
    .required(MSG_ERROR.required),
});
