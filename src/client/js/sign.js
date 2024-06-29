const userIdInput = document.getElementById('userId');
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('email');
const userPhoneInput = document.getElementById('phone');
const userPasswordInput = document.getElementById('userPassword');
const userConfirmPasswordInput = document.getElementById('confirm-password');
const userJoinBtn = document.getElementById("joinBtn");
const eyes = document.querySelector(".eyes");
const eyes_img = document.querySelector(".eyes img")
let isPasswordVisible = false;

eyes.addEventListener("click", () => {
    if (isPasswordVisible) {
        userPasswordInput.type = "password";
        isPasswordVisible = false;
        eyes_img.src = "../file/icon/eyes.png"
    } else {
        userPasswordInput.type = "text";
        isPasswordVisible = true;
        eyes_img.src = "../file/icon/eyes2.png"
    }
});
const eyesd = document.querySelector(".eyesd");
const eyesd_img = document.querySelector(".eyesd img")

let isPasswordVisibled = false;

eyesd.addEventListener("click", () => {
    if (isPasswordVisibled) {
      userConfirmPasswordInput.type = "password";
      eyesd_img.src = "../file/icon/eyes.png"
        isPasswordVisibled = false;
    } else {
      userConfirmPasswordInput.type = "text";
        isPasswordVisibled = true;
        eyesd_img.src = "../file/icon/eyes2.png"
    }
});

const joinFetch = async () => {
    const userId = userIdInput.value;
    const userName = userNameInput.value;
    const userEmail = userEmailInput.value;
    let userPhone = userPhoneInput.value;
    const userPassword = userPasswordInput.value;
    const userPassword2 = userConfirmPasswordInput.value;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(error => error.textContent = '');

    if (!userId || !userName || !userEmail || !userPhone || !userPassword || !userPassword2) {
        if (!userId) document.getElementById('userIdError').textContent = "아이디를 입력해주세요";
        if (!userName) document.getElementById('userNameError').textContent = "이름을 입력해주세요";
        if (!userEmail) document.getElementById('emailError').textContent = "이메일을 입력해주세요";
        if (!userPhone) document.getElementById('phoneError').textContent = "전화번호를 입력해주세요";
        if (!userPassword) document.getElementById('passwordError').textContent = "비밀번호를 입력해주세요";
        if (!userPassword2) document.getElementById('confirmPasswordError').textContent = "비밀번호 확인을 입력해주세요";
        return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        document.getElementById('emailError').textContent = "올바른 이메일 주소를 입력해주세요";
        return;
    }

    if (userPassword !== userPassword2) {
        document.getElementById('confirmPasswordError').textContent = "비밀번호가 서로 일치하지 않습니다..";
        return;
    }

    // '+'와 '-' 제거하고 숫자만 남김
    userPhone = userPhone.replace(/[^\d]/g, '');

    // 전화번호가 '010'으로 시작하고 10자리 이상 11자리 이하이면 정상적인 전화번호로 판단
    if (!/^010\d{7,8}$/.test(userPhone)) {
        document.getElementById('phoneError').textContent = "올바른 전화번호를 입력해주세요.";
        return;
    }

  const response = await fetch("/api/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      userId,
      userPassword,
      userName,
      userPhone,
      userEmail,
    }),
  });

  const data = await response.json();
  if (data.status === "success") {
    alert("회원가입 성공", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } else {
    document.getElementById('userIdError').textContent = "중복된 아이디 입니다."

  }
};

userJoinBtn.addEventListener("click", joinFetch);