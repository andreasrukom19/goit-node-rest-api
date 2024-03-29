import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";
import { createContactSchema, updateContactSchema, updatePatchContactSchema } from "../schemas/contactsSchemas.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { validateBody } from "../helpers/validateBody.js";
import upload from "../middlewares/upload.js";

const contactsRouter = express.Router();
contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(getAllContacts));

contactsRouter.get("/:id", isValidId, ctrlWrapper(getOneContact));

contactsRouter.delete("/:id", isValidId, ctrlWrapper(deleteContact));

contactsRouter.post("/", upload.single("avatarURL"), validateBody(createContactSchema), ctrlWrapper(createContact));

contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));

contactsRouter.patch("/:id/favorite", isValidId, validateBody(updatePatchContactSchema), ctrlWrapper(updateStatusContact));

export default contactsRouter;