import React, { createContext, useContext, useState } from "react";
import { API_INTERFACE, HTTP } from "../services/api";
// Define el contexto de los mapas
const MapContext = createContext({
  map: [],
  getMap: () => {},
  districts: [],
  getDistricts: (country_id: any) => {},
  district: null,
  saveDistrict: (district: any) => {},
});

// Define el componente proveedor de mapas
export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado inicial de los mapas
  const [map, setMap] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState(null);
  const BASE_URL_LOCAL = "http://192.168.100.40:3000";

  //Funcion para guardar District

  const saveDistrict = (district: any) => {
    setDistrict(district);
  };
  // Función para obtener los districts
  const getDistricts = async (country_id: any) => {
    try {
      const apiRequest: API_INTERFACE = {
        method: "GET",
        url: `${BASE_URL_LOCAL}/districts?country=${country_id}`,
      };
      const data = await HTTP(apiRequest);

      console.log("data", data);

      setDistricts(data);
    } catch (error) {
      if (error?.response?.data) {
        const text_error = error.response.data.errors.error;
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors);
      } else {
      }
    } finally {
    }
  };

  // Función para obtener los mapas
  const getMap = async () => {
    try {
      const apiRequest: API_INTERFACE = {
        method: "GET",
        url: `${BASE_URL_LOCAL}/maps`,
      };
      const data = await HTTP(apiRequest);

      console.log("data", data);
    } catch (error) {
      if (error?.response?.data) {
        const text_error = error.response.data.errors.error;
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors);
      } else {
      }
    } finally {
    }
  };

  return (
    <MapContext.Provider
      value={{ map, getMap, districts, getDistricts, district, saveDistrict }}
    >
      {children}
    </MapContext.Provider>
  );
};

// Custom hook para acceder al estado de los mapas y a la función para obtenerlos
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};
