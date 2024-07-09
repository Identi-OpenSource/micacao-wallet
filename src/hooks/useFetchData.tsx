/*
 * @hook useFetchData - Hook para obtener datos de las APIs
 */

import {useState, useCallback} from 'react'
import axios, {AxiosError, AxiosRequestConfig} from 'axios'
import Toast from 'react-native-toast-message'
import {storage} from '../config/store/db'

const useFetchData = () => {
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(
    async (url: string, options?: AxiosRequestConfig, isError?: boolean) => {
      setLoading(true)
      try {
        // Configurar los headers predeterminados
        const defaultHeaders = {
          'Content-Type':
            options?.data instanceof FormData
              ? 'multipart/form-data'
              : 'application/json',
        }

        const combinedOptions = {
          ...options,
          headers: {
            ...defaultHeaders,
            ...options?.headers,
          },
        }
        console.log('url', url)
        const response = await axios(url, combinedOptions)
        return response?.data
      } catch (err: any) {
        const axiosError = err as AxiosError
        const errorText = axiosError.response
          ? axiosError.response.status
          : 'genérico'
        !isError &&
          Toast.show({
            type: 'msgToast',
            autoHide: false,
            text1: 'No se pudo obtener los datos\n\n Error: ' + errorText,
          })
        console.log('URL:', url)
        console.log('ERROR => ', err.response?.data)
        return err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return {loading, fetchData}
}

export default useFetchData

export const HEADERS = () => {
  const accessToken = storage.getString('accessToken')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

export const HEADERS_FORM_DATA = {
  'Content-Type': 'multipart/form-data',
}
