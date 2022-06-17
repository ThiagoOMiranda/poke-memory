const cards = document.querySelectorAll('.card');
const cardsBack = document.querySelectorAll('.card-back');
const cardsFront = document.querySelectorAll('.card-front');
const title = document.getElementsByClassName('logo-wrapper')[0];
const logo = document.getElementById('poke-logo');
const textTitle = document.getElementById('title-text');
const container = document.getElementsByClassName('container')[0];
const Points = document.getElementById('captured');
const resetBtn = document.getElementById("reset-btn");
const setBackground = document.getElementById('background');

let hasFlippedCard = false;
let firstCard, secondCard;
let matchesNums = 0;
let lockBoard = false;
let isFinished = false;
let animationEnded = false;

const cry01 = new Audio();
cry01.src = "./assets/snd/01.wav";
const cry04 = new Audio();
cry04.src = "./assets/snd/04.wav";
const cry07 = new Audio();
cry07.src = "./assets/snd/07.wav";
const cry12 = new Audio();
cry12.src = "./assets/snd/12.wav";
const cry16 = new Audio();
cry16.src = "./assets/snd/16.wav";
const cry25 = new Audio();
cry25.src = "./assets/snd/25.wav";
const cry39 = new Audio();
cry39.src = "./assets/snd/39.wav";
const cry52 = new Audio();
cry52.src = "./assets/snd/52.wav";
const cry58 = new Audio();
cry58.src = "./assets/snd/58.wav";
const cry133 = new Audio();
cry133.src = "./assets/snd/133.wav";
const flipSnd = new Audio();
flipSnd.src = "./assets/snd/flip.mp3";
const titleTheme = new Audio();
titleTheme.src = "./assets/snd/title.mp3";
const start = new Audio();
start.src = "./assets/snd/start.mp3";
const victory = new Audio();
victory.src = "./assets/snd/victory.mp3";
const gameTheme = new Audio();
gameTheme.src = "./assets/snd/game-theme.mp3";


//Função que verifica se a orientação da tela é retrato:
function identifyScreen() {
    if (window.matchMedia("(orientation: portrait)").matches) {
        cards.forEach((card) => {
            card.vanillaTilt.destroy();
            card.removeAttribute('data-tilt');
            card.removeAttribute('data-tilt-scale');
            card.removeAttribute('data-tilt-glare');
            card.removeAttribute('data-tilt-max-glare');
        });
    } else {
        cards.forEach((card) => {
            VanillaTilt.init(card);
            card.setAttribute('data-tilt', "");
            card.setAttribute('data-tilt-scale', "");
            card.setAttribute('data-tilt-glare', "");
            card.setAttribute('data-tilt-max-glare', "");
        });
    }
};

identifyScreen();

//Função que troca o background entre várias imagens em intervalos regulares:
let i = 0;

function changeBackground() {
    let backs = ["Bckg_01.png", "Bckg_02.png", "Bckg_03.png", "Bckg_00.png", "Bckg_04.png", "Bckg_05.png", "Bckg_06.png", "Bckg_07.png", "Bckg_08.png"];

    setBackground.style.backgroundImage = `url("./assets/img/${backs[i]}")`;
    i = (i + 1) % backs.length;
}
setInterval(changeBackground, 5000);

//Função que implementa de frente nos cards:
function setCards() {
    for (let i = 0; i < cardsFront.length / 2; i++) {
        cardsFront[i].style.backgroundImage = `url("./assets/img/${i + 1}.png")`;
        cardsFront[i + 10].style.backgroundImage = `url("./assets/img/${i + 1}.png")`;
    }
};

setCards();

let played = false;
document.body.addEventListener("mouseup", () => {
    if (!played) {
        titleTheme.play();
        title.classList.add("logo-animation");
        logo.classList.add("logo-up-down");
        textTitle.classList.remove("hidden");

        cardsBack.forEach((card) => {
            card.classList.remove("hidden");
            card.classList.add("fade-in");
        });

        title.addEventListener('click', titleScreen);
    }
    played = true;
});

