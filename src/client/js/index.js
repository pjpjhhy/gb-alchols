
// 1번 한국농수산식품유통공사_전통주 정보 api -->
 fetch("https://api.odcloud.kr/api/15048755/v1/uddi:fec53d3a-2bef-4494-b50e-f4e566f403e0?page=1&perPage=100&serviceKey=GfEBGZl%2FWVWZaww3GJjoLpRrE%2B%2BwLFKbom%2FSth6vxaX%2BA8qKV6FBHeMZe0zjSNjGSizunxh5Ylj4ZNegI83s9w%3D%3D")
.then(response => {
  // 서버로부터 응답을 받았을 때 실행되는 함수
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // JSON 형식으로 응답을 파싱
})
.then(data => {
  // JSON 데이터를 사용하는 함수
  console.log("1번 전통주 정보",data);
})
.catch(error => {
  // 네트워크 오류 등의 오류가 발생했을 때 실행되는 함수
  console.error('There was a problem with your fetch operation:', error);
});

//2번 한국농수산식품유통공사_양조장 정보 api -->

  fetch("https://api.odcloud.kr/api/15048756/v1/uddi:ebf9868d-7fbe-4b84-ab38-cc6bb6f0382f?page=1&perPage=10&serviceKey=GfEBGZl%2FWVWZaww3GJjoLpRrE%2B%2BwLFKbom%2FSth6vxaX%2BA8qKV6FBHeMZe0zjSNjGSizunxh5Ylj4ZNegI83s9w%3D%3D")
.then(response => {
  // 서버로부터 응답을 받았을 때 실행되는 함수
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // JSON 형식으로 응답을 파싱
})
.then(data => {
  // JSON 데이터를 사용하는 함수
  console.log("2번 양조장 정보",data);
})
.catch(error => {
  // 네트워크 오류 등의 오류가 발생했을 때 실행되는 함수
  console.error('There was a problem with your fetch operation:', error);
});

// 3번 찾아가는 양조장 정보 api-->

  fetch("https://api.odcloud.kr/api/15048756/v1/uddi:d21a949e-4032-4dee-9829-9c595ba8a46a?page=1&perPage=10&serviceKey=GfEBGZl%2FWVWZaww3GJjoLpRrE%2B%2BwLFKbom%2FSth6vxaX%2BA8qKV6FBHeMZe0zjSNjGSizunxh5Ylj4ZNegI83s9w%3D%3D")
.then(response => {
  // 서버로부터 응답을 받았을 때 실행되는 함수
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // JSON 형식으로 응답을 파싱
})
.then(data => {
  // JSON 데이터를 사용하는 함수
  console.log("3번 양조장 정보",data);
})
.catch(error => {
  // 네트워크 오류 등의 오류가 발생했을 때 실행되는 함수
  console.error('There was a problem with your fetch operation:', error);
});

// 4번 한국농수산식품유통공사_전통주 체험 프로그램 api -->

fetch("https://api.odcloud.kr/api/15089109/v1/uddi:c7468573-84ff-4a92-a84b-884439ce23d3?page=0&perPage=1000&serviceKey=GfEBGZl%2FWVWZaww3GJjoLpRrE%2B%2BwLFKbom%2FSth6vxaX%2BA8qKV6FBHeMZe0zjSNjGSizunxh5Ylj4ZNegI83s9w%3D%3D")
.then(response => {
  // 서버로부터 응답을 받았을 때 실행되는 함수
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // JSON 형식으로 응답을 파싱
})
.then(data => {
  // JSON 데이터를 사용하는 함수
  console.log("4.전통주 체험", data);
  
  // 데이터 구조를 확인하고 양조장 주소를 출력
  if (data.data && data.data.length > 0) {
    // 모든 양조장의 주소 출력
    data.data.forEach(item => {
      document.write("양조장 주소:", item.양조장주소);
      document.write("<br/>")
      
    });
  } else {
    console.log("데이터에 양조장 주소가 없습니다.");
  }
})
.catch(error => {
  // 네트워크 오류 등의 오류가 발생했을 때 실행되는 함수
  console.error('There was a problem with your fetch operation:', error);
});