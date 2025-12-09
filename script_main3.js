document.addEventListener("DOMContentLoaded", () => {

    const cushion = document.getElementById("cushion");
    const foodImages = document.querySelectorAll(".sec3-menu li img");

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
    let draggedType = null; 

    function initView() {
        [dragonDefault, dragonDisappoint, dragonSmile, dragonAngry].forEach(el => {
            if(el) el.style.display = "none";
        });
        if(dragonDefault) dragonDefault.style.display = "block";

        if(sign) {
            sign.style.display = "none";
        }
        
        for (let key in signs) {
            if(signs[key]) signs[key].style.display = "none";
        }
    }
    
    initView();


    function isCursorOverCushion(x, y) {
        if (!cushion) return false;
        
        const rect = cushion.getBoundingClientRect();
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    }


    foodImages.forEach((img) => {
        const li = img.closest("li");
        const type = li ? li.dataset.type : null;

        if (!type) {
            console.error("data-type을 찾을 수 없습니다:", img);
            return;
        }

        img.setAttribute("draggable", "true");
        img.style.cursor = "move";

        img.addEventListener("dragstart", (e) => {
            draggedType = type;
            
            e.dataTransfer.setData("text/plain", type);
            e.dataTransfer.effectAllowed = "copy";
            
            setTimeout(() => {
                img.style.opacity = "0.3";
            }, 0);
        });

        img.addEventListener("dragend", (e) => {

            img.style.opacity = "1";
            const x = e.clientX;
            const y = e.clientY;
            
            if (isCursorOverCushion(x, y)) {
                updateDragonState(draggedType);
            } else {
                console.log("x");
            }
            
            draggedType = null;
        });
    });

    if (cushion) {
        cushion.style.pointerEvents = "all";
        
        const cushionChildren = cushion.querySelectorAll("*");
        cushionChildren.forEach(child => {
            child.style.pointerEvents = "none";
        });

        cushion.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = "copy";
        });

        cushion.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();

            
            const foodType = e.dataTransfer.getData("text/plain") || draggedType;
            
            if (foodType) {
                updateDragonState(foodType);
            }
            
            return false;
        });
    }

    document.addEventListener("dragover", (e) => {
        if (cushion && isCursorOverCushion(e.clientX, e.clientY)) {
            e.preventDefault();
            console.log("document dragover - cushion 위");
        }
    });

    document.addEventListener("drop", (e) => {
        if (cushion && isCursorOverCushion(e.clientX, e.clientY)) {
            e.preventDefault();
            
            const foodType = e.dataTransfer.getData("text/plain") || draggedType;
            
            if (foodType) {
                updateDragonState(foodType);
            }
        }
    });

    function updateDragonState(type) {

        if (isFirstDrop && sign) {
            sign.style.display = "block";
            
            if (typeof gsap !== "undefined") {
                gsap.fromTo(sign, 
                    {y: 50, opacity: 0}, 
                    {y: 0, opacity: 1, duration: 0.5}
                );
            } else {
                sign.style.opacity = "0";
                sign.style.transform = "translateY(50px)";
                setTimeout(() => {
                    sign.style.transition = "transform 0.5s, opacity 0.5s";
                    sign.style.transform = "translateY(0)";
                    sign.style.opacity = "1";
                }, 10);
            }
            
            isFirstDrop = false;
        }

        [dragonDefault, dragonDisappoint, dragonSmile, dragonAngry].forEach(el => {
            if(el) el.style.display = "none";
        });
        
        for (let key in signs) {
            if(signs[key]) signs[key].style.display = "none";
        }

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
            default:
                if(dragonDefault) dragonDefault.style.display = "block";
        }
    }

    if (cushion) {
        const rect = cushion.getBoundingClientRect();
    }
});