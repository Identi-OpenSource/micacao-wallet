import React, {createContext, useReducer} from 'react'

export interface UserInterface {
  name?: string
  dni?: string
  phone?: string
  pin?: string
  isLogin?: boolean
  parcel?: Parcel[]
  sales?: any[]
  syncUp?: boolean
  lastSyncUp?: number
  gender?: string
  country?: any
}
export interface Parcel {
  name: string
  id: string
  nameParcel?: string
  hectares?: number
  location?: {
    latitude: number
    longitude: number
  }
  polygon?: any
}
export interface saleInterface {
  typeCacao?: string
  kgCacao?: string
  month?: string
}
export const userInicialState: UserInterface = {
  name: '',
  dni: '',
  phone: '',
  pin: '',
  parcel: [],
  syncUp: false,
  isLogin: false,
}

export const ParcelState: Parcel = {
  nameParcel: '',
  hectares: 0,
}
export const CacaoState: saleInterface = {
  typeCacao: '',
  kgCacao: '',
  month: '',
}

export type UserActions = 'login' | 'logout' | 'getLogin' | 'setUser'

export interface userInicialState {
  type: UserActions
  payload: UserInterface
}

export interface ActionsInterface {
  type: UserActions
  payload: UserInterface
}

export const UsersContext = createContext(userInicialState)
export const parcelContext = createContext(ParcelState)
export const CacaoContext = createContext(CacaoState)
export const UserDispatchContext = createContext(
  (() => {}) as React.Dispatch<ActionsInterface>,
)

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, dispatch] = useReducer(usersReducer, userInicialState)

  return (
    <UsersContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UsersContext.Provider>
  )
}

export const usersReducer = (user: UserInterface, action: ActionsInterface) => {
  switch (action.type) {
    case 'getLogin': {
      return {
        ...user,
        ...action.payload,
        isLogin: true,
      }
    }
    case 'login': {
      return {
        ...user,
        ...action.payload,
        isLogin: true,
      }
    }
    case 'setUser': {
      return {
        ...action.payload,
      }
    }
    case 'logout': {
      return userInicialState
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}
