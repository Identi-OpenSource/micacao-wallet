import {useEffect, useState} from 'react'
import NetInfo from '@react-native-community/netinfo'

const useInternetConnection = () => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return {isConnected}
}

export default useInternetConnection
