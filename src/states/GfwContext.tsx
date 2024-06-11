import React, { createContext, useContext, useState } from "react";
import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";
import Toast from "react-native-toast-message";
// Define el contexto de los mapas
const GfwContext = createContext({
  getGfw: (index: any) => {},
  postGfw: (index: any) => {},
  errorGfw: null,
  loadingGfw: false,
  gfwData: [],
  getData: {},
  setPostGFW: (value: any) => {},
  setGetGFW: (value: any) => {},
});

// Define el componente proveedor de status
export const GwfProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado inicial de los mapas
  const [errorGfw, setErrorGfw] = useState(null);
  const [loadingGfw, setLoadingGfw] = useState(false);
  const [gfwData, setGfwData] = useState([]);
  const [getData, setGetData] = useState({});
  const BASE_URL = "https://geip5oadr5.execute-api.us-east-2.amazonaws.com";

  const setPostGFW = (value: any) => {
    setGfwData(value);
  };
  const setGetGFW = (value: any) => {
    setGetData(value);
  };

  // Función para obtenerel status y los kpis de coverage
  const getGfw = async (index: any) => {
    try {
      setLoadingGfw(true);
      setGetData({});
      storage.delete("getGFW");

      const existingGetData = gfwData.findIndex((item) => item.index === index);

      const apiRequest: API_INTERFACE = {
        method: "GET",
        url: `${BASE_URL}/${gfwData[existingGetData].data.listId}`,
        //url: `${BASE_URL}/180`,
      };
      const data = await HTTP(apiRequest);
      console.log("data", data);
      let data_temp_get = getData;
      console.log("data_temp", data_temp_get);

      const existingIndex = data_temp_get.findIndex(
        (item) => item.index === index
      );
      if (existingIndex !== -1) {
        data_temp_get[existingIndex] = { index: index, data: data };
      } else {
        data_temp_get.push({ index: index, data: data });
      }
      setGetData(data_temp_get);
      storage.set("getGFW", JSON.stringify(data_temp_get));
    } catch (error) {
      if (error?.response?.data) {
        const text_error = error.response.data.errors.error;
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors);
        setErrorGfw(errorText);
      } else {
        Toast.show({
          type: "syncToast",
          text1: "INTENTE MAS TARDE",
        });
      }
    } finally {
      setLoadingGfw(false);
      setErrorGfw(null);
    }
  };

  // Función para mandar el poligono a GFW(Global Forest Watch)
  const postGfw = async (index: any) => {
    try {
      const parcels_array = JSON.parse(storage.getString("parcels") || "[]");
      const parcels = parcels_array[index];

      // Verificar si hay polígonos
      if (!parcels || !parcels.polygon) {
        throw new Error("No se encontraron polígonos para enviar a GFW");
      }

      setLoadingGfw(true);

      // Formatear las coordenadas del polígono intercambiando latitud y longitud
      const polygonCoordinates = parcels.polygon
        .map((coordenada) => `${coordenada[1]} ${coordenada[0]}`)
        .join(";");

      const apiRequest = {
        url: `${BASE_URL}/upload`,
        method: "POST",
        payload: {
          coordinates: polygonCoordinates,
          start_date: "2020-01-01",
          end_date: "2024-01-01",
        },
      };

      const data = await HTTP(apiRequest);
      console.log("data", data);
      let data_temp = gfwData;
      console.log("data_temp", data_temp);

      const existingIndex = data_temp.findIndex((item) => item.index === index);
      if (existingIndex !== -1) {
        data_temp[existingIndex] = { index: index, data: data };
      } else {
        data_temp.push({ index: index, data: data });
      }
      setGfwData(data_temp);
      storage.set("postGFW", JSON.stringify(data_temp));
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
        console.log(error);
      }
    } finally {
      setLoadingGfw(false);
      setErrorGfw(null);
    }
  };

  return (
    <GfwContext.Provider
      value={{
        getGfw,
        postGfw,
        loadingGfw,
        errorGfw,
        gfwData,
        getData,
        setPostGFW,
        setGetGFW,
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
