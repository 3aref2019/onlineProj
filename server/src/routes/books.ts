//Express
import { Request, Response, Router } from "express";
//Helpers
import { isEmpty } from "class-validator";
import slug from "slug";
import { makeid } from "../utils/helpers";
//Types
import { UploadedFile } from "express-fileupload";

//TypeORM
import { getConnection } from "typeorm";

//Entities
import Book from "../entities/Book";

//Middlewears
import auth from "../middlewears/auth";
import editor from "../middlewears/editor";
import user from "../middlewears/user";

//NODE
import path from "path";
import fs from "fs";

//!GET BOOKS
const getBooks = async (_: Request, res: Response) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
//!GET BOOK
const getBook = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const book = await Book.findOne({ where: { slug } });
    if (!book) throw new Error("book not found");
    return res.status(200).json(book);
  } catch (error) {
    switch (error.message) {
      case "book not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//!DELETE BOOK
const deleteBook = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const book = await Book.findOne({ where: { slug } });
    if (!book) throw new Error("book not found");
    await Book.delete(book.id);
    if (book.imageUrn !== "defaultBook.jpg") {
      let picturePath = path.join(
        __dirname,
        "../../",
        "public/uploads/",
        book.imageUrn
      );
      fs.unlink(picturePath, function (err) {
        if (err) throw new Error("something went wrong");
      });
    }
    return res.status(200).json({ success: "book is deleted succefully" });
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case "book not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! CREATE BOOK

const createBook = async (req: Request, res: Response) => {
  //Initialize Error Object
  const errors: any = {};
  //Get FormDATA from body
  const { title, description, link } = req.body;
  let picture = req.files?.picture as UploadedFile;
  // Validation
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(description)) errors.body = "description cannot be empty";
  try {
    //Throw ERRORS if there's an error
    if (Object.keys(errors).length > 0) throw TypeError("missing inputs");

    //Default file name in case the user didnt upload a picture
    let pictureName = "defaultBook.jpg";

    //Upload picture if it exists
    console.log(path.join(__dirname, "../../"));
    if (picture) {
      pictureName = makeid(9) + "." + picture.name.split(".").pop();
      let uploadPath = path.join(
        __dirname,
        "../../",
        "public/uploads/",
        pictureName
      );
      picture.mv(uploadPath, (err: any) => {
        if (err) {
          console.log(err);
          return res.status(403).json("error");
        }
        return;
      });
    }

    // Create article and save it to DB
    const article = await new Book({
      title,
      description,
      imageUrn: pictureName,
      link,
    }).save();
    return res.status(200).json(article);
  } catch (error) {
    console.log(error);
    if (error.message === "missing inputs") {
      return res.status(401).json(errors);
    } else {
      return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! UPDATE  BOOK
const updateBook = async (req: Request, res: Response) => {
  let errors: any = {};
  const { title, description, link } = req.body;
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(description)) errors.description = "description cannot be empty";
  try {
    if (Object.keys(errors).length > 0) throw new Error("input error");
    const book = await Book.findOne({
      where: { slug: req.params.slug },
    });
    if (!book) throw new Error("book not found");
    const updatedBook = await getConnection()
      .createQueryBuilder()
      .update(Book)
      .set({
        title,
        description,
        slug: slug(title, "_") + "_" + makeid(3),
        link,
      })
      .where("slug = :slug", {
        slug: req.params.slug,
      })
      .execute();
    return res.status(200).json(updatedBook);
  } catch (error) {
    switch (error.message) {
      case "book not found":
        return res.status(404).json({ error: error.message });
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const router = Router();

router.get("/", getBooks);
router.get("/:slug", getBook);
router.delete("/:slug", user, auth, editor, deleteBook);
router.post("/", user, auth, editor, createBook);
router.put("/:slug", user, auth, editor, updateBook);

export default router;
