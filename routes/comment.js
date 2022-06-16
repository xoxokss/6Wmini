const express = require("express");
const Comment = require("../models/comment");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//상세 게시글 댓글 조회
router.get("/comment/:post_id", async (req, res) => {
  const { post_id } = req.params;
  // post_id에 속한 코멘트를 찾아서 comment_id, nickname, comment, created_at 을 보내줘야함
  const comments = await Comment.find({ post_id: post_id }).sort("created_at"); // 댓글 작성시간 순으로 정렬

  res.json({
    comments: comments.map((a) => ({
      created_at:
        a.created_at.toLocaleDateString("ko-KR") +
        a.created_at.toLocaleTimeString("ko-KR"),
      nickname: a.nickname,
      comment: a.comment,
    })),
  });
});

//댓글 작성 API
router.post("/comment/:post_id", authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals; // JWT 인증 정보
    const { comment } = req.body; // 사용자가 입력한 댓글
    const { post_id } = req.params; // 해당 게시글 post_id를 parameter로 받음.
    await Comment.create({
      post_id,
      comment,
      user_id: user.user_id,
      nickname: user.nickname,
    });
    res.status(201).send({ result: true, message: "댓글 작성 완료" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ result: false });
  }
});

//댓글 수정
router.patch("/comment/:comment_id", authMiddleware, async (req, res) => {
  const { comment_id } = req.params;
  const { user } = res.locals;
  const { comment } = req.body;
  // const exist_Comment = await Comment.findOne({ _id: comment_id });
  const exist_Comment = await Comment.findByIdAndUpdate(comment_id);

  if (!user.user_id === exist_Comment.user_id) {
    res.send({ result: false, message: "사용자가 작성한 댓글이 아닙니다." });
  } else {
    await Comment.findByIdAndUpdate(comment_id, { $set: { comment: comment } });
    res.status(200).send({ result: true, message: "댓글 수정 완료" });
  }
});

//댓글 삭제
router.delete("/comment/:comment_id", authMiddleware, async (req, res) => {
  const { comment_id } = req.params;
  const { user } = res.locals;

  const exist_Comment = await Comment.findByIdAndDelete(comment_id);
  console.log(exist_Comment); //DB에서 찾았는지 확인용
  if (!user.user_id === exist_Comment.user_id) {
    res.send({ result: false, message: "사용자가 작성한 댓글이 아닙니다." });
  } else {
    await Comment.deleteOne({ _id: comment_id });
    res.status(200).send({ result: true, message: "댓글 삭제 완료" });
  }
});

module.exports = router;
