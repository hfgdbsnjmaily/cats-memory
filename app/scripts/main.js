var document, window, Audio;

let Card = function(id, front, back = 'card-back', active = '0') {
    this.id = id;
    this.back = back;
    this.front = front;
    this.active = active;
};

const numbersOfCards = 14;
const numbersOfSpecial = 1;
const numbersOfTotal = numbersOfCards + numbersOfSpecial;

let leftCards;

let cards = [];
let activeCards = [];

let randomId = [];

let photoNumber = -1;

const maxNumberOfActives = 2;

let points, timeLeft, endTime;

let score, highscore = 0;

let sound;

let isPlaying = 0;

let element, hours, mins, msLeft, iv, time;

setPointerEvents('body', 'none');
setPointerEvents('.control-panel__button-new-game', 'auto');

function startGame() {

    isPlaying === 1 ? removeCards() : null;


    removeClass('.control-panel__button-new-game', 'bounce');
    removeClass('.control-panel__button-new-game', 'infinite');

    points = 0;

    document.querySelector('.control-panel__points').textContent = points;
    document.querySelector('.control-panel__time').textContent = time;
    document.querySelector('.control-panel__highscore').textContent = highscore;

    document.querySelector('.end-box').style.display = 'none';
    document.querySelector('.game-panel__back-img').style.display = 'none';
    document.querySelector('.control-panel__new-highscore').style.display = 'none';

    setPointerEvents('body', 'auto');

    countdown('.control-panel__time', 1, 0);

    newGame();
}

function newGame() {

    randomCardsId(randomId);
    fillCardsArr(cards);
    addCards(cards);

    leftCards = numbersOfCards + numbersOfSpecial;

    isPlaying = 1;
}

function randomCardsId(arr) {

    for (let i = 0; i < numbersOfTotal; i++) {

        photoNumber++;

        if (i < numbersOfTotal / 2 - 0.5) {

            arr.push(photoNumber);

        } else if (i == numbersOfTotal / 2 - 0.5) {

            photoNumber = 0;
            arr.push(photoNumber);

        } else if (i > numbersOfTotal / 2 - 0.5) {

            arr.push(photoNumber);
        }
    }


    for (let j = arr.length; j > 1; j--) {

        let r = Math.floor(Math.random() * j);
        let temp = arr[r];
        arr[r] = arr[j-1];
        arr[j-1] = temp;
    }
}

function fillCardsArr(arr) {

    for (let i = 0; i < numbersOfTotal; i++) {

        arr.push((new Card(i,'card-'+randomId[i])));
    }
}

function addCards(cardsArr) {

    let html, newHtml;
    const el = '.game-panel__cards';

    console.log(cards);

    cardsArr.forEach(cur => {

        let front = cur.front;
        let id = cur.id;

        html = '<li><img src="../images/card-back.jpeg" class="game-panel__card-%id% animated" onclick="changeSide(this, \''+front+'\', \''+id+'\')"></li>';

        newHtml = html.replace('%id%', id);

        document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
    });
}

function changeSide(el, front, id) {

    let index;

    addClass('.game-panel__card-' + cards[id].id, 'flipInY');

    sound = new Audio('../wav/flip.wav');
    sound.play();
    console.log(sound);

    if (cards[id].active === '0' && activeCards.length < maxNumberOfActives) {

        el.src = '../images/'+front+'.jpeg';

        cards[id].active = '1';

        activeCards.push(cards[id]);

        if (activeCards.length == 2) {

            checkPairs();
        }

    } else if (cards[id].active === '1') {

        el.src = '../images/card-back.jpeg';

        cards[id].active = '0';

        index = activeCards.indexOf(cards[id]);
        activeCards.splice(index, 1);
    }

    if (front == 'card-7') {

        setPointerEvents('body', 'none');

        document.querySelector('.control-panel__bonus-time').style.display = 'block';

        window.setTimeout(() => {

            add30sec();

            sound = new Audio('../wav/bonus.wav');
            sound.play();
            console.log(sound);

            removeClass('.game-panel__card-' + cards[id].id, 'flipInY');
            addClass('.game-panel__card-' + cards[id].id, 'bounceOut');

            document.querySelector('.game-panel__card-' + cards[id].id).style.opacity = 0;

            cards[id].active = '0';

            leftCards= leftCards - 1;

            index = activeCards.indexOf(cards[id]);
            activeCards.splice(index, 1);

            setPointerEvents('body', 'auto');

            document.querySelector('.control-panel__bonus-time').style.display = 'none';

            checkEnd();

        }, 1000);
    }
}

