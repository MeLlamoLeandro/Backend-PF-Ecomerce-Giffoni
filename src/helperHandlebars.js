import Handlebars from "handlebars";

Handlebars.registerHelper("calculateSubtotal", (quantity, price) => {
  let result = quantity * price;
  return result.toFixed(2);
});

Handlebars.registerHelper("calculateTotal", (products) => {
  let total = 0;
  products.forEach((item) => {
    total += item.product.price * item.quantity;
  });
  return total.toFixed(2);
});

