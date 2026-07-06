/*==================================================
    BIRTHDAY WEBSITE V4
==================================================*/

"use strict";

/*==================================================
    SHORTCUT
==================================================*/

const $ = (id) => document.getElementById(id);

/*==================================================
    ELEMENT
==================================================*/

const pages = document.querySelectorAll(".page");

const bgMusic = $("bgMusic");

const touchBtn = $("touchBtn");
const startJourneyBtn = $("startJourney");

const personName = $("personName");
const openingName = $("openingName");
const openingText = $("openingText");

const introText = document.querySelector(".introText");

const progressBar = $("progressBar");
const percent = $("percent");

/*==================================================
    START
==================================================*/

document.addEventListener("DOMContentLoaded", init);

/*==================================================
    INIT
==================================================*/

function init(){

    if(typeof CONFIG === "undefined"){

        alert("config.js belum dimuat!");

        return;

    }

    loadConfig();

    prepareMusic();

    createStars();

    registerEvents();

    showPage("touchScreen");

}

/*==================================================
    CONFIG
==================================================*/

function loadConfig(){

    personName.textContent = CONFIG.nama;

    openingName.textContent = CONFIG.nama;

    openingText.textContent = CONFIG.opening;

}

/*==================================================
    MUSIC
==================================================*/

function prepareMusic(){

    bgMusic.src = CONFIG.music;

    bgMusic.volume = 0.45;

}

/*==================================================
    EVENTS
==================================================*/

function registerEvents(){

    touchBtn.addEventListener(

        "click",

        startWebsite

    );

    startJourneyBtn.addEventListener(

        "click",

        ()=>{

            showPage("envelopePage");

        }

    );

}

/*==================================================
    START WEBSITE
==================================================*/

async function startWebsite(){

    touchBtn.disabled = true;

    try{

        await bgMusic.play();

    }catch(e){}

    showPage("intro");

    await playIntro();

    showPage("loadingScreen");

    await playLoading();

    showPage("opening");

}

/*==================================================
    INTRO
==================================================*/

async function playIntro(){

    introText.style.opacity = 1;

    introText.innerHTML = CONFIG.intro;

    await wait(2500);

}

/*==================================================
    LOADING
==================================================*/

function playLoading(){

    return new Promise(resolve=>{

        let value = 0;

        progressBar.style.width = "0%";

        percent.textContent = "0%";

        const timer = setInterval(()=>{

            value++;

            progressBar.style.width = value + "%";

            percent.textContent = value + "%";

            if(value >= 100){

                clearInterval(timer);

                resolve();

            }

        },20);

    });

}

/*==================================================
    PAGE
==================================================*/

function showPage(id){

    document.querySelectorAll(".page").forEach(page=>{

        page.classList.remove("active");

        page.style.display="none";

    });

    const current=document.getElementById(id);

    current.style.display="flex";

    current.classList.add("active");

}

/*==================================================
    STARS
==================================================*/

function createStars(){

    const stars = $("stars");

    if(!stars) return;

    stars.innerHTML = "";

    for(let i=0;i<120;i++){

        const star = document.createElement("span");

        star.className = "dynamic-star";

        star.style.left = Math.random()*100+"%";

        star.style.top = Math.random()*100+"%";

        star.style.animationDelay = Math.random()*5+"s";

        stars.appendChild(star);

    }

}

/*==================================================
    WAIT
==================================================*/

function wait(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });

}
/*==================================================
    PART 2
    ENVELOPE & LETTER
==================================================*/

const openEnvelopeBtn = $("openEnvelopeBtn");
const letterContent = $("letterContent");
const letterNextBtn = $("letterNextBtn");

/*==================================================
    OPEN ENVELOPE
==================================================*/

openEnvelopeBtn.addEventListener("click", async ()=>{

    showPage("letterPage");

    await typeLetter();

});

/*==================================================
    TYPE LETTER
==================================================*/

async function typeLetter(){

    letterContent.innerHTML = "";

    for(const paragraph of CONFIG.letter){

        await typeText(paragraph);

        letterContent.innerHTML += "<br><br>";

        await wait(250);

    }

}

/*==================================================
    TYPE TEXT
==================================================*/

function typeText(text){

    return new Promise(resolve=>{

        let index = 0;

        const timer = setInterval(()=>{

            letterContent.innerHTML += text.charAt(index);

            letterContent.scrollTop = letterContent.scrollHeight;

            index++;

            if(index >= text.length){

                clearInterval(timer);

                resolve();

            }

        },35);

    });

}

