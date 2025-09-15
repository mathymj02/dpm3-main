<?php
// Datos de conexión
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "dpm_login";

// Conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
  die("Conexión fallida: " . $conn->connect_error);
}

// Recibir datos del login
$usuario = $_POST['usuario'];
$contrasena = $_POST['contrasena'];

// Buscar usuario
$sql = "SELECT * FROM usuarios WHERE correo = '$usuario'";
$resultado = $conn->query($sql);

if ($resultado->num_rows === 1) {
  $fila = $resultado->fetch_assoc();

  // Verificar contraseña encriptada
  if (password_verify($contrasena, $fila['contrasena'])) {
    // Login correcto
    echo "<script>
            alert('¡Bienvenido, {$fila['nombre']}!');
            window.location.href = 'jugadores.html';
          </script>";
  } else {
    // Contraseña incorrecta
    echo "<script>
            alert('Contraseña incorrecta.');
            window.location.href = 'login.html';
          </script>";
  }
} else {
  // Usuario no encontrado
  echo "<script>
          alert('Usuario no encontrado.');
          window.location.href = 'login.html';
        </script>";
}

$conn->close();
?>
