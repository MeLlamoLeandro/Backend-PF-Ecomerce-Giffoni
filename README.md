# Coder House - Backend - Ecommerce

## Documentación de la aplicación
### Introducción
Esta aplicación es un backend para una tienda en línea. Permite a los usuarios registrarse, iniciar sesión, ver productos, agregar productos a un carrito y realizar pedidos.

## Instalación

1. Clona este repositorio: `git clone https://github.com/MeLlamoLeandro/Backend-PF-Ecomerce-Giffoni.git`
2. Navega a la carpeta del proyecto: `cd Coder-House-Backend-55535-PF-Ecomerce-Leandro-Giffoni `
3. Instala las dependencias: `npm install`

## Scripts

1. Ejecuta el script de inicio: `npm start` o `npm run start:prod`
    - Este comando inicia la aplicación en entorno de producción
2. Ejecuta el script de desarrollo: `npm run start:dev`
    - Este comando inicia la aplicación en entorno de desarrollo
3. Ejecuta el script de test: `npm run dev`
    - Este comando inicia la aplicación en modo y entorno de desarrollo
4. Accede a la aplicacion localmente en: `http://localhost:8080`.
5. Ejecuta el script de test: `npm run superTest:carts`
    - Este comando ejecuta los tests de la API de carritos
6. Ejecuta el script de test: `npm run superTest:products`
    - Este comando ejecuta los tests de la API de productos
7. Ejecuta el script de test: `npm run superTest:sessions`
    - Este comando ejecuta los tests de la API de sesiones

## Deploy
https://backend-pf-ecomerce-giffoni-production.up.railway.app/


### Views
#### Home
En la vista de inicio presentacion de la aplicacion y botones para acceder a las vistas.

#### /login
En la vista de login se muestra un formulario para iniciar sesión, si el usuario no está registrado, puede acceder al registro desde la vista de login ("Not a Member Yet? Create an Account").
Tambien si no recuerda su contraseña puede recuperarla desde la vista de login ("Forgot your password?").

#### /register
En la vista de registro se muestra un formulario para crear una cuenta, si el usuario ya está registrado, puede acceder al login desde la vista de registro ("Already a Member? Login").

#### /pwforget
En la vista de recuperacion de contraseña se muestra un formulario para recuperar la contraseña, si el usuario ya está registrado, recibirá a su cuenta de correo un link para recuperar la contraseña.

##### /products
En la vista de productos se muestra un listado de todos los productos disponibles, para ver el detalle de un producto se debe seleccionar el boton "View Details" del producto deseado, una vez en la vista de detalle del producto se puede agregar al carrito o volver a la vista de productos.

##### /products/:id
En la vista de detalle de un producto se muestra la informacion del producto seleccionado, se puede agregar al carrito o volver a la vista de productos.

##### /cart/:id
En la vista de carrito se muestra el listado de productos agregados al carrito, se puede eliminar un producto del carrito o realizar un pedido.

#### /profile
En la vista de perfil se muestra la informacion del usuario logueado, se puede subir la documentacion requerida como personal id, prueba de domicilio o estado de cuenta para pasar el rol del usuario a Premium.

#### /chat
En la vista de chat se muestra un chat en tiempo real para que los usuarios puedan comunicarse entre si.

#### /realtimeproducts
En la vista de realtimeproducts se muestra un listado de productos existentes y permite crear nuevos o eliminarlos si el administrador o usuario premium lo desea.

#### /usermanager
En la vista de usermanager se muestra un listado de usuarios existentes y permite eliminarlos si el administrador lo desea o cambiar el rol directamente desde la vista.


## Tecnologías utilizadas
- Node.js
- Express.js
- MongoDB
- Mongoose
- Bcrypt
- Passport.js
- GitHub OAuth
- JWT
- Nodemailer
- Handlebars
- Winston
- Dotenv
- Swagger
- Nodemon
- Supertest
- Faker
- Chai
- Mocha
- Multer
- Bootstrap


## Documentación de la API
### Swagger
- Accede a la documentación de la API en `https://backend-pf-ecomerce-giffoni-production.up.railway.app/api/docs/`

### Endpoints de la API

#### Encuentra ejemplos de los endpoints en la folder `./postman`
---
### Router Sessions

`POST /api/sessions/login` -Inicia sesión con un usuario existente.

`POST /api/sessions/register` -Registra un nuevo usuario.

`GET /api/sessions/logout` -Cierra la sesión del usuario.

`GET /api/sessions/current` -Obtiene el usuario actual.

---
### Router Products

`GET /api/products` -Obtiene una lista de todos los productos.

    params: limit, page, query, sort. Ejemplo: /api/products?limit=n?page=n?query=category:Papelería?sort=asc

`GET /api/products/:pid` -Obtiene un producto por su ID.

`POST /api/products` -Crea un nuevo producto.

`PUT /api/products/:pid` -Actualiza un producto por su ID.

`DELETE /api/products/:pid` -Elimina un producto por su ID.

---
### Router Carts
`POST /api/carts` -Crear un nuevo carrito.

`GET /api/carts/:cid` -Obtiene un carrito por su ID.

`PUT /api/carts/:cid` -Actualiza un carrito por su ID.

`DELETE /api/carts/:cid`
    -Elimina un carrito por su ID.

`POST /api/carts/:cid/products/:pid`
    -Agrega un producto al carrito.

`PUT /api/carts/:cid/products/:pid`
-Actualiza un producto del carrito.

`DELETE /api/carts/:cid/products/:pid`
    -Elimina un producto del carrito.

`POST /api/carts/:cid/purchase`
   -Crea un nuevo pedido con los productos del carrito.

---
### Router Users
 `GET /api/users`
    -Obtiene una lista de todos los usuarios.

 `DELETE /api/users/`
    -Elimina todos los usuarios que no se conectaron en las ultimas 48hs y se envia un mail de notificación.

 `DELETE /api/users/:uid`
    -Elimina un usuario por su ID(email).

 `PUT /api/users/:uid`
    -Actualiza el Rol del usuario por su ID(email).

 `GET /api/users/premium/:uid`
    -Cambia el Rol de User a Premium si tiene subida la documentacion o hace un downgrade de Premium a User segun corresponda.

 `POST /api/users/:uid/documents`
    -Sube un archivo al servidor.

 `GET /api/users/reset/:token`
    -Recibe el token de reseteo de contraseña y lo valida. luego redirecciona a la vista de reseteo de contraseña.

 `POST /api/users/updatePW`
    -Actualiza la contraseña del usuario.

---
### Router Mail
`POST /api/mail/reset`
    -Envia el mail con token para resetear el password.

---
### Router Logger
`GET /api/logger`
    -Obtiene una lista de muestra de logs.

---
### Router Mocking
`GET /api/mocking/mockingproducts`
   -Obtiene una lista de 100 productos de mockeados.

---

## Autor
* **Leandro Giffoni** - *Development* - [MeLlamoLeandro](https://github.com/MeLlamoLeandro)

