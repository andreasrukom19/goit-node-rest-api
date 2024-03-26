import express from "express";
import authController from "../controllers/authController.js";
import { validateBody } from "../helpers/validateBody.js";
import { userSigninSchema, userSignupSchema } from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(userSignupSchema), authController.signup);

authRouter.post("/signin", validateBody(userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.avatarUpdate);

export default authRouter;