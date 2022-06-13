const express = require("express");
const Comment = require("../models/comment");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//상세 게시글 댓글 조회
router.get("/comment/:post_id", async (req, res) => {
  const { post_id } = req.params;
  // post_id에 속한 코멘트를 찾아서 comment_id, nickname, comment, created_at 을 보내줘야함
  const comments = await Comment.find({ post_id: post_id }).sort("-comment_id"); // 댓글 작성시간 순으로 정렬
  console.log(comments);

  res
  .json({ result: true, comments: comment });
});

//댓글 작성
router.post("/comment", authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    const { post_id, comment } = req.body;
    await Comment.create({
      comment_id,
      post_id,
      comment,
      nickname: user.nickname,
    });
    res.send({ result: true });
  } catch (err) {
    console.log(err);
  }
});

//댓글 수정
router.patch("/comment/:comment_id", authMiddleware, async (req, res) => {
  const { comment_id } = req.params;
  const { user } = res.locals;
  const { comment, nickname } = req.body;
  console.log(comment, user.nickname);

  if (nickname === user.nickname) {
    await Comment.updateOne(
      { comment_id: comment_id },
      { $set: { comment: comment } }
    ); //db의 필드값: req.body
    res.send({ result: true });
  } else {
    res.send({ result: false });
  }
});

//댓글 삭제
router.delete("/comment/:comment_id", authMiddleware, async (req, res) => {
  const { comment_id } = req.params;
  const { user } = res.locals;
  const { nickname } = req.body;

  if (nickname === user.nickname) {
    await Comment.deleteOne({ comment_id: comment_id });
    res.send({ result: true, msg: "댓글 삭제 완료" });
  } else {
    res.send({ result: false });
  }
});

module.exports = router;
