class Background {
    constructor(el, bgImg = '../img/bg.png') {
        this.el = el; // why?

        this.style = {
            left: 0,
            top: 0,
            position: 'fixed',
            height: '100%',
            width: '100%',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: '0 0',
            backgroundSize: 'auto 100%',
            backgroundImage: `url("${bgImg}")`,
        };
        this.movementRatio = 250;
        Object.assign(this.el.style, this.style);
    }

    scrollSideWay(distance) {
        this.el.style.backgroundPosition = `-${distance / this.movementRatio}px 0px`;
    }
}

class Pipe {
    constructor(className, angle, flip, top = null, bottom = 0, parentEl = document.body) {
        this.class = className;
        this.imgSrc = '../img/pipe.png';
        this.size = null;
        this.style = {
            position: 'fixed',
            top: top,
            left: '100%',
            width: '150px',
            bottom: bottom,
            transform: `rotate(${angle}deg)`,
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

    /**
     * Calculate the actual distance that the pipe needs to be shifted to the left
     * according to the distance parameter and the movement ratio
     * @param {Number} distance
     */
    /*     moveLeft(distance) {
        let _current = parseInt(this.style.left);
        document.getElementsByClassName(this.class)[1].style.left = `${
            _current - distance / this.movementRatio
        }px`; */
    moveLeft(classMaker) {
        var scope = this;
        setInterval(function () {
            scope.counter -= 0.5;
            document.getElementsByClassName(
                `${classMaker}`
            )[0].style.left = `${scope.counter}%`;
        }, 17);
    }
}

class Bird {
    constructor(parentEl) {
        this.id = 'bird_' + Math.floor(Math.random() * 2000);
        this.imgSrc = '../img/bird.png';
        this.jumping = false;
        this.fallen = false; // by default a bird is not fallen until it has thrown the FALLEN_BIRD event
        this.style = {
            position: 'fixed',
            top: '60%' /* Math.floor(Math.random() * 80) + '%' */,
            left: '15%' /* Math.floor(Math.random() * 2000) + 'px' */,
            width: '100px',
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
    // instance of the class Background, "this" variable inside an instance refers to the instance itself
    // not to the class
    var bg = new Background(document.getElementById('background')); // bg is an instance of the class Background

    console.log(bg.movementRatio); // will be 50
    console.log(bg.scrollSideWay); // content of scrollSideWay

    // var birds = new Array(10);

    // for (var i=0; i<birds.length; i++){
    //     birds[i] = new Bird(document.body)
    // }

    var bird1 = new Bird(document.body);

    /*     var pipes = new Array(20); // pipes = [undefined,undefined,,,,,,,,]

    // create i, set it to zero, do the following things until i equals to pipes.length
    for (var i = 0; i < pipes.length; i++) {
        var left = Math.floor(Math.random() * 10000) + 'px';
        pipes[i] = new Pipe(left, 0, left, false, null, 0);
        pipes[i] = new Pipe(left, 180, left, true, 0, null);
    }
 */
    var offset = 0;

    setInterval(function () {
        var classMaker = Math.floor(Math.random() * 10000);
        pipe1 = new Pipe(classMaker, 0, false, null, 0);
        pipe2 = new Pipe(classMaker + 1, 180, true, 0, null);
        pipe1.moveLeft(`${classMaker}`);
        pipe2.moveLeft(`${classMaker + 1}`);
    }, 1000);

    var animation = setInterval(function () {
        offset += 200;

        bg.scrollSideWay(offset);

        /*         pipes.forEach(function (pipe) {
            console.log(pipe);
            pipe.moveLeft(offset);
        }); */
    }, 10);

    document.addEventListener('FALLEN_BIRD', function () {
        console.log('Detected a fallen bird');
        clearInterval(animation);
    });
});
