import {useEffect, useState} from 'react'
import {storage} from '../config/store/db'
import useApi from '../hooks/useApi'

type DataType = {
  [key: string]: any
}

const useSync = (
  accessToken: string,
  setLoadingSync: any,
  setErrorSync: any,
) => {
  const [dataToSync, setDataToSync] = useState<DataType>({})
  const [hasDataToSync, setHasDataToSync] = useState<boolean>(false)

  useEffect(() => {
    console.log('accessToken:', accessToken)
    console.log('Has data to sync:', hasDataToSync)
  }, [hasDataToSync])

  const fetchAllKeysAndSetDataToSync = async () => {
    try {
      const allKeys = storage.getAllKeys()
      const names = ['user', 'parcels']

      const keys = allKeys.filter(key => names.includes(key))

      // Establecer las claves como datos pendientes para sincronizar
      setDataToSync(
        keys.reduce((acc, key) => {
          const value = JSON.parse(storage.getString(key) || '{}')

          console.log(value.syncUp, key)

          acc[key] = !value.syncUp
          return acc
        }, {} as DataType),
      )
    } catch (error) {
      console.error('Error al obtener las claves de almacenamiento:', error)
    }
  }

  const addToSync = (newData: any, storageKey: string) => {
    try {
      storage.set(storageKey, newData)

      const storageName = storageKey === 'userSync' ? 'user' : storageKey

      newData = JSON.parse(newData)

      setDataToSync(prevData => ({
        ...prevData,
        [storageName]: !newData.syncUp,
      }))
    } catch (error) {
      console.error('Error al agregar datos a la sincronización:', error)
    }
  }

  const {createProducer, createFarm, createSale} = useApi(
    setLoadingSync,
    setErrorSync,
    addToSync,
  )

  const toSyncData = async (key: string) => {
    try {
      switch (key) {
        case 'userSync':
          createProducer(key)
          break

        case 'user':
          createProducer(key)
          break
        case 'createFarm':
          createFarm()

          break
        case 'createSale':
          createSale()
        default:
          break
      }
    } catch (error) {
      console.error('Error al sincronizar datos:', error)
    }
  }

  useEffect(() => {
    const checkDataToSync = () => {
      console.log('checkDataToSync', dataToSync)
      for (const key in dataToSync) {
        if (dataToSync.hasOwnProperty(key)) {
          if (dataToSync[key]) {
            setHasDataToSync(true)
            return
          }
        }
      }
      setHasDataToSync(false)
    }

    checkDataToSync()
  }, [dataToSync])

  useEffect(() => {
    fetchAllKeysAndSetDataToSync()
  }, [])

  return {hasDataToSync, dataToSync, addToSync, toSyncData}
}

export default useSync
