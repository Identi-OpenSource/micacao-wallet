import {useContext, useEffect} from 'react'
import Config from 'react-native-config'
import {storage} from '../config/store/db'
import {API_INTERFACE, HTTP} from '../services/api'
import {useAuth} from '../states/AuthContext'
import {ConnectionContext} from '../states/ConnectionContext'

const useAuthenticationToken = (setAccessToken: any) => {
  const {accessToken} = useAuth()
  const internetConnection = useContext(ConnectionContext)
  const {isConnected} = internetConnection

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
        setAccessToken(data.access_token)
        storage.set('accessToken', data.access_token)
      } catch (error) {
        console.log('error', error)
        //setError("Error fetching data");
      } finally {
      }
    }
  }

  return {getToken}
}

export default useAuthenticationToken
