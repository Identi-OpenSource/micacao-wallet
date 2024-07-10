import Config from 'react-native-config'
import {MMKV} from 'react-native-mmkv'

export const storage = new MMKV({
  id: 'mmkv.micacao',
  encryptionKey: Config.KEY_CIFRADO_DB,
})
