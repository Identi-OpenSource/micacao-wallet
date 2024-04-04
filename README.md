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
npm install
```

en el caso de dar error usamos el siguiente comando

```
npm install -f
```

4. A continuación cambiamos el compile de la linea 47 dede ,\node_modules\react-native-os\android\build.gradle'por:

```
implementation
```

5.  A continuación cambiamos el compile de la linea 47 y 48 de ,\node_modules\react-native-tcp\android\build.gradle'por:

```
implementation
```

6. Colocamos la siguientes lineas de codigo en la consola

```
npm install --save-dev rn-nodeify -f
```

desinstalamos

```
npm un react-native-tcp -f
```

volvemos a instalar

```
npm i react-native-tcp -f
```

Desinstalamos

```
npm un install react-native-udp -f
```

Volvemos a instalar

```
npm i react-native-udp -f
```

7. Finalmente iniciamos el proyecto con el siguiente comando

```
react-native run-android
```

8. Ahora colocamos el json de evals en la carpeta de node modules bitcoin-ops y pegamos el archivo
