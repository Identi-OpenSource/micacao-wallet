import React, { createContext, useContext, useState } from "react";
import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";
import { useAuth } from "../states/AuthContext";
// Dedine el contexto de kafe sistemas
const KafeContext = createContext({
  getKafeSistemas: () => {},
  postKafeSistemas: () => {},
  errorKafe: null,
  loadingKafe: false,
  postKafeData: {},
  getKafeData: {},
  setPostKafe: (value: any) => {},
  setGetKafe: (value: any) => {},
});
export const KafeProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();
  const [errorKafe, setErrorKafe] = useState(null);
  const [loadingKafe, setLoadingKafe] = useState(false);
  const [postKafeData, setPostKafeData] = useState({});
  const [getKafeData, setGetKafeData] = useState({});
  const BASE_URL = "http://148.113.174.223/api/v1/pe/land-request/polygon";
  //const BASE_URL = "http://192.168.100.40:3000/submit";
  const GET_BASE_URL = "https://api-micacao.dev.identi.digital";
  const API_KEY =
    "fec9eecf43ac2f75f3f6f3edc70bcaf043729409fc2faeee8ce6821d5666c2e4";
  const KAFE_SISTEMAS_KEY =
    "cFZmeGpSOUdWUUI0UXpYcWc2Y0swaFRMUXM4aDBDMkxPRVRrSnRWc0wwSldoMjR0WXBSZzk5dVNFUzdXYVRrdg==";
  const setPostKafe = (value: any) => {
    setPostKafeData(value);
  };
  const setGetKafe = (value: any) => {
    setGetKafeData(value);
  };
  const getKafeSistemas = async () => {
    const user = JSON.parse(storage.getString("user") || "{}");
    const postKafe = JSON.parse(storage.getString("postKafeData") || "{}");
    try {
      setLoadingKafe(true);

      const apiRequest: API_INTERFACE = {
        method: "GET",
        url: `${GET_BASE_URL}/field_state/${user.dni}}`,
        //url: `${GET_BASE_URL}/field_state/hashdni/10`,
        headers: {
          "kafe-sistemas-key": KAFE_SISTEMAS_KEY,
        },
      };

      const data = await HTTP(apiRequest);
      console.log("data", data);
      setGetKafeData(data);
      storage.set("getKafeData", JSON.stringify(data));
    } catch (error) {
      if (error?.response?.data) {
        const text_error = error.response.data.errors.error;
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors);
        setErrorKafe(errorText);
      } else {
        setErrorKafe(error);
      }
    } finally {
      setLoadingKafe(false);
      setErrorKafe(null);
    }
  };

  const postKafeSistemas = async () => {
    console.log("entre");

    try {
      const user = JSON.parse(storage.getString("user") || "{}");
      const parcels_array = JSON.parse(storage.getString("parcels") || "[]");
      const parcels = parcels_array[0];
      const district = JSON.parse(storage.getString("district") || "{}");

      // Verificar si hay polígonos
      if (!parcels || !parcels.polygon) {
        throw new Error("no se puede");
      }

      setLoadingKafe(true);

      // Formatear las coordenadas del polígono en formato WKT intercambiando latitud y longitud
      const polygonCoordinates = parcels.polygon
        .map((coordenada) => `${coordenada[1]} ${coordenada[0]}`)
        .join(", ");
      const wktPolygon = `POLYGON((${polygonCoordinates}))`;

      const apiRequest = {
        url: `${BASE_URL}`,
        method: "POST",
        payload: {
          dni: user.dni,
          polygon: wktPolygon,
          departamento: district.dist_name,
        },
        headers: {
          "api-key": API_KEY,
        },
      };

      const data = await HTTP(apiRequest);
      console.log("data", data);
      setPostKafeData(data);
      storage.set("postKafeData", JSON.stringify(data));
    } catch (error) {
      console.error("Error en la solicitud POST a KafeSistemas:", error);
      if (error?.response?.data) {
        const text_error = error.response.data.errors.error;
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors);
        setErrorKafe(errorText);
      } else {
        setErrorKafe(error);
      }
    } finally {
      setLoadingKafe(false);
      setErrorKafe(null);
    }
  };

  return (
    <KafeContext.Provider
      value={{
        getKafeSistemas,
        postKafeSistemas,
        loadingKafe,
        errorKafe,
        postKafeData,
        getKafeData,
        setPostKafe,
        setGetKafe,
      }}
    >
      {children}
    </KafeContext.Provider>
  );
};
export const useKafeContext = () => {
  const context = useContext(KafeContext);
  if (!context) {
    throw new Error("useMapContext must be used within a KafeProvider");
  }
  return context;
};
