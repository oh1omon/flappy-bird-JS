class HeroBanner {
    constructor() {
        this.id = 'hero-banner';
        this.maximalScore = function() {
            const score = localStorage.getItem('score')
             if (score != null){
                return score
            } else {
                return 0
            };
        };

        var iconsDiv = document.createElement('div');
        iconsDiv.classList.add('icons')
        iconsDiv.innerHTML = '<a href="https://www.instagram.com/oh1omon/"><img src="img/instagram-logo.svg" alt="instagram link"/></a><a href="https://github.com/oh1omon"><img src="img/github-logo.svg" alt="github link"/></a><a id="info-link"><img src="img/info-icon.svg" alt="information button" /></a>'

        var copyRightDiv = document.createElement('div');
        copyRightDiv.classList.add('copyright-text');
        copyRightDiv.innerHTML = '<p>This project is done only for study purposes, meaning that it is not pretending to earn any money. If you own any of images and you do not want them to be presented here, please contact me.</p>'

        var maxDiv = document.createElement('div');
        maxDiv.classList.add('max-score');
        maxDiv.innerHTML = `<p>maximum score<br />${localStorage.getItem('score')}</p>`


        var contDiv = document.createElement('div');
        contDiv.classList.add('container');
        contDiv.innerHTML = '<button class="btn play">play!</button>'
        contDiv.appendChild(maxDiv);
        contDiv.appendChild(copyRightDiv);
        contDiv.appendChild(iconsDiv);

        var heroDiv = document.createElement('div');
        heroDiv.id = 'hero-banner';
        heroDiv.appendChild(contDiv);


        document.body.appendChild(heroDiv);
    }
}

class EndScreen {
    constructor(score) {
        this.id = 'end-screen';
        this.style = {
            top: '22.5%',
            left: '20%',
            position: 'fixed',
            width: '60vw',
            height: '55vh',
            background: 'url("../img/hero-banner.svg") no-repeat center center/cover',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexFlow: 'row wrap',
            zIndex: '2',
            textAlign: 'center',
        };

        var endEl = document.createElement('div');
        endEl.id = this.id;
        endEl.innerHTML =
            `<div><p>Ah shit, heir we go again. You scored ${score} points. Is that really your maximum? Pathetic...</p></div> <button class="btn back-to-start">back</button>`;
        Object.assign(endEl.style, this.style);
        document.body.appendChild(endEl);
        document
            .getElementsByClassName('back-to-start')[0]
            .addEventListener('click', function () {
                document.getElementById('end-screen').remove();
                document.getElementById('hero-banner').style.display = 'flex';
            });
    }
}

class About {
    constructor() {
        this.id = 'about-project';
        this.style = {
            top: '22.5%',
            left: '20%',
            position: 'fixed',
            width: '60vw',
            height: '55vh',
            background: 'url("../img/hero-banner.svg") no-repeat center center/cover',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexFlow: 'row wrap',
            zIndex: '2',
            textAlign: 'center',
        };

        var aboutEl = document.createElement('div');
        aboutEl.id = this.id;
        aboutEl.innerHTML =
            '<div><p>Hello! My name is Artem Zagarov, and I am a Full Stack Web Development and Design student. The site is made by me for studying purposes. Special thanks to Pham Hoang for advising about development.</p><p>If you found any bugs, please contact me via Instagram.</p>Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from<a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> </div> <button class="btn back-to-start">back</button>';
        Object.assign(aboutEl.style, this.style);
        document.body.appendChild(aboutEl);
        document
            .getElementsByClassName('back-to-start')[0]
            .addEventListener('click', function () {
                document.getElementById('about-project').remove();
            });
    }
}

class Background {
    constructor() {
        this.counter = 0;

        this.background = document.getElementsByClassName('background')[0];
    }

    animateBG(currentPoints) {
        document.getElementById('score').innerText = `${currentPoints}`;
        var scope = this;

        if (scope.counter >= 100) {
            scope.background.style.backgroundPosition = `-${0}vw 0px`;
            scope.counter = 0;
        }

        scope.counter += 0.2;

        scope.background.style.backgroundPosition = `-${scope.counter}vw 0px`;
    }
}

class Pipe {
    constructor(idName, angle, flip, top = null, bottom = 0, parentEl = document.body) {
        this.id = idName;
        this.imgSrc = '../img/pipe.svg';
        this.size = null;
        this.style = {
            position: 'fixed',
            top: top,
            left: '100%',
            width: '8vw',
            height: '92vh',
            bottom: bottom,
            transform: `rotate(${angle}deg)`,
            transition: 'linear 0.05s',
        };
        this.flip = flip;
        this.movementRatio = 100;
        this.counter = 100;

        var pipeEl = document.createElement('img');
        pipeEl.src = this.imgSrc;
        pipeEl.id = this.id;
        pipeEl.classList.add('pipe');
        Object.assign(pipeEl.style, this.style);

        parentEl.appendChild(pipeEl);
    }

