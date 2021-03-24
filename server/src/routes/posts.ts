import { Request, Response, Router } from "express";
//middlewears

//models
import Sub from "../entities/Sub";
import Lesson from "../entities/Lesson";
import Comment from "../entities/Comment";
//helpers
import { isEmpty } from "class-validator";
import {
  getConnection,
  Like,
  // getManager
} from "typeorm";
import slug from "slug";
import user from "../middlewears/user";
import auth from "../middlewears/auth";
import editor from "../middlewears/editor";
import { UploadedFile } from "express-fileupload";
//NODE
import path from "path";
import fs from "fs";
import { makeid } from "../utils/helpers";

const router = Router();

// ?──────────────────────────────────────────────────────────── Lessons ─────────────────────────────────────────────────────────────────

//! ────────────────────────────────────────────────────────────────────────────────
//! Create lesson

const createLesson = async (req: Request, res: Response) => {
  const errors: any = {};
  const { title, body, subSlug, videoLink } = req.body;
  const user = res.locals.user;
  // Validation
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(body)) errors.body = "content cannot be empty";
  if (isEmpty(subSlug)) errors.subSlug = "please choose a section";

  try {
    if (Object.keys(errors).length > 0) throw TypeError("missing inputs");
    const sub = await Sub.findOneOrFail({ slug: subSlug });
    const lesson = new Lesson({
      title,
      body,
      user,
      videoLink,
      sub,
      username: user.username,
    });
    await lesson.save();
    return res.status(200).json(lesson);
  } catch (error) {
    console.log(error);
    if (error.message === "missing inputs") {
      return res.status(401).json(errors);
    } else {
      return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//! GET all lessons

const getLessons = async (_: Request, res: Response) => {
  try {
    const allLessons = await Lesson.find({
      order: { createdAt: "ASC" },
      relations: ["sub"],
    });
    return res.json(allLessons);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong" });
  }
};

//! GET latest 7 lessons
//redo
const getLatestLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find({
      order: { createdAt: "ASC" },
      relations: ["sub"],
      take: Number(req.params.limit),
    });
    return res.json(lessons);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong" });
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//! get   Lesson

const getLesson = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const lesson = await Lesson.findOne(
      { identifier, slug },
      {
        relations: ["comments", "sub", "sub.course"],
        order: { createdAt: "ASC" },
      }
    );
    if (!lesson) throw new Error("lesson not found");
    const result = { ...lesson };
    return res.json(result);
  } catch (error) {
    switch (error.message) {
      case "lesson not found":
        return res.status(404).json({ error: "lesson not found" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//! update a  Lesson
const updateLesson = async (req: Request, res: Response) => {
  let errors: any = {};
  const { title, body, videoLink } = req.body;
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(body)) errors.body = "content cannot be empty";
  if (isEmpty(videoLink)) errors.videoLink = "video Link cannot be empty";
  console.log(errors);
  try {
    if (Object.keys(errors).length > 0) throw new Error("input error");
    const lesson = await Lesson.findOne({
      where: { slug: req.params.slug, identifier: req.params.identifier },
    });
    if (!lesson) throw new Error("lesson not found");
    const newLesson = await getConnection()
      .createQueryBuilder()
      .update(Lesson)
      .set({
        title,
        body,
        videoLink,
        slug: slug(title, "_"),
      })
      .where("slug = :slug AND identifier= :identifier", {
        slug: req.params.slug,
        identifier: req.params.identifier,
      })
      .execute();
    return res.status(200).json(newLesson);
  } catch (error) {
    switch (error.message) {
      case "lesson not found":
        return res.status(404).json({ error: error.message });
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! update a  Lesson
const changeLessonDisplayStatus = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findOne({
      where: { slug: req.params.slug, identifier: req.params.identifier },
    });
    if (!lesson) throw new Error("lesson not found");
    await getConnection()
      .createQueryBuilder()
      .update(Lesson)
      .set({
        displayStatus: !lesson.displayStatus,
      })
      .where("slug = :slug AND identifier= :identifier", {
        slug: req.params.slug,
        identifier: req.params.identifier,
      })
      .execute();
    return res.status(200).json({ success: "lesson updated" });
  } catch (error) {
    switch (error.message) {
      case "lesson not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//!-------------------------------------------------------------------------------------
//! delete a  Lesson

const deleteLesson = async (req: Request, res: Response) => {
  const { slug, identifier } = req.params;
  try {
    await Lesson.findOneOrFail({ slug, identifier });
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Lesson)
      .where("slug = :slug AND identifier= :identifier", { slug, identifier })
      .execute();
    return res.status(200).json({ message: "Lesson deleted succefully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//!Search a lesson
const searchLessons = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (isEmpty(query)) throw new Error("query cannot be empty");
    const lessons = await Lesson.find({
      where: { title: Like(`%${query}%`) },
      select: ["title", "displayStatus", "id", "identifier", "slug", "subSlug"],
      take: 10,
    });
    if (lessons.length === 0) throw new Error("no lessons found");
    return res.status(200).json(lessons);
  } catch (error) {
    switch (error.message) {
      case "no lessons found":
        return res.status(404).json({ error: error.message });
      case "query cannot be empty":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

// ?──────────────────────────────────────────────────────────── Comments-----------
//! ────────────────────────────────────────────────────────────────────────────────
//! Lesson a comment

const createComment = async (req: Request, res: Response) => {
  const errors: any = {};
  const { identifier, slug } = req.params;
  const { body } = req.body;
  let picture = req.files?.picture as UploadedFile;
  const { username } = res.locals.user;
  if (isEmpty(body) && !picture) errors.body = "أضف تعليقا أو صورة ...";
  try {
    if (Object.keys(errors).length > 0) throw new Error("input error");
    //Default file name in case the user didnt upload a picture
    let pictureName = undefined;
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

    const lesson = await Lesson.findOne({ identifier, slug });
    if (!lesson) throw new Error("lesson not found");
    const comment = new Comment({
      body,
      username,
      lesson,
      imageUrn: pictureName,
    });
    await comment.save();
    return res.json(comment);
  } catch (error) {
    switch (error.message) {
      case "input error":
        return res.status(403).json(errors);
      case "lesson not found":
        return res.status(404).json({ error: "lesson not found" });
      default:
        return res.status(500).json({ error: "Something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//! Get  a comment
const getComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  try {
    const comment = await Comment.findOneOrFail({ identifier });
    return res.json(comment);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Comment not found" });
  }
};
//! Get  lesson comments
const getLessonComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const lesson = await Lesson.findOne(
      { identifier, slug },
      { relations: ["comments", "comments.user"] }
    );
    if (!lesson) throw new Error("lesson not found");
    const comments = lesson.comments;
    return res.status(200).json(comments);
  } catch (error) {
    console.log(error);

    switch (error.message) {
      case "lesson not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "Something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//! delete a comment

const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) throw new Error("comment not found");
    if (!Number(id)) throw new Error("invalid query");
    await Comment.delete(id);
    if (comment.imageUrn) {
      let picturePath = path.join(
        __dirname,
        "../../",
        "public/uploads/",
        comment.imageUrn
      );
      fs.unlink(picturePath, function (err) {
        console.log("error");
        if (err) throw new Error("something went wrong");
      });
    }
    return res.status(200).json({ success: "comment deleted succefully" });
  } catch (error) {
    switch (error.message) {
      case "comment not found":
        return res.status(404).json({ error: error.message });
      case "invalid query":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong " });
    }
  }
};

const getComments = async (_: Request, res: Response) => {
  try {
    const comments = await Comment.find({ relations: ["lesson","lesson.sub"] });
    console.log(comments)
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
//* ────────────────────────────────────────────────────────────────────────────────
//* ────────────────────────────────────────────────────────────────────────────────
//* ────────────────────────────────────────────────────────────────────────────────

//!Comments  routes
//?GET
router.get("/comment/:identifier", user, auth, editor, getComment); // Admin
router.get("/comments/", user, auth, editor, getComments); // Admin
router.get("/:identifier/:slug/comments", getLessonComments);
//?POST
router.post("/:identifier/:slug/comment", user, auth, createComment);
//?DELETE
router.delete("/comment/:id", deleteComment);
//* ────────────────────────────────────────────────────────────────────────────────
//!Lessons  routes
//?GET
router.get("/", getLessons);
router.get("/limit/:limit", getLatestLessons);
router.get("/:identifier/:slug", getLesson);
router.get("/search/", searchLessons);
//?POST
router.post("/", user, auth, editor, createLesson);
//?UPDATE
router.put("/update/:identifier/:slug", user, auth, editor, updateLesson);
router.put(
  "/display/:identifier/:slug",
  user,
  auth,
  editor,
  changeLessonDisplayStatus
);
//?DELETE
router.delete("/:identifier/:slug", user, auth, editor, deleteLesson);

export default router;
