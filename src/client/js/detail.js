/* 이미지 경로 확인 테스트 */
const getCourseList = async () => {
  const response = await fetch("/api/list");
  const result = await response.json();
  const data = result.data;
  console.log(data,"이건가??")
  const detailPageImg = document.querySelector("#detailPage_img");
  const detailPageInfo = document.querySelector(".detailPage_info");
  const detailName = document.getElementById("Yaungjojang_name")

  // URL에서 course 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const courseParam = urlParams.get('course').replaceAll(`"`, "");

  // 데이터에서 해당 courseParam과 일치하는 데이터 추출
  const matchingData = data.filter(item => item.course_name == courseParam);
  detailName.innerHTML = matchingData[0].course_name + `<b id="Yaungjojang_joso">(${matchingData[0].course_address})

  </b>`
  // <span id="detail_span">♥<span> 찜 하트
  if (matchingData.length > 0) {
    // 첫 번째 이미지 경로 추출
    const firstImg = matchingData[0].course_img.substring(0, matchingData[0].course_img.indexOf(','));
    console.log(matchingData)
    // 이미지 표시
    detailPageImg.innerHTML = `<img id="detail_img" src='${firstImg}.jpg' alt="image" style="width:100%" />`;

    // 정보 표시
    const detailInfoLeft = `
      <div> 
      <p><span class="detail_soja">전화번호:</span> <b id="Yaungjojang_phone">${matchingData[0].course_tel}</b></p>
      <p><span class="detail_soja">예약/상시방문:</span> <b id="Yaungjojang_check">${matchingData[0].course_a_visit}/<b id="Yaungjojang_go">${matchingData[0].course_r_visit}</b></b></p>
      </div>
    `;

    const detailInfoRight = `
      <div>
      <p><span class="detail_soja">주종:</span> <b id="Yaungjojang_jojong">${matchingData[0].course_alcohol}</b></p>
        <p><span class="detail_soja">홈페이지:</span> <b id="Yaungjojang_home"><a href="${matchingData[0].course_homepage}" target="_blank">바로가기</a></b></p>
      </div>
    `;

    // 왼쪽 정보와 오른쪽 정보를 HTML에 삽입
    detailPageInfo.innerHTML = detailInfoLeft + detailInfoRight;
// 캐러셀
const swiperContainer = document.querySelector('.mySwiperz');
for (let i = 0; i < matchingData.length; i++) {
  const cum = 0 + matchingData.length;
  const course = matchingData[i];
  const imageUrl = course.course_img.split(',')[i]; // 첫 번째 이미지만 사용
  const chehum = data[17].course_img.split(',')

  const hoha = cum+i
  // 각 코스 술 이름에 대해 반복하면서 처리할 수 있습니다.
  const swiperSlideHTML = `
    <div id="chehum_div">
      <img src="${chehum[hoha]}.jpg" alt="course image">
      <div class="program-info">
        <h3>${course.course_program}</h3>
        <p>소요시간: ${course.course_time}</p>
        <p>가격: ${course.course_cost ? course.course_cost + '원' : '정보 없음'}</p>
        <p>내용: ${course.course_content}</p>
      </div>
    </div>
  `;

  swiperContainer.innerHTML += swiperSlideHTML;
 
}

const acDosu = `${matchingData[0].course_alcohol_dosu}`
const acMl = `${matchingData[0].course_alcohol_ml}`
const acName = `${matchingData[0].course_alcohol_name}`
const imgLen = matchingData[0].course_img
const acNames =acName.split(', ');
const acMls =acMl.split(', ');
const acDosus =acDosu.split(', ');
const acimg =imgLen.split(', ');
const detailPageSuljeongboMainDiv = document.getElementById("detailPage_suljeongbo_main_div");
const filterimg = matchingData[0].course_img.split(",")
const filterOk = filterimg.filter(imgSrc => imgSrc.includes("product"));
let num = 0

console.log(acimg.length,matchingData.length)
for (let i = matchingData.length; i <= acimg.length; i++) {
  const alcoholDiv = document.createElement("div");
  alcoholDiv.classList.add("detailPage_suljeongbo");

  num++

  const imgDiv = document.createElement("div");
  imgDiv.id = "detailPage_suljeongbo_img";
  imgDiv.innerHTML = `<img src="${filterOk[num]}.jpg" alt="image">`;


  const h3 = document.createElement("h3");
  h3.textContent = acNames[num].trim();

  const dosuP = document.createElement("p");
  dosuP.innerHTML = `도수: <b>${acDosus[num].trim()}%</b>`;

  const mlP = document.createElement("p");
  mlP.innerHTML = `용량: <b>${acMls[num].trim()}</b>`;

  imgDiv.appendChild(h3);
  imgDiv.appendChild(dosuP);
  imgDiv.appendChild(mlP);

  alcoholDiv.appendChild(imgDiv);

  detailPageSuljeongboMainDiv.appendChild(alcoholDiv);
}
  } else {
    console.error('Matching data not found.');
  }
};

getCourseList();

