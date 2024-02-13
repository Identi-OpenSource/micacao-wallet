import axios from 'axios'

export interface API_INTERFACE {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  payload?: any
}

export const HTTP = async (api: API_INTERFACE) => {
  const {url, method, payload} = api
  let http

  switch (method) {
    case 'POST':
      http = axios.post(url, payload)
      break
    case 'PUT':
      http = axios.put(url, payload)
      break
    case 'PATCH':
      http = axios.patch(url, payload)
      break
    case 'DELETE':
      http = axios.delete(url)
      break
    default:
      http = axios.get(url)
      break
  }

  return await http
    .then(resp => resp.data)
    .catch(error => {
      console.error('API Error:', error)
    })
}
