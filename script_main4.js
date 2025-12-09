document.getElementById("musicPlay").addEventListener("click", () => {
    audio.play();
    resetToDefault();
});

document.getElementById("musicPause").addEventListener("click", () => {
    audio.pause();
    resetToDefault();
});

document.addEventListener("DOMContentLoaded", () => {

    const faces = {
        default: document.getElementById("dragon-default"),
        sad: document.getElementById("dragon-sad"),
        excited: document.getElementById("dragon-excited"),
        calm: document.getElementById("dragon-calm")
    };

    const weathers = {
        rain: document.getElementById("rain"),
        thunder: document.getElementById("thunder"),
        snow: document.getElementById("snow")
    };
    Object.values(faces).forEach(f => f.style.opacity = 0);
    Object.values(weathers).forEach(w => w.style.opacity = 0);

    faces.default.style.opacity = 1;

    const audios = {
        sad: document.getElementById("bgm-sad"),
        excited: document.getElementById("bgm-excited"),
        calm: document.getElementById("bgm-calm")
    };

    function stopAllAudio() {
        Object.values(audios).forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
    }

//---------날씨---------------------//
function playRain() {
    gsap.set(rain, { opacity: 1 });

    const lines = rain.querySelectorAll("line");

    lines.forEach((line) => {
        const length = line.getTotalLength();

        gsap.set(line, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        gsap.to(line, {
            strokeDashoffset: 0,
            duration: gsap.utils.random(0.6, 1.2), 
            delay: gsap.utils.random(0, 0.5),    
            repeat: -1,
            ease: "none",
            onRepeat: () => {
                
                gsap.set(line, { strokeDashoffset: length });
            }
        });
    });
}



function playSnow() {
    const flakes = document.querySelectorAll("#snow > *");

    flakes.forEach((flake) => {
        const startX = gsap.utils.random(-20, 20); 
        const swing = gsap.utils.random(10, 25);  
        const fallDuration = gsap.utils.random(3, 6);

        gsap.fromTo(
            flake,
            { y: -100, x: startX, opacity: 1 },
            {
                y: 350,
                duration: fallDuration,
                ease: "none",
                repeat: -1,
                delay: gsap.utils.random(0, 1),
                onRepeat: () => {
                    gsap.set(flake, {
                        x: gsap.utils.random(-20, 20)
                    });
                }
            }
        );

        gsap.to(flake, {
            x: `+=${swing}`,
            duration: gsap.utils.random(1.5, 3),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });

        gsap.to(flake, {
            rotation: gsap.utils.random(-20, 20),
            duration: gsap.utils.random(2, 4),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    });
}


function playThunder() {
    const bolts = document.querySelectorAll("#thunder path, #thunder line, #thunder polyline, #thunder polygon");

    bolts.forEach((bolt) => {
        const len = bolt.getTotalLength();
        bolt.style.strokeDasharray = len;
        bolt.style.strokeDashoffset = len;


        gsap.fromTo(
            bolt,
            { strokeDashoffset: len },
            {
                strokeDashoffset: 0,
                duration: gsap.utils.random(0.05, 0.15),
                repeat: -1,
                yoyo: true,
                ease: "power4.in",
                delay: gsap.utils.random(0, 0.1)
            }
        );

        gsap.fromTo(
            bolt,
            { opacity: 0 },
            {
                opacity: 1,
                duration: gsap.utils.random(0.05, 0.12),
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: gsap.utils.random(0, 0.2)
            }
        );
    });
}


    function stopAllWeather() {
        gsap.killTweensOf("#rain");
        gsap.killTweensOf("#snow");
        gsap.killTweensOf("#thunder");

        Object.values(weathers).forEach(w => {
            w.style.opacity = 0;
            gsap.set(w, { clearProps: "all" });
        });
    }
    function changeMood(mood) {
        Object.values(faces).forEach(f => f.style.opacity = 0);

        stopAllWeather();
        stopAllAudio();

        if (faces[mood]) faces[mood].style.opacity = 1;
        if (audios[mood]) audios[mood].play();
        if (mood === "sad") {
            weathers.rain.style.opacity = 1;
            playRain();
        }
        if (mood === "excited") {
            weathers.thunder.style.opacity = 1;
            playThunder();
        }
        if (mood === "calm") {
            weathers.snow.style.opacity = 1;
            playSnow();
        }
    }

    document.querySelectorAll(".sec4_music_box button").forEach(btn => {
        btn.addEventListener("click", () => {
            const mood = btn.dataset.mood;
            changeMood(mood);
        });
    });
});

function resetToDefault() {
    gsap.set("#dragon-default, #dragon-sad, #dragon-excited, #dragon-calm", { opacity: 0 });

    gsap.set("#dragon-default", { opacity: 1 });

    gsap.killTweensOf("#rain line");
    gsap.killTweensOf("#snow");
    gsap.killTweensOf("#thunder path, #thunder line, #thunder polyline, #thunder polygon");

    gsap.set("#rain line", { opacity: 0, y: 0 });
    gsap.set("#snow", { opacity: 0, y: 0 });
    gsap.set("#thunder path, #thunder line, #thunder polyline, #thunder polygon", {
        opacity: 0,
        strokeDasharray: 0,
        strokeDashoffset: 0
    });


}
const audio = document.getElementById("bgm");

function resetToDefault() {
    gsap.set("#dragon-default, #dragon-sad, #dragon-excited, #dragon-calm", { opacity: 0 });
    gsap.set("#dragon-default", { opacity: 1 });

    gsap.killTweensOf("#rain line");
    gsap.killTweensOf("#snow");
    gsap.killTweensOf("#thunder path, #thunder line, #thunder polyline, #thunder polygon");

    gsap.set("#rain line", { opacity: 0, y: 0 });
    gsap.set("#snow", { opacity: 0, y: 0 });
    gsap.set("#thunder path, #thunder line, #thunder polyline, #thunder polygon", {
        opacity: 0,
        strokeDasharray: 0,
        strokeDashoffset: 0
    });
}

