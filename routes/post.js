const express = require("express");
const Post = require("../models/post"); 
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth-middleware");
const Joi = require("joi");
const router = express.Router();

/**
 * 전체 게시글 불러오기 API.
 */

router.get("/posts/:sort", async (req, res) => { 
    try{
    
        const {sort} = req.params;
        let posts=[];       
             
        if(sort==="d_time"){
            posts = await Post.find().sort({ createdAt: 'desc' }).exec(); // sort()작성시간 기준 내림차순   
        }else if(sort==="a_time"){
            posts = await Post.find().sort({ createdAt: 'asc' }).exec(); // sort()작성기준 오름차순
        }else if(sort==="likes"){
            posts = await Post.find().sort({ likes: 'desc' }).exec(); // sort()좋아요 기준 내림차순
        }else if(sort==="release_year"){
            posts = await Post.find().sort({ onair_year: 'asc' }).exec(); // sort()방영일 기준 오름차순
        }
    
        //console.log(posts); []배열 안에 게시글 하나씩[{게시글1},{게시글2},{게시글3}]   
    
        const user_ids = posts.map((writer) =>writer.user_id);
        //console.log(user_ids);  //user_id만 추출. ['user_id1', 'user_id2', 'user_id3', ..]
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
                    //ost_url: a.ost_url,
                    //content: a.content,
                    created_at: a.createdAt.toLocaleDateString('ko-KR')+a.createdAt.toLocaleTimeString('ko-KR'),
                    likes: a.likes,
                    //like_users: a.like_users,
                    userInfo: userInfoById[a.user_id],
                })),
        });     

        }catch(error) {       
            res.status(400).send({
            errorMessage: "게시글 조회에 실패하였습니다.",
        })
    };

});
/**
 * 글 생성, 입력 API 
*/
const post_schema = Joi.object({
      
    title: Joi.string(),
    thumbnail_url: Joi.string().required(),
    onair_year: Joi.number(), //1992, 2000, 1980 4자리년도 숫자형식으로
    //nickname: Joi.string(),
    content: Joi.string(),
    ost_url: Joi.string(),  //youtube 주소로만 
    user_id: Joi.string(),  
    likes:{
        type: Number,
        default: 0,  //좋아요 수 default는 0 으로준다.
    },
    like_users: [String], //이 글에 좋아요를 누른 사람들의 id값으로 좋아요를 눌렀으면 배열에 들어간다.
});
router.post("/post", authMiddleware, async (req, res) => {  
    try {      
        
        const { user } = res.locals;
        //console.log(user.user_id);
        const { title, thumbnail_url, onair_year, content, ost_url } = await post_schema.validateAsync(req.body); // body 정보가져옴                
        if(!(ost_url.includes("www.youtube.com")||ost_url.includes("youtu.be"))){
            res.status(412).send({
                errorMessage: 'youtube의 영상만 가능합니다.',
            });   
            return;     
        } else if (!(onair_year>1900&&onair_year<2022)) {
            res.status(412).send({
                errorMessage: "년도 형식으로 입력해주세요."
            });
            return; 
        } else if (content.search(/^[\s\S]{1,2000}$/) == -1) {
            res.status(412).send({
                errorMessage: "게시글 내용의 형식이 일치하지 않습니다."
            });
            return;
        } else if (title.search(/^[\s]*$/) != -1 || content.search(/^[\s]*$/) != -1) {
            res.status(412).send({
                errorMessage: "공백으로만 이루어진 게시글은 작성할 수 없습니다."
            });
            return;
        }

        await Post.create({
                title,
                user_id : user.user_id,
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

router.patch('/post/:post_id/',authMiddleware,async (req, res) => {
    try{
        const { title, thumbnail_url, onair_year, content, ost_url} = await post_schema.validateAsync(req.body);        
        const {post_id} = req.params;
        
        if(!(ost_url.includes("www.youtube.com")||ost_url.includes("youtu.be"))){
            res.status(412).send({
                errorMessage: 'youtube의 영상만 가능합니다.',
            });   
            return;     
        } else if (!(onair_year>1900&&onair_year<2022)) {
            res.status(412).send({
                errorMessage: "년도 형식으로 입력해주세요."
            });
            return; 
        } else if (content.search(/^[\s\S]{1,2000}$/) == -1) {
            res.status(412).send({
                errorMessage: "게시글 내용의 형식이 일치하지 않습니다."
            });
            return;
        } else if (title.search(/^[\s]*$/) != -1 || content.search(/^[\s]*$/) != -1) {
            res.status(412).send({
                errorMessage: "공백으로만 이루어진 게시글은 작성할 수 없습니다."
            });
            return;
        }          
        await Post.findByIdAndUpdate(post_id, {
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

router.delete('/post/:post_id',authMiddleware, async (req, res) => {    
    try{
            const {post_id} = req.params;
            const existsPost = await Post.findById(post_id);
            //console.log(existsPost);
        
            if(existsPost) {                      
                    await Post.findByIdAndDelete(post_id); // postId 일치하는 것으로 삭제
                    res.status(200).json({
                        result: 'success',
                        msg: '글이 삭제되었습니다.',
                    });
                    return;
            }
            else{
                // 올 일은 없지만, 멀티 세션으로 같은 글을 동시에 지우려고 했을때?---???
                res.status(400).json({
                    result: 'error',
                    msg: '게시글이 이미 삭제되었습니다.',
                });
                return;
            }       
    }catch (error) {        
        res.status(400).send({
            errorMessage: '게시글 삭제에 실패하였습니다.',
        });
    }
})
/**
 * 좋아요 기능 API 
*/
router.patch('/post/like/:post_id/',authMiddleware,async (req, res) => {
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

/**
 * 게시글 상세조회 기능 API 
*/
router.get('/post/detail/:post_id', async (req, res) => {
    try{
        const { post_id } = req.params; 
        
        const post = await Post.findById(post_id);
     
        const post_user = await User.findOne({user_id:post.user_id}).exec(); 
       
        
        const current_year = new Date().getFullYear();
        
       
        const postInfo = {
          
            title: post.title,
            thumbnail_url: post.thumbnail_url,
            onair_year: post.onair_year,
            content: post.content,
            ost_url: post.ost_url,
            user_id: post_user.user_id,
            nickname: post_user.nickname, //
            period: current_year-post.onair_year,//방영시점으로부터 현재의 년도까지 흐른 년수를 담음
            created_at: post.createdAt,
            likes:post_user.likes
        };  
        res.status(200).send(postInfo);
    } catch (error) {    
        res.status(400).send({
        errorMessage: '실패하였습니다.',
    });
    } 
   
});

module.exports = router; // app.js의 require()로 리턴. module.exports는 꼭 있어야함.