//todo: creae ball and paddle separate classes 
let mCircle = {
    x: 30,
    y: 30,
    r: 30,
    cx: 0,
    cy: 0,
    vx: 5,
    vy: 5
};

let mBrick = {
    x: 360,
    y: 600,
    w: 200,
    h: 60,
    leftBound: 200,
    rightBound: 1000,
    cx: 0,
    cy: 0
}

const period = 2000; //in ms
let that;
class BouncingBall {
    constructor() {
        this.canvas = document.getElementById('stage');
        this.stage = this.canvas.getContext('2d');
        this.gradient = {};
        that = this;
    }

    init() {
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.continue = true;
        this.addEvent();
        this.setBackground();
        this.drawBall();
        mBrick.y = this.canvas.height - mBrick.h;
        mBrick.rightBound = this.canvas.width - mBrick.w;
        this.drawBrick();
        this.calculateCenterPoints();
        this.amplitude = this.centerY - mCircle.r;
        setTimeout(function() {
            var startTime = (new Date()).getTime();
            that.animate(startTime);
        }, 1000);
    }

    calculateCenterPoints() {
        mCircle.cx = mCircle.x + mCircle.r;
        mCircle.cy = mCircle.y + mCircle.r;
        mBrick.cx = mBrick.x + mBrick.w / 2;
        mBrick.cy = mBrick.y + mBrick.h / 2;
    }

    addEvent() {
        this.canvas.addEventListener('mousedown', this.onMouseDown, false);
        this.canvas.addEventListener('mousemove', this.onMouseMove, false);
    }

    onMouseDown(evt) {
        that.continue = false;
    }

    onMouseMove(evt) {
        if (evt.clientX <= mBrick.rightBound) mBrick.x = evt.clientX;
    }

    setBackground() {
        this.gradient = this.stage.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        this.gradient.addColorStop(0, 'white');
        this.gradient.addColorStop(0.7, 'skyblue');
        this.gradient.addColorStop(1, 'green');
        this.stage.fillStyle = this.gradient;
        this.stage.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.stage.save();
    }

    drawBall() {
        this.stage.moveTo(mCircle.x, mCircle.y);
        this.stage.beginPath();
        this.stage.arc(mCircle.x, mCircle.y, mCircle.r, 0, Math.PI * 2, true);
        this.stage.closePath();
        this.stage.fillStyle = '#FA6900';
        this.stage.fill();
    }

    drawBrick() {
        this.stage.fillStyle = 'orange';
        this.stage.fillRect(mBrick.x, mBrick.y, mBrick.w, mBrick.h);
    }

    continueGame() {
        this.stage.restore();
        this.stage.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.stage.save();
        this.drawBall();
        this.drawBrick();
    }

    endGame() {
        this.stage.restore();
        this.stage.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    hasCollision() {
        if (mCircle.x + mCircle.r > mBrick.x &&
            (mCircle.x - mCircle.r < mBrick.x + mBrick.w) &&
            mCircle.y + mCircle.r > mBrick.y) {
            mCircle.vy *= -1;
            mCircle.y += mCircle.vy;

            if (mCircle.x < mBrick.x + mCircle.r || mCircle.x > mBrick.x + mBrick.w) {
                mCircle.vx *= -1;
                mCircle.x += mCircle.vx;
            }
        }
    }

    animate() {

        if (mCircle.x >= mCircle.r && mCircle.x + mCircle.r < that.canvas.width) {
            mCircle.x += mCircle.vx;
            that.hasCollision();
        } else {
            mCircle.vx *= -1;
            mCircle.x += mCircle.vx;
        }
        if (mCircle.y >= mCircle.r && mCircle.y + mCircle.r < that.canvas.height) {
            mCircle.y += mCircle.vy;
            that.hasCollision();
        } else {
            mCircle.vy *= -1;
            mCircle.y += mCircle.vy;
        }


        that.continueGame();
        // request new frame
        requestAnimFrame(() => that.animate());
    }

}


window.requestAnimFrame = ((callback) => {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

let bouncingBall = new BouncingBall();
bouncingBall.init();