/*==================================================
    NEXT TO GAME
==================================================*/

letterNextBtn.addEventListener("click",()=>{

    startGame();

});
/*==================================================
    PART 3
    GIFT GAME
==================================================*/

const gameArea = $("gameArea");
const giftBox = $("giftBox");
const scoreText = $("score");

let score = 0;
let gameInterval = null;

/*==================================================
    START GAME
==================================================*/

function startGame(){

    showPage("gamePage");

    score = 0;

    scoreText.textContent = "0";

    gameArea.innerHTML = "";

    if(gameInterval){

        clearInterval(gameInterval);

    }

    gameInterval = setInterval(createHeart,800);

}

/*==================================================
    CREATE HEART
==================================================*/

function createHeart(){

    if(score>=10) return;

    const heart=document.createElement("div");

    heart.className="heart";

    heart.innerHTML="❤️";

    heart.style.left=Math.random()*85+"%";

    heart.style.top=Math.random()*70+"%";

    gameArea.appendChild(heart);

    heart.addEventListener("click",()=>{

        collectHeart(heart);

    });

    setTimeout(()=>{

        if(heart.parentNode){

            heart.remove();

        }

    },7000);

}

/*==================================================
    COLLECT HEART
==================================================*/

function collectHeart(heart){

    heart.style.pointerEvents="none";

    const giftRect=giftBox.getBoundingClientRect();

    const heartRect=heart.getBoundingClientRect();

    const x=

        giftRect.left-heartRect.left;

    const y=

        giftRect.top-heartRect.top;

    heart.style.transition=

        "transform .7s ease, opacity .7s ease";

    heart.style.transform=

        `translate(${x}px,${y}px) scale(.2)`;

    heart.style.opacity="0";

    giftBox.classList.add("collect");

    setTimeout(()=>{

        giftBox.classList.remove("collect");

    },300);

    setTimeout(()=>{

        if(heart.parentNode){

            heart.remove();

        }

        score++;

        scoreText.textContent=score;

        if(score>=10){

            finishGame();

        }

    },700);

}

/*==================================================
    FINISH GAME
==================================================*/

function finishGame(){

    clearInterval(gameInterval);

    giftBox.classList.add("finish");

    setTimeout(()=>{

        showVideo();

    },1500);

}
/*==================================================
    PART 4
    VIDEO & GALLERY
==================================================*/

const memoryVideo = $("memoryVideo");
const videoNextBtn = $("videoNextBtn");

const galleryContainer = $("galleryContainer");
const nextPhotoBtn = $("nextPhoto");
const prevPhotoBtn = $("prevPhoto");

let photoIndex = 0;

/*==================================================
    SHOW VIDEO
==================================================*/

function showVideo(){

    showPage("videoPage");

    memoryVideo.src = CONFIG.video;

    memoryVideo.load();

    memoryVideo.play().catch(()=>{});

}

/*==================================================
    VIDEO NEXT
==================================================*/

videoNextBtn.addEventListener("click",()=>{

    memoryVideo.pause();

    showGallery();

});

/*==================================================
    SHOW GALLERY
==================================================*/

function showGallery(){

    showPage("galleryPage");

    photoIndex = 0;

    renderGallery();

}

/*==================================================
    RENDER PHOTO
==================================================*/

function renderGallery(){

    galleryContainer.innerHTML = "";

    const img = document.createElement("img");

    img.src = CONFIG.gallery[photoIndex];

    img.className = "gallery-photo";

    img.draggable = false;

    galleryContainer.appendChild(img);

}

/*==================================================
    NEXT PHOTO
==================================================*/

nextPhotoBtn.addEventListener("click",()=>{

    photoIndex++;

    if(photoIndex >= CONFIG.gallery.length){

       showEnding();

        return;

    }

    renderGallery();

});

/*==================================================
    PREVIOUS PHOTO
==================================================*/

prevPhotoBtn.addEventListener("click",()=>{

    if(photoIndex <= 0){

        return;

    }

    photoIndex--;

    renderGallery();

});
/*==================================================
    PART 5
    TIMELINE
==================================================*/

const timelineContainer = $("timelineContainer");
const timelineNextBtn = $("timelineNextBtn");

const openGiftBtn = $("openGiftBtn");

const replayBtn = $("replayBtn");

/*==================================================
    SHOW TIMELINE
==================================================*/

