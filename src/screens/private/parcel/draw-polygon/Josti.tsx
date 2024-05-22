import {useRef} from 'react'
import {PanResponder, StyleSheet, View} from 'react-native'

const Joystick = ({onMove}: {onMove: any}) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        handleMove(gestureState)
      },
      onPanResponderMove: (evt, gestureState) => {
        handleMove(gestureState)
      },
      onPanResponderRelease: () => {
        // Si deseas ejecutar algo al soltar el joystick
        // Por ejemplo, detener el movimiento del mapa.
      },
    }),
  ).current

  const handleMove = (gestureState: any) => {
    let {dx, dy} = gestureState
    const angle = Math.atan2(dy, dx) // Calcular ángulo
    const distance = Math.sqrt(dx * dx + dy * dy) // Calcular distancia

    // Limitar el movimiento máximo del joystick
    const maxDistance = 50
    if (distance > maxDistance) {
      dx = maxDistance * Math.cos(angle)
      dy = maxDistance * Math.sin(angle)
    }

    // Normalizar valores entre -1 y 1
    const normalizedX = dx / maxDistance
    const normalizedY = dy / maxDistance

    // Llamar a la función onMove con los valores normalizados
    onMove(normalizedX, normalizedY)
  }

  return (
    <View style={styles.joystickContainer} {...panResponder.panHandlers}>
      <View style={styles.joystickHandle} />
    </View>
  )
}
const styles = StyleSheet.create({
  joystickContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joystickHandle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
})

export default Joystick
