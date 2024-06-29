CREATE TABLE users (
	user_no INT NOT NULL AUTO_INCREMENT,
	user_id VARCHAR(500) NOT NULL UNIQUE,
	user_password VARCHAR(500) NOT NULL,
	user_email VARCHAR(200) NULL,
  user_tel VARCHAR(200) NULL,
	user_image VARCHAR(500) NULL,
	PRIMARY KEY (user_no)
);

CREATE TABLE course (
	course_no INT NOT NULL AUTO_INCREMENT,
	course_name VARCHAR(100),
	course_program VARCHAR(200),
	course_address VARCHAR(200),
  course_alcohol VARCHAR(100),
	course_tel VARCHAR(100),
  course_homepage VARCHAR(100),
  course_content VARCHAR(1000),
  course_a_visit VARCHAR(10),
  course_r_visit VARCHAR(10),
  course_time VARCHAR(20),
  course_cost VARCHAR(20),
  course_latitude VARCHAR(500),
  course_longitude VARCHAR(500),
  course_qr VARCHAR(500),
  course_img VARCHAR(500),
	PRIMARY KEY (course_no)
);

CREATE TABLE users_course (
	user_courses_no INT NOT NULL AUTO_INCREMENT,
	user_no INT NOT NULL,
	course_no INT NOT NULL,
	PRIMARY KEY (user_courses_no)
);