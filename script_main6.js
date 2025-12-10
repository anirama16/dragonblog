document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin();

    const buttons = document.querySelectorAll(".sec6_btn button");
    
    const costumes = {
        winter: document.getElementById("winter"),
        cute: document.getElementById("cute"),
        sleep: document.getElementById("sleep")
    };

    let currentMood = null; 
    let isChanging = false; 


    gsap.set(Object.values(costumes), { display: "none", opacity: 0 });

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedMood = btn.dataset.mood;


            if (selectedMood === currentMood) return;

            if (isChanging) return;

            changeOutfit(selectedMood);
        });
    });


    function changeOutfit(newMood) {
        isChanging = true; 
        const newOutfit = costumes[newMood];


        if (currentMood === null) {
            gsap.set(newOutfit, { display: "block", x: 0, opacity: 0 });
            
            gsap.to(newOutfit, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    currentMood = newMood; 
                    isChanging = false; 
                }
            });
            return; 
        }


        const oldOutfit = costumes[currentMood];

        const tl = gsap.timeline({
            onComplete: () => {
                currentMood = newMood;
                isChanging = false;
            }
        });


        tl.to(oldOutfit, {
            x: -500,        
            opacity: 0,
            duration: 0.6,
            ease: "back.in(1.7)",
            onComplete: () => {
                gsap.set(oldOutfit, { display: "none" }); 
            }
        });


        tl.set(newOutfit, { display: "block", x: 0, opacity: 0 });
        
        tl.to(newOutfit, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.1"); 
    }
});