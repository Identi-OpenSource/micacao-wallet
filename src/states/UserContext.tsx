import React, {createContext, useReducer} from 'react'
import {number} from 'yup'

export interface UserInterface {
  name?: string
  dni?: string
  phone?: string
  pin?: string
  isLogin?: boolean
  parcel?: any[]
  syncUp?: boolean
  lastSyncUp?: number
  gender?: string
  country?: any
}
export interface Parcel {
  id?: string
  nameParcel?: string
  hectares?: number
  location?: {
    latitude: number
    longitude: number
  }
  polygon?: any
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
