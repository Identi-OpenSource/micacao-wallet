import React, {createContext, useReducer} from 'react'

export interface UserInterface {
  name: string
  phone: string
  pin: string
  isLogin?: boolean
  parcel?: any[]
}

export const userInicialState: UserInterface = {
  name: '',
  phone: '',
  pin: '',
  isLogin: false,
  parcel: [],
}

export type UserActions = 'login' | 'logout' | 'getLogin'

export interface userInicialState {
  type: UserActions
  payload: UserInterface
}

export interface ActionsInterface {
  type: UserActions
  payload: UserInterface
}

export const UsersContext = createContext(userInicialState)
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
    case 'logout': {
      return userInicialState
    }

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}
