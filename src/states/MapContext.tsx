import React, {createContext, useContext, useState} from 'react'
import Toast from 'react-native-toast-message'
import {API_INTERFACE, HTTP} from '../services/api'
import {useAuth} from './AuthContext'

export interface MapInterface {
  errorMap?: any
}

export const mapInicialState: MapInterface = {
  errorMap: null,
}

// Define el contexto de los mapas
const MapContext = createContext({
  map: [],
  getMap: () => {},
  districts: [],
  getDistricts: (country_id: any) => {},
  getDistrict: (country_id: any) => {},
  district: null,
  saveDistrict: (district: any) => {},
  saveDistricts: (districts: any) => {},
  loadingMap: false,
  errorMap: mapInicialState.errorMap,
})

// Define el componente proveedor de mapas
export const MapProvider = ({children}: {children: React.ReactNode}) => {
  // Estado inicial de los mapas
  const [map, setMap] = useState([])
  const [errorMap, setErrorMap] = useState(null)
  const [loadingMap, setLoadingMap] = useState(false)
  const [districts, setDistricts] = useState([])
  const [district, setDistrict] = useState(null)
  const {accessToken} = useAuth()
  /*   const BASE_URL_LOCAL = "http://192.168.100.40:3000"; */
  const BASE_URL = 'https://api-micacao.dev.identi.digital'

  const saveDistricts = (districts: any) => {
    setDistricts(districts)
  }
  const getDistrict = (value: any) => {
    setDistricts(value)
  }
  //Funcion para guardar District
  const saveDistrict = (district: any) => {
    setDistrict(district)
  }
  // Función para obtener los districts
  const getDistricts = async (country_id: any) => {
    try {
      setLoadingMap(true)
      const apiRequest: API_INTERFACE = {
        method: 'GET',
        url: `${BASE_URL}/districts/${country_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }

      const data = await HTTP(apiRequest)
      setDistricts(data)
      // storage.set("getDistrict", JSON.stringify(data));
    } catch (error) {
      if (error?.response?.data) {
        const text_error = error.response.data.errors.error
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors)
        setErrorMap(errorText)
      } else {
        Toast.show({
          type: 'syncToast',
          text1: 'No se escogio el distrito correctamente',
        })
      }
    } finally {
      setLoadingMap(false)
      setErrorMap(null)
    }
  }

  // Función para obtener los mapas
  const getMap = async () => {
    try {
      setLoadingMap(true)
      const apiRequest: API_INTERFACE = {
        method: 'GET',
        url: `${BASE_URL}/coordinates/${district.dist_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      const data = await HTTP(apiRequest)

      setMap(data)
    } catch (error) {
      if (error?.response?.data) {
        const text_error = error.response.data.errors.error
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors)
        setErrorMap(errorText)
      } else {
        Toast.show({
          type: 'syncToast',
          text1: 'No se escogio el distrito correctamente',
        })
      }
    } finally {
      setLoadingMap(false)
      setErrorMap(null)
    }
  }

  return (
    <MapContext.Provider
      value={{
        map,
        getMap,
        districts,
        getDistricts,
        getDistrict,
        district,
        saveDistrict,
        saveDistricts,
        loadingMap,
        errorMap,
      }}>
      {children}
    </MapContext.Provider>
  )
}

// Custom hook para acceder al estado de los mapas y a la función para obtenerlos
export const useMapContext = () => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider')
  }
  return context
}