//Função que implementa animações da tela de título:
function titleScreen() {

    start.play();
    if (title.classList.contains("logo-animation")) {
        title.classList.remove("logo-animation");
        textTitle.classList.add("hidden");
    }
    titleTheme.pause();
    if (played) {
        cardsBack.forEach((card) => {
            card.classList.remove("fade-in");
            card.classList.remove("rounded");
        });

        for (let i = 0; i < cards.length; i++) {
            setTimeout(() => {
                cards[i].classList.add("card-pos");
                flipSnd.volume = 0.5;
                flipSnd.playbackRate = 1.5;
                flipSnd.play();
            }, 200 * i)
        }

        setTimeout(() => {
            cards.forEach((card) => {
                card.style.transition = "none";
                card.style.position = "relative";
                card.classList.remove("card-pos");
            });
        }, 4500)
    }

    gameTheme.volume = 0.2;
    gameTheme.play();
    gameTheme.loop = true;
    setTimeout(() => {
        container.classList.remove("z-back");
        shuffleCards();
    }, 4000);
}

//Função que desativa as funções do logo após a tela de título:
function disableTitle() {
    title.removeEventListener('click', titleScreen);
}

//Função que ativa o giro do card:
function mainGame() {
    disableTitle();
    flipSnd.playbackRate = 1;
    flipSnd.play();
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    hasFlippedCard = false;
    checkForMatch();
    endGame();
    disableBtn();

    if (isFinished) {
        gameTheme.pause();
        gameTheme.currentTime = 0;
        victory.play();
        FlipCards();
        setTimeout(orderCards, 1300);
        setTimeout(() => {
            frontChange();
            randomColor(cardsFront);
            endingAnimation();
        }, 4000);
        setTimeout(FlipCards, 7000);
        setTimeout(() => {
            randomColor(cardsFront)
        }, 11500);
        setTimeout(() => {
            endingAnimation();
            animationEnded = true;
            disableBtn();
        }, 11000);
    }
}

//Função que seleciona o som correto de cada Pokemon:
function playSound() {
    switch (secondCard.dataset.card) {
        case "01":
            cry01.play();
            break;
        case "02":
            cry04.play();
            break;
        case "03":
            cry07.play();
            break;
        case "04":
            cry12.play();
            break;
        case "05":
            cry16.play();
            break;
        case "06":
            cry25.play();
            break;
        case "07":
            cry39.play();
            break;
        case "08":
            cry52.play();
            break;
        case "09":
            cry58.play();
            break;
        case "10":
            cry133.play();
            break;
    }
}

//Função que checa se os cards são iguais:
function checkForMatch() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
        playSound();
        disableCards();
        matchesNums++;
        updatePoints();
        return;
    }
    unFlipCards();
}

//Função que previne o "clique duplo" nos cards:
function disableCards() {
    firstCard.removeEventListener('click', mainGame);
    secondCard.removeEventListener('click', mainGame);
    resetBoard();
}

//Função que desvira os cards não iguais:
function unFlipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

//Função que implementa o "zero à esquerda" no placar:
function zeroEsquerda(numero, comprimento) {
    numero = numero.toString();
    while (numero.length < comprimento)
        numero = "0" + numero;
    return numero;
}

//Funcção de que incrementa o placar:
function updatePoints() {
    Points.innerText = zeroEsquerda(matchesNums, 2);
}

//Função que reseta variáveis:
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

//Funcção que embaralha os cards:
function shuffleCards() {
    cards.forEach((card) => {
        let randomPosition = Math.floor(Math.random() * 20);
        card.style.order = randomPosition;
    })
};

//Função que reinicia o Jogo:
function resetGame() {
    cardsFront.forEach((card) => {
        card.classList.remove('face');
    });

    removeId(cardsFront);

    setCards();

    cards.forEach((card) => {
        card.classList.remove('flip');
        setTimeout(() => {
            card.addEventListener('click', mainGame);
            console.log("evento");
        }, 3500);
    });

    animationEnded = false;
    matchesNums = 0;
    setTimeout(shuffleCards, 2000);
    resetBoard();
    updatePoints();
    resetBtn.disabled = true;
    isFinished = false;
    victory.pause();
    victory.currentTime = 0;
    gameTheme.play();
}

