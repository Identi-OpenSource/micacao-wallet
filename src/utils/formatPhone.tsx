export const formatPhone = (phone: string) => {
  /**
   * @author : Braudin Laya
   * @phone : 123-123-1234
   */
  let formattedPhone = phone.replace(/\D/g, '') // Elimina cualquier carácter no numérico
  if (formattedPhone.length > 10) {
    formattedPhone = formattedPhone.slice(0, 10) // Si la longitud supera los 10 dígitos, se corta al décimo dígito
  }
  if (formattedPhone.length > 6) {
    formattedPhone = formattedPhone.replace(
      /(\d{3})(\d{3})(\d{1,4})/,
      '$1-$2-$3',
    ) // Inserta un guión después de los primeros 3 y 6 dígitos
  } else if (formattedPhone.length > 3) {
    formattedPhone = formattedPhone.replace(/(\d{3})(\d{1,3})/, '$1-$2') // Inserta un guión después de los primeros 3 dígitos
  }
  return formattedPhone
}
