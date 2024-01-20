import {ViewProps} from 'react-native'
import {Colors} from '../../config/themes/default'

export interface SafeAreaProps extends ViewProps {
  bg?: Colors
  barStyle?: 'light-content' | 'dark-content' | 'default' | undefined
  isForm?: boolean
}
