let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let currentLetters = [];
let correctLetter = '';
let isGameStarted = false;
let correctAudio = document.getElementById('correct-audio');
let errorAudio = document.getElementById('error-audio');
let pronunciationAudio = document.getElementById('pronunciation-audio');
let parabensAudio = document.getElementById('parabens-audio');
let currentAudio = null;

function startGame() {
    isGameStarted = true;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('instruction-text').style.display = 'block';
    document.getElementById('repeat-btn').style.display = 'inline-block';
    generateRandomLetters();
}

function generateRandomLetters() {
    clearLargeLetter();

    let randomLetters = [];
    while (randomLetters.length < 4) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!randomLetters.includes(randomLetter)) {
            randomLetters.push(randomLetter);
        }
    }
    correctLetter = randomLetters[Math.floor(Math.random() * randomLetters.length)];
    currentLetters = randomLetters;
    displayLetters();
    playPronunciation();
    document.getElementById('feedback').innerHTML = '';
}

function displayLetters() {
    const buttonsContainer = document.querySelector('.alphabet-buttons');
    buttonsContainer.innerHTML = '';
    currentLetters.forEach(letter => {
        const button = document.createElement('button');
        button.classList.add('letter-btn');
        button.textContent = letter;
        button.onclick = () => checkAnswer(letter, button);
        buttonsContainer.appendChild(button);
    });

    animateLetters();
}

function playPronunciation() {
    pronunciationAudio.src = `audios/pronuncia-${correctLetter}.mp3`;
    pronunciationAudio.play();
    currentAudio = pronunciationAudio;
}

function checkAnswer(selectedLetter, selectedButton) {
    const feedback = document.getElementById('feedback');
    const buttons = document.querySelectorAll('.letter-btn');

    if (selectedLetter === correctLetter) {
        feedback.innerHTML = "<span style='color: green;'>✔</span> Você acertou!";
        stopAndPlayNewAudio(correctAudio);
        parabensAudio.play(); // Reproduz o áudio de parabéns uma vez

        parabensAudio.onended = () => {
            // Após o áudio de parabéns terminar, repete a pronúncia da letra duas vezes
            setTimeout(() => {
                playPronunciation();
                setTimeout(() => {
                    playPronunciation();
                }, 1000); // Repetir 1 segundo depois
            }, 1000);
        };

        moveAndGrowLetter(selectedButton);

        buttons.forEach(button => {
            button.disabled = true;
        });

        createCelebrationEffects();

        correctAudio.onended = () => {
            generateRandomLetters();
        };
    } else {
        feedback.innerHTML = "<span style='color: red;'>✖</span> Você errou. Tente novamente!";
        stopAndPlayNewAudio(errorAudio);
        selectedButton.style.backgroundColor = "red";
        selectedButton.style.color = "white";
        selectedButton.disabled = true;
    }
}

function stopAndPlayNewAudio(audioElement) {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    audioElement.play();
    currentAudio = audioElement;
}

function restartPronunciation() {
    playPronunciation();
}

document.getElementById('repeat-btn').addEventListener('click', restartPronunciation);

function animateLetters() {
    const letters = document.querySelectorAll('.letter-btn');
    let index = 0;
    let interval = setInterval(() => {
        letters.forEach(letter => {
            letter.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
        });

        index++;

        if (index >= 30) {
            clearInterval(interval);
            setTimeout(() => {
                letters.forEach((letter, i) => {
                    letter.textContent = currentLetters[i];
                });
            }, 300);
        }
    }, 100);
}

function moveAndGrowLetter(button) {
    const letterClone = button.cloneNode(true);
    letterClone.style.position = 'absolute';
    letterClone.style.top = `${button.offsetTop}px`;
    letterClone.style.left = `${button.offsetLeft}px`;
    letterClone.style.transition = 'all 1s ease-in-out';
    letterClone.style.zIndex = '100';
    letterClone.style.transform = 'scale(1)';
    document.body.appendChild(letterClone);

    setTimeout(() => {
        letterClone.style.top = '50%';
        letterClone.style.left = '50%';
        letterClone.style.transform = 'translate(-50%, -50%) scale(6.4)';
    }, 10);

    setTimeout(() => {
        letterClone.style.transition = 'none';
        letterClone.style.transform = 'translate(-50%, -50%) scale(6.4)';
        letterClone.style.backgroundColor = 'green';
        letterClone.style.color = 'white';

        // Remover a letra 1 segundo antes (7 segundos)
        setTimeout(() => {
            letterClone.remove();
        }, 7000); // Remover a letra 1 segundo antes das animações
    }, 1000);
}

