document.addEventListener("DOMContentLoaded", () => {

    const sec = document.querySelector("#sec5");
    const fill = document.querySelector("#main5-fill");

    if (!sec || !fill) return;

    let done = false;
    let timer = null;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 화면에 충분히 들어온 상태일 때만 실행
            if (entry.intersectionRatio >= 0.7 && !done) {

                // 스크롤 조금만 닿아도 발동되는 걸 방지하기 위해 지연 추가
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
