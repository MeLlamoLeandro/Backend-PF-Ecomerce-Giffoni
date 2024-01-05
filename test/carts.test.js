import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

let cid;
let cookie;
const pid = "64f8e7a4d2b3ac04a2598f18";
const newProducts = [{ product: "64f8e7a4d2b3ac04a2598f18", quantity: 3 }];
const newQuantity = { quantity: 5 };
const mockUser = {
  email: "tester@mail.com",
  password: "coder123",
};

describe("Testing Router Carts", () => {
  describe("Cart test", () => {
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

    it("the endpoint POST /api/carts/ must create a cart correctly and return his id", async function () {
      const { statusCode, ok, body } = await requester.post("/api/carts/");
      cid = body.id;
      expect(statusCode).to.equal(201);
      expect(body).to.have.property("id");
    });

    it("the enpoint GET /api/carts/:cid must get a cart correctly", async function () {
      const response = await requester.get(`/api/carts/${cid}`);
      expect(response.status).to.equal(200);
      //products is an array
      expect(response.body.products).to.be.an("array");
    });

    it("the endpoint POST /api/carts/:cid/products/:pid must add a product to a cart correctly", async function () {
      const response = await requester
        .post(`/api/carts/${cid}/products/${pid}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(response.status).to.equal(200);
      //chequeo producto dentro del carrito
      const response2 = await requester.get(`/api/carts/${cid}`);
      expect(response2.body.products).to.have.lengthOf(1);
    });
  });
});
