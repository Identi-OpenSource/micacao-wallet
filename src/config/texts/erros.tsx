export const MSG_ERROR = {
  400: 'Erro de validación',
  401: 'Não autorizado',
  403: 'Acceso negado',
  404: 'Não encontrado',
  500: 'Erro interno',
  502: 'Bad Gateway',
  503: 'Servio no disponible',
  504: 'Gateway Timeout',
  default: 'Erro desconocido',
  matches: 'Formato invalido',
  namePropio: 'Nombre invalido, letras y espacios',
  dni: 'El DNI o Cédula incorrecto',
  pin: 'El PIN debe tener 6 dígitos',
  rePin: 'El PIN no coincide',
  required: 'Requerido',
  errorGeneric: 'Error desconocido, intente de nuevo',
  minString: (n: number) => `Mínimo ${n} caracteres`,
}
