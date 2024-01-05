const newCart = async () => {
  try {
    if (localStorage.getItem("cart")) {
      return await JSON.parse(localStorage.getItem("cart"));
    } else {
      const response = await fetch("/api/carts/", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      const data = await response.json();
      localStorage.setItem("cart", JSON.stringify(data));

      return data;
    }
  } catch (error) {
    console.log("Error: " + error);
  }
};

const getCartId = async () => {
  try {
    let cart = await newCart();

    return cart.id;
  } catch (error) {
    console.log("Error:" + error);
  }
};

const addProductToCart = async (pid) => {
  try {
    let cid = await getCartId();
    cartButton(cid);
    console.log("Cart id: " + cid);
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Obtén el mensaje de error del cuerpo de la respuesta
      throw new Error(errorMessage); // Lanza un nuevo error con el mensaje recibido
    }

    const data = await response.json();
    console.log("Product added to Cart: " + cid);
    cartAlert(cid);
  } catch (error) {
    userErrorAlert(error.message); // Mostrar error al usuario
    console.log("Error:" + error); // Registrar el error en la consola
  }
};

const cartAlert = async (cid) => {
  Swal.fire({
    title: "<strong>Producto agregado al carrito</strong>",
    icon: "success",
    html: `Podes consultar los productos en el siguiente link:<a href="/carts/${cid}">Ver Carrito</a>`,
    showCloseButton: true,
    showCancelButton: false,
    confirmButtonText: "Continuar comprando",
  });
};

const userErrorAlert = async (err) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: err,
  });
};

// creo el boton del carrito en el dom con el link al carrito creado
const cartButton = async (cid) => {
  try {
    /* let cid = await getCartId(); */
    let cartButton = document.getElementById("cartButton");
    cartButton.innerHTML = `<a class="nav-link" href="/carts/${cid}" title="Cart">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
                              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                              </svg>
                            </a>`;
  } catch (error) {
    console.log("Error:" + error);
  }
};
