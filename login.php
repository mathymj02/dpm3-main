<?php
// Conexión a la base de datos
include("conexion.php");

// Obtener datos del formulario
$correo = $_POST['correo'];
$contrasena = $_POST['contrasena'];

// Consulta para buscar el usuario por correo
$sql = "SELECT * FROM usuarios WHERE correo = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

// Verifica si existe el usuario
if ($result->num_rows === 1) {
  $usuario = $result->fetch_assoc();

  // Verifica que la contraseña sea correcta
  if (password_verify($contrasena, $usuario['contrasena'])) {
    echo "<script>
            alert('Bienvenido, {$usuario['nombre']}');
            window.location.href = 'jugadores.html';
          </script>";
  } else {
    echo "<script>
            alert('Contraseña incorrecta');
            window.location.href = 'login.html';
          </script>";
  }

} else {
  echo "<script>
          alert('Correo no encontrado');
          window.location.href = 'login.html';
        </script>";
}

$stmt->close();
$conexion->close();
?>
