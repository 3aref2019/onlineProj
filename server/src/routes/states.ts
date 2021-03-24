import { Request, Response, Router } from "express";
import Article from "../entities/Article";
import Book from "../entities/Book";
import Course from "../entities/Course";
import Lesson from "../entities/Lesson";
import Sub from "../entities/Sub";
import User from "../entities/User";
import auth from "../middlewears/auth";
import editor from "../middlewears/editor";
import user from "../middlewears/user";
const router = Router();
const getStatistics = async (req: Request, res: Response) => {
  try {
    const [, articlesCount] = await Article.findAndCount();
    const [, lessonsCount] = await Lesson.findAndCount();
    const [, subsCount] = await Sub.findAndCount();
    const [, usersCount] = await User.findAndCount();
    const [, coursesCount] = await Course.findAndCount();
    const [, booksCount] = await Book.findAndCount();

    return res
      .status(200)
      .json({
        articlesCount,
        lessonsCount,
        subsCount,
        usersCount,
        coursesCount,
        booksCount
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong" });
  }
};

router.get("/", user, auth, editor, getStatistics);

export default router;
