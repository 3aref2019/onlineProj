import { isEmail, isEmpty, length, validate } from "class-validator";

import { Request, Response, Router } from "express";
import { getConnection } from "typeorm";
import User from "../entities/User";
import auth from "../middlewears/auth";
import user from "../middlewears/user";
import { createErrorObject, makeid } from "../utils/helpers";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcrypt";
import admin from "../middlewears/admin";
//NODE
import path from "path";
import fs from "fs";

import { UploadedFile } from "express-fileupload";
//! ────────────────────────────────────────────────────────────────────────────────
//!Get all users
const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find({ order: { createdAt: "ASC" } });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//!Get  user
const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!Number(id)) throw new Error("invalid query");
    const user = await User.findOne({
      where: { id },
      relations: ["posts", "comments"],
    });
    if (!user) throw new Error("user not found");
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);

    switch (error.message) {
      case "user not found":
        return res.status(404).json({ error: "User not found" });
      case "invalid query":
        return res.status(403).json({ error: "invalid query" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//!delete a user
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!Number(id)) throw new Error("invalid query");
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("user not found");
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id })
      .execute();
    if (user.imageUrn !== "defaultpp.jpg") {
      let picturePath = path.join(
        __dirname,
        "../../",
        "public/uploads/profilepictures/",
        user.imageUrn
      );
      fs.unlink(picturePath, function (err) {
        if (err) throw new Error("something went wrong");
      });
    }
    return res.status(200).json({ message: "user deleted succefully" });
  } catch (error) {
    switch (error.message) {
      case "user not found":
        return res.status(404).json({ error: "User not found" });
      case "invalid query":
        return res.status(403).json({ error: "invalid query" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//!update a user
const updateUser = async (req: Request, res: Response) => {
  console.log(req.params);
  const errors: any = {};
  const { username, role } = req.body;
  const email = req.body.email.toLowerCase();

  const { id } = req.params;
  try {
    if (!Number(id)) throw new Error("invalid query");
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("user not found");

    if (isEmpty(email)) errors.email = "email cannot be empty";
    if (isEmpty(username)) errors.username = "username cannot be empty";
    if (isEmpty(role)) errors.role = "role cannot be empty";
    const roles = ["admin", "editor", "user"];
    if (!roles.includes(role)) errors.roleType = "invalid role";
    if (Object.keys(errors).length > 0) throw new Error("invalid input");
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        email,
        username,
        role,
      })
      .where("id = :id", { id })
      .execute();
    return res.status(200).json({ success: "user updated succefully" });
  } catch (error) {
    console.log(error.message);
    switch (error.message) {
      case "user not found":
        return res.status(404).json({ error: "User not found" });
      case "invalid input":
        return res.status(403).json({ errors });
      case "invalid query":
        return res.status(403).json({ error: "invalid query" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//!suspendUser
const suspendUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!Number(id)) throw new Error("invalid query");
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("user not found");
    let status = !user.status;
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        status,
      })
      .where("id = :id", { id })
      .execute();
    return res.status(200).json({ success: "user suspended" });
  } catch (error) {
    console.log(error.message);
    switch (error.message) {
      case "user not found":
        return res.status(404).json({ error: "User not found" });
      case "invalid query":
        return res.status(403).json({ error: "invalid query" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//!update Email

const updateUserEmail = async (req: Request, res: Response) => {
  const errors: any = {};
  const user = res.locals.user;
  const oldEmail = req.body.oldEmail.toLowerCase();
  const newEmail = req.body.newEmail.toLowerCase();

  console.log(user);
  try {
    //validation

    if (isEmpty(oldEmail)) errors.oldEmail = "this field is required";
    if (isEmpty(newEmail)) errors.newEmail = "this field is required";
    if (Object.keys(errors).length > 0) throw new Error("validations errors");

    // 1- Check if there's a user with this email
    const foundUser = await User.findOne({ email: oldEmail });
    if (!foundUser) {
      errors.oldEmail = "this email is not connected to any account";
      throw new Error("validations errors");
    }

    // 2- check if the user email matchs the sent email
    if (foundUser?.email !== user.email) {
      errors.oldEmail = "your email does not match";
      throw new Error("validations errors");
    }

    // 3- validate new email
    if (!isEmail(newEmail)) {
      errors.newEmail = "this email is not valid";
      throw new Error("validations errors");
    }
    // 4- Check if new email is not the same as old email
    if (newEmail === oldEmail) {
      errors.newEmail = "please provide an email that differs from your old one";
      throw new Error("validations errors");
    }

    const checkNewEmail = await User.findOne({ email: newEmail });
    if (checkNewEmail) {
      errors.newEmail = "this email is already used";
      throw new Error("validations errors");
    }

    //
    // If pass all validations , update email from database
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        email: newEmail,
        emailConfirmed: false,
      })
      .where("id = :id", { id: user.id })
      .execute();

    const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET!);
    // set token on the browser
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", //connect from https after deployment
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );
    return res.json(user);
  } catch (error) {
    switch (error.message) {
      case "validations errors":
        return res.status(403).json(errors);
      case "not authenticated":
        return res.status(401).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//!update Bio

const updateUserBio = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const { bio } = req.body;
  try {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        bio,
      })
      .where("id = :id", { id: user.id })
      .execute();

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
//!update//add Profile Picture
const updateUserProfilePicture = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const picture = req.files?.picture as UploadedFile;
  let pictureName: string;
  //Upload picture
  try {
    if (picture) {
      pictureName = makeid(9) + "." + picture.name.split(".").pop();
      let uploadPath = path.join(
        __dirname,
        "../../",
        "public/uploads/profilepictures/",
        pictureName
      );
      console.log(uploadPath)
      picture.mv(uploadPath, (err: any) => {
        if (err) {
          console.log(err)
          return res.status(403).json("error");
        }
        return;
      });
      if (user.imageUrn !== "default.jpg") {
        let picturePath = path.join(
          __dirname,
          "../../",
          "public/uploads/profilepictures/",
          user.imageUrn
        );
        fs.unlink(picturePath, function (err) {
          if (err) throw new Error("something went wrong");
        });
      }
    } else {
      throw new Error("please send a valid picture");
    }
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        imageUrn: pictureName,
      })
      .where("id = :id", { id: user.id })
      .execute();
    return res.json({ success: "user picture updated succefully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong" });
  }
};
//!update User Password

const updateUserPassword = async (req: Request, res: Response) => {
  const errors: any = {};
  const user = res.locals.user;
  const { oldPassword, newPassword } = req.body;
  console.log(user);
  try {
    //validation
    if (isEmpty(oldPassword))
      errors.oldPassword = "لا يمكنك ترك هذه الخانة فارغـة";
    if (isEmpty(newPassword))
      errors.newPassword = "لا يمكنك ترك هذه الخانة فارغـة";
    if (Object.keys(errors).length > 0) throw new Error("validations errors");

    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    // 2- check if the user password matchs the sent password
    if (!checkPassword) {
      errors.oldPassword = "تأكد من أن كلمة المرور صحيحة";
      throw new Error("validations errors");
    }

    // 3- validate new password
    if (!length(newPassword, 6)) {
      errors.newPassword = "كلمة المرور يجب أن تحتوي على ستة حروف أو أكثر";
      throw new Error("validations errors");
    }
    // 4- hash password

    const passwordEncrypted = await bcrypt.hash(newPassword, 6);

    // If pass all validations , update password from database
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        password: passwordEncrypted,
      })
      .where("id = :id", { id: user.id })
      .execute();

    const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET!);
    // set token on the browser
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", //connect from https after deployment
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );
    return res.json({ success: "password updated" });
  } catch (error) {
    switch (error.message) {
      case "validations errors":
        return res.status(403).json(errors);
      case "not authenticated":
        return res.status(401).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//!create a user
const createUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  let mappedErrors: any = {};
  let errors: any = {};
  try {
    //create a new user using the model
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });
    if (emailUser) errors.email = "البريد الإلكتروني مستخدم مسبقا";

    if (usernameUser) errors.username = "الاسم مستخدم مسبقا";
    if (Object.keys(errors).length > 0)
      throw new Error("username or email already taken");

    // Create the user
    const user = new User({ email, username, password });
    //validate user
    errors = await validate(user);
    if (errors.length > 0) {
      mappedErrors = createErrorObject(errors);
      throw new Error("validation error");
    }
    //save user to database
    await user.save();
    //return user as json
    return res.status(200).json({ user });
  } catch (error) {
    switch (error.message) {
      case "validation error":
        return res.status(403).json(mappedErrors);
      case "username or email already taken":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const router = Router();

//*GET
// GET  USERS - ADMIN ONLY
router.get("/", user, auth, admin, getUsers);
// GET  USER - ADMIN ONLY
router.get("/:id", user, auth, admin, getUser);
//!DELETE
//DELETE  USER- ADMIN ONLY
router.delete("/:id", user, auth, admin, deleteUser);
//?UPDATE
//UPDATE EMAIL USER
router.put("/updateEmail/", user, auth, updateUserEmail);
//UPDATE EMAIL Bio
router.put("/updateBio/", user, auth, updateUserBio);
//UPDATE EMAIL Picture
router.put("/updateUserProfilePicture/", user, auth, updateUserProfilePicture);
//UPDATE PASSWORD USER
router.put("/updatePassword/", user, auth, updateUserPassword);
//UPDATE USER ADMIN ONLY
router.put("/:id", user, auth, admin, updateUser);
//SUSPEND USER ADMIN ONLY
router.put("/suspend/:id", user, auth, admin, suspendUser);
//?POST
router.post("/", user, auth, admin, createUser);

export default router;
