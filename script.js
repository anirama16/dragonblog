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

        svgPaths.forEach((path) => {
            path.style.transition = "stroke-dashoffset 2.5s ease";
            path.style.strokeDashoffset = "0";
        });

        clickText.classList.add("hide");
    });
});








document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin();

    const armGroup = document.getElementById('_arm-flesh');
    const handGroup = document.getElementById('_hand-group');
    const svgElement = document.getElementById('mainSvg2');

    const armPaths = armGroup.querySelectorAll('path');
    const armUpper = armPaths[0]; 
    const armLower = armPaths[1]; 

    const shoulder1 = { x: 830, y: 720 }; 
    const shoulder2 = { x: 836, y: 840 }; 
    const initHand = { x: 639.77, y: 810.63 }; 
    
    const baseLen = 85; 
    const wristOffset = 60; 

    gsap.set(armUpper, { svgOrigin: `${shoulder1.x} ${shoulder1.y}` });
    gsap.set(armLower, { svgOrigin: `${shoulder2.x} ${shoulder2.y}` });
    gsap.set(handGroup, { transformOrigin: "50% 50%" });











    let positions = [
        { 
            id: "initial", 
            hand: { x: initHand.x, y: initHand.y }, 
            handScale: 1, 
            isReset: true 
        },
        { 
            id: "top-right", 
            hand: { x: 1500, y: 220 }, 
            handScale: 1, 
            scaleCorrection: 1
        },


        { 
            id: "bottom-right", 
            hand: { x: 1400, y: 800 }, 
            handScale: 1.0,    
            scaleCorrection: 1.0 
        },

        { 
            id: "top-left", 
            hand: { x: 400, y: 300 }, 
            handScale: 0.8,    
            scaleCorrection: 1.0 
        }
    ];


    function reachTo(pose) {
        if (pose.isReset) {
            const tl = gsap.timeline();
            tl.to([armUpper, armLower], { rotation: 0, scaleX: 1, duration: 0.5, ease: "back.out(1.0)" }, 0);
            tl.to(handGroup, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.5, ease: "back.out(1.0)" }, 0);
            return;
        }

        const tx = pose.hand.x;
        const ty = pose.hand.y;
        const correction = pose.scaleCorrection || 1.0;
        const hScale = pose.handScale || 1.0; 

        const dx1 = tx - shoulder1.x;
        const dy1 = ty - shoulder1.y;
        const dist1 = Math.sqrt(dx1*dx1 + dy1*dy1);
        const deg1 = (Math.atan2(dy1, dx1) * 180 / Math.PI) - 180;
        const scale1 = ((dist1 - wristOffset) / baseLen) * correction;

        const dx2 = tx - shoulder2.x;
        const dy2 = ty - shoulder2.y;
        const dist2 = Math.sqrt(dx2*dx2 + dy2*dy2);
        const deg2 = (Math.atan2(dy2, dx2) * 180 / Math.PI) - 180;
        const scale2 = ((dist2 - wristOffset) / baseLen) * correction;


        const moveX = tx - initHand.x;
        const moveY = ty - initHand.y;

        const tl = gsap.timeline();
        
        tl.to(armUpper, { rotation: deg1, scaleX: scale1, duration: 0.4, ease: "power2.out" }, 0);
        tl.to(armLower, { rotation: deg2, scaleX: scale2, duration: 0.4, ease: "power2.out" }, 0);
        

        tl.to(handGroup, { 
            x: moveX, 
            y: moveY, 
            rotation: deg1, 
            scale: hScale,
            duration: 0.4, 
            ease: "power2.out" 
        }, 0);
    }


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



    
    let editScaleCorrection = 1.0; 
    let editHandScale = 1.0; 




    let lastClickX = initHand.x;
    let lastClickY = initHand.y;

    svgElement.addEventListener("click", (e) => {

        svgPt.x = e.clientX; svgPt.y = e.clientY;
        const p = svgPt.matrixTransform(svgElement.getScreenCTM().inverse());
        lastClickX = p.x;
        lastClickY = p.y;
    });

    window.addEventListener("keydown", (e) => {
        if (!isEditMode) return;

        if (e.key.toLowerCase() === 'a') editScaleCorrection -= 0.05;
        if (e.key.toLowerCase() === 's') editScaleCorrection += 0.05;
        
        if (e.key.toLowerCase() === 'q') editHandScale -= 0.1;
        if (e.key.toLowerCase() === 'w') editHandScale += 0.1;

        if (e.key === ' ') {
            e.preventDefault();
            printCode();
        } else {
            updateTestPose(lastClickX, lastClickY);
            
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


});


