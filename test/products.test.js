import { generateOneProduct } from "../src/utils/faker.js";
import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

const pid = "64f8e7a4d2b3ac04a2598f18";
const mockUser = {
  email: "tester@mail.com",
  password: "coder123",
};
let cookie;

describe("Testing Router Products", () => {
  describe("Crud products test", () => {
    before(async function () {
      const response = await requester
        .post("/api/sessions/login")
        .send(mockUser);
      const cookieResult = response.headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
    });
    beforeEach(function () {
      this.timeout(5000);
    });

    it("The endpoint GET /api/products/ must return 10 products correctly", async function () {
      const response = await requester.get(`/api/products`);
      expect(response.status).to.equal(200);
      expect(response.body.products.payload).to.have.lengthOf(10);
    });
    
    it("the endpoint GET /api/products/:pid must return a product correctly", async function () {
      const response = await requester.get(`/api/products/${pid}`);
      expect(response.status).to.equal(200);
      expect(response.body.Product._id).to.be.deep.equal(pid);
    });

    it("the endpoint POST /api/products/ must create a product correctly", async function () {
      const mockProduct = generateOneProduct();

      const response = await requester
        .post("/api/products/")
        .send(mockProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(response.status).to.equal(200);
      expect(response.body.payload).to.be.an("object");
    });
    
    it("the endpoint DELETE /api/products/:pid must delete a product correctly", async function () {
      const mockProduct = generateOneProduct();
      const product = await requester
        .post("/api/products/")
        .send(mockProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(product.status).to.equal(200);

      const response = await requester
        .delete(`/api/products/${product.body.payload._id}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(response.status).to.equal(200);
    });
  });
});
