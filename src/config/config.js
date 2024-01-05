import { Command } from "commander";
import dotenv from "dotenv";

const program = new Command();

// Configura la opción --dev con valor por defecto "produccion"
program.option("--dev", "Entorno de trabajo", false); //si no se pasa el argumento --dev, el valor por defecto es false
program.parse();

const environment = program.opts().dev;
export const environmentMode = environment ? "dev" : "prod";

console.log(`Entorno de trabajo: ${environment}`);
console.log(`Modo de ejecución: ${environmentMode}`);

// Carga las variables de entorno desde el archivo .env correspondiente si es true carga el .env.development sino carga el .env.production
dotenv.config({
  path: environment ? "./.env.development" : "./.env.production",
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
