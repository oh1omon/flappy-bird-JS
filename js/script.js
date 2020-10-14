class Background {
    constructor() {
        this.counter = 0;
    }

    animateBG() {
        var scope = this;

        var background = document.getElementsByClassName('background')[0];

        var movingBg = setInterval(function () {
            scope.counter += 0.05;

            background.style.backgroundPosition = `-${scope.counter}vw 0px`;

            if (scope.counter > 100) {
                background.style.backgroundPosition = `-${0}vw 0px`;
                scope.counter = 0;
            }

            document.addEventListener('FALLEN_BIRD', function () {
                clearInterval(movingBg);
                console.log('Background has been stopped');
            });
        }, 1000 / 240);
    }
}

class Pipe {
    constructor(className, angle, flip, top = null, bottom = 0, parentEl = document.body) {
        this.class = className;
        this.imgSrc = '../img/pipe.svg';
        this.size = null;
        this.style = {
            position: 'fixed',
            top: top,
            left: '100%',
            width: '8vw',
            bottom: bottom,
            transform: `rotate(${angle}deg)`,
            transition: 'linear',
        };
        this.flip = flip;
        this.movementRatio = 100;
        this.counter = 100;

        var pipeEl = document.createElement('img');
        pipeEl.src = this.imgSrc;
        pipeEl.classList.add(`${this.class}`);
        Object.assign(pipeEl.style, this.style);

        parentEl.appendChild(pipeEl);
    }

    moveLeft(classMaker) {
        var scope = this;
        var moving = setInterval(function () {
            scope.counter -= 0.125;
            document.getElementsByClassName(
                `${classMaker}`
            )[0].style.left = `${scope.counter}%`;

            if (scope.counter < -16) {
                document.getElementsByClassName(`${classMaker}`)[0].remove();
                clearInterval(moving);
            }

            document.addEventListener('FALLEN_BIRD', function () {
                clearInterval(moving);
                console.log('Pipe has been stopped');
            });
        }, 1000 / 240);
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
            transition: 'linear',
        };
        this.movementRatio = 20;

        var birdEl = document.createElement('img');
        birdEl.src = this.imgSrc;
        birdEl.id = this.id;
        Object.assign(birdEl.style, this.style);

        parentEl.appendChild(birdEl);
        this.addGravity();
        var scope = this;

        document.addEventListener('keydown', function () {
            if (scope.fallen) {
                return; // don't perform jumping if the bird has fallen
            }

            scope.jump();
        });
    }

    moveLeft(distance) {
        let _current = parseInt(this.style.left);
        document.getElementById(this.id).style.left = `${
            _current + distance / this.movementRatio
        }px`;
    }

    addGravity() {
        var scope = this;
        var gravity = setInterval(function () {
            if (scope.jumping) {
                return;
            }

            var _current = parseInt(scope.style.top);

            if (_current == 100) {
                var fallenBird = new CustomEvent('FALLEN_BIRD', { detail: scope.id });
                document.dispatchEvent(fallenBird);
            }

            var _new = _current < 100 ? _current + 1 : _current;
            scope.style.top = _new;

            document.getElementById(scope.id).style.top = `${_current}%`;
        }, 1000 / 35);

        document.addEventListener('FALLEN_BIRD', function (e) {
            if (e.detail == scope.id) {
                scope.fallen = true; // set status of this bird to fallen
                clearInterval(gravity);
            }
        });
    }

    jump() {
        var scope = this;
        var counter = 0;

        this.jumping = true;

        setInterval(function () {
            if (counter === 15) {
                scope.jumping = false;
                return;
            }

            var _current = parseInt(scope.style.top);
            counter++;

            var _new = _current > 1 ? _current - 1 : _current;
            scope.style.top = _new;

            // if (_current < 100){
            //     _new = _current + 1
            // } else {
            //     _new = _current
            // }

            document.getElementById(scope.id).style.top = `${_current}%`;
        }, 1000 / 75);
    }
}

$(document).ready(function () {
    var bird1 = new Bird(document.body);

    var offset = 0;

    var animatePipesCaller = setInterval(function () {
        var classMaker = Math.floor(Math.random() * 40000);
        bottomPipe = new Pipe(classMaker, 0, false, null, `${-75 + classMaker / 1000}vh`);
        topPipe = new Pipe(classMaker + 1, 180, true, `${-35 - classMaker / 1000}vh`, null);
        bottomPipe.moveLeft(`${classMaker}`);
        topPipe.moveLeft(`${classMaker + 1}`);
    }, 900);

    var background = new Background();
    background.animateBG();

    document.addEventListener('FALLEN_BIRD', function () {
        console.log('Detected a fallen bird');
        clearInterval(animatePipesCaller);
    });
});
