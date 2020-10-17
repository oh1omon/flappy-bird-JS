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

    animateBG() {
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
            top: '60%',
            left: '15%',
            width: '4vw',
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
        } else if (scope.jumping) {
            birdPosition -= 0.7;

            document.getElementById(scope.id).style.top = `${birdPosition}%`;
        } else {
            birdPosition += 1;

            document.getElementById(scope.id).style.top = `${birdPosition}%`;
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
}

document.getElementsByClassName('play')[0].addEventListener('click', function () {
    document.getElementById('hero-banner').style.display = 'none';

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
            }
            pipe.moveLeft();
        });
        background.animateBG();
        bird.flying();
    }, 1000 / 60);

    document.getElementById('info-link').addEventListener('click', function () {
        new About();
    });

    document.addEventListener('FALLEN_BIRD', function () {
        console.log('Detected a fallen bird');
        clearInterval(pipesCaller);
        clearInterval(animationInterval);
    });
});
