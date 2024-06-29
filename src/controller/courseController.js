import db from "../config/db.js";

export const getCourseList = async (req, res) => {
  // 비지니스 로직(service) -> DB에서 코스 리스트를 가져와서 전달
  // console.log(req.user);
  const point = req.params.point;
  // 로그인한사람 : 안한사람
  const no = req.user ? req.user.user_no : null;
  let QUERY;
  if(point === "south") {
    QUERY = "SELECT c.*, uc.user_courses_no FROM course c LEFT JOIN users_course uc ON c.course_no = uc.course_no AND uc.user_no = ? WHERE c.point='경상남도'";
  }else if(point === "north") {
    QUERY = "SELECT c.*, uc.user_courses_no FROM course c LEFT JOIN users_course uc ON c.course_no = uc.course_no AND uc.user_no = ? WHERE c.point='경상북도'";
  }else {
    QUERY = "SELECT c.*, uc.user_courses_no FROM course c LEFT JOIN users_course uc ON c.course_no = uc.course_no AND uc.user_no = ?";
  }
  const result = await db.execute(QUERY, [no]).then(result => result[0]);


  res.status(200).json({ status: "success", message: "성공", data: result });
};

export const getCourseDetails = async (req, res) => {
  const courseNo = req.params.course_no;
  const QUERY = "SELECT * FROM course WHERE course_no = ?";
  const result = await db.execute(QUERY, [courseNo]).then(result => result[0]);
  const courseName = result[0]?.course_name;

  if(courseName) {
    const allDetailsQuery = "SELECT * FROM course WHERE course_name = ?";
    const allDetailsResult = await db.execute(allDetailsQuery, [courseName]).then(result => result[0]);
    res.status(200).json({ status: "success", message: "성공", data: allDetailsResult });
  } else {
    res.status(404).json({ status: "error", message: "해당하는 코스 이름이 없습니다." });
  }
};

export const qrCheck = async (req, res) => {
  const user = req.user;
  console.log(user);
  const { qrCode } = req.body;
  console.log(qrCode);

  // qrCode 번호찾기
  const QUERY1 = `SELECT course_no FROM course WHERE course_qr = ?`
  const qrCourseNo = await db.execute(QUERY1, [qrCode]).then((result) => result[0][0]);
  if(!qrCourseNo) {
    return res.status(404).json({ status: "fail", message: "잘못 된 QR코드입니다." });
  }
  // 방문했는지 확인
  const QUERY2 = `SELECT * FROM users_course WHERE user_no = ? AND course_no = ?`;
  const ucId = await db.execute(QUERY2, [user.user_no, qrCourseNo.course_no]).then((result) => result[0][0]);
  if(ucId) {
    return res.status(400).json({ status: "fail", message: "이미 방문한 코스입니다." });
  }

  // QR COURSE ID, USER ID => INSERT
  const QUERY3 = `INSERT INTO users_course (user_no, course_no) VALUES (?, ?)`;
  await db.execute(QUERY3, [user.user_no, qrCourseNo.course_no]);
  return res.status(201).json({ status: "success", message: "방문 완료" });
}