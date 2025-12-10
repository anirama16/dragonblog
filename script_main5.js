document.addEventListener("DOMContentLoaded", () => {

    const sec = document.querySelector("#sec5");
    const fill = document.querySelector("#main5-fill");

    if (!sec || !fill) return;

    let done = false;
    let timer = null;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.7 && !done) {

                timer = setTimeout(() => {
                    if (!done) {
                        done = true;

                        fill.style.transition = "opacity 1.2s ease-out";
                        fill.style.opacity = "1";
                        io.unobserve(sec);
                    }
                }, 300); 
            } else {
                clearTimeout(timer);
            }
        });
    }, {
        threshold: [0, 0.3, 0.5, 0.7, 1] 
    });

    io.observe(sec);
});
