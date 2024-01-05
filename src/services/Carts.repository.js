export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  //#Create

  addCart = async (cart) => {
    const result = await this.dao.addCart(cart);
    return result;
  };

  addProductToCart = async (cid, pid) => {
    const result = await this.dao.addProductToCart(cid, pid);
    return result;
  };

  //#Read
  getAll = async () => {
    const carts = await this.dao.getAll();
    return carts;
  };

  getCartById = async (cid) => {
    const cart = await this.dao.getCartById(cid);
    return cart;
  };

    //#Update
  updateCart = async (cid, cart) => {
    const carts = await this.dao.updateCart(cid, cart);
    return carts;
  };

  updateProductFromCart = async (cid, pid, quantity) => {
    const carts = await this.dao.updateProductFromCart(cid,pid,quantity);
    return carts;
  };

    //#Delete
  deleteProductFromCart = async (cid, pid) => {
    const carts = await this.dao.deleteProductFromCart(cid, pid);
    return carts;
  };

  deleteCart = async (cid) => {
    const carts = await this.dao.deleteCart(cid);
    return carts;
  };
}
