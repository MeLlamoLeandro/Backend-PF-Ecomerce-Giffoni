export const isAuth = (req, res, next) => {
  if (req.user) {
    req.logger.debug("User is authenticated");
    next();
  } else {
    req.logger.warning("User not logged in");
    return res.redirect("/login");
  }
};
