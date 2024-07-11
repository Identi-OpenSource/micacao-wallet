# App MiCacao

## Requerimientos

- Java Development Kit (JDK) versión 17+
- Node.js versión 20+
- React Native CLI
- Archivo .env (solicítalo)

## Instalación

1. Asegúrate de tener React Native instalado en tu sistema. Si aún no lo tienes, sigue las instrucciones en [Instalación de React Native](https://reactnative.dev/docs/environment-setup).

2. Clonar este repositorio:

```
git clone https://github.com/identi-digital/micacao-app.git
```

3. Instalamos los paquetes de npm:

```
npm install --legacy-peer-deps
```

4. Iniciamos el proyecto

```
npm start -- --reset-cache
```

## Posibles problemas

1. Falta del archivo evals.json.<br><br>Para poder funcionar correctamente, necesitamos el archivo evals.json que se encuentra en la carpeta node_modules/bitcoin-ops pero es posible que al instalar la libreria no este presente el archivo. [Descargar evals.json](https://drive.google.com/file/d/1xHqJq6i3F1_W73EhCGtd5scWgXezXLE5/view?usp=sharing)

2. Compiles por Implementation<br><br>Dependiendo del entorno de desarrollo, puede ser necesario cambiar `compiles` por `implementation` en ciertos archivos build.gradle de librerías o del propio proyecto. Aquí hay algunos ejemplos donde se han encontrado estos cambios necesarios:

- node_modules/react-native-tcp/android/build.gradle (líneas 47 y 48)
- node_modules/react-native-os/android/build.gradle (línea 47)

3. WASM y transaction-js<br><br>La librería transaction-js utiliza métodos que emplean WebAssembly. Aunque WASM es generalmente compatible con los navegadores móviles modernos, puede haber limitaciones y problemas de rendimiento en entornos móviles nativos como React Native. Es recomendable mantener estos métodos con `async/await` y probar cuidadosamente su funcionamiento en tu entorno específico.
