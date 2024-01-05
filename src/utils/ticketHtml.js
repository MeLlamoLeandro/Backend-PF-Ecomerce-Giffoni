import { productsService } from "../services/index.js";

export async function generateHtmlForTicket(ticket) {
  const productListHtml = await Promise.all(
    ticket.products.map(async (productItem) => {
      const quantity = productItem.quantity;
      const productId = productItem.product.toString();
      const productDetails = await getProductDetails(productId); // espera a que se resuelva la promesa

      // Genera el HTML de cada producto
      return `
      <tr>
        <td>${productDetails.title}</td>
        <td><img src="${productDetails.thumbnails}" alt="${
        productDetails.title
      }" width="50" /></td>
        <td>${productDetails.price}</td>
        <td>${quantity}</td>
        <td>${productDetails.price * quantity}</td>
      </tr>
    `;
    })
  );

  // Genera el HTML completo del ticket
  const html = `
    <html>
      <head>
        <style>
          /* Agrega estilos CSS según sea necesario */
        </style>
      </head>
      <body>
        <h2>Order Details</h2>
        <p>Order Code: ${ticket.code}</p>
        <p>Amount: $${ticket.amount.toFixed(2)}</p>
        <p>Purchaser: ${ticket.purchaser}</p>
        <table border="1">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${productListHtml.join("")}
          </tbody>
        </table>
        <p>Status: ${ticket.status}</p>
        <p>Purchase Date: ${ticket.purchase_datetime}</p>
      </body>
    </html>
  `;

  return html;
}

async function getProductDetails(productId) {
  const productDetail = await productsService.getProductById(productId);
  return productDetail;
}
