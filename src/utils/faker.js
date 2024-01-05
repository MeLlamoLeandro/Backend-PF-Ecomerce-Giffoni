import { faker } from "@faker-js/faker";

//Mocking whith faker
// Función para generar productos aleatorios

export const generateMockProducts = (quantity) => {
  const products = [];

  for (let i = 0; i < quantity; i++) {
    const product = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code:
        faker.location.countryCode("alpha-2") +
        "-" +
        faker.location.countryCode("numeric"), // 'TJ' +" - "+ '528' ==> TJK - 528
      price: +faker.commerce.price(),
      status: faker.datatype.boolean(),
      stock: Math.floor(Math.random() * 100) + 1,
      category: faker.commerce.productAdjective(),
      thumbnails: [faker.image.avatarLegacy()],
      id: faker.database.mongodbObjectId(),
    };

    products.push(product);
  }

  return products;
};

export const generateOneProduct = () => {
  const mockProductTemp = generateMockProducts(1);
  const mockProduct = { product: mockProductTemp[0] };
  mockProduct.product.owner = "admin";
  delete mockProduct.product.id;
  return mockProduct;
};