function checkPairs() {

    if (activeCards[0].front == activeCards[1].front) {

        setPointerEvents('body', 'none');

        window.setTimeout(() => {

            removeClass('.game-panel__card-' + cards[activeCards[0].id].id, 'flipInY');
            removeClass('.game-panel__card-' + cards[activeCards[1].id].id, 'flipInY');

            addClass('.game-panel__card-' + cards[activeCards[0].id].id, 'bounceOut');
            addClass('.game-panel__card-' + cards[activeCards[1].id].id, 'bounceOut');

            window.setTimeout(() => {

                document.querySelector('.game-panel__card-' + activeCards[0].id).style.opacity = 0;
                document.querySelector('.game-panel__card-' + activeCards[1].id).style.opacity = 0;

                cards[activeCards[0].id].active = '0';
                cards[activeCards[1].id].active = '0';

                sound = new Audio('../wav/pair.wav');
                sound.play();
                console.log(sound);

                leftCards = leftCards - 2;

                clearActiveCards();
                addPoints();
                checkEnd();

                setPointerEvents('body', 'auto');

            }, 800);

        }, 1000);

    } else {

        setPointerEvents('body', 'none');

        removeClass('.game-panel__card-' + cards[activeCards[0].id].id, 'flipInY');
        removeClass('.game-panel__card-' + cards[activeCards[1].id].id, 'flipInY');

        addClass('.game-panel__card-' + cards[activeCards[0].id].id, 'shake');
        addClass('.game-panel__card-' + cards[activeCards[1].id].id, 'shake');

        window.setTimeout(() => {

            if (activeCards[1].front !== 'card-7'){

                sound = new Audio('../wav/no-pair.wav');
                sound.play();
            }

            document.querySelector('.game-panel__card-' + activeCards[0].id).src = '../images/card-back.jpeg';
            document.querySelector('.game-panel__card-' + activeCards[1].id).src = '../images/card-back.jpeg';

            removeClass('.game-panel__card-' + cards[activeCards[0].id].id, 'shake');
            removeClass('.game-panel__card-' + cards[activeCards[1].id].id, 'shake');

            addClass('.game-panel__card-' + cards[activeCards[0].id].id, 'flipInY');
            addClass('.game-panel__card-' + cards[activeCards[1].id].id, 'flipInY');

            cards[activeCards[0].id].active = '0';
            cards[activeCards[1].id].active = '0';

            clearActiveCards();

            setPointerEvents('body', 'auto');

        }, 1000);
    }
}

function clearActiveCards() {

    activeCards = [];
}


function addPoints() {

    points = points + 25;

    document.querySelector('.control-panel__points').textContent = points;

    addClass('.control-panel__points', 'tada');

     window.setTimeout(() => {

        removeClass('.control-panel__points', 'tada');

    }, 500);
}

function endGame() {

    window.clearInterval(iv);

    document.querySelector('.end-box').style.display = 'inline-block';

    removeCards();

    if (leftCards === 0) {

        timeLeft = document.querySelector('.control-panel__time').textContent;

        let a = timeLeft.split(':');
        let seconds = (+a[0]) * 60 + (+a[1]);

        score = points + seconds;

        endTime = seconds;

        countdownPoints();
        countupPoints();

        document.querySelector('.end-box__button-try-again').style.display = 'none';

        if (score > highscore) {

            highscore = score;

            sound = new Audio('../wav/new-highscore.wav');
            sound.play();

            document.querySelector('.control-panel__new-highscore').style.display = 'inline-block';
            document.querySelector('.control-panel__highscore').textContent = highscore;
        }

    } else {

        document.querySelector('.end-box__end-text').innerHTML = 'Time\'s up!';
        document.querySelector('.end-box__button-try-again').style.display = 'inline-block';
    }
}

function checkEnd() {

    leftCards === 0 ? endGame() : null;
}

function closeEndBox() {

    document.querySelector('.end-box').style.display = 'none';
}

function add30sec() {

    window.clearInterval(iv);

    timeLeft = document.querySelector('.control-panel__time').textContent;

    let a = timeLeft.split(':');
    let seconds = (+a[0]) * 60 + (+a[1]);

    countdown('.control-panel__time', 0, seconds + 30);
}

function setPointerEvents(el, value) {

    document.querySelector(el).style.pointerEvents = value;
}

function addClass (el, className) {

    document.querySelector(el).classList.add(className);
}

function removeClass (el, className) {

    document.querySelector(el).classList.remove(className);
}



function countdown(elementName, minutes, seconds) {

    function twoDigits(n) {

        return (n <= 9 ? '0' + n : n);
    }

    function updateTimer() {

        msLeft = endTime - (+new Date);

        if (msLeft < 1000) {

            element.innerHTML = '0:00';

            endGame();

        } else {

            time = new Date(msLeft);
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();

            element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());

            iv = window.setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
        }
    }

    element = document.querySelector(elementName);

    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;

    updateTimer();
}

function tryAgain() {

    document.querySelector('.end-box').style.display = 'none';

    startGame();
}

function removeCards() {

    cards = [];
    activeCards = [];
    randomId = [];

    photoNumber = -1;
    isPlaying = 0;

    const el = document.querySelector('.game-panel__cards').innerHTML;
    const replace = el.replace(el, '');

    document.querySelector('.game-panel__cards').innerHTML = replace;
}

function countdownPoints() {

    endTime--;

    endTime >= 10 ? document.querySelector('.control-panel__time').innerHTML = '0:' + endTime : document.querySelector('.control-panel__time').innerHTML = '0:0' + endTime;


    if (endTime === 0) {

         return;
    }

    setTimeout(countdownPoints, 50);
}

function countupPoints() {

    points++;

    document.querySelector('.end-box__end-score').innerHTML = points;

    if (points >= score) {

         return;
    }

    setTimeout(countupPoints, 50);
}

