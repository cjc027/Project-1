// Constants
const playerStats = {
    'Easy': {
        HP: 150,
        STR: 10
    },
    'Medium': {
        HP: 100,
        STR: 8
    },
    'Hard': {
        HP: 75,
        STR: 5
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

const rollSound = new Audio('audio/nettimato__rolling-dice-2.wav')
const defeatSound = new Audio('audio/darksouls_youdied.mp3')

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


// Cached DOM Variables
const difficultyEls = document.querySelectorAll('input');
const difficultyDivEl = document.querySelector('#difficulty');
const playerStatsEl = document.querySelector('#playerStats');

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
    messageEl.innerText = ' Choose a difficulty  \n\n Good luck'
    playerStatsEl.hidden = true;
    difficultyDivEl.hidden = false;
    monsterDivEl.hidden = true;
    rollEl.innerText = 'Roll'

    bgAudioPlayer.volume = 0.75;

    document.querySelector('#playerSprite').classList.remove(`playerDeath`);
};

init();

function render(){
    renderProgress();
    renderAnimation();
    bgAudioPlayer.play()

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
    } else {
        startEl.disabled = false;
        rollEl.disabled = true;
        monsterDivEl.hidden = true;
        playerStatsEl.hidden = true;
        difficultyDivEl.hidden = false;
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
            };
        });
        gameInProgress = true;
        chooseMonster(monsters);
        message = `\n You have encountered ${currentMonster.msg}!`
        turn = 1;
    };

    render();
});

rollEl.addEventListener('click', function(event){
    if (turn%2 !== 0){
        roll();
        rollSound.volume = 0.5;
        rollSound.play();

        message = `\n You rolled ${rollNum}. You deal ${rollNum} + ${playerSTR} damage!`;
        monsterHP -= rollNum + playerSTR;
        turn += 1;
        rollEl.innerText = 'Continue';
        if (monsterHP <= 0){
            message = `\n You rolled ${rollNum}. You deal ${rollNum} + ${playerSTR} damage! \n Victory!`;
            roundsSurvived += 1;
            // monsterSpriteEl.classList.add(`${currentMonster.name}Death`);
        };
        render();
    } else if (monsterHP <= 0){
        // monsterSpriteEl.classList.remove(`${currentMonster.name}Death`);
        chooseMonster(monsters);
        message = `\n You have encountered ${currentMonster.msg}!`;
        turn = 1;
        rollEl.innerText = 'Roll'
        render();
    } else if (rollEl.innerText === 'Continue' && monsterHP > 0){
        roll();
        message = `\n The ${currentMonster.name} rolled ${rollNum}. You take ${rollNum} + ${monsterSTR} damage!`;
        playerHP -= rollNum + monsterSTR;
        turn += 1;
        rollEl.innerText = 'Roll'
        if (playerHP <= 0){
            message = `The ${currentMonster.name} rolled ${rollNum}. You take ${rollNum} + ${monsterSTR} damage! \n Defeat! \n \n You survived ${roundsSurvived} rounds.`
            defeatSound.volume = 0.4;
            defeatSound.play();
            rollEl.innerText = 'Restart'
            turn -= 1;
            // document.querySelector('#playerSprite').classList.add(`playerDeath`);
        };
        render();
    } else if (rollEl.innerText === 'Restart'){
        init()
    }

});

// Functions
function chooseMonster(array){
    currentMonster = array[Math.floor(Math.random()*array.length)];
    monsterHP = currentMonster.HP;
    monsterSTR = currentMonster.STR;
};

function roll(){
    rollNum = Math.floor(Math.random() * 8) + 1;
};

function playSound(key){
    audioPlayer.src = sounds[key];
    audioPlayer.play;
}