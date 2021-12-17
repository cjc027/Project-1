// Constants
const playerStats = {
    'Easy': {
        HP: 100,
        STR: 10,
        items: ['potion', 'potion', 'potion', 'potion', 'smoke']
    },
    'Medium': {
        HP: 100,
        STR: 8,
        items: ['potion', 'potion', 'smoke']
    },
    'Hard': {
        HP: 75,
        STR: 7,
        items: ['potion', 'smoke']
    }
};

const monsters = [
    {
        name: 'orc',
        HP: 30,
        STR: 6,
        sprite: 'imgs/orc.png',
        msg: 'an orc'
    },
    {
        name: 'skeleton',
        HP: 15,
        STR: 4,
        sprite: 'imgs/skeleton.png',
        msg: 'a skeleton'
    },
    {
        name: 'demon',
        HP: 40,
        STR: 8,
        sprite: 'imgs/demon.png',
        msg: 'a demon'
    }
];

const rollSound = new Audio('audio/nettimato__rolling-dice-2.wav');
const potionSound = new Audio('audio/valentinpetiteau__potion-drink-swallow.wav');
const smokeSound = new Audio('audio/saviraz__poof-in-cloud.mp3');

// State Variables
let turn;
let gameInProgress;
let roundsSurvived;

let playerHP;
let playerSTR;
let monsterHP;
let monsterSTR;
let currentMonster;

let rollNum;
let message;
let initiative;
let escaped;


// Cached DOM Variables
const difficultyEls = document.querySelectorAll('input');
const difficultyDivEl = document.querySelector('#difficulty');
const playerStatsEl = document.querySelector('#playerStats');
const itemsEl = document.querySelector('.items');

const playerHPEl = document.querySelector('#playerHP');
const PlayerSTREl = document.querySelector('#playerSTR');
const monsterHPEl = document.querySelector('#monsterHP');
const monsterSTREl = document.querySelector('#monsterSTR');

const monsterDivEl = document.querySelector('.monster');
const monsterSpriteEl = document.querySelector('#monsterSprite');

const startEl = document.querySelector('#start button');
const rollEl = document.querySelector('#roll button');
const messageEl = document.querySelector('#message p');

const bgAudioPlayer = document.querySelector('#bgAudio');


// Init and Render
function init(){
    gameInProgress = false;
    renderProgress();
    roundsSurvived = 0;
    messageEl.innerText = 'Choose a difficulty  \n Good luck';
    playerStatsEl.hidden = true;
    difficultyDivEl.hidden = false;
    monsterDivEl.hidden = true;
    rollEl.innerText = 'Roll'
    escaped = false;
    itemsEl.innerHTML = '';

    bgAudioPlayer.volume = 0.75;

    document.querySelector('#playerSprite').classList.remove(`playerDeath`);
};

init();

function render(){
    renderProgress();
    renderAnimation();
    bgAudioPlayer.play();

    playerHPEl.innerText = playerHP;
    PlayerSTREl.innerText = playerSTR;
    monsterHPEl.innerText = monsterHP;
    monsterSTREl.innerText = monsterSTR;
    monsterSpriteEl.src = currentMonster.sprite;
    messageEl.innerText = message;
};

function renderProgress(){
    if (gameInProgress === true){
        startEl.disabled = true;
        rollEl.disabled = false;
        monsterDivEl.hidden = false;
        playerStatsEl.hidden = false;
        difficultyDivEl.hidden = true;
        itemsEl.hidden = false;
    } else {
        startEl.disabled = false;
        rollEl.disabled = true;
        monsterDivEl.hidden = true;
        playerStatsEl.hidden = true;
        difficultyDivEl.hidden = false;
        itemsEl.hidden = true;
    };
};

function renderAnimation(){
    if ((monsterHP <= 0) && rollEl.innerText === 'Continue'){
        monsterSpriteEl.classList.add(`${currentMonster.name}Death`);
    } else {
        monsterSpriteEl.className = '';
    };

    if (playerHP <= 0){
        document.querySelector('#playerSprite').classList.add(`playerDeath`);
    };
};