function showEnding(){

    showPage("timelinePage");

    timelineContainer.innerHTML="";

    CONFIG.timeline.forEach(item=>{

        const card=document.createElement("div");

        card.className="timeline-card";

        card.innerHTML=`

            <h3>${item.year}</h3>

            <p>${item.text}</p>

        `;

        timelineContainer.appendChild(card);

    });

}

/*==================================================
    NEXT TO GIFT
==================================================*/

timelineNextBtn.addEventListener(

    "click",

    ()=>{

        showGift();

    }

);

/*==================================================
    GIFT PAGE
==================================================*/

function showGift(){

    showPage("giftPage");

}

/*==================================================
    OPEN GIFT
==================================================*/

openGiftBtn.addEventListener(

    "click",

    ()=>{

        showEnding();

    }

);

/*==================================================
    ENDING
==================================================*/

async function showEnding(){

    showPage("endingPage");

    createConfetti();

    const endingText = $("endingText");

    endingText.innerHTML="";

    const text =

`Terima kasih yaa udah meluangkan waktu untuk melihat semuanya sampai akhir.

Sekali lagi...

Selamat ulang tahun 🤍`;

    await typeEnding(text);

}

/*==================================================
    REPLAY
==================================================*/

replayBtn.addEventListener(

    "click",

    ()=>{

        location.reload();

    }

);

/*==================================================
    CONFETTI
==================================================*/

function createConfetti(){

    const box=$("confettiContainer");

    if(!box) return;

    box.innerHTML="";

    for(let i=0;i<180;i++){

        const confetti=document.createElement("div");

        confetti.className="confetti";

        confetti.style.left=Math.random()*100+"%";

        confetti.style.animationDelay=Math.random()*3+"s";

        confetti.style.backgroundColor=

        [

            "#FFD54F",

            "#FF8A80",

            "#81D4FA",

            "#A5D6A7",

            "#FFFFFF"

        ][Math.floor(Math.random()*5)];

        box.appendChild(confetti);

    }

}
/*==================================================
    PART 5
    TIMELINE
==================================================*/


/*==================================================
    SHOW TIMELINE
==================================================*/

function showEnding(){

    showPage("timelinePage");

    timelineContainer.innerHTML="";

    CONFIG.timeline.forEach(item=>{

        const card=document.createElement("div");

        card.className="timeline-card";

        card.innerHTML=`

            <h3>${item.year}</h3>

            <p>${item.text}</p>

        `;

        timelineContainer.appendChild(card);

    });

}

/*==================================================
    NEXT TO GIFT
==================================================*/

timelineNextBtn.addEventListener(

    "click",

    ()=>{

        showGift();

    }

);

/*==================================================
    GIFT PAGE
==================================================*/

function showGift(){

    showPage("giftPage");

}

/*==================================================
    OPEN GIFT
==================================================*/

openGiftBtn.addEventListener(

    "click",

    ()=>{

        showEnding();

    }

);

/*==================================================
    ENDING
==================================================*/

async function showEnding(){

    showPage("endingPage");

    createConfetti();

    const endingText = $("endingText");

    endingText.innerHTML="";

    const text =

`Terima kasih yaa udah meluangkan waktu untuk melihat semuanya sampai akhir.

Sekali lagi...

Selamat ulang tahun 🤍`;

    await typeEnding(text);

}
/*==================================================
    REPLAY
==================================================*/

replayBtn.addEventListener(

    "click",

    ()=>{

        location.reload();

    }

);

/*==================================================
    CONFETTI
==================================================*/

function createConfetti(){

    const box=$("confettiContainer");

    if(!box) return;

    box.innerHTML="";

    for(let i=0;i<180;i++){

        const confetti=document.createElement("div");

        confetti.className="confetti";

        confetti.style.left=Math.random()*100+"%";

        confetti.style.animationDelay=Math.random()*3+"s";

        confetti.style.backgroundColor=

        [

            "#FFD54F",

            "#FF8A80",

            "#81D4FA",

            "#A5D6A7",

            "#FFFFFF"

        ][Math.floor(Math.random()*5)];

        box.appendChild(confetti);

    }

}
function typeEnding(text){

    return new Promise(resolve=>{

        const endingText=$("endingText");

        let i=0;

        const timer=setInterval(()=>{

            endingText.innerHTML+=text.charAt(i);

            i++;

            if(i>=text.length){

                clearInterval(timer);

                resolve();

            }

        },30);

    });

}