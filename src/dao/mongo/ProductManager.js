import { productModel } from "../models/product.model.js";
import config from "../../config/config.js";

const port = config.port || 8080;

class ProductMongo {
  constructor() {}

  //#Read
  getAll = async (params) => {
    let { limit, page, query, sort } = params;
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    sort = sort ? (sort == "asc" ? 1 : -1) : 0; // 0 = no sort, 1 = asc, -1 = desc

    //recibo querys de la forma ?query=category:Papelería y la convierto en un objeto de la forma {category: "Papelería"}
    if (query) {
      query = query.split(":");
      query = { [query[0]]: query[1] };
    } else {
      query = {};
    }

    let products = await productModel.paginate(query, {
      limit: limit,
      page: page,
      sort: { price: sort },
      lean: true,
    }); //lean:true para que devuelva un objeto plano y no un documento de mongoose

    let status = products ? "success" : "error";

    let prevLink = products.hasPrevPage
      ? `http://localhost:${port}/products?limit=${limit}&page=${products.prevPage}`
      : null;
    let nextLink = products.hasNextPage
      ? `http://localhost:${port}/products?limit=${limit}&page=${products.nextPage}`
      : null;

    products = {
      status: status,
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    };

    return products;
  };

  getProductById = async (id) => {
    if (this.validateId(id)) {
      return (await productModel.findOne({ _id: id }).lean()) || null;
    } else {
      console.log("Not found!");

      return null;
    }
  };

  //#Create
  addProduct = async (product) => {
    try {
      const result = await productModel.create(product);
      return result;
    } catch (error) {
      throw error;
    }
  };

  getProductOwner= async (pid) => {
    try {
      const result = await productModel.findById(pid);
      return result.owner;
    } catch (error) {
      throw error;
    }
  };

  //#Update
  updateProduct = async (id, product) => {
    try {
      if (this.validateId(id)) {
        if (await this.getProductById(id)) {
          await productModel.updateOne({ _id: id }, product);
          console.log("Product updated!");
          return true;
        } else {
          console.error(`The product id: ${id} does not exist`);
          return false;
        }
      } else {
        console.error(`The id: ${id} is not a Mongo valid id`);
        return false;
      }
    } catch (error) {
      console.log("Not found!");

      return false;
    }
  };

  //#Delete
  deleteProduct = async (pid) => {
    try {
      const result = await productModel.findByIdAndDelete(pid);
      return result;
    } catch (error) {
      throw error;
    }
  };

  //#Auxiliares
  async validateCode(code) {
    return (await productModel.findOne({ code: code })) || false;
  }

  validateId(id) {
    return id.length === 24 ? true : false; // 24 es la cantidad de caracteres que tiene un id de mongo, entonces valido esto para saber si es un id de mongo o no
  }
}

export default ProductMongo;
