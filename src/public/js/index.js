console.log("cargo index.js");
let cartExistId = "";
let cart = {};
let userEmail=""
let userRole = "";

// obtengo el email del usuario
document.addEventListener("DOMContentLoaded", function () {
  const userDiv = document.querySelector(".container");
  userEmail = userDiv.dataset.userEmail;
  userRole = userDiv.dataset.userRole;
  console.log(userEmail);
  console.log(userRole)
});



const ifCartExist = async () => {
  try {
    if (localStorage.getItem("cart")) {
      const cartData = await JSON.parse(localStorage.getItem("cart"));
      cartExistId = cartData.id;
      console.log("Cart id: " + cartExistId);
      cartButton(cartExistId);
    }
  } catch (error) {
    console.log("Error: " + error);
  }
};

// creo el boton del carrito en el dom con el link al carrito correspondiente
const cartButton = async (cid) => {
  try {
    let cartButton = document.getElementById("cartButton");
    cartButton.innerHTML = `<a class="btn btn-success" href="/carts/${cid}" title="Cart --> ${cid}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                              </a>`;
  } catch (error) {
    console.log("Error:" + error);
  }
};

ifCartExist();
