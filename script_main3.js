document.addEventListener("DOMContentLoaded", () => {
    console.log("스크립트 시작"); // 확인용

    // 1. 요소 가져오기
    const cushion = document.getElementById("cushion");
    const foods = document.querySelectorAll(".sec3-menu li img"); // li 안의 img를 바로 선택

    // SVG 표정/점수판 그룹들
    const dragonDefault = document.getElementById("dragon-default-face");
    const dragonDisappoint = document.getElementById("dragon-disappoint");
    const dragonSmile = document.getElementById("dragon-smile");
    const dragonAngry = document.getElementById("dragon-angry");

    const sign = document.getElementById("sign");
    const signs = {
        baby: document.getElementById("sign-x"),
        cabbage: document.getElementById("sign-10"),
        carrot: document.getElementById("sign-20"),
        potato: document.getElementById("sign-100")
    };

    let isFirstDrop = true;

    // --- 초기화 함수 ---
    function initView() {
        // 모든 표정 숨기기
        [dragonDefault, dragonDisappoint, dragonSmile, dragonAngry].forEach(el => {
            if(el) el.style.display = "none";
        });
        // 기본 표정 보이기
        if(dragonDefault) dragonDefault.style.display = "block";

        // 점수판 전체 숨기기
        if(sign) sign.style.display = "none"; // 처음엔 점수판 통째로 숨김
        
        // 점수 내용물 숨기기
        for (let key in signs) {
            if(signs[key]) signs[key].style.display = "none";
        }
    }
    
    initView();

// --------------------------------------
    // [핵심] 드래그 시작 설정 (수정됨)
    // --------------------------------------
    foods.forEach((img) => {
        // 부모 li에서 data-type 가져오기
        const type = img.parentElement.dataset.type;

        img.addEventListener("dragstart", (e) => {
            console.log("드래그 시작:", type);
            e.dataTransfer.setData("food-type", type);
            e.dataTransfer.effectAllowed = "copy"; 

            // ★ 핵심 추가 1: 드래그 시작 직후 원본 숨기기 (비동기 처리)
            // setTimeout을 써야 브라우저가 '고스트 이미지'를 캡처한 뒤에 원본을 숨깁니다.
            setTimeout(() => {
                img.style.visibility = "hidden"; // 혹은 img.style.opacity = "0";
            }, 0);
        });

        // ★ 핵심 추가 2: 드래그가 끝나면(놓았거나 취소했거나) 원본 다시 보이기
        img.addEventListener("dragend", () => {
            console.log("드래그 종료");
            img.style.visibility = "visible"; // 혹은 img.style.opacity = "1";
        });
    });

    // --------------------------------------
    // [핵심] 드롭 영역 설정 (Cushion)
    // --------------------------------------
    if (cushion) {
        // SVG 영역 인식 강제 설정
        cushion.style.pointerEvents = "all"; 
        
        cushion.addEventListener("dragover", (e) => {
            e.preventDefault(); // 필수: 이걸 해야 drop 이벤트가 발생함
            e.dataTransfer.dropEffect = "copy";
        });

        cushion.addEventListener("drop", (e) => {
            e.preventDefault();
            const foodType = e.dataTransfer.getData("food-type");
            console.log("드롭된 아이템:", foodType);

            if (!foodType) return;

            updateDragonState(foodType);
        });
    } else {
        console.error("아이디가 'cushion'인 요소를 찾을 수 없습니다.");
    }

    // --- 상태 업데이트 로직 분리 ---
    function updateDragonState(type) {
        // 1. 점수판 등장 애니메이션 (최초 1회)
        if (isFirstDrop && sign) {
            sign.style.display = "block";
            // 간단한 등장 애니메이션 (CSS transition 활용 추천)
            gsap.fromTo(sign, {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.5});
            isFirstDrop = false;
        }

        // 2. 표정 및 점수 리셋
        [dragonDefault, dragonDisappoint, dragonSmile, dragonAngry].forEach(el => el.style.display = "none");
        for (let key in signs) {
            if(signs[key]) signs[key].style.display = "none";
        }

        // 3. 타입별 분기 처리
        switch (type) {
            case "baby":
                if(dragonAngry) dragonAngry.style.display = "block";
                if(signs.baby) signs.baby.style.display = "block";
                break;
            case "carrot":
                if(dragonDisappoint) dragonDisappoint.style.display = "block";
                if(signs.carrot) signs.carrot.style.display = "block";
                break;
            case "cabbage":
                if(dragonDisappoint) dragonDisappoint.style.display = "block";
                if(signs.cabbage) signs.cabbage.style.display = "block";
                break;
            case "potato":
                if(dragonSmile) dragonSmile.style.display = "block";
                if(signs.potato) signs.potato.style.display = "block";
                break;
        }
    }
});