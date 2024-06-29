    const info = JSON.parse(localStorage.getItem("userData"));
 
    // 소셜로그인 시 정보수정 X
    if(info.social === "kakao" || info.social === "naver") {
      const myPage = document.querySelector("#myPage_info");
      const infoPage = document.querySelector("#myPage_info_info_user");
      infoPage.style.display = "none";
      const message = document.createElement("p");
      message.innerHTML = "소셜 로그인을 통해 로그인 한 경우<br />정보를 수정할 수 없습니다.";
      myPage.appendChild(message);
    }

    document.getElementById('userId').textContent = info.user_id;
    // document.getElementById('email').placeholder = info.user_email;
    // document.getElementById('phone').placeholder = info.user_tel;
    const passowrd = document.getElementById("userPassword");
    const passowrd1 = document.getElementById("confirm-password");

    const eyes1 = document.querySelector(".eyes1");
    const eyes1_img = document.querySelector(".eyes1 img");

    let isPasswordVisible1 = false;

      eyes1.addEventListener("click", () => {
          if (isPasswordVisible1) {
            passowrd.type = "password";
              isPasswordVisible1 = false;
              eyes1_img.src = "../file/icon/eyes.png"
          } else {
            passowrd.type = "text";
              isPasswordVisible1 = true;
              eyes1_img.src = "../file/icon/eyes2.png"
          }
      });
      const eyesd1 = document.querySelector(".eyesd1");
      const eyesd1_img = document.querySelector(".eyesd1 img")

      let isPasswordVisibled1 = false;

      eyesd1.addEventListener("click", () => {
          if (isPasswordVisibled1) {
            passowrd1.type = "password";
            eyesd1_img.src = "../file/icon/eyes.png"
            isPasswordVisibled1 = false;
          } else {
            passowrd1.type = "text";
            isPasswordVisibled1 = true;
            eyesd1_img.src = "../file/icon/eyes2.png"
          }
      });
  
  // 이메일과 전화번호 수정하지 않으면 기존 정보로 설정
  window.addEventListener("load", async () => {
    try {
      // 서버에서 사용자 정보를 요청
      const response = await fetch("/api/userinfo", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      
      // 응답 데이터를 JSON으로 파싱
      const userData = await response.json();
    localStorage.setItem("userData", JSON.stringify(userData));
    const emailInput = document.getElementById('email');
      if (emailInput.value == '') {
        emailInput.value = userData.user_email;
      }

      const phoneInput = document.getElementById('phone');
      if (phoneInput.value === '') {
        phoneInput.value = userData.user_tel;
      } 
    console.log(userData,"유저")
    // 콘솔에 사용자 정보 출력
    } catch (error) {
      
    }
  });
  
  const infoChangeButton = document.getElementById("info_change").addEventListener("click", async () => {
  // 새 비밀번호와 확인 비밀번호 가져오기
  const newPasswordInput = document.getElementById('userPassword'); 
  const newPasswordValue = newPasswordInput.value.trim();

  const confirmPasswordInput = document.getElementById('confirm-password');
  const confirmPasswordValue = confirmPasswordInput.value.trim(); 

  // 이메일과 전화번호 가져오기
  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim();

  const phoneInput = document.getElementById('phone');
  let phone = phoneInput.value.trim();

  // 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('올바른 이메일 주소를 입력해주세요.');
    alert('올바른 이메일 주소를 입력해주세요.');
    return;
  }

  // 전화번호 형식 검사
  phone = phone.replace(/[^\d]/g, '');
  if (!/^010\d{7,8}$/.test(phone)) {
    console.log('올바른 전화번호를 입력해주세요.');
    alert('올바른 전화번호를 입력해주세요.');
    return;
  }

  // 입력 값이 비어 있는지 확인
  if (!newPasswordValue || !confirmPasswordValue || !email || !phone) {
    console.log('입력 값을 모두 채워주세요.');
    alert('빈칸없이 입력해주세요.'); // 입력 값이 비어 있는 경우에도 경고창을 띄웁니다.
    return;
  }

  // 새 비밀번호와 확인 비밀번호가 일치하지 않으면 에러 메시지를 표시하고 함수 종료
  if (newPasswordValue !== confirmPasswordValue) {
    console.log('비밀번호가 일치하지 않습니다.');
    alert('비밀번호가 일치하지 않습니다.'); // 비밀번호가 일치하지 않는 경우에도 경고창을 띄웁니다.
    return;
  }else{
    swal("내 정보수정 완료")
  }
  // 와우
  // 로그인된 사용자인지 확인
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    alert('로그인이 필요합니다.');
    return;
  }

  // 변경할 정보를 서버로 전송
  try {
    const response = await fetch('/api/change-user-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ email, phone, newPassword: newPasswordValue })
    });

    const data = await response.json();
    if (data.success) {
      // 성공적으로 변경되면 메시지 표시
      alert('정보가 성공적으로 변경되었습니다.');
      location.reload();
    } else {
      // 변경 실패 시 에러 메시지 표시
      alert('정보 변경에 실패했습니다. 다시 시도해주세요.');
    }
  } 
  catch (error) {
    console.error('Error:', error);
    // alert('정보 변경에 실패했습니다. 다시 시도해주세요.');
  }
});

const accessToken = localStorage.getItem("accessToken");
const selectImg=document.getElementById("profile_img");
// 프로필이 있는 경우
async function fetchProfileImage() {
  const response = await fetch("/api/fileload", {
      headers: {
          Authorization: `Bearer ${accessToken}`
      }
  });
  if (response.ok) {
      const result = await response.json();
      if (result.user_image) {
          selectImg.src = result.user_image;
      }
  } else {
      console.error("이미지 없음");
  }
};
window.onload = function() {
    fetchProfileImage();
};

// 프로필 이미지 변경
selectImg.addEventListener("click", function(){
  document.getElementById("image_upload").click();
});
document.getElementById("image_upload").addEventListener("change", async function(e) {
  const file=e.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      selectImg.src = e.target.result;
      // console.log("선택 이미지",selectImg.src);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/fileload", {
      headers: { Authorization: `Bearer ${accessToken}`},
      method: "POST",
      body: formData
    });
    
    const result = await response.json();
    // console.log(result.url);
  };
});