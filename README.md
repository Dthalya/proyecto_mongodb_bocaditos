# Proyecto CRUD para Bocaditos Tienda Galletas

Este proyecto es un sistema CRUD para gestionar pedidos, productos y toppings en una tienda de galletas. Está diseñado para desplegarse en la nube utilizando **Render** y conecta con una base de datos alojada en **MongoDB Atlas**. El repositorio del proyecto está alojado en **GitHub**.

---

## Flujo de Trabajo

1. **Creación del Repositorio en GitHub**
   - Se necesita crear un repositorio en una cuenta de `Github` para poder cargar el proyecto hecho en local 
   - Se debe de conectar el repositorio con `Render`

2. **Configuración de la Base de Datos con MongoDB Atlas**
   - Se debe de crear una cuenta en `MongoDb Atlas` para poder configurar la base de datos.
   - Se debe de crear y configurar un cluster en `MongoDB Atlas` para la base de datos de Bocaditos.
   - Se deben de migrar las collections existentes desde la base local utilizando herramientas de mongoBD como `mongodump` y `mongorestore`.

3. **Despliegue del Proyecto en Render**
   - Se debe crear una cuenta en `Render`para conectar con el repositorio.
   - Render se debe de configurar para hacer el deploy de la app desde el repositorio GitHub.

---

## Configuración Paso a Paso

### 1. Creación del Repositorio en GitHub

1. **Crear el repositorio en GitHub**
   - Crear un repositorio desde la cuenta en la pagina [GitHub](https://github.com).

2. **Inicializar el repositorio local** 
    ```bash
    git init
    git add .
    git commit -m "Commit inicial"
    ```

3. **Conectar el repositorio local con GitHub**
    ```bash
    git remote add origin <URL_DEL_REPOSITORIO>
    git branch -M main
    git push -u origin main
    ```

### 2. Configuración de MongoDB Atlas

1. Acceder a la cuenta de la pagina [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

2. **Crear un Cluster**:
   - Crea un cluster nuevo y configura un usuario con los permisos necesarios para manipular la base de datos.

3. **Obtener la URI de conexión**:
   - Con el cluster creado en MongoDB Atlas, hacer click en la opcion `Connect`.
   - Se debe de copiar la URI para establecer la conexion, la URI es como la siguiente.:
     ```
     mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/<nombre_base_de_datos>?retryWrites=true&w=majority
     ```

4. **Migrar Datos Existentes**
   - Se debe de hacer un dump usando `mongodump` para la base de datos local:
     ```bash
     mongodump --db bocaditos_tienda_galletas --out ./backup
     ```
   - Se debe de restaurar la data en MongoDB Atlas usando `mongorestore` con el dump ya creado:
     ```bash
     mongorestore --uri "mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/bocaditos_tienda_galletas" --drop ./backup
     ```

### 3. Deploy del Proyecto en Render

1. **Crear un servicio en Render**:
   - Conectarse a la cuenta de [Render](https://render.com).
   - Para crear la aplicacion hacer click en `New > Web Service`.

2. **Conectar el repositorio de GitHub**:
   - Selecciona el repositorio actual que contiene el proyecto CRUD bocaditos.

3. **Configurar la aplicacion**:
   - En Render, se debe de configurar el servicio agregando una variable de entorno para la base:
     ```
     MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/bocaditos_tienda_galletas
     ```
   - Se debe de especificar ademas el uso de `node app.js` en Render para que ejecute la aplicacion correctamente

4. **Deploy del proyecto**:
   - Una vez finalizada la configuracion adecuada Render empezara a hacer Deploy del proyecto y genera una URL publica para la app.
   - Esta aplicacion es dinamica y cada vez que haya un cambio en el repositorio hara un deploy sobre el ultimo commit realizado.
---


### Archivos importantes
- `models/`: Contiene los archivos `*.js` correspondientes a los esquemas de las Colecciones `Pedido` y `Producto`.
- `app.js`: Archivo principal de la APP donde se definen los EndPoints (GET, POST, PUT).
- `views/`: Contiene las vistas que se deben renderizar para cada pagina de la APP.


## URL de la APP

La app se encuentra ya disponible para probar en la URL:
```
https://bocaditos-mongodb.onrender.com/
```

