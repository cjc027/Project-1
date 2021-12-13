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
        sprite: 'imgs/orc.png'
    },
    {
        name: 'skeleton',
        HP: 15,
        STR: 4,
        sprite: 'imgs/skeleton.png'
    },
    {
        name: 'demon',
        HP: 40,
        STR: 8,
        sprite: 'imgs/demon.png'
    }
];


// State Variables
let turn;
let gameInProgress;
let roundsSurvived;

let playerHP;
let playerSTR;
let monsterHP;
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


// Init and Render
function init(){
    console.log('Initial state');
    gameInProgress = false;
    roundsSurvived = 0;
    messageEl.innerText = 'Choose a difficulty \n \n Good luck'
    playerStatsEl.hidden = true;
    difficultyDivEl.hidden = false;
    monsterDivEl.hidden = true;
};

init();

function render(){
    console.log('Wrender');
    if (gameInProgress === true){
        startEl.disabled = true;
        rollEl.disabled = false;
        monsterDivEl.hidden = false;
        playerStatsEl.hidden = false;
        difficultyDivEl.hidden = true;
    } else {
        startEl.disabled = false;
        rollEl.disabled = true;
        difficultyDivEl.hidden = false;
        playerStatsEl.hidden = true;
        monsterDivEl.hidden = true;
    }

    playerHPEl.innerText = playerHP;
    PlayerSTREl.innerText = playerSTR;
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
    };
    render();
});


// Functions
function chooseMonster(array){
    currentMonster = array[Math.floor(Math.random()*array.length)];
};

function roll(){
    rollNum = Math.floor(Math.random() * 8) + 1;
};