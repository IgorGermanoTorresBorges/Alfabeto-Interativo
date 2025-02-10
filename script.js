// Define o alfabeto, que é um array de letras de A a Z.
let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Variáveis para armazenar o estado do jogo e letras
let currentLetters = []; // Letras que aparecerão como opções
let correctLetter = ''; // A letra correta que o jogador deve adivinhar
let isGameStarted = false; // Indica se o jogo foi iniciado
let correctAudio = document.getElementById('correct-audio'); // Áudio para resposta correta
let errorAudio = document.getElementById('error-audio'); // Áudio para resposta incorreta
let pronunciationAudio = document.getElementById('pronunciation-audio'); // Áudio para pronúncia da letra
let parabensAudio = document.getElementById('parabens-audio'); // Áudio de parabéns após acerto
let currentAudio = null; // Áudio atual que está sendo reproduzido

// Função para iniciar o jogo
function startGame() {
    isGameStarted = true; // Marca o início do jogo
    document.getElementById('start-btn').style.display = 'none'; // Esconde o botão de iniciar
    document.getElementById('instruction-text').style.display = 'block'; // Exibe o texto de instrução
    document.getElementById('repeat-btn').style.display = 'inline-block'; // Exibe o botão de repetir
    generateRandomLetters(); // Gera letras aleatórias
}

// Função para gerar letras aleatórias para o jogo
function generateRandomLetters() {
    clearLargeLetter(); // Limpa qualquer letra grande da tela

    let randomLetters = []; // Array para armazenar as letras aleatórias
    while (randomLetters.length < 4) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)]; // Sorteia uma letra aleatória
        if (!randomLetters.includes(randomLetter)) { // Verifica se a letra já foi sorteada
            randomLetters.push(randomLetter); // Adiciona a letra ao array
        }
    }
    correctLetter = randomLetters[Math.floor(Math.random() * randomLetters.length)]; // Escolhe uma letra correta aleatória
    currentLetters = randomLetters; // Armazena as letras aleatórias
    displayLetters(); // Exibe as letras na tela
    playPronunciation(); // Reproduz o áudio de pronúncia da letra correta
    document.getElementById('feedback').innerHTML = ''; // Limpa qualquer feedback anterior
}

// Função para exibir as letras na tela como botões
function displayLetters() {
    const buttonsContainer = document.querySelector('.alphabet-buttons'); // Pega o contêiner dos botões
    buttonsContainer.innerHTML = ''; // Limpa o conteúdo do contêiner
    currentLetters.forEach(letter => {
        const button = document.createElement('button'); // Cria um novo botão
        button.classList.add('letter-btn'); // Adiciona uma classe ao botão
        button.textContent = letter; // Define o texto do botão como a letra
        button.onclick = () => checkAnswer(letter, button); // Define a função de clique
        buttonsContainer.appendChild(button); // Adiciona o botão ao contêiner
    });

    animateLetters(); // Anima as letras
}

// Função para reproduzir o áudio da pronúncia da letra correta
function playPronunciation() {
    pronunciationAudio.src = `audios/pronuncia-${correctLetter}.mp3`; // Define o arquivo de áudio com a pronúncia da letra
    pronunciationAudio.play(); // Reproduz o áudio
    currentAudio = pronunciationAudio; // Define o áudio atual como a pronúncia
}

// Função para verificar a resposta do jogador
function checkAnswer(selectedLetter, selectedButton) {
    const feedback = document.getElementById('feedback'); // Pega o elemento de feedback
    const buttons = document.querySelectorAll('.letter-btn'); // Pega todos os botões de letras

    // Verifica se a letra selecionada é a correta
    if (selectedLetter === correctLetter) {
        feedback.innerHTML = "<span style='color: green;'>✔</span> Você acertou!"; // Exibe mensagem de acerto
        stopAndPlayNewAudio(correctAudio); // Toca o áudio de acerto
        parabensAudio.play(); // Reproduz o áudio de parabéns

        // Após o áudio de parabéns, repete a pronúncia duas vezes
        parabensAudio.onended = () => {
            setTimeout(() => {
                playPronunciation(); // Repete a pronúncia
                setTimeout(() => {
                    playPronunciation(); // Repete novamente a pronúncia
                }, 1000);
            }, 1000);
        };

        moveAndGrowLetter(selectedButton); // Move e aumenta a letra ao acertar

        buttons.forEach(button => {
            button.disabled = true; // Desabilita todos os botões após acerto
        });

        createCelebrationEffects(); // Cria efeitos de celebração

        correctAudio.onended = () => {
            generateRandomLetters(); // Gera novas letras após o áudio de acerto
        };
    } else {
        feedback.innerHTML = "<span style='color: red;'>✖</span> Você errou. Tente novamente!"; // Exibe mensagem de erro
        stopAndPlayNewAudio(errorAudio); // Toca o áudio de erro
        selectedButton.style.backgroundColor = "red"; // Altera a cor de fundo do botão para vermelho
        selectedButton.style.color = "white"; // Altera a cor do texto para branco
        selectedButton.disabled = true; // Desabilita o botão
    }
}

