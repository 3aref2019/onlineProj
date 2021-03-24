// import Post from "../entities/Post";
// import { Request, Response, Router } from "express";
// import auth from "../middlewears/auth";
// import user from "../middlewears/user";
// import BookmarkPost from "../entities/BookmarkPost";
// import { getRepository } from "typeorm";

// const getBookmarkPosts = async (_: Request, res: Response) => {
//   try {
//     const bookmarkPosts = await getRepository(BookmarkPost)
//       .createQueryBuilder("bookmark_post")
//       .where({ userId: res.locals.user.id })
//       .select(["bookmark_post.userId", "post.identifier", "post.slug"])
//       .leftJoin("bookmark_post.post", "post")
//       .getMany();

//     return res.status(200).json(bookmarkPosts);
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({ error: "something went wrong" });
//   }
// };

// const addPostToBookmark = async (req: Request, res: Response) => {
//   const postId = req.params.postId;
//   const slug = req.params.postSlug;
//   const userId = res.locals.user.id;
//   try {
//     const post = await Post.findOne({ where: { identifier: postId, slug } });
//     if (!post) throw new Error("post not found");
//     const foundBookmark = await BookmarkPost.findOne({
//       where: { userId, postId },
//     });
//     if (foundBookmark) throw new Error("already bookmarked");

//     const bookmark = BookmarkPost.create({ userId, postId });
//     await bookmark.save();
//     return res.status(200).json({ succes: bookmark });
//   } catch (error) {
//     switch (error.message) {
//       case "post not found":
//         return res.status(404).json({ error: error.message });
//       case "already bookmarked":
//         return res.status(404).json({ error: error.message });
//       default:
//         return res.status(500).json({ error });
//     }
//   }
// };

// const removePostFromBookmarkPosts = async (req: Request, res: Response) => {
//   const id = Number(req.params.bookmarkId);
//   const user = res.locals.user;
//   try {
//     const bookmarkPost = await BookmarkPost.findOne({ where: { id } });
//     if (!bookmarkPost) throw new Error("bookmark not found");
//     if (user.id === bookmarkPost.id) {
//       BookmarkPost.delete(id);
//     } else {
//       throw new Error("unauthenticated");
//     }
//   } catch (error) {
//     switch (error.message) {
//       case "bookmark not found":
//         return res.status(404).json({ error: error.message });
//       case "unauthenticated":
//         return res.status(403).json({ error: error.message });
//       default:
//         return res.status(500).json({ error });
//     }
//   }
// };

// const router = Router();

// //api/bookmarks
// router.get("/", user, auth, getBookmarkPosts);
// router.post("/c/:postId/:postSlug", user, auth, addPostToBookmark);
// router.delete("/d/:bookmarkId", user, auth, removePostFromBookmarkPosts);
// export default router;
