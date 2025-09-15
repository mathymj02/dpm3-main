//carrito.js

    function mostrarCarrito() {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      let contenedor = document.getElementById("carrito");
      let total = 0;

      if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
      } else {
        contenedor.innerHTML = "";
        carrito.forEach((item, index) => {
          total += item.precio;
          contenedor.innerHTML += `
            <div class="producto">
              <h3>${item.nombre}</h3>
              <p>$${item.precio}</p>
              <button onclick="eliminarProducto(${index})">Eliminar</button>
            </div>
          `;
        });
      }

      document.getElementById("total").innerText = "Total: $" + total;
    }

    function eliminarProducto(index) {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito();
    }

    function vaciarCarrito() {
      localStorage.removeItem("carrito");
      mostrarCarrito();
    }

    function finalizarCompra() {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      if (carrito.length === 0) {
        alert("Tu carrito está vacío ❌");
        return;
      }
      alert("✅ Compra realizada con éxito. ¡Gracias por apoyar al DPM!");
      localStorage.removeItem("carrito");
      mostrarCarrito();
    }

    window.onload = mostrarCarrito;


    //tienda.js

    function agregarAlCarrito(nombre, precio) {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.push({ nombre, precio });
      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(nombre + " agregado al carrito 🛒");
    }

  
  
  
    //index.js

  if(usuario === "admin" && pass === "1234"){
  localStorage.setItem("usuario", "admin");
  window.location.href = "admin.html";
} else {
  localStorage.setItem("usuario", usuario);
  window.location.href = "jugadores.html";
}
