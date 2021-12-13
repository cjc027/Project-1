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
let monsterHP;
let currentMonster;

let rollNum;

// Cached DOM Variables
const difficultyEls = document.querySelectorAll('input');

const playerHPEl = document.querySelector('#playerHP');
const PlayerSTREl = document.querySelector('#playerSTR');
const monsterHPEl = document.querySelector('#monsterHP');
const monsterSTREl = document.querySelector('#monsterSTR');

const monsterSpriteEl = document.querySelector('#monsterSprite');

const startEl = document.querySelector('#start button');
const rollEl = document.querySelector('#roll button');
const messageEl = document.querySelector('#message p');

// Init and Render

function init(){
    console.log('Initial state')
}

init()

// Event Listeners



// Functions

function chooseMonster(array){
    currentMonster = array[Math.floor(Math.random()*array.length)]
}