// Função para parar e tocar um novo áudio
function stopAndPlayNewAudio(audioElement) {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause(); // Pausa o áudio atual
        currentAudio.currentTime = 0; // Reseta o tempo do áudio
    }
    audioElement.play(); // Toca o novo áudio
    currentAudio = audioElement; // Define o novo áudio como o atual
}

// Função para repetir a pronúncia
function restartPronunciation() {
    playPronunciation(); // Reproduz a pronúncia novamente
}

document.getElementById('repeat-btn').addEventListener('click', restartPronunciation); // Adiciona um evento de clique no botão de repetir

// Função para animar as letras (letras "flutuam" aleatoriamente)
function animateLetters() {
    const letters = document.querySelectorAll('.letter-btn'); // Pega todos os botões de letras
    let index = 0;
    let interval = setInterval(() => {
        letters.forEach(letter => {
            letter.textContent = alphabet[Math.floor(Math.random() * alphabet.length)]; // Troca as letras aleatoriamente
        });

        index++; // Incrementa o contador de animação

        if (index >= 30) {
            clearInterval(interval); // Para a animação após 30 iterações
            setTimeout(() => {
                letters.forEach((letter, i) => {
                    letter.textContent = currentLetters[i]; // Restaura as letras corretas
                });
            }, 300);
        }
    }, 100); // A cada 100ms troca as letras
}

// Função para mover e aumentar a letra após acerto
function moveAndGrowLetter(button) {
    const letterClone = button.cloneNode(true); // Cria uma cópia do botão
    letterClone.style.position = 'absolute'; // Define a posição absoluta para animação
    letterClone.style.top = `${button.offsetTop}px`;
    letterClone.style.left = `${button.offsetLeft}px`;
    letterClone.style.transition = 'all 1s ease-in-out'; // Define uma transição suave
    letterClone.style.zIndex = '100'; // Coloca a letra em cima das outras
    letterClone.style.transform = 'scale(1)'; // Inicialmente no tamanho original
    document.body.appendChild(letterClone); // Adiciona a cópia ao corpo da página

    // Anima a letra (move para o centro e cresce)
    setTimeout(() => {
        letterClone.style.top = '50%';
        letterClone.style.left = '50%';
        letterClone.style.transform = 'translate(-50%, -50%) scale(6.4)';
    }, 10);

    // Remove a cópia da letra após a animação
    setTimeout(() => {
        letterClone.style.transition = 'none'; // Remove a transição
        letterClone.style.transform = 'translate(-50%, -50%) scale(6.4)'; // Garante que a animação finalize
        letterClone.style.backgroundColor = 'green'; // Altera a cor de fundo para verde
        letterClone.style.color = 'white'; // Altera a cor do texto para branco

        setTimeout(() => {
            letterClone.remove(); // Remove a letra após 7 segundos
        }, 7000); // Remove após 7 segundos
    }, 1000); // 1 segundo após começar a animação
}

// Função para limpar letras grandes da tela
function clearLargeLetter() {
    const enlargedLetters = document.querySelectorAll('.enlarged'); // Pega as letras grandes
    enlargedLetters.forEach(letter => {
        letter.remove(); // Remove as letras grandes
    });
}

// Funções para criar efeitos de celebração (balões, confetes, estrelas)
function createCelebrationEffects() {
    createBalloons(); // Cria balões
    createConfetti(); // Cria confetes
    createFallingStars(); // Cria estrelas caindo
    createTwinklingStars(); // Cria estrelas piscando
}

