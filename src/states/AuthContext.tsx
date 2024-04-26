import React, {createContext, useEffect, useState} from 'react'
import useAuthenticationToken from '../hooks/useAuthenticationToken'

export interface AuthInterface {
  accessToken?: any
  setAccessToken?: any
  getToken?: any
}

export const authInicialState: AuthInterface = {
  accessToken: null,
}

export type AuthActions = 'getAccessToken'

export interface ActionsInterface {
  type: AuthActions
  payload: AuthInterface
}

export const AuthContext = createContext(authInicialState)
export const AuthDispatchContext = createContext(
  (() => {}) as React.Dispatch<ActionsInterface>,
)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [accessToken, setAccessToken] = useState(null)

  const {getToken} = useAuthenticationToken(setAccessToken)

  useEffect(() => {
    console.log('AccessToken on Context', accessToken)
  }, [accessToken])

  return (
    <AuthContext.Provider value={{accessToken, setAccessToken, getToken}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
