import {useContext} from 'react'
//import Config from "react-native-config";
import {storage} from '../config/store/db'
import {API_INTERFACE, HTTP} from '../services/api'
import {useAuth} from '../states/AuthContext'
import {ConnectionContext} from '../states/_ConnectionContext'
import Toast from 'react-native-toast-message'
import {STORAGE_KEYS} from '../config/const'
const useAuthenticationToken = (
  setAccessToken: any,
  setLoading: any,
  setError: any,
) => {
  const {accessToken} = useAuth()
  const internetConnection = useContext(ConnectionContext)
  const {isConnected} = internetConnection
  const Config = {
    BASE_URL: 'https://api-micacao.dev.identi.digital',
    USERNAME: 'wallet_user',
    PASSWORD: 'wallet_user',
  }

  const getToken = async () => {
    setLoading(true)
    if (isConnected && accessToken === null) {
      try {
        const apiRequest: API_INTERFACE = {
          url: `${Config.BASE_URL}/token`,
          method: 'POST',
          payload: {username: Config.USERNAME, password: Config.PASSWORD},
          headers: {'Content-Type': 'multipart/form-data'},
        }
        const data = await HTTP(apiRequest)
        setAccessToken(data.access_token)
        storage.set(STORAGE_KEYS.accessToken, data.access_token)
      } catch (error) {
        Toast.show({
          type: 'syncToast',
          text1: 'INTENTE MAS TARDE',
        })
      } finally {
        setLoading(false)
      }
    }
  }

  return {getToken}
}

export default useAuthenticationToken
