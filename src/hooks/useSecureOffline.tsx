import * as SecureStore from 'expo-secure-store'
import {LABELS} from '../config/texts/labels'
import {MSG_ERROR} from '../config/texts/erros'
import {Alert} from 'react-native'

export const useSecureOffline = (key: string) => {
  const save = async (values: any) => {
    await SecureStore.setItemAsync(key, JSON.stringify(values)).catch(() => {
      alertError()
    })
  }

  const get = async () => {
    const data = await SecureStore.getItemAsync(key).catch(() => {
      alertError()
    })
    return data && JSON.parse(data)
  }

  const remove = async () => {
    await SecureStore.deleteItemAsync(key).catch(() => {
      alertError()
    })
  }

  return {
    save,
    get,
    remove,
  }
}

const alertError = () => {
  Alert.alert(LABELS.error, MSG_ERROR.errorGeneric)
}
