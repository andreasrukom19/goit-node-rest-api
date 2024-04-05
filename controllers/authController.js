import jwt from "jsonwebtoken";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const subscription = req.body.subscription ?? "starter";
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const body = { ...req.body, subscription, avatarURL, verificationToken };

  const newUser = await authServices.signup(body);

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify email</a>`,
  }

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  })
}

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "Not found");
  }
  await authServices.updateUser({ _id: user._id }, { verify: true, verificationToken: null });

  res.json({
    message: "Verification successful"
  })
}

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify email</a>`,
  }

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  })
}

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }
  const comparePassword = await authServices.validatePassword(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
  })
}

const getCurrent = async (req, res) => {
  const { username, email } = req.user;

  res.json({
    username,
    email
  })
}

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: null });

  res.json({
    message: "Signout success"
  })
}

const avatarUpdate = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "File not uploaded");
  }

  const { _id } = req.user;

  const avatarImage = await Jimp.read(req.file.path);
  await avatarImage.resize(250, 250).write(req.file.path);

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);

  await authServices.updateUser({ _id }, { avatarURL });

  res.status(200).json({
    avatarURL: avatarURL,
  })
}

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  avatarUpdate: ctrlWrapper(avatarUpdate),
}