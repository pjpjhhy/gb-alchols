import "dotenv/config.js";
import jwt from "jsonwebtoken";
import db from "./config/db.js";
import express from 'express';
import { detailPage, guide, login, mainPage, mapPage, myPage, qrPage, sign, stampPage } from './controller/webContorller.js';
import { joinUser, loginUser } from "./controller/authController.js";
import { getCourseDetails, getCourseList, qrCheck } from "./controller/courseController.js";
import { neededAuth, notNeededAuth } from "./middleware/auth.js";
import axios from "axios";
import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver-v2";
// import session from 'express-session';
import  bcrypt  from 'bcryptjs';
import fileUpload from "express-fileupload";
import { ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { firebaseConfig, storage } from "./client/js/firebase.js";

const app = express();
// JSON 형식 변환 미들웨어

// 세션
// app.use(session({
//   secret:'secret',
// }))


// EJS 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/client/html");

app.use("/css", express.static("src/client/css"));
app.use("/js", express.static("src/client/js"));
app.use("/file", express.static("src/client/file"));

app.use(express.json());

// 라우트 설정
app.get('/', mainPage);
app.get('/detail', detailPage);
app.get('/map', mapPage);
app.get('/myPage', myPage);
app.get('/qrPage', qrPage);
app.get('/stampPage', stampPage);
app.get('/login', login);
app.get('/sign', sign);
app.get('/guide',guide);

app.get("/social/callback", (req, res) => {
  res.render("accessToken");
})

// api
app.post("/api/join", joinUser);
app.post("/api/course", neededAuth, qrCheck);
app.get("/api/course", notNeededAuth, getCourseList);
app.get("/api/course/map/:point", notNeededAuth, getCourseList);
app.get("/api/course/:course_no", getCourseDetails);
app.post("/api/login", loginUser);
app.get("/api/list", getCourseList);

// 파일 업로드
app.use(fileUpload());

// 프로필 사진이 있으면
app.get("/api/fileload", async (req, res) => {
  // 현재 사용자의 액세스 토큰 가져오기
  const accessToken = req.headers.authorization.split(" ")[1];
  // 액세스 토큰을 해독하여 사용자 식별자 가져오기
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
  const userId = decoded.no;

  const QUERY = "SELECT user_image FROM users WHERE user_no=?;"
  const existProfile = await db
    .execute(QUERY, [userId])
    .then((result) => result[0][0]);
  if (existProfile) {
    return res
      .status(200)
      .json({ user_image: existProfile.user_image });
  }
}); 
// 프로필 사진을 바꾸면
app.post("/api/fileload", async (req, res) => {
  // 현재 사용자의 액세스 토큰 가져오기
  const accessToken = req.headers.authorization.split(" ")[1];
  // 액세스 토큰을 해독하여 사용자 식별자 가져오기
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
  const userId = decoded.no;
  
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('파일 없음');
    }
    let file = req.files.file;
    // console.log(file);

    const fileName = `alcohol/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);

    // 이미지업로드
    const metadata = {
      contentType: file.mimetype
    };

    await uploadBytes(storageRef, file.data, metadata);
    const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(fileName)}?alt=media`;
    // console.log('파일 URL:', downloadURL);

    // 파일 url이 있으면 데이터베이스 저장
    if(downloadURL) {
      const QUERY = `UPDATE users SET user_image=? WHERE user_no=?`;
      await db.execute(QUERY, [downloadURL, userId]);
      res.send({ status: "success", message: "파일 업로드 완료" });
    }
    
  } catch (error) {
    console.error('파일 업로드 에러:', error);
  }
});