//Atribui o monitor de eventos do botão Reset:
resetBtn.addEventListener('click', resetGame);

//Função que define as regras do fim do Jogo:
function endGame() {
    if (matchesNums === 10) {
        isFinished = true;
        return;
    };
}

//Função que desabilita o botâo:
function disableBtn() {
    if (animationEnded) {
        resetBtn.disabled = false;
        return;
    }
    resetBtn.disabled = true;
    return;
}
disableBtn();


// Função que ordena os cards:
function orderCards() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.order = i;
    }
}

// Função que vira as cartas em sequência:
function FlipCards() {
    for (let i = 0; i < cards.length; i++) {
        setTimeout(() => {
            cards[i].classList.toggle('flip');
            flipSnd.playbackRate = 1.5;
            flipSnd.play();
        }, 200 * i);
    }
}

// Função troca a imagem da frente:
function frontChange() {
    setId(cardsFront, "front");
    cardsFront.forEach((card) => {
        card.classList.add('face');
    });
}

// Adiciona Ids à elementos de um conjunto:
function setId(elemento, nome) {
    let name = nome;
    for (i = 0; i < elemento.length; i++) {
        elemento[i].id = `${name}_${i + 1}`;
    }
}

// Remove Ids à elementos de um conjunto:
function removeId(elemento) {
    for (i = 0; i < elemento.length; i++) {
        elemento[i].removeAttribute("id");
    }
}

// Defini regras de randomização de cores do background:
function randomColor(elemento) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    elemento.forEach((el) => {
        el.style.backgroundColor = "#" + randomColor;
    });
}
randomColor(cardsFront);

// Função que atribui as regras da animação de encerramento:
function endingAnimation() {
    for (let i = 1; i < 36; i++) {
        switch (i) {
            case 1:
                setTimeout(() => {
                    cards[0].classList.add('flip');
                    flipSnd.playbackRate = 1.5;
                    flipSnd.play();
                }, 200 * i);
                break;
            case 2:
                setTimeout(() => {
                    cards[1].classList.add('flip');
                    cards[5].classList.add('flip');
                    flipSnd.playbackRate = 1.5;
                    flipSnd.play();
                }, 200 * i);
                break;
            case 3:
                setTimeout(() => {
                    cards[2].classList.add('flip');
                    cards[6].classList.add('flip');
                    cards[10].classList.add('flip');
                    flipSnd.playbackRate = 1.5;
                    flipSnd.play();
                }, 200 * i);
                break;
            case 4:
                setTimeout(() => {
                    cards[3].classList.add('flip');
                    cards[7].classList.add('flip');
                    cards[11].classList.add('flip');
                    cards[15].classList.add('flip');
                    flipSnd.playbackRate = 1.5;
                    flipSnd.play();
                }, 200 * i);
                break;
            case 5:
                setTimeout(() => {
                    cards[4].classList.add('flip');
                    cards[8].classList.add('flip');
                    cards[12].classList.add('flip');
                    cards[16].classList.add('flip');
                    flipSnd.playbackRate = 1.5;
                    flipSnd.play();
                }, 200 * i);
                break;
            case 6:
                setTimeout(() => {
                    cards[9].classList.add('flip');
                    cards[13].classList.add('flip');
                    cards[17].classList.add('flip');
                    flipSnd.playbackRate = 1.5;
                    flipSnd.play();
                }, 200 * i);
                break;
            case 7:
                setTimeout(() => {
                    cards[14].classList.add('flip');
                    cards[18].classList.add('flip');
                    flipSnd.playbackRate = 1.5;
                    flipSnd.play();
                }, 200 * i);
                break;
            case 8:
                setTimeout(() => {
                    cards[19].classList.add('flip');
                    flipSnd.playbackRate = 1.5;
                    flipSnd.play();
                }, 200 * i);
                break;
        }
    }
}

//Implementa o monitor de eventos para os cards:
cards.forEach((card) => {
    card.addEventListener('click', mainGame);
});