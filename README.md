<p align="center">
  <img src="https://static.wixstatic.com/media/ebdd7b_b5544ac1b9d542cb8dfd9ddd84a0609f~mv2.png/v1/fill/w_195,h_61,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/4.png" alt="Descripción de la imagen" width="300" style="background-color: white; border-radius: 10px; padding: 10px;">
</p>

<p align="center">
El proyecto MiCacao busca desarrollar una herramienta de trazabilidad para productores y comercializadores de cacao en Perú y Colombia, garantizando el cumplimiento de la normativa europea sobre productos libres de deforestación.
</p>

# MiCacao App

**MiCacao** es una innovadora aplicación **wallet de trazabilidad** desarrollada en React Native, diseñada para empoderar a los productores de cacao en Colombia y Perú, brindándoles control total sobre su información. La aplicación permite gestionar de manera eficiente todos los aspectos relacionados con la producción de cacao, asegurando el cumplimiento de la normativa europea sobre productos libres de deforestación.

Aunque **MiCacao** está diseñada en React Native, actualmente **solo es compatible con sistemas Android** en sus versiones API level 29 y superiores. Esto asegura que la aplicación funcione de manera óptima en dispositivos Android modernos, garantizando a los usuarios una experiencia estable y eficiente mientras gestionan su información y procesos de producción.

## Funcionalidades Principales

- **Registro de Parcelas**: Los usuarios pueden registrar sus parcelas de cultivo, almacenando información clave sobre la localización y características de cada una.
- **Registro de Polígonos**: Permite la geolocalización precisa de las áreas cultivadas mediante la creación de polígonos que delimitan las parcelas.
- **Solicitud de Certificados de No Deforestación**: Los productores pueden solicitar y gestionar certificados que acrediten la no deforestación, necesarios para cumplir con las normativas europeas.
- **Registro de Ventas**: Los usuarios pueden registrar y rastrear todas las transacciones de venta de cacao, manteniendo un historial completo.
- **Geolocalización de Polígonos**: Ofrece herramientas para la geolocalización exacta de las parcelas cultivadas.
- **Solicitud de Titularidad de Tierra**: Permite a los productores gestionar y solicitar la titularidad legal de sus tierras.
- **Importar y Exportar Data**: Facilita la importación y exportación de datos, permitiendo a los usuarios gestionar su información de manera flexible.
- **Envío de Data para Trazabilidad a Blockchain en la Red OCC**: La aplicación asegura la trazabilidad de los productos al integrar la información de producción en la red blockchain OCC.
- **Operación Offline y Online**: MiCacao puede funcionar tanto en modo offline como online, garantizando que los usuarios puedan sincronizar sus datos con la red blockchain incluso sin conexión a internet.

## Principio Fundamental

El proyecto MiCacao se basa en el principio de que **el usuario es el único dueño de su información**. Esto garantiza la privacidad y seguridad de los datos, permitiendo que los productores gestionen y compartan su información solo cuando lo deseen.

La combinación de funcionalidades avanzadas y un enfoque en la soberanía de los datos hacen de MiCacao una herramienta esencial para los productores de cacao que buscan cumplir con estándares internacionales y acceder a mercados globales. La aplicación representa un avance significativo en la adopción de tecnologías modernas para promover la sostenibilidad y la trazabilidad en la industria del cacao.

## Requerimientos

- Java Development Kit (JDK) versión 17+
- Node.js versión 20+
- React Native CLI
- Archivo .env (solicítalo)

#### Compatibilidad

**MiCacao** está diseñada para funcionar en dispositivos Android con API level 29 y superiores.

## Instalación

