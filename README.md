
# 📺추억의 만화영화

## 👋프로젝트 소개
어린 시절, 학교가 끝나면 TV 앞으로 달려가 챙겨보던 만화영화들을 기억하시나요?<br/>
추억의 만화영화들을 공유하며 어린 시절 향수를 느껴보아요 :)<br/><br/>
<br/>
<br/>

## 팀원 소개와 역할
#### Frontend (https://github.com/Trainy32/Anime)
강수현 : 글 작성 & 수정, 메인 리스트 디스플레이 <br/>
김은진 : 로그인, 회원가입, 헤더 <br/>
정예빈 : 글 상세보기, 삭제하기, 좋아요, 댓글 기능 <br/><br/>

 #### Backend (https://github.com/xoxokss/6Wmini/)
김상선: 댓글 작성 수정 삭제 관련 API <br/>
진태인: 게시글 작성 조회 수정 삭제 좋아요 관련 API <br/>
최봉규: 회원가입, 로그인 관련 API <br/><br/>
<br/>
<br/>
## 👨‍💻 프로젝트 기간

2022년 6월 10일 ~ 2022년 6월 16일 (총 7일)

<br/>
<br/>

## 📚 기술스택 소개
<p align="center">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&  logoColor=white">
<img src="https://img.shields.io/badge/JSON Web Tokens-000000?style=for-the-badge&logo=JSON Web Tokens&logoColor=FFFFFF"/>
<br/>
<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=FFFFFF"/> 
<img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=for-the-badge&logo=GitHub Actions&logoColor=FFFFFF"/> 
<img src="https://img.shields.io/badge/OBS Studio-302E31?style=for-the-badge&logo=OBS Studio&logoColor=000000"/> 
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=FFFFFF"/>
  
