import {useEffect, useState} from 'react'
import {storage} from '../config/store/db'
import useApi from '../hooks/useApi'

type DataType = {
  [key: string]: any
}

const useSyncData = () => {
  const {createProducer} = useApi()
  const [dataToSync, setDataToSync] = useState<DataType>({})
  const [hasDataToSync, setHasDataToSync] = useState<boolean>(false)

  const fetchAllKeysAndSetDataToSync = async () => {
    try {
      // Obtener todas las claves de almacenamiento
      const allKeys = storage.getAllKeys()
      const names = ['parcels', 'user']

      const keys = allKeys.filter(key => names.includes(key))

      // Establecer las claves como datos pendientes para sincronizar
      setDataToSync(
        keys.reduce((acc, key) => {
          const value = JSON.parse(storage.getString(key) || '{}')
          acc[key] = !value.syncUp // Establecer algún valor asociado a la sincronización
          return acc
        }, {} as DataType),
      )
    } catch (error) {
      console.error('Error al obtener las claves de almacenamiento:', error)
    }
  }

  const addToSync = (newData: any, storageKey: string) => {
    try {
      // Agregar datos a la lista de datos pendientes de sincronización
      storage.set(storageKey, newData)

      const storageName = storageKey === 'userSync' ? 'user' : storageKey

      setDataToSync(prevData => ({
        ...prevData,
        [storageName]: !newData.syncUp,
      }))
    } catch (error) {
      console.error('Error al agregar datos a la sincronización:', error)
    }
  }

  const toSyncData = async (key: string) => {
    try {
      switch (key) {
        case 'userSync':
          createProducer(key)
          break

        default:
          break
      }
    } catch (error) {
      console.error('Error al sincronizar datos:', error)
    }
  }

  useEffect(() => {
    console.log('dataToSync', dataToSync)

    const checkDataToSync = () => {
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

  return {hasDataToSync, addToSync, toSyncData}
}

export default useSyncData
