document.addEventListener("DOMContentLoaded", () => {
    const svgPaths = document.querySelectorAll("#mainSvg path");
    const clickText = document.querySelector(".sec1_text_center");

    svgPaths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.stroke = "#fff";
        path.style.strokeWidth = "2";
        path.style.fill = "none";
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
    });

    const svgBox = document.getElementById("svgBox");

    svgBox.addEventListener("click", () => {

        // 1) SVG 선 애니메이션
        svgPaths.forEach((path) => {
            path.style.transition = "stroke-dashoffset 1.2s ease";
            path.style.strokeDashoffset = "0";
        });

        // 2) 클릭 텍스트 사라짐
        clickText.classList.add("hide");
    });
});








document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin();

    // 1. 요소 가져오기
    const armGroup = document.getElementById('_arm-flesh');
    const handGroup = document.getElementById('_hand-group');
    const svgElement = document.getElementById('mainSvg2');

    const armPaths = armGroup.querySelectorAll('path');
    const armUpper = armPaths[0]; // 윗팔
    const armLower = armPaths[1]; // 아랫팔

    // =================================================================
    // [1] 좌표 상수 (수정 금지)
    // =================================================================
    const shoulder1 = { x: 830, y: 720 }; 
    const shoulder2 = { x: 836, y: 840 }; 
    const initHand = { x: 639.77, y: 810.63 }; 
    
    const baseLen = 85; 
    const wristOffset = 60; 

    // 초기화
    gsap.set(armUpper, { svgOrigin: `${shoulder1.x} ${shoulder1.y}` });
    gsap.set(armLower, { svgOrigin: `${shoulder2.x} ${shoulder2.y}` });
    gsap.set(handGroup, { transformOrigin: "50% 50%" });


    // =================================================================
    // [2] 포즈 데이터 (손 위치, 손 크기, 팔 길이 보정)
    // =================================================================
    // hand: { x, y } -> 손 위치
    // handScale: 손의 크기 (1 = 기본, 2 = 2배 큼)
    // scaleCorrection: 팔 길이 보정 (팔이 손에 안 닿을 때 늘려주는 배율)
    // =================================================================
    let positions = [
        // [0] 초기 위치 (리셋)
        { 
            id: "initial", 
            hand: { x: initHand.x, y: initHand.y }, 
            handScale: 1, // 크기 1
            isReset: true 
        },
        
        // [1] 오른쪽 위
        { 
            id: "top-right", 
            hand: { x: 1800, y: 200 }, 
            handScale: 0.85, 
            scaleCorrection: 1
        },

        // [2] 오른쪽 아래
        { 
            id: "bottom-right", 
            hand: { x: 1400, y: 800 }, 
            handScale: 1.0,      // 기본 크기
            scaleCorrection: 1.0 
        },

        // [3] 왼쪽 위
        { 
            id: "top-left", 
            hand: { x: 400, y: 300 }, 
            handScale: 0.8,      // ★ 손을 0.8배로 줄임
            scaleCorrection: 1.0 
        }
    ];


    // ----------------------------------------------------------------
    // [기능 1] 팔과 손을 움직이는 함수
    // ----------------------------------------------------------------
    function reachTo(pose) {
        // [A] 초기화 (강제 리셋)
        if (pose.isReset) {
            const tl = gsap.timeline();
            tl.to([armUpper, armLower], { rotation: 0, scaleX: 1, duration: 0.5, ease: "back.out(1.0)" }, 0);
            tl.to(handGroup, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.5, ease: "back.out(1.0)" }, 0);
            return;
        }

        // [B] 이동 모드 (자동 계산)
        const tx = pose.hand.x;
        const ty = pose.hand.y;
        const correction = pose.scaleCorrection || 1.0;
        const hScale = pose.handScale || 1.0; // 손 크기 (없으면 1)

        // 1. 윗팔 계산 (자동 조준)
        const dx1 = tx - shoulder1.x;
        const dy1 = ty - shoulder1.y;
        const dist1 = Math.sqrt(dx1*dx1 + dy1*dy1);
        const deg1 = (Math.atan2(dy1, dx1) * 180 / Math.PI) - 180;
        const scale1 = ((dist1 - wristOffset) / baseLen) * correction;

        // 2. 아랫팔 계산 (자동 조준)
        const dx2 = tx - shoulder2.x;
        const dy2 = ty - shoulder2.y;
        const dist2 = Math.sqrt(dx2*dx2 + dy2*dy2);
        const deg2 = (Math.atan2(dy2, dx2) * 180 / Math.PI) - 180;
        const scale2 = ((dist2 - wristOffset) / baseLen) * correction;

        // 3. 손 이동
        const moveX = tx - initHand.x;
        const moveY = ty - initHand.y;

        // 4. 애니메이션
        const tl = gsap.timeline();
        
        tl.to(armUpper, { rotation: deg1, scaleX: scale1, duration: 0.4, ease: "power2.out" }, 0);
        tl.to(armLower, { rotation: deg2, scaleX: scale2, duration: 0.4, ease: "power2.out" }, 0);
        
        // 손: 위치 이동 + 팔 각도 따라 회전 + 크기 조절(Scale)
        tl.to(handGroup, { 
            x: moveX, 
            y: moveY, 
            rotation: deg1, 
            scale: hScale, // ★ 손 크기 적용
            duration: 0.4, 
            ease: "power2.out" 
        }, 0);
    }


    // ----------------------------------------------------------------
    // [기능 2] 마우스 감지 (게임 플레이)
    // ----------------------------------------------------------------
    let currentIndex = 0;
    let isMoving = false;
    let isEditMode = false;
    const svgPt = svgElement.createSVGPoint(); 

    window.addEventListener('mousemove', (e) => {
        if (isEditMode || isMoving) return;

        const currentPos = positions[currentIndex];
        svgPt.x = e.clientX;
        svgPt.y = e.clientY;
        const mouseSvg = svgPt.matrixTransform(svgElement.getScreenCTM().inverse());

        // 거리 계산
        const dist = Math.sqrt(
            Math.pow(mouseSvg.x - currentPos.hand.x, 2) + 
            Math.pow(mouseSvg.y - currentPos.hand.y, 2)
        );

        if (dist < 200) {
            isMoving = true;
            currentIndex = (currentIndex + 1) % positions.length;
            console.log(`이동: ${positions[currentIndex].id}`);
            reachTo(positions[currentIndex]);
            setTimeout(() => { isMoving = false; }, 600);
        }
    });


    // ================================================================
    // ★ [기능 3] 에디터 모드 (클릭 & 키보드)
    // ================================================================
    
    let editScaleCorrection = 1.0; // 팔 길이 보정
    let editHandScale = 1.0;       // 손 크기



    // 키보드 조절
    // 마지막 클릭 좌표 저장용
    let lastClickX = initHand.x;
    let lastClickY = initHand.y;

    svgElement.addEventListener("click", (e) => {
        // 좌표 갱신
        svgPt.x = e.clientX; svgPt.y = e.clientY;
        const p = svgPt.matrixTransform(svgElement.getScreenCTM().inverse());
        lastClickX = p.x;
        lastClickY = p.y;
    });

    window.addEventListener("keydown", (e) => {
        if (!isEditMode) return;
        
        // 팔 길이 (접착) 조절
        if (e.key.toLowerCase() === 'a') editScaleCorrection -= 0.05;
        if (e.key.toLowerCase() === 's') editScaleCorrection += 0.05;
        
        // 손 크기 조절
        if (e.key.toLowerCase() === 'q') editHandScale -= 0.1;
        if (e.key.toLowerCase() === 'w') editHandScale += 0.1;

        if (e.key === ' ') {
            e.preventDefault();
            printCode();
        } else {
            // 변경사항 즉시 반영
            updateTestPose(lastClickX, lastClickY);
            console.log(`손크기: ${editHandScale.toFixed(1)} | 팔보정: ${editScaleCorrection.toFixed(2)}`);
        }
    });

    function updateTestPose(x, y) {
        const testPose = {
            id: "test",
            hand: { x: x, y: y },
            handScale: editHandScale,
            scaleCorrection: editScaleCorrection
        };
        reachTo(testPose);
    }

    function printCode() {
        console.log(`%c👇 복사해서 positions 배열에 넣으세요:`, "color: yellow");
        console.log(`{`);
        console.log(`    id: "custom-pos",`);
        console.log(`    hand: { x: ${Math.round(lastClickX)}, y: ${Math.round(lastClickY)} },`);
        console.log(`    handScale: ${editHandScale.toFixed(1)},`);
        console.log(`    scaleCorrection: ${editScaleCorrection.toFixed(2)}`);
        console.log(`},`);
    }
});