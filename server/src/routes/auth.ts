import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";

import User from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middlewears/auth";
import user from "../middlewears/user";
import { createErrorObject } from "../utils/helpers";
import { getConnection } from "typeorm";
import nodemailer from "nodemailer";
import admin from "../middlewears/admin";

const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const email = req.body.email.toLowerCase();
  let errors: any = {};
  try {
    //check if username or email already exists
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });
    if (emailUser) errors.email = "البريد الإلكتروني مستخدم مسبقا";
    if (usernameUser) errors.username = "الاسم مستخدم مسبقا";
    if (Object.keys(errors).length > 0) throw new Error("validation error");

    // Create the user
    const user = new User({ email, username, password });

    //validate user ("check if username or email is already taken")
    errors = await validate(user);
    if (errors.length > 0) {
      errors = createErrorObject(errors);
      throw new Error("validation error");
    }

    // If no error create a token & set it on the client
    const newUser = await user.save();
    const token = jwt.sign({ user: newUser.id }, process.env.JWT_SECRET!);

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

    //save user to database

    // Return the user
    return res.json(user);
  } catch (error) {
    console.log(error.message);
    switch (error.message) {
      case "validation error":
        return res.status(400).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const login = async (req: Request, res: Response) => {
  let errors: any = {};
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  if (isEmpty(email)) errors.email = "this field is required";
  if (isEmpty(password)) errors.password = "this field is required";
  try {
    if (Object.keys(errors).length > 0) throw new Error("validation error");
    // check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      errors.email = "this email is not connected to any account";
      throw new Error("validation error");
    }
    // check if password match the username
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      errors.password = "password does not match";
      throw new Error("validation error");
    }
    // email & password are correct
    // create token
    //server -> token(id)
    const token = jwt.sign({ user: user.id }, process.env.JWT_SECRET!);
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
      case "validation error":
        return res.status(401).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const me = (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = (_: Request, res: Response) => {
  try {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        secure: process.env.NODE_ENV === "production", //connect from https after deployment
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
//admin
const activateUserEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne(id);
    if (!user) throw new Error("user not found");
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        emailConfirmed: !user?.emailConfirmed,
      })
      .where("id = :id", { id })
      .execute();
    return res.json({ success: "user updated" });
  } catch (error) {
    switch (error.message) {
      case "user not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const createActivationLink = async (_: Request, res: Response) => {
  const user: User = res.locals.user;
  try {
    if (user.emailConfirmed) throw new Error("your email is already confirmed");
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET!
    );
    const url = `http://localhost:3000/verifyEmail/${token}`;
    const options = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Phy12 - Activate your account !",
      html: `<p><b>Hello</b> press this link to activate your email </p>
      <a href=${url}>Link</a>
      <p>if that link doesn't work ,copy this and paste it in ur browser</p>
      ${url}
      `,
    };
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    transporter.sendMail(options, (err) => {
      if (err) {
        throw new Error("something went wrong");
      }
    });
    return res.status(200).json({ success: "sent" });
  } catch (error) {
    switch (error.message) {
      case "your email is already confirmed":
        return res.status(403).json({ error: error.message });
      case "something went wrong":
        return res.status(500).json({ error: "something went wrong" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const verifyActivationLink = async (req: Request, res: Response) => {
  //Get the token from the link's query
  const { token } = req.body;
  try {
    //Check if there's a token
    if (!token) throw new Error("invalid link");
    //Check if the token is valid
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) throw new Error("invalid link");

    //Check if the token owner actually exist
    const user = await User.findOne(decoded.id);
    if (!user) throw new Error("invalid link");

    //Check if the email is already activate
    if (user.emailConfirmed) throw new Error("email already activated");

    //If not activate email
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        emailConfirmed: !user?.emailConfirmed,
      })
      .where("id = :id", { id: decoded.id })
      .execute();

    //
    return res.json({ success: "user updated" });
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case "user not found":
        return res.status(404).json({ error: error.message });
      case "email already activated":
        return res.status(403).json({ error: error.message });
      case "jwt malformed":
      case "invalid link":
        return res.status(403).json({ error: "invalid link" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", user, auth, me);
router.get("/logout", logout);
router.put("/activateUserEmail/:id", user, auth, admin, activateUserEmail);
router.put("/verifyActivationLink/", user, auth, verifyActivationLink);
router.get("/createActivationLink/", user, auth, createActivationLink);

export default router;
