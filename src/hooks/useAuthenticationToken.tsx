import { useEffect, useState } from "react";
import { HTTP, API_INTERFACE } from "../services/api";
import Config from "react-native-config";
import useInternetConnection from "./useInternetConnection";
import { useAuth } from "../states/AuthContext";

const useAuthenticationToken = () => {
  const { accessToken, setToken } = useAuth();
  const { isConnected } = useInternetConnection();

  const getToken = async () => {
    if (isConnected && accessToken === null) {
      try {
        const apiRequest: API_INTERFACE = {
          url: `${Config.BASE_URL}/token`,
          method: "POST",
          payload: { username: "test", password: "test" },
          headers: { "Content-Type": "multipart/form-data" },
        };
        const data = await HTTP(apiRequest);
        setToken(data.access_token);
      } catch (error) {
        console.log("error", error);
        //setError("Error fetching data");
      } finally {
      }
    }
  };

  useEffect(() => {
    console.log("AccessToken on Use", accessToken);
  }, [accessToken]);

  return { accessToken, getToken };
};

export default useAuthenticationToken;
