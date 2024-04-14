// DataService.ts
import { API_INTERFACE, HTTP } from "../index";

// Función para obtener datos de la API
export const fetchData = async (): Promise<any> => {
  const apiConfig: API_INTERFACE = {
    url: "http://micacao-qa.us-east-2.elasticbeanstalk.com/micacao-api",
    method: "GET",
  };

  try {
    const responseData = await HTTP(apiConfig);
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Función para enviar datos a la API
export const postData = async (data: any): Promise<any> => {
  const apiConfig: API_INTERFACE = {
    url: "http://micacao-qa.us-east-2.elasticbeanstalk.com/micacao-api",
    method: "POST",
    payload: data,
  };

  try {
    const response = await HTTP(apiConfig);
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
