const express = require("express"); //express 모듈 불러오기
const app = express();
const cors = require("cors"); // CORS 모듈 불러오기
const connect = require("./models"); // index.js 파일 연결해서 mongoDB 연결
require("dotenv").config(); // dotenv 모듈 불러오기 및 연결 구성

const port = 8080;

connect(); //mongoDB 연결 실행

const postRouter = require("./routes/post"); // require 함수로 post 모듈(board.js)을 가지고옴.

const userRouter = require("./routes/user"); // require 함수로 user라우터 모듈(user.js)을 가지고옴.

const commentRouter = require("./routes/comment"); // require 함수로 comment라우터 모듈(user.js)을 가지고옴.

app.use(cors()); // CORS 모듈 실행

app.use(express.json()); // json 미들웨어 실행

app.use(express.urlencoded()); // url 인코더 미들웨어 실행

app.use(express.json()); // json 미들웨어 실행

app.use(express.urlencoded()); // url 인코더 미들웨어 실행

app.use("/api", [postRouter, commentRouter, userRouter]); // /api라는 url 요청시 라우터 미들웨어 실행.

//루트 디렉토리 http://localhost:8080
app.get("/", (req, res) => {
  res.send("Hello! 항해99 7기 D반 2조 백엔드 서버입니다.");
});

app.listen(port, () => {
  console.log(port, "번 포트로 서버가 열렸어요!");
});


