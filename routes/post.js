const express = require("express");
const Post = require("../models/post"); //스키마 폴더 안에 post 스키마
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();



/**
 * 전체 게시글 불러오기 API. index.ejs > getArticles()
 */
//taein
router.get("/posts", async (req, res) => { 
   // [{ post의 내용. _id: ..., title: ..., content: ... }, { }, { }]
    const { postDate } = req.body;

    const posts = await Post.find().sort({ createdAt: 'desc' }).exec(); //post라는 스키마에서 find, sort()날짜기준 내림차순 
     // console.log("posts",posts);    
    // userId만 추출. ['userId1', 'userId2', 'userId3', ..]
    const userIds = posts.map((author) => author.user_id);
    
    // $in : 비교 연산자. 주어진 배열(userIds) 안에 속하는 값
    const userInfoById = await User.find({ $in: userIds
    })
        .exec()
        .then((user) =>
          user.reduce(
                (prev, a) => ({
                    ...prev,   
                    [a.user_id]: a, 
                 }),
                    {} 
                    )
                    );     
    res.send({
       posts: posts.map((a) => ({     
           
            postId: a.postId,
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
router.post("/write", authMiddleware, async (req, res) => { 
    
    try {
        //const { user } = res.locals;
        const { title, user_id, thumbnail_url, onair_year, content, ost_url } = req.body; // body 정보가져옴

        // 자동으로 postId를 넣는 라이브러리 설치 후 중복확인 절차 제거
        // isExist = await Post.find({ postId });
        // if (isExist.length) {
        //     return res.status(400).json({ success: false, errorMessage: "이미 있는 게시글입니다." });
        // }
        
    if(!(ost_url.includes("www.youtube.com"||"youtu.be"))){
        res.status(401).send({
            errorMessage: 'youtube의 영상만 가능합니다.',
        });
        
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

        //res.json({ post: createpost });
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
router.patch('/post/:postId/',authMiddleware,async (req, res) => {
    const { title, thumbnail_url, onair_year, content, ost_url,user_id } = req.body;
    const {postId} = req.params;
    const post = await Post.findById(postId);
    // console.log(post.postPassword);
    // console.log(postPassword);
   
        const modifyArticle = await Post.findByIdAndUpdate(postId, {
            $set: { 
                title:title,
                thumbnail_url:thumbnail_url,
                onair_year:onair_year,
                content:content,
                ost_url:ost_url 
            },
        });
        res.status(201).json({
            result: 'success',
            msg: '글이 수정되었습니다.',
        });
    }    
);

/**
 * 좋아요 기능 API 
*/
//taein
router.patch('/posts/:postId/like',authMiddleware,async (req, res) => {
    const { user_id } = req.body;
    const {postId} = req.params;
   // console.log(postId);
    const post = await Post.findOne({_id:{ $in: postId } }).exec();  
   
   // console.log("post",post);
    let cnt = post.likes;
    //console.log("type",typeof(cnt))
    const found = post.lovers.find(e => e === user_id);
     
    if(found)  {
               
        await post.updateOne({$pull:{like_users: user_id}})
        await post.updateOne({$set: {likes: cnt-1}})
        res.status(201).json({ result: 'success', msg: '좋다 말았어요.' });
    }else {       
                    
        await post.updateOne({$push:{like_users: user_id}})
        await post.updateOne({$set: {likes: cnt+1}})
        res.status(201).json({ result: 'success', msg: '좋아요!' });
    }
    }
);

// 게시글 상세 조회 API
/*
router.get("/post/:postId", authMiddleware, async (req, res) => { 
    const { user } = res.locals;
    const { postId } = req.params;

    const [detail] = await Post.find({ postId: Number(postId) });
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
router.put("/post/:postId", authMiddleware, async (req, res) => { // 게시글 수정 API
    const { user } = res.locals;
    const { postId } = req.params;
    const { password, title, content } = req.body;
    const correctPw = await Post.findOne({user})
    if (password === correctPw.password) {
        const updatepost = await Post.updateOne({ postId: Number(postId) }, { $set: { title, content } });
        res.status(201).json({ post: updatepost })
    } else {
        return res.status(401).json({ success: false, errorMessage: "비밀번호 재확인." });
    };
});

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