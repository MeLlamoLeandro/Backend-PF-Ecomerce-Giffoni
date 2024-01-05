import { generateMockProducts } from "../utils/faker.js";

const quantity = 100; //cantidad de productos a generar

export const mokingProductsController = async (req, res) => {
  let prod = generateMockProducts(quantity);
  res.send({ status: "success", payload: prod });
};
