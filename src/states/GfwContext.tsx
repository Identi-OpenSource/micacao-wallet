import React, { createContext, useContext, useState } from "react";
import { API_INTERFACE, HTTP } from "../services/api";
import { storage } from "../config/store/db";
// Define el contexto de los mapas
const GfwContext = createContext({
  gfw: [],
  getGfw: (list_id: any) => {},
  postGfw: () => {},
  saveCoverage: (coverage: any) => {},
  saveStatus: (status: any) => {},
  errorGfw: null,
  loadingGfw: false,
  coverage: false,
  status: null,
});

// Define el componente proveedor de status
export const GwfProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado inicial de los mapas
  const [gfw, setGfw] = useState([]);
  const [errorGfw, setErrorGfw] = useState(null);
  const [loadingGfw, setLoadingGfw] = useState(false);

  const [coverage, setCoverage] = useState(false);
  const [status, setStatus] = useState(null);
  const BASE_URL = "https://geip5oadr5.execute-api.us-east-2.amazonaws.com";

  //Funcion para guardar el true o false dela respuesta
  const saveCoverage = (coverage: any) => {
    setCoverage(coverage);
  };
  //Funcion para guardar el status de la petición
  const saveStatus = (status: any) => {
    setStatus(status);
  };
  // Función para obtenerel status y los kpis de coverage
  const getGfw = async (list_id: any) => {
    try {
      setLoadingGfw(true);
      const apiRequest: API_INTERFACE = {
        method: "GET",
        url: `${BASE_URL}/${list_id}`,
      };
      const data = await HTTP(apiRequest);

      console.log("data", data);

      setCoverage(data);
    } catch (error) {
      if (error?.response?.data) {
        const text_error = error.response.data.errors.error;
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors);
        setErrorGfw(errorText);
      } else {
        setErrorGfw(error);
      }
    } finally {
      setLoadingGfw(false);
      setErrorGfw(null);
    }
  };

  // Función para mandar el poligono a GFW(Global Forest Watch)
  const postGfw = async () => {
    const parcels_array = JSON.parse(storage.getString("parcels") || "[]");
    const parcels = parcels_array[0];
    try {
      setLoadingGfw(true);
      const apiRequest: API_INTERFACE = {
        url: `${BASE_URL}/upload`,
        method: "POST",
        payload: {
          polygon_coordinates: parcels.polygon.toString(),
          start_date: "2020-01-01",
          end_date: "2024-01-01",
        },
      };
      const data = await HTTP(apiRequest);
      console.log("data", data);
    } catch (error) {
      console.error("Error en la solicitud POST a GFW:", error);
      if (error?.response?.data) {
        const text_error = error.response.data.errors.error;
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors);
        setErrorGfw(errorText);
      } else {
        setErrorGfw(error);
      }
    } finally {
      setLoadingGfw(false);
      setErrorGfw(null);
    }
  };

  return (
    <GfwContext.Provider
      value={{
        gfw,
        getGfw,
        postGfw,
        saveCoverage,
        saveStatus,
        loadingGfw,
        errorGfw,
        coverage,
        status,
      }}
    >
      {children}
    </GfwContext.Provider>
  );
};

// Custom hook para acceder al estado de los mapas y a la función para obtenerlos
export const useGfwContext = () => {
  const context = useContext(GfwContext);
  if (!context) {
    throw new Error("useMapContext must be used within a GfwProvider");
  }
  return context;
};
