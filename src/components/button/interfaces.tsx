import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export const BTN_THEME = {
  primary: "primary",
  secondary: "secondary",
  white: "white",
  warning: "warning",
  transparent: "transparent",
  agrayu: "agrayu",
  agrayuDisabled: "agrayuDisabled",
};

export type BTN_THEME_DF = keyof typeof BTN_THEME;

export type BTN_THEME_ICON_DF = keyof typeof BTN_THEME;

export interface ButtonProps {
  title?: string;
  theme?: BTN_THEME_DF;
  onPress: () => void;
  disabled?: boolean;
  style?: BtnProps;
  icon?: string;
  props?: string;
}

export interface ButtonIconProps {
  theme?: BTN_THEME_DF;
  onPress: () => void;
  disabled?: boolean;
  style?: BtnProps;
  icon: IconProp | string;
  iconColor?: string;
  size?: number;
}

export interface BtnProps {
  containerPrincipal?: StyleProp<ViewStyle>;
  container?: StyleProp<ViewStyle>;
  label?: StyleProp<TextStyle>;
  icon?: StyleProp<TextStyle>;
  iconColor?: string;
  const?: {
    opacity?: number;
    color?: string;
  };
}
