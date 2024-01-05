//auth para saber si es user / premium / admin
export const authorization = (roles) => {
    return async (req, res, next) => {
      if (!req.user) {
        return res
          .status(401)
          .send({ status: "error", message: "Unauthorizated" });
      }
      //si el rol del usuario No existe dentro del array de roles que paso por el middleware, no tiene permisos
      if (!roles.includes(req.user.role)) {
        req.logger.warning(`role: ${req.user.role} not autorized`);
        return res
          .status(403)
          .send({ status: "error", message: "No permissions" });
      }
  
      //console.log(`role: ${req.user.role} autorizado`)
      req.logger.info(`role: ${req.user.role} autorized`);
      next();
    };
  };
  