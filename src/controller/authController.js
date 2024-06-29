import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const joinUser = async (req, res) => {
  const { userId, userPassword, userName,userPhone,userEmail } = req.body;
  // 1. userId가 중복인지 확인한다. (데이터베이스 찾아서) // CRUD R
  const QUERY1 = `SELECT user_no FROM users WHERE user_id = ?`;
  const existUser = await db
    .execute(QUERY1, [userId])
    .then((result) => result[0][0]);

  if (existUser) {
    return res
      .status(400)
      .json({ status: "fail", message: "중복된 아이디 입니다." });
  }
  const encryptPassword = await bcrypt.hash(userPassword, 8);

  // db에 데이터를 넣는다 users테이블에 (CRUD) CREATE
  // 저장
  const QUERY2 = `INSERT INTO users (user_id, user_password, user_name, user_email, user_tel) VALUES (?, ?, ?, ?, ?)`;
  await db.execute(QUERY2, [userId, encryptPassword, userName, userEmail, userPhone]);

  res.status(201).json({ status: "success", message: "회원가입 완료" });
};

// 로그인
// 로그인
// 로그인
// 로그인
// 로그인

export const loginUser = async (req, res) => {

  const {userId, userPassword } = req.body;
  // 1. id 에맞는 사용자를 찾기 => 없으면 에러
  const QUERY = `SELECT * FROM users WHERE user_id = ?`;
  const user = await db.execute(QUERY, [userId !== undefined ? userId : null]).then((result) => result[0][0]);
  if (!user) {
    return res
      .status(400)
      .json({ status: "fail", message: "아이디와 비밀번호를 확인해주세요." });
  }

  // 2. 비밀번호 맞는지 찾기
  const isPasswordCorret = await bcrypt.compare(
    userPassword,
    user.user_password
  );

  if (!isPasswordCorret) {
    return res
      .status(400)
      .json({ status: "fail", message: "아이디와 비밀번호를 확인해주세요." });
  }
  // 3. 회원 인증키 발급키 - json web token
  // user.user_no
  const accessToken = jwt.sign(
    { no: user.user_no }, //
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  res
    .status(200)
    .json({ status: "success", message: "로그인 성공", data: { accessToken } });
};