// 소셜로그인
async function getProfile(accessToken){
  const token = `Bearer ${accessToken}`;
  const profileUrl = "https://kapi.kakao.com/v2/user/me";
  const response = await axios.get(profileUrl,{
      headers:{
          Authorization: token
      }
  }) ;
  const data = JSON.stringify(response.data);
  const profile = JSON.parse(data);
  return profile;
}
// 로그인 이동
app.get("/social/:location", (req, res) => {
  // console.log(req);
  const location = req.params.location;
  switch(location){
    case "kakao":
        res.redirect(`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_API}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code&state=kakao&prompt=login`);
    default:
        return "";
  }
});
// 리다이렉트
app.get("/api/social/kakao", async (req, res) => {
  const {code} = req.query;
  const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_API}&redirect_uri=${process.env.REDIRECT_URL}&code=${code}`;
  const response = await axios.get(url);
  const data = JSON.stringify(response.data);
  const tokenData = JSON.parse(data);
  // console.log(tokenData.access_token);
  const profile = await getProfile(tokenData.access_token);
  // console.log(profile);
  // req.session.profile = profile;
  const id = profile.id;
  const nickname = profile.properties.nickname;
  const email = profile.kakao_account.email;
  const profileImage = profile.properties.profile_image;
  // console.log("Id:", id);
  // console.log("Nickname:", nickname);
  // console.log("Email:", email);

  const QUERY = `SELECT user_no FROM users WHERE user_id = ?`;
  let existUser = await db
  .execute(QUERY, [id])
  .then((result) => result[0][0]);
  if(!existUser) {
    const QUERY = `INSERT INTO users (user_id, user_password, user_image, user_name, user_email, social) VALUES (?, ?, ?, ?, ?, ?)`;
    await db.execute(QUERY, [id, id, profileImage, nickname, email, "kakao"]);

    const QUERY2 = `SELECT user_no FROM users WHERE user_id = ?`;
    existUser = await db
    .execute(QUERY2, [id])
    .then((result) => result[0][0]);
  } 
  // token  만들기
  const accessToken = jwt.sign(
    { no: existUser.user_no },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  res.redirect("/social/callback?accessToken=" + accessToken);
});

// 네이버 로그인
const handleNaverLogin = async (naverAccessToken, naverRefreshToken, profile, done) => {
  // console.log(profile);
  const id = profile.id;
  const nickname = profile.nickname;
  const email = profile.email;
  const profileImage = profile.profileImage;
  // user_id 찾기 provider
  const QUERY = `SELECT user_no FROM users WHERE user_id = ?`;
  let existUser = await db
  .execute(QUERY, [id])
  .then((result) => result[0][0]);

  if(!existUser) {
    const QUERY = `INSERT INTO users (user_id, user_password, user_image, user_name, user_email, social) VALUES (?, ?, ?, ?, ?, ?)`;
    await db.execute(QUERY, [id, id, profileImage, nickname, email, "naver"]);

    const QUERY2 = `SELECT user_no FROM users WHERE user_id = ?`;
    existUser = await db
    .execute(QUERY2, [id])
    .then((result) => result[0][0]);
  } 
  // token  만들기
  const accessToken = jwt.sign(
    { no: existUser.user_no },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );


  done(null, accessToken); // (에러, 정보)
};

passport.use(
  new NaverStrategy({
    clientID: process.env.NAVER_ID,
    clientSecret: process.env.NAVER_SECRET,
    callbackURL: "/naver/callback"
  }, handleNaverLogin)
)
app.get("/naver", passport.authenticate("naver", { authType: "reprompt" }));
app.get("/naver/callback", (req, res) => {
  passport.authenticate("naver", { session: false}, async (err, accessToken) => {
    console.log(accessToken);
    res.redirect("/social/callback?accessToken=" + accessToken);
  })(req, res);
})

// 서버에서 해당 사용자 정보를 가져와 클라이언트로 전송하는 라우트 추가
app.get("/api/userinfo", async (req, res) => {
  try {
    // 현재 사용자의 액세스 토큰 가져오기
    const accessToken = req.headers.authorization.split(" ")[1];

    // 액세스 토큰을 해독하여 사용자 식별자 가져오기
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.no;

    // 사용자 식별자를 사용하여 데이터베이스에서 해당 사용자 정보 가져오기
    const QUERY = "SELECT * FROM users WHERE user_no = ?";
    const user = await db
      .execute(QUERY, [decoded.no])
      .then((result) => result[0][0]);
    // 사용자 정보를 클라이언트로 전송
    res.json(user);
  } catch (error) {
    // 오류가 발생한 경우 클라이언트로 오류 응답 전송
    res.status(500).json({ message: "Failed to fetch user information" });
  }
});

// 비밀번호 및 사용자 정보 업데이트 엔드포인트
app.post("/api/change-user-info", async (req, res) => {
  try {
    // 현재 사용자의 액세스 토큰 가져오기
    const accessToken = req.headers.authorization.split(" ")[1];

    // 액세스 토큰을 해독하여 사용자 식별자 가져오기
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.no;

    // 새로운 비밀번호, 이메일, 전화번호 받기
    const { newPassword, email, phone } = req.body;

    // 새로운 비밀번호를 해싱
    const encryptedPassword = await bcrypt.hash(newPassword, 8);

    // 사용자 정보를 DB에 업데이트
    const UPDATE_QUERY = "UPDATE users SET user_password = ?, user_email = ?, user_tel = ? WHERE user_no = ?";
    await db.execute(UPDATE_QUERY, [encryptedPassword, email, phone, userId]);

    // 성공 응답 전송
    res.status(200).json({ success: true, message: "비밀번호 및 사용자 정보가 성공적으로 변경되었습니다." });
  } catch (error) {
    // 오류가 발생한 경우 클라이언트로 오류 응답 전송
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to change password and user info" });
  }
});


// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});