function clearLargeLetter() {
    const enlargedLetters = document.querySelectorAll('.enlarged');
    enlargedLetters.forEach(letter => {
        letter.remove();
    });
}

function createCelebrationEffects() {
    createBalloons();
    createConfetti();
    createFallingStars();
    createTwinklingStars();
}

function createBalloons() {
    const balloonCount = 100; // Duplicado para maior impacto
    for (let i = 0; i < balloonCount; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.position = 'absolute';
        balloon.style.top = `${Math.random() * window.innerHeight}px`;
        balloon.style.left = `${Math.random() * window.innerWidth}px`;
        const size = Math.random() * 50 + 30; // Aumento do tamanho para maior volume
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size}px`;
        balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
        balloon.style.borderRadius = '50%';
        document.body.appendChild(balloon);

        balloon.style.animation = 'floatUp 8s infinite';

        setTimeout(() => {
            balloon.remove();
        }, 8000); // Garantir que dure 8 segundos
    }
}

function createConfetti() {
    const confettiCount = 200; // Duplicado para maior impacto
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.position = 'absolute';
        confetti.style.top = `${Math.random() * window.innerHeight}px`;
        confetti.style.left = `${Math.random() * window.innerWidth}px`;
        confetti.style.width = `${Math.random() * 20 + 15}px`; // Aumento do tamanho
        confetti.style.height = `${Math.random() * 20 + 15}px`; // Aumento do tamanho
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
        confetti.style.borderRadius = '50%';
        document.body.appendChild(confetti);

        confetti.style.animation = 'fallDown 8s linear infinite';

        setTimeout(() => {
            confetti.remove();
        }, 8000); // Garantir que dure 8 segundos
    }
}

function createFallingStars() {
    const fallingStarCount = 20; // Duplicado para maior impacto
    for (let i = 0; i < fallingStarCount; i++) {
        const fallingStar = document.createElement('div');
        fallingStar.classList.add('falling-star');
        fallingStar.style.position = 'absolute';
        fallingStar.style.top = `${Math.random() * 100}%`;
        fallingStar.style.left = `${Math.random() * 100}%`;
        const size = Math.random() * 6 + 5; // Aumento do tamanho para maior impacto
        fallingStar.style.width = `${size}px`;
        fallingStar.style.height = `${size}px`;
        fallingStar.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        fallingStar.style.borderRadius = '50%';
        fallingStar.style.animation = 'fallStar 8s linear infinite';
        document.body.appendChild(fallingStar);

        setTimeout(() => {
            fallingStar.remove();
        }, 8000); // Garantir que dure 8 segundos
    }
}

function createTwinklingStars() {
    const starCount = 100;  // Duplicado para maior impacto
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('twinkling-star');
        star.style.position = 'absolute';
        star.style.top = `${Math.random() * window.innerHeight}px`;
        star.style.left = `${Math.random() * window.innerWidth}px`;
        const size = Math.random() * 10 + 5; // Aumento do tamanho para maior impacto
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        star.style.borderRadius = '50%';
        document.body.appendChild(star);

        star.style.animation = 'twinkle 8s infinite alternate';

        setTimeout(() => {
            star.remove();
        }, 8000); // Garantir que dure 8 segundos
    }
}

// Estilos CSS para animações
const style = document.createElement('style');
style.innerHTML = `
    .balloon {
        position: absolute;
        animation: floatUp 8s infinite;
        opacity: 0.8;
    }

    .confetti {
        position: absolute;
        animation: fallDown 8s linear infinite;
        opacity: 0.9;
    }

    .falling-star {
        position: absolute;
        animation: fallStar 8s linear infinite;
    }

    .twinkling-star {
        position: absolute;
        animation: twinkle 8s infinite alternate;
    }

    @keyframes floatUp {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-100vh);
        }
    }

    @keyframes fallDown {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(100vh);
        }
    }

    @keyframes fallStar {
        0% {
            transform: translateX(0) translateY(0);
        }
        100% {
            transform: translateX(-100vw) translateY(50px);
        }
    }

    @keyframes twinkle {
        0% {
            opacity: 0.3;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.3;
        }
    }
`;

document.head.appendChild(style);
