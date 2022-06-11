const express = require("express");
const Post = require("../models/post"); 
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

/**
 * 전체 게시글 불러오기 API.
 */
//taein
router.get("/posts", async (req, res) => { 
   // [{ post의 내용. _id: ..., title: ..., content: ... }, { }, { }]
    //const { postDate } = req.body;

    const posts = await Post.find().sort({ createdAt: 'desc' }).exec(); //post라는 스키마에서 find, sort()날짜기준 내림차순 
    //console.log(posts); []배열 안에 게시글 하나씩[{게시글1},{게시글2},{게시글3}]   
    
    const user_ids = posts.map((writer) =>writer.user_id);
    console.log(user_ids);  //user_id만 추출. ['user_id1', 'user_id2', 'user_id3', ..]
    // $in mongodb query
    const userInfoById = await User.find({
        user_id: { $in: user_ids },
    }).exec()    
         .then((user) =>user.reduce((prev, a) => ({...prev,[a.user_id]:{user_id:a.user_id,nickname:a.nickname}, }), {} )); 
         //console.log(userInfoById);
         //프론트에서 원하는데로 가공해주자
    res.send({
       posts: posts.map((a) => ({   
           
            post_id: a.post_id,
            thumbnail_url: a.thumbnail_url,
            onair_year:a.onair_year,
            title: a.title,
            ost_url: a.ost_url,
            content: a.content,
            createdAt: a.createdAt,
            likes: a.likes,
            like_users: a.like_users,
            userInfo: userInfoById[a.user_id],
        })),
    });
});

/**
 * 글 생성, 입력 API 
*/
//taein
router.post("/posts", authMiddleware, async (req, res) => {  
    try {      
        //const { user } = res.locals;
        const { title, user_id, thumbnail_url, onair_year, content, ost_url } = req.body; // body 정보가져옴                
        if(!(ost_url.includes("www.youtube.com")||ost_url.includes("youtu.be"))){
            res.status(401).send({
                errorMessage: 'youtube의 영상만 가능합니다.',
            });   
            return;     
        }
        const posting = await Post.create({
                title,
                user_id,
                thumbnail_url, 
                onair_year, 
                content,
                ost_url,
        });          
        res.status(201).json({ result: 'success', msg: '내 추천만화가 등록되었습니다.' });    

        } catch (err) {
            console.log(err)
            res.status(400).send({
                errorMessage: "게시글 작성 에러",
            })
        };
});

/**
 * 게시글 수정 API 
*/
//taein
router.patch('/posts/:post_id/modify',authMiddleware,async (req, res) => {
    try{
        const { title, thumbnail_url, onair_year, content, ost_url,user_id } = req.body;
        const {post_id} = req.params;
        const post = await Post.findById(post_id);
           
        const modifyArticle = await Post.findByIdAndUpdate(post_id, {
            $set: { 
                title:title,
                thumbnail_url:thumbnail_url,
                onair_year:onair_year,
                content:content,
                ost_url:ost_url 
            },
        })
        res.status(201).json({
            result: 'success',
            msg: '글이 수정되었습니다.',
        });
    }
    catch (error) {    
        res.status(400).send({
        errorMessage: '게시글 수정에 실패하였습니다.',
        });
    }
  
});
/**
 * 게시글 삭제 기능 API 
*/
//taein 
router.delete('/posts/:post_id',authMiddleware, async (req, res) => {    
    try {
        const {post_id} = req.params;
        const existsPost = await Post.findById(post_id);
        //console.log(existsPost);
       
        if (existsPost) {                      
                await Post.findByIdAndDelete(post_id); // postId 일치하는 것으로 삭제
                res.status(200).json({
                    result: 'success',
                    msg: '글이 삭제되었습니다.',
                });
                return;
         }
         else {
            // 올 일은 없지만, 멀티 세션으로 같은 글을 동시에 지우려고 했을때?---???
            res.status(400).json({
                result: 'error',
                msg: '게시글이 이미 삭제되었습니다.',
            });
            return;
        }       
    } catch (error) {        
        res.status(400).send({
            errorMessage: '게시글 삭제에 실패하였습니다.',
        });
    }
})
/**
 * 좋아요 기능 API 
*/
//taein
router.patch('/posts/:post_id/like',authMiddleware,async (req, res) => {
    try{
        const { user_id } = req.body;
        const {post_id} = req.params;
        //console.log(postId);
        const post = await Post.findOne({_id:{ $in: post_id } }).exec();  
    
       // console.log("post",post);
        let cnt = post.likes;
        
        const found = post.like_users.find(e => e === user_id);
        
            if(found)  {                    
                await post.updateOne({$pull:{like_users: user_id}})
                await post.updateOne({$set: {likes: cnt-1}})
                res.status(201).json({ result: 'success', msg: '좋다 말았어요.' });
            }else {                                  
                await post.updateOne({$push:{like_users: user_id}})
                await post.updateOne({$set: {likes: cnt+1}})
                res.status(201).json({ result: 'success', msg: '좋아요!' });
            } 
    } catch (error) {    
        res.status(400).send({
        errorMessage: '좋아요 선택 실패하였습니다.',
        });
    }
    
});