    killSelf() {
        document.getElementById(this.id).remove();
    }

    moveLeft() {
        var scope = this;
        scope.counter -= 0.5;
        document.getElementById(scope.id).style.left = `${scope.counter}%`;
    }
}

class Bird {
    constructor(parentEl) {
        this.id = 'bird_' + Math.floor(Math.random() * 2000);
        this.imgSrc = '../img/bird.svg';
        this.jumping = false;
        this.fallen = false; // by default a bird is not fallen until it has thrown the FALLEN_BIRD event
        this.style = {
            position: 'fixed',
            top: '60vh',
            left: '15%',
            width: '4vw',
            height: '6.4vh',
            transition: 'linear 0.05s',
        };
        this.fallenBirdEvent = new CustomEvent('FALLEN_BIRD', { detail: this.id });

        var birdEl = document.createElement('img');
        birdEl.src = this.imgSrc;
        birdEl.id = this.id;
        birdEl.classList.add('falling');
        Object.assign(birdEl.style, this.style);

        parentEl.appendChild(birdEl);

        var scope = this;

        document.addEventListener('keydown', function () {
            if (scope.fallen || scope.jumping) {
                return;
            }

            scope.jump();
        });
    }

    flying() {
        var scope = this;

        var birdPosition = parseInt(document.getElementById(scope.id).style.top);

        if (birdPosition >= 100) {
            document.dispatchEvent(scope.fallenBirdEvent);
            console.log('Detected a fallen bird');
        } else if (scope.jumping) {
            birdPosition -= 0.7;

            document.getElementById(scope.id).style.top = `${birdPosition}vh`;
        } else {
            birdPosition += 1;

            document.getElementById(scope.id).style.top = `${birdPosition}vh`;
        }
    }

    jump() {
        var scope = this;

        scope.jumping = true;
        document.getElementById(scope.id).classList.remove('falling');
        setTimeout(function () {
            scope.jumping = false;
            document.getElementById(scope.id).classList.add('falling');
        }, 300);
    }
    killSelf() {
        document.getElementById(this.id).remove()
    }
}


document.addEventListener('DOMContentLoaded', function() {
    var heroBanner = new HeroBanner();

    document.getElementById('info-link').addEventListener('click', function () {
        new About();
    });

    document.getElementsByClassName('play')[0].addEventListener('click', function () {

        var currentMaxScore = localStorage.getItem('score');

        var newScore = 0;

        document.getElementById('hero-banner').style.display = 'none';
        document.getElementsByClassName('btn-pause')[0].style.display = 'inline';

        var background = new Background();

        var bird = new Bird(document.body);

        var pipeArray = new Array();

        var pipesCaller = setInterval(function () {
            var idMaker = Math.floor(Math.random() * 40000);
            bottomPipe = new Pipe(idMaker, 0, false, null, `${-75 + idMaker / 1000}vh`);
            topPipe = new Pipe(idMaker + 1, 180, true, `${-35 - idMaker / 1000}vh`, null);
            pipeArray.push(bottomPipe, topPipe);
        }, 900);

        var animationInterval = setInterval(function () {
            pipeArray.forEach((pipe) => {
                if (pipe.counter <= -16) {
                    pipe.killSelf();
                    pipeArray.shift();
                    newScore += 0.5
                } else if (15 < pipe.counter && pipe.counter < 19) {
                    if (
                        pipe.flip && parseInt(document.getElementById(bird.id).style.top) < (parseInt(pipe.style.height) + parseInt(pipe.style.top))
                    ) {
                        console.log('The bird was inserted into the up pipe');
                        document.dispatchEvent(bird.fallenBirdEvent);
                    } else if (
                        pipe.flip === false && (parseInt(document.getElementById(bird.id).style.top)) > 100 - ((parseInt(pipe.style.height) + parseInt(pipe.style.bottom)))
                    ) {
                        console.log('The bird was inserted into the down pipe');
                        document.dispatchEvent(bird.fallenBirdEvent);
                    }
                }
                pipe.moveLeft();
            });
            background.animateBG(newScore);
            bird.flying();
        }, 1000 / 60);

        document.addEventListener('FALLEN_BIRD', function () {
            if(newScore > currentMaxScore || currentMaxScore === null) {
                localStorage.setItem('score', `${newScore}`)
            }

            const endScreen = new EndScreen(newScore);

            document.getElementsByClassName('btn-pause')[0].style.display = 'none';
            clearInterval(pipesCaller);
            clearInterval(animationInterval);
            bird.killSelf();
            pipeArray.forEach((pipe) => {
                pipe.killSelf();
            });
            pipeArray.length = 0;
        });
    });


});

