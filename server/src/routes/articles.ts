//Express
import { Request, Response, Router } from "express";
//Helpers
import { isEmpty } from "class-validator";
import slug from "slug";
import { makeid } from "../utils/helpers";
const Paginator = require("paginator");
//Types
import { UploadedFile } from "express-fileupload";

//TypeORM
import { getConnection } from "typeorm";

//Entities
import Article from "../entities/Article";

//Middlewears
import auth from "../middlewears/auth";
import editor from "../middlewears/editor";
import user from "../middlewears/user";

//NODE
import path from "path";
import fs from "fs";

//!GET ARTICLES
const getArticles = async (_: Request, res: Response) => {
  try {
    const articles = await Article.find();
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};

//!GET ARTICLES PAGINATED
interface Query {
  current: string;
}
const getArticlesPaginated = async (
  req: Request<{}, {}, {}, Query>,
  res: Response
) => {
  try {
    const take = 3;
    const current = parseInt(req.query.current);
    const skip = (current - 1) * 3;
    const paginator = new Paginator(take, skip);
    const articles = await Article.find({ skip, take });
    const articlesCount = await Article.findAndCount();
    var infos = paginator.build(articlesCount[1], current);
    return res.status(200).json({ articles, infos });
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
const getArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const article = await Article.findOne(id);
    if (!article) throw new Error("article not found");
    return res.status(200).json(article);
  } catch (error) {
    switch (error.message) {
      case "article not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//!DELETE ARTICLE
const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const article = await Article.findOne(id);
    if (!article) throw new Error("article not found");
    await Article.delete(id);
    if (article.imageUrn !== "default.jpg") {
      let picturePath = path.join(
        __dirname,
        "../../",
        "public/uploads/",
        article.imageUrn
      );
      fs.unlink(picturePath, function (err) {
        if (err) throw new Error("something went wrong");
      });
    }

    return res.status(200).json({ success: "article is deleted succefully" });
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case "article not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! CREATE ARTICLE

const createArticle = async (req: Request, res: Response) => {
  //Initialize Error Object
  const errors: any = {};
  //Get FormDATA from body
  const { title, body } = req.body;
  let picture = req.files?.picture as UploadedFile;
  const user = res.locals.user;
  // Validation
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(body)) errors.body = "body cannot be empty";
  try {
    //Throw ERRORS if there's an error
    if (Object.keys(errors).length > 0) throw TypeError("missing inputs");

    //Default file name in case the user didnt upload a picture
    let pictureName = "default.jpg";

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
    const article = await new Article({
      title,
      body,
      username: user.username,
      imageUrn: pictureName,
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

//! UPDATE  ARTICLE
const updateArticle = async (req: Request, res: Response) => {
  let errors: any = {};
  const { title, body } = req.body;
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(body)) errors.body = "body cannot be empty";
  try {
    if (Object.keys(errors).length > 0) throw new Error("input error");
    const article = await Article.findOne({
      where: { id: req.params.id },
    });
    if (!article) throw new Error("article not found");
    const updatedArticle = await getConnection()
      .createQueryBuilder()
      .update(Article)
      .set({
        title,
        body,
        slug: slug(title, "_"),
      })
      .where("id = :id", {
        id: req.params.id,
      })
      .execute();
    return res.status(200).json(updatedArticle);
  } catch (error) {
    switch (error.message) {
      case "article not found":
        return res.status(404).json({ error: error.message });
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

const router = Router();

router.get("/", user, auth, editor, getArticles);
router.get("/paginate/", getArticlesPaginated);
router.get("/:id", getArticle);
router.delete("/:id", user, auth, editor, deleteArticle);
router.post("/", user, auth, editor, createArticle);
router.put("/:id", user, auth, editor, updateArticle);

export default router;
