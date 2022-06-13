const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({   //다른 곳은 new 안쓰는데 차이가 ?? //상선 : new 는 constructor(생성자 함수)에 쓰입니다. this 라는 빈객체가 암시적으로 생성됩니다.

  user_id: String,
  profile_img: Number,
  nickname: String,
  password: String,
});

//user_id가 회원이 직접 입력하는 이메일로 결정되서 Mongoose를 이용한 virtual은 불필요합니다.
/* 
UserSchema.virtual("user_id").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
*/
module.exports = mongoose.model("User", UserSchema);


