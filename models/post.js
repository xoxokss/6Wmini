const mongoose = require('mongoose');
//taein
const PostSchema = mongoose.Schema(
    {
        title: String,
        thumbnail_url: String,
        onair_year: Number, //1992, 2000, 1980 4자리년도 숫자형식으로
        content: String,
        ost_url: String,  //youtube 주소로만 
        user_id: String,  
        likes:{
            type: Number,
            default: 0,  //좋아요 수 default는 0 으로준다.
        },
        like_users: [String], //이 글에 좋아요를 누른 사람들의 id값으로 좋아요를 눌렀으면 배열에 들어간다.
    },
    { timestamps: true }
);

PostSchema.virtual('postId').get(function () {
    return this._id.toHexString();
});

PostSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Post', PostSchema);