## App MiCacao

## Requerimientos

- Java Development Kit (JDK) versión 17
- Node.js versión 20 o superior
- React Native CLI
  -Solicita el archivo .env
  -Solicitamos el json de Evals

## Instalación

1. Asegúrate de tener React Native instalado en tu sistema. Si aún no lo tienes, sigue las instrucciones en [Instalación de React Native](https://reactnative.dev/docs/environment-setup).
2. Clonar este repositorio:

```
git clone https://github.com/identi-digital/micacao-app.git
```

3. Ejecuta los siguientes comandos para inicializar tu proyecto:

```
npm install --legacy-peer-deps
```

4. A continuación cambiamos el compile de la linea 47 desde \node_modules\react-native-os\android\build.gradle por:

```
implementation
```

5.  A continuación cambiamos el compile de la linea 47 y 48 de \node_modules\react-native-tcp\android\build.gradle por:

```
implementation
```

6. Abrimos 2 terminales y en una ventana colocamos el comando

```
npm start
```

7. Y en la segunda iniciamos el proyecto con el siguiente comando

```
react-native run-android
```

8. Ahora colocamos el archivo  "evals.json" en la carpeta de node_modules/bitcoin-ops y pegamos el archivo

9. Modificar archivos que usan WebAssembly, dejarlos con "async await"