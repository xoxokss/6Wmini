const express = require("express"); //express 패키지 불러오기
const Joi = require("joi"); //joi 패키지 불러오기
const jwt = require("jsonwebtoken"); // JWT 패키지 불러오기
const authMiddleware = require("../middlewares/auth-middleware"); //사용자인증 미들웨어 불러오기
const User = require('../models/user') // user 스키마 불러오기
const router = express.Router(); // express 라우터 기능 불러오기

router.get("/login", (req, res) => {
    res.json({ success: true, call: "로그인 페이지입니다." })
});

const nickname_pattern = /[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9]/; // 닉네임은 알파벳 대소문자 (a~z, A~Z), 숫자(0~9) 
const postUsersSchema = Joi.object({
   
    nickname: Joi.string()
        .min(3)
        .pattern(new RegExp(nickname_pattern))
        .required(),
    password: Joi.string().min(4).required(),
    confirm_password: Joi.string().required(),
    profile_img: Joi.number().required(),
    user_id: Joi.string().required().email(),
});
//회원가입 api
router.post("/user/signup", async (req,res) => {

    
   try{
       const { user_id, profile_img, nickname, password, confirm_password, } = await postUsersSchema.validateAsync(req.body);
       
       
       if(password.includes(nickname)){            
           res.status(400).send({    //상태코드가 400보다 작은 것은 client는 성공이라 인식 400(bad request)
               errorMessage: "닉네임이 패스워드에 포함되어 있습니다!",
           });
           return;
       }  

       if(password !== confirm_password){
           res.status(400).send({    //상태코드가 400보다 작은 것은 client는 성공이라 인식 400(bad request)
               errorMessage: "패스워드가 패스워드 확인란과 일치하지 않습니다.",
           });
           return;
       }
       
       const existUsers = await User.find({
           nickname
       });
       if(existUsers.length){
           res.status(400).send({
               errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다."
           });
           return;
       }
       const user = new User({user_id, profile_img,nickname, password });
       await user.save();

       res.status(201).send({});

   }catch(err){
       console.log(err);
       res.status(400).send({
           errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
       });

   }
   
});
// user_id 중복체크 API
router.post('/user/id_check', async (req, res) => {
    const {user_id} = req.body;
    // console.log(user_id);

    const existUsers = await User.find({
        user_id
    });
    if (existUsers.length) {
        res.send({
            alert: "아이디가 중복되었습니다"
        });
        return;
    }
    
    res.send({
        alert: '사용 가능합니다.'
    });
});

/**
*로그인 API 
*/
router.post("/user/login", async(req,res)=>{
   try{

       const { user_id,password } = req.body;

       const user = await User.findOne({user_id,password}).exec();

       if(!user){
           res.status(401).send({ //401 인증실패 상태코드
                   errorMessage: "비밀번호 또는 아이디를 확인해보세요",
           });
           return;
       }
      // console.log("key",process.env.JWT_SECRET);
       const token = jwt.sign({user_id: user.user_id}, process.env.JWT_SECRET);
       //console.log("token",token);

       res
       .send({ token, });

   }catch(err){
        console.log(err);
        res.status(400).send({
           errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
       });
   }    
});

//여기가 필요한가 ? 여기가 없으면 로그인 이후 로그인상태가 유지 안된다... ? 이유는 ?
//let cnt = 0;
router.get("/user/me",authMiddleware, async (req,res)=>{  // "/users/me" 경로로 들어오는 경우 authMiddleware가 붙는다
   const {user} = res.locals;
   //cnt++;
   //console.log("/users/me 호출테스트",user,cnt);
   res.send({
       user: {  
           user_id: user.user_id,          
           profile_img : user.profile_img,
           nickname: user.nickname,
       },
   });

});

module.exports = router; // app.js의 require()로 리턴. module.exports는 꼭 있어야함.