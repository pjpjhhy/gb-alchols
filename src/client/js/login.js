const userIdInput = document.getElementById("userId");

const userPasswordInput = document.getElementById("userPassword");
const joinBtn = document.querySelector(".join");
const loginBtn = document.getElementById("login")


const eyesa = document.querySelector(".eyesa");
const eyesa_img = document.querySelector(".eyesa img")

let isPasswordVisiblea = false;

eyesa.addEventListener("click", () => {
    if (isPasswordVisiblea) {
      userPasswordInput.type = "password";
      eyesa_img.src = "../file/icon/eyes.png"
      isPasswordVisiblea = false;
    } else {
      userPasswordInput.type = "text";
      isPasswordVisiblea = true;
        eyesa_img.src = "../file/icon/eyes2.png"
    }
});

const loginFetch = async () => {
  const userId = userIdInput.value;
  const userPassword = userPasswordInput.value;

  console.log(userId)

  if (!userId || !userPassword) {
    alert("모든 필드를 입력해주세요", "error");
    return;
  }

  // 서버로 보내는 요청
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      userId,
      userPassword,
    }),
  });

  const result = await response.json();
  console.log(result)
  if (result.status === "success") {
    swal("성공", "로그인 되었습니다");
    localStorage.setItem("accessToken", result.data.accessToken);
   
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  } else {
    swal("실패", "아이디와 비밀번호를 확인해주세요");
  }
};

loginBtn.addEventListener("click", loginFetch);
joinBtn.addEventListener("click", () => (window.location.href = "/sign"));

const checkError = () => {
  const notFoundAccessTokenError = getParameterByName("error");
  if (notFoundAccessTokenError == "not_found_access_token") {
    alert("인증에 실패하였습니다.", "error");
  } else if (notFoundAccessTokenError == "need_login") {
    alert("로그인이 필요합니다.", "error");
  }
  const cleanUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
};
checkError();
