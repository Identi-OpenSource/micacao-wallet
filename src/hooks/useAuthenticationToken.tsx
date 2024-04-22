import {useEffect} from 'react'
import Config from 'react-native-config'
import {API_INTERFACE, HTTP} from '../services/api'
import {useAuth} from '../states/AuthContext'
import useInternetConnection from './useInternetConnection'
import {storage} from '../config/store/db'

const useAuthenticationToken = () => {
  const {accessToken, setToken} = useAuth()
  const {isConnected} = useInternetConnection()

  const getToken = async () => {
    if (isConnected && accessToken === null) {
      try {
        const apiRequest: API_INTERFACE = {
          url: `${Config.BASE_URL}/token`,
          method: 'POST',
          payload: {username: Config.USERNAME, password: Config.PASSWORD},
          headers: {'Content-Type': 'multipart/form-data'},
        }
        const data = await HTTP(apiRequest)
        setToken(data.access_token)
        storage.set('accessToken', data.access_token)
      } catch (error) {
        console.log('error', error)
        //setError("Error fetching data");
      } finally {
      }
    }
  }

  useEffect(() => {
    console.log('AccessToken on Use', accessToken)
  }, [accessToken])

  return {getToken}
}

export default useAuthenticationToken
