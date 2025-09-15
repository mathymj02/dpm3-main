<?php
// Datos de conexión a MySQL con XAMPP
$servername = "127.0.0.1"; // o "localhost"
$username = "root";        // usuario por defecto
$password = "";            // sin contraseña por defecto
$dbname = "dpm_login";     // nombre de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hay errores de conexión
if ($conn->connect_error) {
  die("Conexión fallida: " . $conn->connect_error);
}

// Capturar datos del formulario
$nombre = $_POST['nombre'];
$correo = $_POST['correo'];
$contrasena = password_hash($_POST['contrasena'], PASSWORD_DEFAULT);

// Verificar si el correo ya existe
$verificarCorreo = "SELECT * FROM usuarios WHERE correo = '$correo'";
$resultado = $conn->query($verificarCorreo);

if ($resultado->num_rows > 0) {
  echo "<script>
          alert('El correo ya está registrado. Intenta con otro.');
          window.location.href = 'registro.html';
        </script>";
} else {
  // Insertar nuevo usuario
  $sql = "INSERT INTO usuarios (nombre, correo, contrasena) VALUES ('$nombre', '$correo', '$contrasena')";

  if ($conn->query($sql) === TRUE) {
    echo "<script>
            alert('Usuario registrado exitosamente.');
            window.location.href = 'login.html';
          </script>";
  } else {
    echo "Error al registrar: " . $conn->error;
  }
}

$conn->close();
?>
