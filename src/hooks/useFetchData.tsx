/*
 * @hook useFetchData - Hook para obtener datos de las APIs
 */

import {useState, useCallback} from 'react'
import axios, {AxiosError, AxiosRequestConfig} from 'axios'
import Toast from 'react-native-toast-message'

const useFetchData = () => {
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(
    async (url: string, options?: AxiosRequestConfig) => {
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
        const response = await axios(url, combinedOptions)
        return response?.data
      } catch (err: any) {
        const axiosError = err as AxiosError
        const errorText = axiosError.response
          ? axiosError.response.status
          : 'genérico'
        Toast.show({
          type: 'msgToast',
          autoHide: false,
          text1: 'No se pudo obtener los datos\n\n Error: ' + errorText,
        })
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

export const HEADERS = {
  'Content-Type': 'application/json',
}

export const HEADERS_FORM_DATA = {
  'Content-Type': 'multipart/form-data',
}
