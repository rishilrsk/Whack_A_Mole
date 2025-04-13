        document.addEventListener('DOMContentLoaded', () => {
            // Create stars background
            createStars();

            // Game variables
            let score = 0;
            let timeLeft = 30;
            let gameActive = false;
            let timer;
            let moleTimer;
            const holes = [];

            // DOM elements
            const gameBoard = document.getElementById('game-board');
            const scoreDisplay = document.getElementById('score');
            const timeDisplay = document.getElementById('time');
            const gameOverScreen = document.getElementById('game-over');
            const finalScoreDisplay = document.getElementById('final-score');
            const playAgainBtn = document.getElementById('play-again');

            // Create holes
            for (let i = 0; i < 9; i++) {
                const hole = document.createElement('div');
                hole.className = 'hole';
                hole.dataset.index = i;

                const asteroid = document.createElement('div');
                asteroid.className = 'asteroid';

                hole.appendChild(asteroid);
                hole.addEventListener('click', whackAsteroid);

                gameBoard.appendChild(hole);
                holes.push({
                    element: hole,
                    asteroid: asteroid,
                    isUp: false
                });
            }

            // Start game
            startGame();

            // Event listeners
            playAgainBtn.addEventListener('click', startGame);

            // Functions
            function startGame() {
                // Reset game state
                score = 0;
                timeLeft = 30;
                gameActive = true;
                scoreDisplay.textContent = score;
                timeDisplay.textContent = timeLeft;
                gameOverScreen.classList.remove('show');

                // Hide all asteroids
                holes.forEach(hole => {
                    hole.element.classList.remove('up');
                    hole.isUp = false;
                });

                // Clear any existing timers
                clearInterval(timer);
                clearTimeout(moleTimer);

                // Start game timers
                timer = setInterval(updateTimer, 1000);
                popRandomAsteroid();
            }

            function updateTimer() {
                timeLeft--;
                timeDisplay.textContent = timeLeft;

                if (timeLeft <= 0) {
                    endGame();
                }
            }

            function popRandomAsteroid() {
                if (!gameActive) return;

                // Hide any currently visible asteroid
                const currentUp = holes.find(hole => hole.isUp);
                if (currentUp) {
                    currentUp.element.classList.remove('up');
                    currentUp.isUp = false;
                }

                // Show a random asteroid
                const randomIndex = Math.floor(Math.random() * holes.length);
                const hole = holes[randomIndex];
                hole.element.classList.add('up');
                hole.isUp = true;

                // Set time for next asteroid (easy level: 0.8-1.5 seconds)
                const nextTime = 800 + Math.random() * 700;
                moleTimer = setTimeout(popRandomAsteroid, nextTime);
            }

            function whackAsteroid(e) {
                if (!gameActive) return;

                const holeIndex = e.target.closest('.hole').dataset.index;
                const hole = holes[holeIndex];

                if (hole.isUp) {
                    // Hit the asteroid
                    hole.asteroid.classList.add('hit');
                    setTimeout(() => {
                        hole.asteroid.classList.remove('hit');
                    }, 500);

                    score++;
                    scoreDisplay.textContent = score;
                    hole.element.classList.remove('up');
                    hole.isUp = false;

                    // Play sound (optional)
                    playSound('hit');
                }
            }

            function endGame() {
                gameActive = false;
                clearInterval(timer);
                clearTimeout(moleTimer);

                // Hide all asteroids
                holes.forEach(hole => {
                    hole.element.classList.remove('up');
                    hole.isUp = false;
                });

                // Show game over screen
                finalScoreDisplay.textContent = score;
                gameOverScreen.classList.add('show');

                // Play sound (optional)
                playSound('gameOver');
            }

            function playSound(type) {
                // In a real implementation, you would play actual sound files here
                console.log(`Playing ${type} sound`);
            }

            function createStars() {
                const starsContainer = document.getElementById('stars');
                starsContainer.innerHTML = '';

                for (let i = 0; i < 200; i++) {
                    const star = document.createElement('div');
                    star.className = 'star';

                    // Random position
                    const x = Math.random() * 100;
                    const y = Math.random() * 100;

                    // Random size (0.5px to 2px)
                    const size = 0.5 + Math.random() * 1.5;

                    // Random animation delay
                    const delay = Math.random() * 2;

                    star.style.left = `${x}%`;
                    star.style.top = `${y}%`;
                    star.style.width = `${size}px`;
                    star.style.height = `${size}px`;
                    star.style.animationDelay = `${delay}s`;

                    starsContainer.appendChild(star);
                }
            }
        });
