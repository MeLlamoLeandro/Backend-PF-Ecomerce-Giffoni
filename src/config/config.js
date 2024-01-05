import { Command } from "commander";
import dotenv from "dotenv";

const program = new Command();

// Configura la opción --mode con valor por defecto "development"
program.option("--prod", "Entorno de trabajo", false); //si no se pasa el argumento --prod, el valor por defecto es false
program.parse();

const environment = program.opts().prod;
export const environmentMode = environment ? "prod" : "dev";

// Carga las variables de entorno desde el archivo .env correspondiente si es true carga el .env.production sino carga el .env.development
dotenv.config({
  path: environment ? "./.env.production" : "./.env.development",
});

export default {
  port: process.env.PORT,
  mongoURL: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  gitHubClientID: process.env.GITHUB_CLIENT_ID,
  gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  gitHubCallbackURL: process.env.GITHUB_CALLBACK_URL,
  JWTPrivateKey: process.env.JWT_PRIVATE_KEY,
  persistence: process.env.PERSISTENCE,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailFrom: process.env.EMAIL_FROM,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};
