import { Request, Response, Router } from "express";
import { getRepository, ILike } from "typeorm";
import { getConnection } from "typeorm";
import slug from "slug";
//models
import Lesson from "../entities/Lesson";
import Sub from "../entities/Sub";
import Course from "../entities/Course";
//helpers
import { isEmpty, isInt, isPositive } from "class-validator";
import { makeid } from "../utils/helpers";
import user from "../middlewears/user";
import auth from "../middlewears/auth";
import editor from "../middlewears/editor";
import { UploadedFile } from "express-fileupload";
//NODE
import path from "path";
import fs from "fs";
const router = Router();

// ?──────────────────────────────────────────────────────────── COURSES ─────────────────────────────────────────────────────────────────
//! ────────────────────────────────────────────────────────────────────────────────
//! Create Course
const createCourse = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  let picture = req.files?.picture as UploadedFile;

  let errors: any = {};
  try {
    // Validation

    if (isEmpty(name)) errors.name = "Title cannot be empty";
    if (isEmpty(description))
      errors.description = "Description  cannot be empty";
    let course = await getRepository(Course)
      .createQueryBuilder("course")
      .where("lower(course.name) = :name", { name: name.toLowerCase() })
      .getOne();
    if (course) errors.name = "name is already used";
    if (Object.keys(errors).length > 0) throw new Error("input error");
    // create  the new course
    let pictureName = "default.jpg";
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
    let [, apperance_order] = await Course.findAndCount();
    course = new Course({
      name,
      description,
      apperance_order: apperance_order + 1,
      imageUrn: pictureName,
    });
    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    switch (error.message) {
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//!Get all courses
const getCourses = async (_: Request, res: Response) => {
  try {
    const courses = await Course.find({
      order: { apperance_order: "ASC", createdAt: "ASC" },
      relations: ["subs"],
    });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//!Get Latest courses
const getLatestCourses = async (_: Request, res: Response) => {
  try {
    const courses = await Course.find({
      order: { apperance_order: "ASC", createdAt: "ASC" },
      take: 3,
    });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//!Get a single course
const getCourse = async (req: Request, res: Response) => {
  try {
    const course: Course | undefined = await Course.findOne({
      where: { slug: req.params.slug },
      relations: ["subs"],
    });
    if (!course) throw new Error("course not found");
    return res.status(200).json(course);
  } catch (error) {
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//! Update a  course
const updateCourse = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const apperance_order = Number(req.body.apperance_order);
  const slugName = req.params.slug;
  let errors: any = {};

  try {
    if (!isPositive(apperance_order) || !isInt(apperance_order))
      errors.apperance_order = "أدخل رقما صحيحًا";
    if (isEmpty(name)) errors.name = "اسم القسم لا يمكن أن يكون فارغًا";
    if (isEmpty(description))
      errors.description = "وصف القسم لا يمكن أن يكون فارغًا";
    const course = await Course.findOne({
      where: { slug: slugName },
    });
    if (!course) throw new Error("course not found");
    if (Object.keys(errors).length > 0) throw new Error("input error");

    await getConnection()
      .createQueryBuilder()
      .update(Course)
      .set({
        apperance_order: apperance_order || 1,
        name,
        description,
        slug: slug(name, "_") + "_" + makeid(3),
      })
      .where("slug = :slug", { slug: slugName })
      .execute();
    return res.status(200).json({ success: "course updated" });
  } catch (error) {
    console.log(error);

    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      case "input error":
        return res.status(404).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! ────────────────────────────────────────────────────────────────────────────────

//!Search a course
const searchCourse = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (isEmpty(query)) throw new Error("query cannot be empty");
    console.log(query)
    const courses = await Course.find({
      where: { name: ILike(`%${query}%`) },
      select: ["name", "slug"],
      take: 10,
    });
    if (courses.length === 0) throw new Error("no courses found");
    return res.status(200).json(courses);
  } catch (error) {
    console.log(error)
    switch (error.message) {
      case "no courses found":
        return res.status(404).json({ error: error.message });
      case "query cannot be empty":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//! Delete Course

const deleteCourse = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const course = await Course.findOne({ slug });
    if (!course) throw new Error("course not found");
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Course)
      .where("slug = :slug", { slug })
      .execute();
    if (course.imageUrn !== "default.jpg") {
      let picturePath = path.join(
        __dirname,
        "../../",
        "public/uploads/",
        course.imageUrn
      );
      fs.unlink(picturePath, function (err) {
        if (err) throw new Error("something went wrong");
      });
    }
    return res.status(200).json({ message: "course deleted succefully" });
  } catch (error) {
    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error });
    }
  }
};
//!Update appearance Order
const updateCourseOrder = async (req: Request, res: Response) => {
  const apperance_order = Number(req.body.apperance_order);
  const id = Number(req.body.id);
  try {
    if (!isPositive(apperance_order) || !isInt(apperance_order))
      throw new Error("insert valid number");
    const course = await Course.findOne(id);
    if (!course) throw new Error("course not found");
    await getConnection()
      .createQueryBuilder()
      .update(Course)
      .set({ apperance_order })
      .where("id = :id", { id })
      .execute();
    return res.status(404).json({ success: "course apperance_order updated" });
  } catch (error) {
    console.log(error);

    switch (error.message) {
      case "course not found":
        return res.status(404).json({ error: error.message });
      case "insert valid number":
        return res.status(403).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//?──────────────────────────────────────────────────────────── SUBCOURSES─────────────────────────────────────────────────────────────────

//! ────────────────────────────────────────────────────────────────────────────────
//! Get all subs
const getSubs = async (_: Request, res: Response) => {
  try {
    const subs = await Sub.find({ relations: ["course"] });
    return res.status(200).json(subs);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//! Get a single sub
const getSub = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  try {
    const sub = await Sub.findOne({ slug }, { relations: ["course"] });
    if (!sub) throw new Error("sub not found");
    const lessons = await Lesson.find({
      where: { sub },
      order: { createdAt: "ASC" },
    });
    sub.lessons = lessons;
    return res.status(200).json(sub);
  } catch (error) {
    switch (error.message) {
      case "sub not found":
        return res.status(404).json({ error: "sub not found" });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//! Create Sub
const createSub = async (req: Request, res: Response) => {
  const errors: any = {};
  const { title, description, courseSlug } = req.body;
  if (isEmpty(title)) errors.title = "title cannot be empty";
  if (isEmpty(description)) errors.description = "description cannot be empty";
  if (isEmpty(courseSlug)) errors.courseSlug = "please choose a course";

  try {
    if (Object.keys(errors).length > 0) throw new Error("validation errors");
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) throw new Error("course is not found");
    const sub = new Sub({
      description,
      title,
      courseSlug,
    });
    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case "validation errors":
        return res.status(404).json(errors);
      case "course is not found":
        return res.status(404).json({ error: error.message });
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};

//! ────────────────────────────────────────────────────────────────────────────────
//! Update a  sub
const updateSub = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const slugName = req.params.slug;
  let errors: any = {};
  try {
    // validate
    if (isEmpty(title)) errors.title = "title cannot be empty";
    if (isEmpty(description))
      errors.description = "description cannot be empty";
    // check if sub exists
    const sub = await Sub.findOne({
      where: { slug: slugName },
    });
    if (!sub) throw new Error("subcourse not found");
    if (Object.keys(errors).length > 0) throw new Error("input error");

    // update sub
    await getConnection()
      .createQueryBuilder()
      .update(Sub)
      .set({
        title,
        description,
        slug: slug(title, "_") + "_" + makeid(3),
      })
      .where("slug = :slug", { slug: slugName })
      .execute();
    return res.status(200).json({ success: "subcourse updated" });
  } catch (error) {
    switch (error.msg) {
      case "subcourse not found":
        return res.status(404).json({ error: error.msg });
      case "input error":
        return res.status(403).json(errors);
      default:
        return res.status(500).json({ error: "something went wrong" });
    }
  }
};
//! ────────────────────────────────────────────────────────────────────────────────
//! Delete Sub
const deleteSub = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    await Sub.findOneOrFail({ slug });
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Sub)
      .where("slug = :slug", { slug })
      .execute();
    return res.status(200).json({ message: "sub deleted succefully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//* ────────────────────────────────────────────────────────────────────────────────
//* ────────────────────────────────────────────────────────────────────────────────
//* ────────────────────────────────────────────────────────────────────────────────
//* ────────────────────────────────────────────────────────────────────────────────

//!course routes
//?GET
router.get("/course/all", getCourses);
router.get("/course/latest", getLatestCourses);
router.get("/course/search/", searchCourse);
router.get("/course/:slug", getCourse);
//?POST
router.post("/course", user, auth, editor, createCourse);
//?UPDATE
router.put("/course/updateCourseOrder", updateCourseOrder);
router.put("/course/:slug", user, auth, editor, updateCourse);
//?DELETE
router.delete("/course/:slug", user, auth, editor, deleteCourse);

//!subs routes
//?GET
router.get("/", getSubs);
router.get("/:slug", getSub);
//?POST
router.post("/", user, auth, editor, createSub);
//?UPDATE
router.put("/:slug", user, auth, editor, updateSub);
//?DELETE
router.delete("/:slug", user, auth, editor, deleteSub);

export default router;