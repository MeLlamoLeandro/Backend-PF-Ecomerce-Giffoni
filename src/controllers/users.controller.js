import { usersService } from "../services/index.js";
import jwt from "jsonwebtoken";
import { isValidPassword, createHash } from "../utils/bycrypt.js";
import config from "../config/config.js";
import { determineDocumentName } from "../utils/multer.js";
import { sendEmailFunction } from "./mail.controller.js";
import userDTOGetAll from "../dao/DTOs/user.dto.getAll.js";

const PRIVATE_KEY = config.JWTPrivateKey;

export const resetControllerToken = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, PRIVATE_KEY);
    const user = await usersService.getUserByEmail(decoded.email);
    //si el usuario no existe lo advierto
    if (!user)
      return res
        .status(401)
        .send({ status: "Error", message: "Invalid credentials" });

    // esta todo ok, renderizo el formulario para resetear el password
    res.render("resetPw", { email: user.email });
  } catch (error) {
    req.logger.error(error.message);
    if (error.message === "jwt expired") {
      return res.redirect("/pwforget");
    }
  }
};

export const updatePWController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usersService.getUserByEmail(email);

    // si el usuario no existe lo advierto
    if (!user)
      return res
        .status(401)
        .send({ status: "Error", message: "Invalid credentials" });

    // hasheo y valido que no repita la contraseña anterior
    const isSamePassword = await isValidPassword(user, password);

    if (isSamePassword) {
      return res.status(400).send({
        status: "Error",
        message: "the password must be different from the previous one",
      });
    }

    // actualizo el password
    const newPassword = await createHash(password);
    const result = await usersService.updatePassword(email, newPassword);

    res.send({
      status: "success",
      message: "password updated successfully",
    });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ status: "Error", message: "Server Error" });
  }
};

export const userController = async (req, res) => {
  try {
    const AllUsers = await usersService.getUsers();
    //utilizo el DTO para mostrar solamente el nombre, email y role de cada usuario
    const users = AllUsers.map((user) => new userDTOGetAll(user));
    res.send({ status: "success", payload: users });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

//debe cambiar el rol del usuario de user a premium y viceversa
export const userPremiumController = async (req, res) => {
  try {
    const email = req.params.uid;
    //busco el user por email
    const user = await usersService.getUserByEmail(email);
    //si el user es premium lo paso a admin y viceversa
    if (!user) {
      res.status(400).send({ status: "error", message: "User not found" });
    }
    let updatedUser = null;
    let role = user.role;

    switch (role) {
      case "premium":
        role = "user";
        updatedUser = await usersService.updateRole(email, role);
        if (updatedUser) {
          res
            .status(200)
            .send({ status: "success", message: "User updated to user" });
        } else {
          res
            .status(400)
            .send({ status: "error", message: "User not updated" });
        }
        break;
      case "user":
        // valido que el usuario tenga completa la documentacion para poder ser premium
        if (
          user.status.id_doc &&
          user.status.address_doc &&
          user.status.account_doc
        ) {
          role = "premium";
          updatedUser = await usersService.updateRole(email, role);
          if (updatedUser) {
            res
              .status(200)
              .send({ status: "success", message: "User updated to premium" });
          } else {
            res
              .status(400)
              .send({ status: "error", message: "User not updated" });
          }
        } else {
          res.send({
            status: "error",
            message:
              "User not updated, you must complete your documentation to be premium",
          });
        }
        break;
      default:
        res.status(400).send({
          status: "error",
          message:
            'User not updated, remember that "admin" users are not allowed in this operation',
        });
        break;
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const userDocumentController = async (req, res) => {
  const email = req.params.uid;

  try {
    const files = req.files;
    const fileType = req.body.fileType;
    const documentType = req.body.documentType;
    if (!files)
      res
        .status(400)
        .send({ status: "error", error: "Files could not be loaded" }); //Verifica si se subió un archivo.

    if (files.length === 0)
      res.status(400).send({ status: "error", error: "No files uploaded" });

    let userData = await usersService.getUserByEmail(email); //Busca el usuario por email.

    if (!userData) {
      res.status(400).send({ status: "error", error: "User not found" });
    }

    let newStatus = userData.status;
    let documents = userData.documents || [];

    if (determineDocumentName(fileType, documentType) === "id_doc") {
      userData.status.id_doc = true;
      files.forEach((file) => {
        documents.push({ name: file.originalname, reference: file.path });
      });
    }
    if (determineDocumentName(fileType, documentType) === "address_doc") {
      userData.status.address_doc = true;
      files.forEach((file) => {
        documents.push({ name: file.originalname, reference: file.path });
      });
    }
    if (determineDocumentName(fileType, documentType) === "account_doc") {
      userData.status.account_doc = true;
      files.forEach((file) => {
        documents.push({ name: file.originalname, reference: file.path });
      });
    }
    if (determineDocumentName(fileType, documentType) === "image-profile") {
      files.forEach((file) => {
        documents.push({ name: file.originalname, reference: file.path });
      });
    }
    if (determineDocumentName(fileType, documentType) === "image-product") {
      files.forEach((file) => {
        documents.push({ name: file.originalname, reference: file.path });
      });
    }

    console.log("documents:");
    console.log(documents);
    console.log("status:");
    console.log(newStatus);

    const docUpdated = {
      documents,
      status: newStatus,
    };

    const result = await usersService.updateDocuments(
      userData.email,
      docUpdated
    );
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllUsersController = async (req, res) => {
  try {
    //limpia todos los usuarios que no se conectaron en las ultimas 48hs comparando con el campo last_connection y enviar un mail a cada uno de ellos
    //primero determino a quienes mandarle el mail
    const users = await usersService.getUsers();

    const usersToDelete = users.filter((user) => {
      const last_connection = new Date(user.last_connection);
      const now = new Date();
      const diff = now - last_connection;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return hours >= 48; //si la diferencia es mayor a 48hs lo agrego al array
    });

    //envio el mail
    usersToDelete.forEach((user) => {
      //elimino el usuario de mongo
      usersService.deleteUser(user.email);

      //envio el mail
      console.log("enviando mail a: " + user.email);
      const dataEmail = {
        email: user.email,
        subject: `${user.first_name} - DELETE ACCOUNT`,
        message: `Dear ${user.first_name}: Your account has been deleted due to inactivity for more than 48 hours.`,
        attachments: [],
      };
      sendEmailFunction(
        dataEmail.email,
        dataEmail.subject,
        dataEmail.message,
        dataEmail.attachments
      );
    });
    //devuelvo el array de usuarios eliminados
    res.send({ status: "success", payload: usersToDelete });
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const email = req.params.uid;
    const result = await usersService.deleteUser(email);
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
  }
};

export const updateRoleController = async (req, res) => {
  try {
    const email = req.params.uid;
    const { role } = req.body;
    const result = await usersService.updateRole(email, role);
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
  }
};
