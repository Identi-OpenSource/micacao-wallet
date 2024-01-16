export const formatPin = (pin: string) => {
  /**
   * @author : Braudin Laya
   * @pin : 123-123-1234
   */
  let formattedpin = pin.replace(/\D/g, '')
  if (formattedpin.length > 6) {
    formattedpin = formattedpin.slice(0, 6)
  }
  return formattedpin
}
