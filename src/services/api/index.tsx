import axios, { AxiosRequestConfig } from "axios";

export interface API_INTERFACE {
  url: any;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  payload?: any;
  headers?: Record<string, string>;
}

export const HTTP = async (api: API_INTERFACE) => {
  const { url, method, payload, headers } = api;

  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    data: payload,
    headers: headers || {},
  };

  try {
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error; // Relanzar el error para que el llamador lo maneje
  }
};