// Função para criar balões flutuando
function createBalloons() {
    const balloonCount = 100; // Número de balões
    for (let i = 0; i < balloonCount; i++) {
        const balloon = document.createElement('div'); // Cria um balão
        balloon.classList.add('balloon'); // Adiciona a classe do balão
        balloon.style.position = 'absolute'; // Posição absoluta
        balloon.style.top = `${Math.random() * window.innerHeight}px`; // Posição aleatória
        balloon.style.left = `${Math.random() * window.innerWidth}px`; // Posição aleatória
        const size = Math.random() * 50 + 30; // Tamanho aleatório
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size}px`;
        balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`; // Cor aleatória
        balloon.style.borderRadius = '50%'; // Torna o balão redondo
        document.body.appendChild(balloon); // Adiciona o balão à página

        balloon.style.animation = 'floatUp 8s infinite'; // Animação de flutuar para cima

        setTimeout(() => {
            balloon.remove(); // Remove o balão após 8 segundos
        }, 8000); // Remoção após 8 segundos
    }
}

// Função para criar confetes caindo
function createConfetti() {
    const confettiCount = 200; // Número de confetes
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div'); // Cria um confete
        confetti.classList.add('confetti'); // Adiciona a classe de confete
        confetti.style.position = 'absolute'; // Posição absoluta
        confetti.style.top = `${Math.random() * window.innerHeight}px`; // Posição aleatória
        confetti.style.left = `${Math.random() * window.innerWidth}px`; // Posição aleatória
        confetti.style.width = `${Math.random() * 20 + 15}px`; // Tamanho aleatório
        confetti.style.height = `${Math.random() * 20 + 15}px`; // Tamanho aleatório
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`; // Cor aleatória
        confetti.style.borderRadius = '50%'; // Confete redondo
        document.body.appendChild(confetti); // Adiciona o confete ao corpo

        confetti.style.animation = 'fallDown 8s linear infinite'; // Animação de queda

        setTimeout(() => {
            confetti.remove(); // Remove o confete após 8 segundos
        }, 8000); // Remover após 8 segundos
    }
}

// Função para criar estrelas caindo
function createFallingStars() {
    const fallingStarCount = 20; // Número de estrelas caindo
    for (let i = 0; i < fallingStarCount; i++) {
        const fallingStar = document.createElement('div'); // Cria uma estrela
        fallingStar.classList.add('falling-star'); // Adiciona a classe de estrela caída
        fallingStar.style.position = 'absolute'; // Posição absoluta
        fallingStar.style.top = `${Math.random() * 100}%`; // Posição vertical aleatória
        fallingStar.style.left = `${Math.random() * 100}%`; // Posição horizontal aleatória
        const size = Math.random() * 6 + 5; // Tamanho aleatório
        fallingStar.style.width = `${size}px`;
        fallingStar.style.height = `${size}px`;
        fallingStar.style.backgroundColor = 'rgba(255, 255, 255, 1)'; // Cor da estrela (branco)
        fallingStar.style.borderRadius = '50%'; // Forma redonda
        fallingStar.style.animation = 'fallStar 8s linear infinite'; // Animação de queda
        document.body.appendChild(fallingStar);

        setTimeout(() => {
            fallingStar.remove(); // Remove a estrela após 8 segundos
        }, 8000); // Remover após 8 segundos
    }
}

// Função para criar estrelas piscando
function createTwinklingStars() {
    const starCount = 100; // Número de estrelas piscando
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div'); // Cria uma estrela
        star.classList.add('twinkling-star'); // Adiciona a classe de estrela piscante
        star.style.position = 'absolute'; // Posição absoluta
        star.style.top = `${Math.random() * window.innerHeight}px`; // Posição vertical aleatória
        star.style.left = `${Math.random() * window.innerWidth}px`; // Posição horizontal aleatória
        const size = Math.random() * 10 + 5; // Tamanho aleatório
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Cor da estrela (branco com opacidade)
        star.style.borderRadius = '50%'; // Forma redonda
        document.body.appendChild(star); // Adiciona a estrela ao corpo

        star.style.animation = 'twinkle 8s infinite alternate'; // Animação de piscar

        setTimeout(() => {
            star.remove(); // Remove a estrela após 8 segundos
        }, 8000); // Remover após 8 segundos
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

document.head.appendChild(style); // Adiciona o estilo CSS ao cabeçalho do documento
