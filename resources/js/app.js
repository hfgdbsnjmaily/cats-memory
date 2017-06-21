var document, window;

var Card = function(id, front, back, active) {
    this.id = id;
    this.back = back;
    this.front = front;
    this.active = active;
};

var numbersOfCards = 14; 
var numbersOfSpecial = 1;
var numbersOfTotal = numbersOfCards + numbersOfSpecial;
var leftCards = numbersOfCards + numbersOfSpecial;

var cards = [];
var activeCards = [];

var randomId = [];

var photoNumber = -1;

var maxNumberOfActives = 2;

var points;
var time;
var timeLeft;

var sound;

setPointerEvents('body', 'none');
setPointerEvents('.new-game', 'auto');

function startGame() {
    
    removeClass('start', 'bounce');
    removeClass('start', 'infinite');    
    
    points = 0;
    
    document.querySelector('.points').textContent = points;
    document.querySelector('.time').textContent = time;
    document.querySelector('.end-box').style.display = 'none'; 
    
    setPointerEvents('body', 'auto');
    
    countdown("time", 1, 0);
    
    newGame();
}

function newGame() {

    randomCardsId(randomId);
    fillCardsArr(cards);
    addCards(cards);
}

function randomCardsId (arr) {
    
    for (var i = 0; i < numbersOfTotal; i++) {

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
    
    for (var j = arr.length; j > 1; j--) {
        
        var r = Math.floor(Math.random() * j);
        var temp = arr[r];
        arr[r] = arr[j-1];
        arr[j-1] = temp;
    }
}

function fillCardsArr(arr) {
    
    for (var i = 0; i < numbersOfTotal; i++) {

        arr.push((new Card(i,'card-'+randomId[i],'card-back', '0')));
    }
}


function addCards(cardsArr) {
    var html, newHtml, el;
    console.log(cards);

    for (var i = 0; i < cardsArr.length; i++) {
        el = '.cards';
        var front = cardsArr[i].front;
        var id = cardsArr[i].id;
            
        html = '<li><img src="resources/img/card-back.jpeg" class="card animated" id="card-%id%" onclick="changeSide(this, \''+front+'\', \''+id+'\')"></li>';
            
        newHtml = html.replace('%id%', id);

        document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
    }
}

function changeSide(el, front, id) {
    
    sound = new Audio("resources/wav/flip.wav");
    sound.play();
    
    var index;
    
    addClass('card-' + cards[id].id, 'flipInY'); 

    if (cards[id].active === '0' && activeCards.length < maxNumberOfActives) {

        el.src = "resources/img/"+front+".jpeg";
        cards[id].active = '1';

        activeCards.push(cards[id]);

        if (activeCards.length == 2) {
 
            checkPairs();   
        }
            
    } else if (cards[id].active === '1') {

        el.src = "resources/img/card-back.jpeg";
        cards[id].active = '0';
            
        index = activeCards.indexOf(cards[id]);
        activeCards.splice(index, 1);
    }
    
    if (front == 'card-7') {
        
        setPointerEvents('body', 'none');
        document.querySelector('.bonus-time').style.display = 'inline-block';

        window.setTimeout(function() {
            add30sec();
            
            sound = new Audio("resources/wav/bonus.wav");
            sound.play();
            
            removeClass('card-' + cards[id].id, 'flipInY'); 

            addClass('card-' + cards[id].id, 'bounceOut'); 
            
            document.getElementById('card-' + cards[id].id).style.opacity = 0; 
            cards[id].active = '0';
            leftCards= leftCards - 1;

            index = activeCards.indexOf(cards[id]);
            activeCards.splice(index, 1);
            
            setPointerEvents('body', 'auto');
            document.querySelector('.bonus-time').style.display = 'none';
            
        }, 1000);
    }
}

function checkPairs() {
    
    if (activeCards[0].front == activeCards[1].front) {
        
        setPointerEvents('body', 'none');
        
        window.setTimeout(function() {
            
            removeClass('card-' + cards[activeCards[0].id].id, 'flipInY');             
            removeClass('card-' + cards[activeCards[1].id].id, 'flipInY'); 
            
            addClass('card-' + cards[activeCards[0].id].id, 'bounceOut');             
            addClass('card-' + cards[activeCards[1].id].id, 'bounceOut'); 
        
            window.setTimeout(function() {

                document.getElementById('card-' + activeCards[0].id).style.opacity = 0;        
                document.getElementById('card-' + activeCards[1].id).style.opacity = 0;
                cards[activeCards[0].id].active = '0';
                cards[activeCards[1].id].active = '0';
                
                sound = new Audio("resources/wav/pair.wav");
                sound.play();

                leftCards = leftCards - 2;

                clearActiveCards();
                addPoints();

                checkEnd();

                setPointerEvents('body', 'auto');

            }, 800);
            
        }, 1000);
        
    } else {
        
        setPointerEvents('body', 'none');
 
        removeClass('card-' + cards[activeCards[0].id].id, 'flipInY');         
        removeClass('card-' + cards[activeCards[1].id].id, 'flipInY'); 
        
        addClass('card-' + cards[activeCards[0].id].id, 'shake');          
        addClass('card-' + cards[activeCards[1].id].id, 'shake');
                    
        window.setTimeout(function() {

            sound = new Audio("resources/wav/no-pair.wav");
            sound.play();
            
            document.getElementById('card-' + activeCards[0].id).src = "resources/img/card-back.jpeg";        
            document.getElementById('card-' + activeCards[1].id).src = "resources/img/card-back.jpeg";
            
            removeClass('card-' + cards[activeCards[0].id].id, 'shake');             
            removeClass('card-' + cards[activeCards[1].id].id, 'shake');  
            
            addClass('card-' + cards[activeCards[0].id].id, 'flipInY');          
            addClass('card-' + cards[activeCards[1].id].id, 'flipInY');
            
            cards[activeCards[0].id].active = '0';
            cards[activeCards[1].id].active = '0';
            
            clearActiveCards();
            
            setPointerEvents('body', 'auto');
            
        }, 800);   
    }    
}

function clearActiveCards() {

    activeCards = [];
}


function addPoints() {
    
    points = points + 25;
    document.querySelector('.points').textContent = points;
    addClass('points', 'tada');
    
     window.setTimeout(function() {
        removeClass('points', 'tada');
    }, 500); 
}

function endGame() {
    
    window.clearInterval(iv);
    document.querySelector('.end-box').style.display = 'inline-block';
    
    cards = [];
    activeCards = [];
    randomId = [];
    
    if (leftCards === 0) {

        timeLeft = document.getElementById('time').textContent;
        var a = timeLeft.split(':'); 
        var seconds = (+a[0]) * 60 + (+a[1]); 
        document.querySelector('.end-score').textContent = points + seconds;
        document.querySelector('.try-again').style.display = 'none';
        
    } else {
        
        document.querySelector('.end-text').innerHTML = 'Time\'s up!';
        document.querySelector('.end-text').style.backgroundColor = '#ebebeb';
        document.querySelector('.end-text').style.borderRadius = '10px';
        document.querySelector('.end-text').style.boxShadow = '6px 6px 30px 0px rgba(184,184,184,1)';
    }
}

function checkEnd() {
    if (leftCards === 0) {
        endGame();
    }
}

function closeEndBox() {
    
    document.querySelector('.end-box').style.display = 'none'; 
}
 
function add30sec() {
    window.clearInterval(iv);
    timeLeft = document.getElementById('time').textContent;
    
    var a = timeLeft.split(':'); 
    var seconds = (+a[0]) * 60 + (+a[1]); 

    countdown("time", 0, seconds + 30);
}

function setPointerEvents(el, value) {
    
    document.querySelector(el).style.pointerEvents = value;   
}

function addClass (el, className) {
    
    document.getElementById(el).classList.add(className);    
}

function removeClass (el, className) {
    
    document.getElementById(el).classList.remove(className);        
}

var element, endTime, hours, mins, msLeft, time, iv;

function countdown(elementName, minutes, seconds) {

    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
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

    element = document.getElementById(elementName);
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}

function tryAgain() {
    
    window.setTimeout(function() {
        location.reload();
    }, 500); 
}



