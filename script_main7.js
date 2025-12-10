document.addEventListener("DOMContentLoaded", () => {

    (function() { 
        
        const gameSvg = document.getElementById('canvas'); 
        const particleSvg = document.getElementById('particle-svg');
        const overlay = document.getElementById('overlay');
        const tryAgainBtn = document.getElementById('tryAgain');
        
        const dragonEyes = document.getElementById('dragon-default-eyes');
        const dragonSuccess = document.getElementById('success');
        const dragonBubble = document.querySelector('.sec7_bubble');

        let gameCircles = [];     
        let gameParticles = [];   
        let gameAnimId;       
        let isGameActive = true;

        const STAGE_W = 650;
        const STAGE_H = 350;
        const CIRCLE_COUNT = 15;
        const BASE_COLOR = '#4ecdc4'; 
        const TARGET_COLOR = '#45b7d1'; 


        if (!gameSvg || !particleSvg) return;

        initGame();

        function initGame() {
            gameCircles = [];
            gameParticles = [];
            gameSvg.innerHTML = ''; 
            particleSvg.innerHTML = ''; 
            overlay.classList.remove('show');
            isGameActive = true;

            if(dragonEyes) dragonEyes.style.display = 'block';
            if(dragonSuccess) {
                dragonSuccess.style.display = 'none';
                if(typeof gsap !== 'undefined') {
                    gsap.set(dragonSuccess, { y: 0, opacity: 0 }); 
                }
            }


            const targetIndex = Math.floor(Math.random() * CIRCLE_COUNT);
            for (let i = 0; i < CIRCLE_COUNT; i++) {
                const isTarget = (i === targetIndex);
                createBouncingCircle(isTarget);
            }

            if (gameAnimId) cancelAnimationFrame(gameAnimId);
            animateGame();
        }

        function createBouncingCircle(isTarget) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

            const x = Math.random() * (STAGE_W - 40) + 20;
            const y = Math.random() * (STAGE_H - 40) + 20;
            const size = 20;

            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', size);
            
            if (isTarget) {
                circle.setAttribute('fill', TARGET_COLOR);
                circle.setAttribute('class', 'target-glow'); 
                circle.setAttribute('data-id', 'target'); 
            } else {
                circle.setAttribute('fill', BASE_COLOR);
                circle.setAttribute('opacity', 0.6);
            }

            gameSvg.appendChild(circle);

            gameCircles.push({
                element: circle,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 3, 
                vy: (Math.random() - 0.5) * 3,
                size: size,
                isTarget: isTarget
            });
        }

        function createExplosion(screenX, screenY, color) {
            const particleCount = 40; 
            for (let i = 0; i < particleCount; i++) {
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                
                p.setAttribute('cx', screenX);
                p.setAttribute('cy', screenY);
                p.setAttribute('r', Math.random() * 4 + 2); 
                p.setAttribute('fill', color);

                particleSvg.appendChild(p);

                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 8 + 3; 

                gameParticles.push({
                    element: p,
                    x: screenX,
                    y: screenY,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    life: 1.0, 
                    decay: Math.random() * 0.02 + 0.01
                });
            }
        }

        function animateGame() { 
            if (isGameActive) {
                gameCircles.forEach(c => {
                    c.x += c.vx;
                    c.y += c.vy;
                    if (c.x < c.size || c.x > STAGE_W - c.size) c.vx = -c.vx;
                    if (c.y < c.size || c.y > STAGE_H - c.size) c.vy = -c.vy;

                    c.element.setAttribute('cx', c.x);
                    c.element.setAttribute('cy', c.y);
                });
            }


            for (let i = gameParticles.length - 1; i >= 0; i--) {
                const p = gameParticles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;

                if (p.life <= 0) {
                    p.element.remove();
                    gameParticles.splice(i, 1);
                } else {
                    p.element.setAttribute('cx', p.x);
                    p.element.setAttribute('cy', p.y);
                    p.element.setAttribute('opacity', p.life);
                }
            }

            gameAnimId = requestAnimationFrame(animateGame);
        }


        gameSvg.addEventListener('click', (e) => {
            if (!isGameActive) return;

            if (e.target.tagName === 'circle' && e.target.getAttribute('data-id') === 'target') {
                handleSuccess(e.target);
            }
        });

        function handleSuccess(targetElement) {
            isGameActive = false;
            

            const rect = targetElement.getBoundingClientRect();
            const globalX = rect.left + rect.width / 2;
            const globalY = rect.top + rect.height / 2;

            targetElement.style.display = 'none';


            createExplosion(globalX, globalY, '#e7ffb3ff'); 
            createExplosion(globalX, globalY, '#ffffff'); 
            createExplosion(globalX, globalY, '#206aff'); 


            if(dragonEyes) dragonEyes.style.display = 'none';
            if(dragonSuccess) {
                dragonSuccess.style.display = 'block';
                if(typeof gsap !== 'undefined') {
                    gsap.fromTo(dragonSuccess, 
                        { y: 520, opacity: 0 }, 
                        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
                    );
                }
            }
            if(dragonBubble) {
                gsap.to(dragonBubble, {
                    opacity: 1,
                    y: "60%",
                    duration: 0.5,
                    delay: 0.7, 
                    ease: "back.out(1.2)"
                });
            }

            setTimeout(() => {
                overlay.classList.add('show');
            }, 300);
        }


        tryAgainBtn.addEventListener('click', initGame);

    })(); 
});