// 게시글 상세 조회 API
/*
router.get("/post/:post_id", authMiddleware, async (req, res) => { 
    const { user } = res.locals;
    const { post_id } = req.params;

    const [detail] = await Post.find({ postId: Number(post_id) });
if(detail.nickname !== user.nickname){
    console.log("유효하지 않은 회원정보");
    res.status(400).redirect("/")
}
    res.json({ //json형식으로 상세 조회 응답
        detail, // detail이라는 Key에 json 데이터를 넣어서 응답을 준다.
    });
});
*/
/*
router.delete("/post/:postId", authMiddleware, async (req, res) => { // 게시글 삭제 API
    const { user } = res.locals;
    const { postId } = req.params;
    const { password } = req.body;
    const correctPw = await Post.findOne({ user })
    if (password == correctPw.password) {
        const deletepost = await Post.deleteOne({ postId: Number(postId) });
        res.status(200).json({ post: deletepost })
    } else {
        return res.status(401).json({ success: false, errorMessage: "비밀번호 재확인." });
    };
});





router.get('/post/write', async (req, res) => {
    const post = ''; // write.ejs는 modify 부분과 같이 쓰므로,
    //새 글 쓰기 일 경우 !post 이 true 로 넘길 수 있도록 빈 스트링값 전달
    res.status(200).render('write', { post: post });
});
router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params; // localhost:3000/api/posts/1, 2, ... <- 여기서 req.params는 { postId : '1' }, postId = 1

    const post = await Post.findById(postId);
    const postAuthor = await User.findById(post.userId);
    const comments = await Comment.find({ postId: postId }).exec();
    

    const commentUserIds = comments.map(
        (commentAuthor) => commentAuthor.userId
    );
  
    const commentAuthorInfoById = await User.find({
        _id: { $in: commentUserIds },
    })
        .exec()
        .then((commentAuthor) =>
            commentAuthor.reduce(
                (prev, ca) => ({
                    ...prev,
                    [ca.userId]: ca,
                }),
                {}
            )
        );

    const postInfo = {
        postId: post._id,
        title: post.title,
        content: post.content,
        userId: postAuthor.userId,
        nickname: postAuthor.nickname,
        createdAt: post.createdAt,
    };

    const commentsInfo = comments.map((comment) => ({
        commentId: comment.commentId,
        content: comment.commentContent,
        userInfo: commentAuthorInfoById[comment.userId],
        createdAt: comment.createdAt,
    }));
    
   
    res.status(200).render('read', {
        post: postInfo,
        commentsInfo: commentsInfo,
    }); // read.ejs 의 내용 render, postId 값이 일치하는 post 내용 전달
});
*/
module.exports = router; // app.js의 require()로 리턴. module.exports는 꼭 있어야함.