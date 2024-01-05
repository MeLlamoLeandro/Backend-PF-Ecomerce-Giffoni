import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

import { userModel } from "../dao/models/user.model.js";
import { usersService } from "../services/index.js";
import { cookieExtractor } from "../utils/jwt.js";
import { createHash, isValidPassword } from "../utils/bycrypt.js";

import config from "../config/config.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const PRIVATE_KEY = config.JWTPrivateKey;

// Configuración de la estrategia local
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          let user = await usersService.getUserByEmail(username);

          if (user) {
            console.log(`User ${email} already exists`);
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: await createHash(password),
            /*  role: "user", */
          };

          if (username == "adminCoder@coder.com") {
            newUser.role = "admin";
          }

          //Guardo el usuario en la base de datos

          let result = await usersService.addUser(newUser);
          if (result) {
            return done(null, result);
          }
        } catch (error) {
          //Si hay un error lo capturo
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await usersService.getUserByEmail(username);

          if (!user) {
            console.log(`User ${username} doesn't exists`);
            return done(null, false);
          }

          const authenticatedUser = await isValidPassword(user, password);

          if (!authenticatedUser) {
            console.log(`Invalid password`);
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //# Github Strategy
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.gitHubClientID,
        clientSecret: config.gitHubClientSecret,
        callbackURL: config.gitHubCallbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);

          // let user = await userModel.findOne({ email: profile._json.email });
          let user = await usersService.getUserByEmail(profile._json.email);

          if (!user) {
            //Si no existe el usuario, lo creo
            
            const newUser = {
              name: profile._json.name,
              email: profile._json.email,
              age: null,
              password: "",
              avatar: profile._json.avatar_url,
            };

            let result = await usersService.addUser(newUser);
            done(null, result);
          } else {
            //Si existe el usuario, lo devuelvo
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //#JWT Strategy
  passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      }, async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      })
  );

  //Serializar y deserializar usuarios
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
