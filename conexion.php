<?php
$host = "127.0.0.1";
$usuario = "root";  
$contrasena = "";   // sin contraseña por defecto
$base_de_datos = "dpm_login";
$conexion = new mysqli("127.0.0.1", "root", "", "dpm_login", 3306);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}
?>
