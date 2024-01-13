import React, {createContext, useReducer} from 'react'

export interface UserInterface {
  name: string
  phone: string
  pin: string
  isLogin?: boolean
}

export const userInicialState: UserInterface = {
  name: '',
  phone: '',
  pin: '',
  isLogin: false,
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
  const [tasks, dispatch] = useReducer(usersReducer, userInicialState)

  return (
    <UsersContext.Provider value={tasks}>
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
        name: action.payload.name,
        phone: action.payload.phone,
        pin: action.payload.pin,
        isLogin: true,
      }
    }
    case 'login': {
      return {
        ...user,
        name: action.payload.name,
        phone: action.payload.phone,
        pin: action.payload.pin,
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