// Event Listeners
startEl.addEventListener('click', function(event){
    if (startEl.disabled === false){
        difficultyEls.forEach(function(option){
            if (option.checked === true){
                playerHP = playerStats[option.value].HP;
                playerSTR = playerStats[option.value].STR;
                (playerStats[option.value].items).forEach(function(item){
                    const newItem = document.createElement('img');
                    newItem.className = item;
                    itemsEl.appendChild(newItem);
                })
            };
        });
        gameInProgress = true;
        chooseMonster(monsters);
        message = `You have encountered ${currentMonster.msg}! \n Roll for initiative.`;
        initiative = true;
    };

    render();
});

rollEl.addEventListener('click', function(event){
    if (rollEl.innerText === 'Restart'){
        init();
    };
    
    if (initiative === true) {
        rollInitiative();
        render();
    } else if ((turn%2 !== 0) && escaped === false){
        rollNum = roll();
        rollSound.volume = 0.5;
        rollSound.play();

        message = `You rolled ${rollNum}. You deal ${rollNum} + ${playerSTR} damage!`;
        monsterHP -= rollNum + playerSTR;
        turn += 1;
        rollEl.innerText = 'Continue';
        if (monsterHP <= 0){
            message = `You rolled ${rollNum}. You deal ${rollNum} + ${playerSTR} damage! \n Victory!`;
            roundsSurvived += 1;
        };
        render();
    } else if (monsterHP <= 0 || escaped === true){
        chooseMonster(monsters);
        message = `You have encountered ${currentMonster.msg}! \n Roll for initiative.`;
        initiative = true;
        escaped = false;
        rollEl.innerText = 'Roll';
        render();
    } else if (rollEl.innerText === 'Continue' && monsterHP > 0){
        rollNum = roll();
        message = `The ${currentMonster.name} rolled ${rollNum}. You take ${rollNum} + ${monsterSTR} damage!`;
        playerHP -= rollNum + monsterSTR;
        turn += 1;
        rollEl.innerText = 'Roll'
        if (playerHP <= 0){
            message = `The ${currentMonster.name} rolled ${rollNum}. You take ${rollNum} + ${monsterSTR} damage! \n Defeat! \n \n You survived ${roundsSurvived} rounds.`;
            rollEl.innerText = 'Restart';
            turn -= 1;
        };
        render();
    }; 

});

itemsEl.addEventListener('click', function(event){
    console.dir(event.target);
    if ((turn%2 !== 0) && (initiative === false) && event.target.className !== 'items') {
        if (event.target.className === 'potion'){
            potionSound.volume = 0.5;
            potionSound.play();

            playerHP += 15;
            turn += 1;
            message = 'You used a potion. You heal for 15 HP!';
            rollEl.innerText = 'Continue';
            event.target.className = '';
        } else {
            smokeSound.volume = 0.5;
            smokeSound.play();
            
            escaped = true;
            message = 'You used a smoke bomb. You manage to escape!';
            rollEl.innerText = 'Continue'
            event.target.className = ''
        }
    } else if (initiative === true) {
        message = 'Please roll for initiative first.';
    } else {
        message = 'Your turn has ended. \n You may use items next turn.';
    }
    render();
});

// Functions
function chooseMonster(array){
    currentMonster = array[Math.floor(Math.random()*array.length)];
    monsterHP = currentMonster.HP;
    monsterSTR = currentMonster.STR;
};

function roll(){
    return Math.floor(Math.random() * 8) + 1;
};

function rollInitiative(){
    rollSound.volume = 0.5;
        rollSound.play();
        let monsterRoll = roll();
        let playerRoll = roll();
        if (playerRoll >= monsterRoll){
            turn = 1;
            message = `You rolled ${playerRoll} and the monster rolled ${monsterRoll}. \n You will attack first.`;
            rollEl.innerText = 'Roll';
        } else {
            turn = 2;
            message = `You rolled ${playerRoll} and the monster rolled ${monsterRoll}. \n The monster will attack first.`;
            rollEl.innerText = 'Continue';
        }
        initiative = false;
}