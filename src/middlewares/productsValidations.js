export const checkValidProductFields = (req, res, next) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
   //valido que todos los campos sean obligatorios y correctos
    if (!title) {
        return res
            .status(400)
            .send({ status: "error", message: "The 'title' is a mandatory field" });
    }
    else if (!description) {
        return res
            .status(400)
            .send({
            status: "error",
            message: "The 'description' is a mandatory field",
        });
    }
    else if (!code) {
        return res
            .status(400)
            .send({ status: "error", message: "The 'code' is a mandatory field" });
    }
    else if (!price) {
        return res
            .status(400)
            .send({ status: "error", message: "The 'price' is a mandatory field" });
    }
    else if (!status) {
        return res
            .status(400)
            .send({ status: "error", message: "The 'status' is a mandatory field" });
    }
    else if (!category) {
        return res
            .status(400)
            .send({
            status: "error",
            message: "The 'category' is a mandatory field",
        });
    }
    next();
}