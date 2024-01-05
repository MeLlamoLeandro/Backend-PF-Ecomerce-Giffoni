import passport from "passport";

//#JWT
export const passportCall = (strategy) => {
  return async (req, res, next) => {
      passport.authenticate(strategy, function (err, user, info) {
          if (err) return next(err);
          if (!user) {
              req.message = ((info.messages ? info.messages : info.toString()))
              return next();;
          }
          req.user = user;
          next();
      })(req, res, next)
  }
}