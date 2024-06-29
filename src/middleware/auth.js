import jwt from "jsonwebtoken";
import db from "../config/db.js";

// 1. 토큰이 있으면 유저 정보 넣어줌, 없으면 안넣어줌
export const notNeededAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  // console.log(authHeader);
  const token = authHeader.split(" ")[1];
  if (token && token != "null") {
    // 첫번째 인자 토큰값, 시크릿값, 콜백함수
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ status: "fail", message: "jwt 검증 실패" });
      }
      // decoded.no 2 => user 찾기
      const QUERY = "SELECT * FROM users WHERE user_no = ?";
      const user = await db
        .execute(QUERY, [decoded.no])
        .then((result) => result[0][0]);
      req.user = user;
      next();
    });
  } else {
    next();
  }
};
// export async function testFun(req, res, next){
//   const QUERY = "SELECT * FROM users WHERE user_no = ?";
//   const user = await db
//   .execute(QUERY, [3])
//   .then((result) => result[0][0]);
// req.user = user;
// next();
// };

// 2. 토큰 이있으면 유저정보 넣어줌, 없으면 통과안됨
export const neededAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader.split(" ")[1];
  if (token && token != "null") {
    // 첫번째 인자 토큰값, 시크릿값, 콜백함수
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ status: "fail", message: "jwt 검증 실패" });
      }
      // decoded.no 2 => user 찾기
      const QUERY = "SELECT * FROM users WHERE user_no = ?";
      const user = await db
        .execute(QUERY, [decoded.no])
        .then((result) => result[0][0]);
      req.user = user;
      next();
    });
  } else {
    res.status(403).json({ status: "fail", message: "로그인이 필요합니다." });
  }
};
