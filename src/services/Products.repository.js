export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async (params) => {
    const result = await this.dao.getAll(params);
    return result;
  };

  addProduct = async (product) => {
    const result = await this.dao.addProduct(product);
    return result;
  };

  getProductById = async (pid) => {
    const result = await this.dao.getProductById(pid);
    return result;
  };

  updateProduct = async (pid, update) => {
    const result = await this.dao.updateProduct(pid, update);
    return result;
  };

  deleteProduct = async (pid) => {
    const result = await this.dao.deleteProduct(pid);
    return result;
  };

  getProductOwner = async (pid) => {
    const result = await this.dao.getProductOwner(pid);
    return result;
  }
}