## 🎬 시연영상
[시연영상 유튜브](https://youtu.be/_U0lL7_E7qU)

<br/>
<br/>
 
   ## 🐶🍯 사이트 주소
 <p>

 프론트 엔드 도메인 : http://suhyun.site.s3-website.ap-northeast-2.amazonaws.com/</br>
 백엔드 서버 : http://54.180.121.151/
  

<br/>
<br/>

## 🎨 프로젝트 초안(와이어 프레임)

[와이어프레임 Figma 링크](https://www.figma.com/proto/Nb2JQYk7ZFzk4qywUeH9ka/2%EC%A1%B0-%EB%AF%B8%EB%8B%88%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%99%80%EC%9D%B4%EC%96%B4%ED%94%84%EB%A0%88%EC%9E%84?node-id=34%3A12&scaling=min-zoom&page-id=0%3A1)

## 🔨 개발툴
 #### Backend
-   Server: AWS EC2 (Ubuntu 18.04 LTS)
-   Database: MongoDB
-   Runtime Flatform : Node.js
-   Tool : Git, Notion

<br/>
<br/>
  
  ## 🛠 구현한 기능 
<li> <b> 로그인 / 회원가입 </b><br/>
: JWT를 이용한 로그인과 회원가입<br/>

<br/>
  
<li> <b> 헤더 </b><br/>
: 유저의 로그인 여부 및 현재 보고있는 페이지를 판별하여 다른 정보를 보여줍니다. <br/>

<br/>

<li> <b> 메인페이지 </b><br/>
: 추천순, 방영연도 순의 2가지 방식으로 리스트를 정렬해서 볼 수 있습니다. <br/>
: 게시글의 추천 수가 썸네일과 함께 디스플레이 됩니다. <br/>
: Windowing 기법을 이용한 무한스크롤 <br/>
  
<br/>

<li> <b> 글 작성 & 수정 </b><br/>
: 업로드한 이미지를 미리보기 할 수 있습니다<br/>
: 유튜브 데이터 API를 사용해 ost 영상 링크를 페이지 내에서 바로 검색하고 가져올 수 있습니다.<br/>

<br/>
  
<li> <b> 글 상세보기 & 댓글 & 좋아요 </b>
 : 리액트 플레이어를 이용해 상세보기 페이지에서 바로 동영상을 재생할 수 있습니다.<br/>
 : 게시글에 좋아요를 누를 수 있습니다. <br/>
 : 게시글에 댓글을 달고 & 수정하고 & 삭제할 수 있습니다.
<br/>
<br/>

<br/>
<br/>
 

 ## API 설계
[API Notion 링크](https://www.notion.so/4fcd8f229d4d48478530508817aef5f8?v=d0a19e1d534f492bbbfb43a602bcdbed)
<br/>
<br/>
 
## ERD
<IMG SRC="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F995d6be8-d5c3-4764-ab48-d366118697ad%2FUntitled.png?table=block&id=d988dbe2-e2fe-497a-97a8-09a459614a0f&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=1560&userId=d664f5fa-2103-4eb2-9920-b5fed697333a&cache=v2">
 
<br/>
<br/>

## 💣 프로젝트 중 힘들었던 점이 있다면?
1)프론트와 백엔드가 API명세서를 통해 소통했는데 처음부터 완벽하게 작성하는건 불가능할정도로 어려웠다
2) CORS 문제 공부 : 프로토콜이 다르면 CORS 에러가 난다는 것을 배웠다. CORS options 에서 모든 허용을 해도 프로토콜이 다르면 에러가 나는 듯 하다. FE쪽에서 클라이언트 요청을 HTTPS - > HTTP로 변경하는 방법을 통해 해결되었다.
3) 좋아요 기능에 하나의 API만 사용해서 인스타의 좋아요 버튼처럼 토글로 동작하게 하였다. 게시글에 좋아요를 누른 유저아이디도 담고 있기 때문에 누가 좋아요를 눌렀는지도 알 수 있도록 활용할 수 있다.
4) 좋아요 기능은 게시글 정보 테이블에 좋아요를 누른 사람을 배열로 저장하도록 하여 게시글 정보 테이블에 해당 사용자가 존재하면  유저아이디를 배열에서 제거하고 좋아요 카운트를 하나 줄이고 만약 없다면 배열에 유저 아이디를 저장하고 좋아요 카운트를 올려주는 방식으로 처리하였다.
 
## 프로젝트에 시간적 여유가 있었다면 추가하고 싶은 것.
 1)Swagger를 통한 API 작성해보기
처음 API를 작성할 때, RES, REQ 에는 어떤 데이터가 필요한지 고민하기 어려웠고 오타도 많아서 FE와 확인하는 작업을 반복했다.
Swagger를 이용하면 어떤 데이터를 주고받는 지에 대한 API 서버의 spec을 명세,관리, 수정하고 팀원들과 서로 공유할 수 있다고 한다.
2) 소셜로그인

 
 ## 기술 매니저님 피드백
 1) 사용자의 비밀번호를 bcrypt를 이용해 암호화하기.
 2) 커밋명은 줄이고 description에 설명쓰기. 
 3) 서버에서도 어느정도 validation을 한 후에 FE에 넘기기.
 4) 나중에는 토큰은 acess token과 refresh token 두가지가 들어가는 상황도 발생한다. 이 경우 DB에서 토큰을 지우는 API가 필요하다.
 5) 좋아요 기능은 Like DB 테이블을 따로 나눠서 post와 user를 엮는 테이블을 만들고 삭제하는 게 좋다.
 6) 좋아요 만드는 API와 삭제하는 API를 따로 만드는 게 좋다.
 7) 백엔드는 프론트엔드가 와이어프레임을 그리는 순간부터 데이터를 어떻게 만들어야할까 고민해야 한다.
 와이어프레임 설계의 주도권은 프론트엔드이며, 백엔드는 그려지는 와이어프레임을 보면서 데이터타입을 생각하고, 데이터 타입부터 전달해야 한다.
 8) 깃허브 API가 REST의 표본이니 한번 참고해볼 것.
