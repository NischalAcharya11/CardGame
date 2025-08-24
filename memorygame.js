
        const icons = [
            'https://cdn.rafled.com/anime-icons/images/c01e4b6a0d13805ce0a7efb5a4c56bbaced0a201ce283be4dd9b321ba189c851.jpg',
            'https://cdn.rafled.com/anime-icons/images/f3565b5711851bab3e5cdab21b29d498fd6b04ee6bfe2365f291365c2b685efc.jpg',
            'https://cdn.rafled.com/anime-icons/images/f9763b86bedc5ba2c13ab59a66b8cb8c5fcc9637bdba986b54d6d749a3a5aa70.jpg',
            'https://cdn.rafled.com/anime-icons/images/97fcfc3ebdd48b13062e24755d1ef38635a9f33ce617a6419e3c31c8502e0e1f.jpg',
            'https://imgs.search.brave.com/fS6BmC_xPMEPBEQfS1MUkDg5nvoDnP8eLRuT_d5FWHw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hLnRo/dW1icy5yZWRkaXRt/ZWRpYS5jb20vWXk2/QmFjbkNaTDJHeHlQ/am55Sl85WlVxR2FE/SjlIMmZScjV2VEM1/NXVoOC5qcGc',
            'https://imgs.search.brave.com/CtD0UkiC13gX-I0J0O_GK3FIO5MRN2AgDa5Ju5O6yS4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmdhbWVyYW50/aW1hZ2VzLmNvbS93/b3JkcHJlc3Mvd3At/Y29udGVudC91cGxv/YWRzLzIwMjQvMDgv/YmxhY2stbXl0aC13/dWtvbmctdGFnLXBh/Z2UtY292ZXItYXJ0/LmpwZz9xPTQ5JmZp/dD1jcm9wJnc9MzEw/Jmg9NDYwJmRwcj0y',
            'https://imgs.search.brave.com/yw3dSM7sYTUlujxklT1jHprHZ9SfVOp82mITQ1LC4ic/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMxLnNyY2RuLmNv/bS93b3JkcHJlc3Mv/d3AtY29udGVudC91/cGxvYWRzLzIwMjUv/MDgvYmxhY2stbXl0/aC16aG9uZy1rdWkt/Y292ZXItaW1hZ2Uu/anBnP3E9NDkmZml0/PWNyb3Amdz00MjIm/aD0yNjgmZHByPTI',
            'https://imgs.search.brave.com/b9fgBeVG_J5Aufa-CNz8jNOgMJHCmU83aFqPhqTJSuc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/aS1nYXZlLXlvdS1h/bGwtaS1oYWQtcmVk/LWRlYWQtaS1kaWQt/djAtMDZ4cGVqNG5o/MzllMS5wbmc_YXV0/bz13ZWJwJnM9Yzlh/ZDIzOWNmY2IyZjYz/YzVlMWI2MDdlMWNh/MjU1MzQ3MzZmYjc1/YQ'
        ];
        
        // Duplicate and shuffle the icons
        const cards = shuffle([...icons, ...icons]);
        
        const grid = document.getElementById('grid');
        const movesEl = document.getElementById('moves');
        const timeEl = document.getElementById('time');
        const win = document.getElementById('win');
        const finalMoves = document.getElementById('finalMoves');
        const finalTime = document.getElementById('finalTime');
        const restartBtn = document.getElementById('restart');
        const againBtn = document.getElementById('again');
        
        let first = null, second = null, lock = false, moves = 0;
        let startTime = null, timerId = null;
        
        function shuffle(arr) { 
            for(let i = arr.length - 1; i > 0; i--) { 
                const j = Math.floor(Math.random() * (i + 1)); 
                [arr[i], arr[j]] = [arr[j], arr[i]]; 
            } 
            return arr; 
        }
        
        function pad(n) { 
            return n.toString().padStart(2, '0'); 
        }
        
        function startTimer() {
            startTime = Date.now();
            timerId = setInterval(() => {
                const s = Math.floor((Date.now() - startTime) / 1000);
                const mm = pad(Math.floor(s / 60)), ss = pad(s % 60);
                timeEl.textContent = `${mm}:${ss}`;
            }, 500);
        }
        
        function createCard(icon) {
            const c = document.createElement('div');
            c.className = 'card';
            c.innerHTML = `
                <div class="face backface"></div>
                <div class="face frontface"><img src="${icon}" alt="Card icon"></div>
            `;
            c.dataset.icon = icon;
            c.addEventListener('click', () => flip(c));
            return c;
        }
        
        function setup() {
            grid.innerHTML = '';
            cards.forEach(ic => grid.appendChild(createCard(ic)));
        }
        
        function flip(c) {
            if (lock || c.classList.contains('matched') || c === first) return;
            if (!startTime) startTimer();
            
            c.classList.add('flipped');
            
            if (!first) {
                first = c;
                return;
            }
            
            second = c;
            lock = true;
            moves++;
            movesEl.textContent = moves;
            
            if (first.dataset.icon === second.dataset.icon) {
                first.classList.add('matched');
                second.classList.add('matched');
                resetPair();
                checkWin();
            } else {
                setTimeout(() => {
                    first.classList.remove('flipped');
                    second.classList.remove('flipped');
                    resetPair();
                }, 700);
            }
        }
        
        function resetPair() { 
            first = null; 
            second = null; 
            lock = false; 
        }
        
        function checkWin() {
            const allCards = document.querySelectorAll('.card');
            const allMatched = [...allCards].every(card => card.classList.contains('matched'));
            
            if (allMatched) {
                clearInterval(timerId);
                finalMoves.textContent = moves;
                finalTime.textContent = timeEl.textContent;
                win.classList.add('visible');
            }
        }
        
        restartBtn.addEventListener('click', () => {
            location.reload();
        });
        
        againBtn.addEventListener('click', () => {
            win.classList.remove('visible');
            setTimeout(() => {
                location.reload();
            }, 300);
        });
        
        // Initialize the game
        setup();
