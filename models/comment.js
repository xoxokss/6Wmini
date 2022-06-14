const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    post_id: String,
    user_id: String,
    nickname: String,
    comment: String,
    // created_at : { type : Date, default : Date.now},
  },
  { timestamps: { createdAt: "created_at" } } // 자동 타임스탬프가 작동하는지 확인하기
);

CommentSchema.virtual("comment_id").get(function () {
  return this.c_id.toHexString();
});
CommentSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Comment", CommentSchema);
