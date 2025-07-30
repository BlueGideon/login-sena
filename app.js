// Importar el módulo Express
const express = require('express');
// Crear una instancia de la aplicación Express
const app = express();
// Definir el puerto en el que se ejecutará el servidor
const PUERTO = process.env.PORT || 3000;

// Middleware para parsear cuerpos de solicitudes JSON
// Esto es necesario para que Express pueda leer los datos enviados en formato JSON
app.use(express.json());

// Base de datos de usuarios simulada (para simplificar, no usaremos una base de datos real)
// En un escenario real, aquí se usaría MongoDB, PostgreSQL, MySQL, etc.
const usuariosRegistrados = []; // Array para almacenar los usuarios registrados

// --- Rutas de la API ---

// Ruta para el registro de usuarios
// Método POST para enviar datos al servidor
app.post('/registro', (req, res) => {
    // Extraer el correo y la contraseña del cuerpo de la solicitud (del JSON que envía el cliente)
    const { correo, contrasena } = req.body;

    // Verificar si el usuario (correo) ya existe en nuestra base de datos simulada
    const usuarioYaExiste = usuariosRegistrados.find(usuario => usuario.correo === correo);
    if (usuarioYaExiste) {
        // Si el usuario ya existe, enviar un mensaje de error con estado 400 (Bad Request)
        return res.status(400).json({ mensaje: 'Error en el registro: El correo ya está registrado.' });
    }

    // Si el usuario no existe, crearlo y guardarlo en nuestra "base de datos"
    // NOTA IMPORTANTE: En un entorno de producción, las contraseñas DEBEN ser hasheadas
    // antes de ser almacenadas (por ejemplo, usando librerías como bcrypt).
    const nuevoUsuario = { correo, contrasena };
    usuariosRegistrados.push(nuevoUsuario); // Añadir el nuevo usuario al array

    // Enviar una respuesta de éxito con estado 201 (Created)
    console.log('Usuario registrado exitosamente:', nuevoUsuario); // Para depuración en consola del servidor
    res.status(201).json({ mensaje: 'Registro de usuario satisfactorio.' });
});

// Ruta para el inicio de sesión
// Método POST para enviar datos al servidor
app.post('/login', (req, res) => {
    // Extraer el correo y la contraseña del cuerpo de la solicitud
    const { correo, contrasena } = req.body;

    // Buscar al usuario en nuestra "base de datos" simulada que coincida con el correo y la contraseña
    const usuarioEncontrado = usuariosRegistrados.find(
        usuario => usuario.correo === correo && usuario.contrasena === contrasena
    );

    // Verificar si el usuario fue encontrado y si las credenciales coinciden
    if (usuarioEncontrado) {
        // Si la autenticación es correcta, enviar un mensaje de éxito con estado 200 (OK)
        console.log('Inicio de sesión exitoso para:', correo); // Para depuración en consola del servidor
        res.status(200).json({ mensaje: 'Autenticación satisfactoria. ¡Bienvenido!' });
    } else {
        // Si la autenticación falla (credenciales inválidas), enviar un mensaje de error con estado 401 (Unauthorized)
        console.log('Intento de inicio de sesión fallido para:', correo); // Para depuración en consola del servidor
        res.status(401).json({ mensaje: 'Error en la autenticación: Correo o contraseña inválidos.' });
    }
});

// Ruta de ejemplo para una "pantalla" o recurso al que se accede después de un inicio de sesión exitoso.
// En una aplicación real, esta ruta estaría protegida (por ejemplo, con un token de autenticación)
// para asegurar que solo usuarios autenticados puedan acceder.
app.get('/dashboard', (req, res) => {
    // Por simplicidad en este ejemplo, solo enviamos un mensaje.
    // En una aplicación real, aquí se enviarían datos del usuario, se renderizaría una vista, etc.
    res.status(200).json({ mensaje: 'Bienvenido a tu panel de control, has iniciado sesión correctamente!' });
});

// Iniciar el servidor
app.listen(PUERTO, () => {
    console.log(`Servidor de autenticación ejecutándose en http://localhost:${PUERTO}`);
});