//carrito
console.log("cargo cart.js");
let products;


async function cargarProductosCarrito() {
  try {
    const result = await fetchCarrito();
    products = result;
    console.log("Productos cargados:", products);
    // operaciones de productos
  } catch (error) {
    console.log("Error: " + error);
  }
}

async function fetchCarrito() {
  const url = `/api/carts/${cartExistId}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.products)
    .catch((error) => {
      console.error("Se ha producido un error al obtener el carrito:", error);
      return null;
    });
}

// Llamada a la función para cargar los productos del carrito
cargarProductosCarrito().then(() => {
  renderProductosCarrito();
});

function totalProductosCarrito() {
  const products = cargarProductosCarrito();
  return products.reduce((total, item) => (total += item.quantity), 0);
}

function totalPagarCarrito() {
  return products
    .reduce((total, item) => (total += item.quantity * item.product.price), 0)
    .toFixed(2);
}

//----------------------------------
//index carrito

function renderProductosCarrito() {
  let salida = "";
  salida += `<table class="table">
      <tr>
      <td colspan="5" class="text-end"><button class="btn btn-warning" onclick="vaciarCarrito('${cartExistId}')">Vaciar Carrito</button></td>
      <tr>`;

  // Recorriendo la respuesta con un bucle for
  if (products) {
    for (let i = 0; i < products.length; i++) {
      const product = products[i].product;
      let quantity = products[i].quantity;
      const pid = product._id;
      const maxStock = product.stock;
      let subtotal = (quantity * product.price).toFixed(2);

      salida += `<tr>
              <td><img src="${product.thumbnails}" alt="${product.title}" width="80" /></td>
              <td>${product.title}</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="decrementarCantidad('${pid}')">-</button>
                <span id="quantity${i}">${quantity}</span>
                <button class="btn btn-secondary btn-sm" onclick="incrementarCantidad('${pid}', ${maxStock})">+</button>
              </td>
              <td>$${subtotal}</td>
              <td class="text-end"><button class="btn btn-warning btn-sm d-none" onclick="eliminarProducto('${pid}');" title="Eliminar Producto">X</button></td>
              </tr>`;
    }

    salida += `<tr>
              <td colspan="4" class="fw-bold">Total a Pagar</td>
              <td class="fw-bold">$${totalPagarCarrito()}</td>
              <td>&nbsp;</td>
              </tr>`;
    salida += `</table>`;
  } else {
    salida = `<div class="alert alert-danger text-center" role="alert">No se agregaron Productos en el Carrito!</div>`;
  }

  document.getElementById("productos").innerHTML = salida;
}

// Funciones para incrementar y decrementar la cantidad de un producto
function incrementarCantidad(productId, maxStock) {
  const productIndex = products.findIndex(
    (item) => item.product._id === productId
  );
  if (products[productIndex].quantity < maxStock) {
    products[productIndex].quantity++;
    renderProductosCarrito();
  }
}

function decrementarCantidad(productId) {
  const productIndex = products.findIndex(
    (item) => item.product._id === productId
  );
  if (products[productIndex].quantity > 1) {
    products[productIndex].quantity--;
    renderProductosCarrito();
  }
}

async function vaciarCarrito(cid) {
  const url = `/api/carts/${cid}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Carrito eliminado con éxito.");
      localStorage.removeItem("cart");
      renderProductosCarrito();
      // Para recargar la página
      location.reload();
    } else {
      throw new Error("Error al eliminar el carrito.");
    }
  } catch (error) {
    console.error(
      "Se ha producido un error al intentar eliminar el carrito:",
      error
    );
  }
}

async function eliminarProducto(pid) {
  const url = `/api/carts/${cartExistId}/products/${pid}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Producto eliminado con éxito.");
      cargarProductosCarrito();
      renderProductosCarrito();
    } else {
      throw new Error("Error al eliminar el producto.");
    }
  } catch (error) {
    console.error(
      "Se ha producido un error al intentar eliminar el producto:",
      error
    );
  }
}

// Función para actualizar el carrito

async function updateCart() {
  const url = `/api/carts/${cartExistId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Puedes agregar otros encabezados según sea necesario
      },
      body: JSON.stringify({ products }), // Asegúrate de que products sea un array con los valores actualizados
    });
    if (response.ok) {
      console.log("Paso 1. Carrito actualizado con éxito.");
      // Realiza más operaciones si es necesario
    } else {
      throw new Error("Error al actualizar el carrito.");
    }
  } catch (error) {
    console.error(
      "Se ha producido un error al intentar actualizar el carrito:",
      error
    );
  }
}

async function purchaseCart() {
  try {
    const email = userEmail;
    const Data = { email: email };

    const url = `/api/carts/${cartExistId}/purchase`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Status ${response.status}, ${errorData.message}`);
    }

    const data = await response.json();
    const ticket = data.payload.ticket;
    const cart = data.payload.cart;

    const orderedProducts = ticket.products;

    let mssg = "";
    orderedProducts.forEach((product) => {
      mssg += `<br> Id ${product.product}: ${product.quantity} unidades`;
    });

    Swal.fire({
      icon: "success",
      title: `ticket: ${ticket.code}`,
      html: `<p>Se completó su orden ${mssg}</p>`,
    });
    console.log("paso 2. compra realizada");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: `${error}`,
    });
  }
}

function cleanCarritoFinal() {
  localStorage.removeItem("cart");
  renderProductosCarrito();
  // Para recargar la página
  location.reload();
}
//---------------
async function actualizarYComprar() {
  try {
    await updateCart();
    await purchaseCart();
    await vaciarCarrito(cartExistId);
  } catch (error) {
    console.error(
      "Se ha producido un error durante la actualización y la compra:",
      error
    );
  }
}
