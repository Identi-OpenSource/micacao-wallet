import {useContext} from 'react'
import Config from 'react-native-config'
import {storage} from '../config/store/db'
import {API_INTERFACE, HTTP} from '../services/api'
import {AuthContext, useAuth} from '../states/AuthContext'
import {UsersContext, parcelContext} from '../states/UserContext'
import {SyncDataContext} from '../states/SyncDataContext'
import useInternetConnection from './useInternetConnection'

const useApi = () => {
  const {setToken} = useAuth()
  const {isConnected} = useInternetConnection()
  const accessToken = useContext(AuthContext)
  const parcel = useContext(parcelContext)
  const syncData = useContext(SyncDataContext)
  const {addToSync} = syncData
  const createProducer = async (key: string) => {
    console.log('createProducer')

    if (isConnected) {
      try {
        const user = JSON.parse(storage.getString(key) || '{}')
        const apiRequest: API_INTERFACE = {
          url: `${Config.BASE_URL}/create_producer`,
          method: 'POST',
          payload: {
            dni: user.dni,
            name: user.name,
            phone: user.phone,
            gender: user.gender == 'M' ? 'MALE' : 'FEMALE',
            countryid: user.country?.code === 'CO' ? 1 : 2,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
        const data = await HTTP(apiRequest)
        console.log('data', data)
        addToSync(JSON.stringify({...user, syncUp: true}), key)
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  const createFarm = async () => {
    const parcel = useContext(parcelContext)
    if (isConnected) {
      try {
        const apiRequest: API_INTERFACE = {
          url: `${Config.BASE_URL}/create_farm`,
          method: 'POST',
          payload: {
            parcel: parcel.nameParcel,
            hectares: parcel.hectares,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
        const data = await HTTP(apiRequest)
        console.log('data', data)
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  return {createProducer, createFarm}
}

export default useApi
