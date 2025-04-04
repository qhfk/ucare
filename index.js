let express = require("express");
//axios 모듈을 사용하기 
let axios = require("axios");

let app = express();
let port = process.env.PORT || 80;

app.use(express.static("public_html"));
app.listen(port,function() {
        console.log("HTML 서버 시작");
 });

/*  https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire?serviceKey=N6nFoM4QHD9nBnQ88KxE1kcwXpbHbR4Irrwgs8NLEx0AklvwwpoVFPEuDere8%2F76GlKS15q9Af8YxdIkQ%2FN5rQ%3D%3D&Q0=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C&Q1=%EA%B0%95%EB%82%A8%EA%B5%AC&QT=1&QN=%EC%82%BC%EC%84%B1%EC%95%BD%EA%B5%AD&ORD=NAME&pageNo=1&numOfRows=10 */

//https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?serviceKey=N6nFoM4QHD9nBnQ88KxE1kcwXpbHbR4Irrwgs8NLEx0AklvwwpoVFPEuDere8%2F76GlKS15q9Af8YxdIkQ%2FN5rQ%3D%3D&pageNo=1&numOfRows=10&sidoCd=110000&sgguCd=110019&emdongNm=%EC%8B%A0%EB%82%B4%EB%8F%99&yadmNm=%EC%84%9C%EC%9A%B8%EC%9D%98%EB%A3%8C%EC%9B%90&zipCd=2010&clCd=11&dgsbjtCd=01&xPos=127.09854004628151&yPos=37.6132113197367&radius=3000

// app.use()로 public_html 폴더 전체를 express 모듈 웹서버가 구동되게 했는데, 단 한 개의 페이지만 열어보자
// 두 번째 파라미터에는 /pharmach_list로 접속한 사용자에게 (req, res)를 사용하여 요청(받고)과 응답(보냄)
app.get("/hospital_list", (req, res) => {
    //app.get() 역시 비동기이기 때문에 동기로 바꾸는 작업이 필요
    let api = async() => {
        //밑에 동기로 수행하기 위해 axios로 부터 받은 데이터 객체를 받을 변수를 미리 상위에 선언
        let response = null;

        //axios는 try catch 로 예외처리 필요
        try {
            //axios.get()라는 모듈을 써서 다른 URL에 있는(크로스 도메인) 데이터를 가지고 온다.
            //CORS는 Cross Origin Resource Sharing(교차 출처 자원 공유)
            //https에서 s를 빼고, (?) 전까지 : 파라미터변수 제외
            response = await axios.get("http://apis.data.go.kr/B551182/hospInfoServicev2", {
                //두번째 인자가 여러개(파라미터들)일 경우 중괄호를 써서 표현
                //params도 여러개라서 때문에 중괄호를 써서 표현
                params : {
                    //serviceKey는 프로그램 변수에 할당할 때는 암호화되지 않은 Decoding 형태의 키를 넣는다. 
                    "serviceKey" : "N6nFoM4QHD9nBnQ88KxE1kcwXpbHbR4Irrwgs8NLEx0AklvwwpoVFPEuDere8/76GlKS15q9Af8YxdIkQ/N5rQ==",
                    "pageNo": req.query.pageNo,
                    "numOfRows": req.query.numOfRows,
                    "sidoCd": req.query.sidoCd,
                    "sgguCd" : req.query.sgguCd,
                    "emdongNm" : req.query.emdongNm,
                    "yadmNm" : req.query.yadmNm
                }
            });
            console.log("API 호출 파라미터:", params);
        }catch (error) {
            console.error("API 호출 중 에러 발생: ", error.message); // 에러 로그 추가
            response = { data: { response: { body: "오류 발생" } } }; // 대체 응답 설정
        }

        return response;
    }

    //CORS 오류를 잡기 위한 소스 res가 교차 출처에 대해 보내는 것이 가능해 진다.
    api().then((response) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (response.data && response.data.response && response.data.response.body) {
            res.json(response.data.response.body); // 정상적인 경우
        } else {
            res.json({ error: "데이터가 없습니다." }); // 데이터가 없을 경우
        }
        
    });        
}); 