1. Asegúrate de tener React Native instalado en tu sistema. Si aún no lo tienes, sigue las instrucciones en [Instalación de React Native](https://reactnative.dev/docs/environment-setup).

2. Clonar este repositorio:

```
git clone https://github.com/identi-digital/micacao-app.git
```

3. Instalación de los paquetes de npm:

```
npm install --legacy-peer-deps
```

4. Iniciación del proyecto

```
npm start -- --reset-cache
```

## Posibles Problemas

1. **Falta del archivo `evals.json`.**  
   Para que la aplicación funcione correctamente, necesitas el archivo `evals.json` que se encuentra en la carpeta `node_modules/bitcoin-ops`. Es posible que al instalar la librería no esté presente el archivo. Puedes crearlo manualmente y agregar el siguiente contenido:

```
{
  "EVAL_NONE": 0,
  "EVAL_STAKEGUARD": 1,
  "EVAL_CURRENCY_DEFINITION": 2,
  "EVAL_NOTARY_EVIDENCE": 3,
  "EVAL_EARNEDNOTARIZATION": 4,
  "EVAL_ACCEPTEDNOTARIZATION": 5,
  "EVAL_FINALIZE_NOTARIZATION": 6,
  "EVAL_CURRENCYSTATE": 7,
  "EVAL_RESERVE_TRANSFER": 8,
  "EVAL_RESERVE_OUTPUT": 9,
  "EVAL_RESERVE_UNUSED": 10,
  "EVAL_RESERVE_DEPOSIT": 11,
  "EVAL_CROSSCHAIN_EXPORT": 12,
  "EVAL_CROSSCHAIN_IMPORT": 13,
  "EVAL_IDENTITY_PRIMARY": 14,
  "EVAL_IDENTITY_REVOKE": 15,
  "EVAL_IDENTITY_RECOVER": 16,
  "EVAL_IDENTITY_COMMITMENT": 17,
  "EVAL_IDENTITY_RESERVATION": 18,
  "EVAL_FINALIZE_EXPORT": 19,
  "EVAL_FEE_POOL": 20,
  "EVAL_NOTARY_SIGNATURE": 21
}
```

2. **Compiles por Implementation.**  
   Dependiendo del entorno de desarrollo, puede ser necesario cambiar `compiles` por `implementation` en ciertos archivos `build.gradle` de librerías o del propio proyecto. Ejemplos donde se han encontrado estos cambios necesarios incluyen:

- `node_modules/react-native-tcp/android/build.gradle` (líneas 47 y 48)
- `node_modules/react-native-os/android/build.gradle` (línea 47)

3. **WASM y `transaction-js`.**  
   La librería `transaction-js` utiliza métodos que emplean WebAssembly (WASM). Aunque WASM es generalmente compatible con los navegadores móviles modernos, puede haber limitaciones y problemas de rendimiento en entornos móviles nativos como React Native. Es recomendable mantener estos métodos con `async/await` y probar cuidadosamente su funcionamiento en tu entorno específico.

## Contribución

Estamos encantados de recibir contribuciones de la comunidad para mejorar **MiCacao**. Si estás interesado en contribuir, aquí te mostramos algunas maneras en las que puedes hacerlo:

- **Informar errores**: Si encuentras un error o problema en la aplicación, por favor, repórtalo a través del [sistema de issues](https://github.com/identi-digital/micacao-app/issues). Asegúrate de proporcionar detalles sobre el problema, cómo reproducirlo y cualquier información adicional que pueda ser útil para corregirlo.

- **Sugerir una característica**: Si tienes una idea para una nueva funcionalidad que podría mejorar la aplicación, abre un issue en el repositorio para discutir tu sugerencia. Nos encantaría escuchar tus ideas y colaborar en su implementación.

- **Respondiendo a los problemas**: Ayuda a la comunidad respondiendo a los problemas abiertos en el repositorio. Si tienes experiencia en la solución de problemas específicos, tus sugerencias y soluciones serán muy apreciadas.

- **Implementación de correcciones de errores y mejoras**: Si deseas corregir un error o implementar una mejora, primero revisa los issues abiertos para ver si alguien más ya está trabajando en ello. Si no es así, crea un issue para anunciar tu intención de trabajar en la corrección o mejora y luego envía un pull request cuando hayas terminado.

¡Gracias por tu interés en contribuir a **MiCacao**! Tu ayuda es invaluable para mejorar la herramienta y apoyar a los productores de cacao en Colombia y Perú.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para obtener detalles completos.

## Aviso de Licencia MIT

El software está proporcionado "tal cual", sin ninguna garantía de ningún tipo. Los autores no son responsables de ningún daño que pueda surgir del uso del software.
