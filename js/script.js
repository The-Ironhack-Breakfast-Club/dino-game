const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

let width = canvas.width = 1000
let height = canvas.height = 750

const bgImg = new Image()
bgImg.src = './images/BG/BG.png'

const dinoImg = new Image()
dinoImg.src = `./images/dino-sprites/dino-sprite.png`

class Background {
    constructor(x, y, w, h) {
        this.x = 0;
        this.y = 0;
        this.w = width;
        this.h = height;
    }

    render() {
        if (dino.x < width * .5) {
            ctx.drawImage(bgImg, this.x, this.y)
            ctx.drawImage(bgImg, this.x + 1000, this.y)
        } else if (dino.x > width * .5 && dino.running == false) {
            ctx.drawImage(bgImg, this.x, this.y)
            ctx.drawImage(bgImg, this.x + 1000, this.y)
        } else if (dino.x > width * .5 && dino.running == true) {
            ctx.drawImage(bgImg, this.x -= 1, this.y)
            ctx.drawImage(bgImg, this.x + 1000, this.y)
            if (this.x <= -1000) {
                this.x = 0
            }
        }
    }
}

let scrollingBackground = new Background();

let bg = { x: 0, y: 0, w: width, h: height }

let dino = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    speed: 6,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
    idling: true,
    running: false,
    dying: false,
    rightFacing: true
}

let dinoColPts = {
    x: dino.x,
    y: dino.y,
    w: dino.w * .6,
    h: dino.h * .8,
}

let keys = [];
let friction = 0.8;
let gravity = 0.8;

let boxes = [];

// BOTTOM BOUNDARY
boxes.push({
    x: 0,
    y: height,
    w: width,
    h: 5
});

// LEFT BOUNDARY
boxes.push({
    x: -1,
    y: 0,
    w: 1,
    h: height
})

boxes.push({
    x: 650,
    y: height - 400,
    w: 200,
    h: 200
})

boxes.push({
    x: 300,
    y: height - 200,
    w: 200,
    h: 100
})

function update() {
    // check keys
    dino.idling = true;
    // console.log(dino.x, width * .5, dino.running)

    if (keys[38] || keys[32]) {
        // up arrow or space
        if (!dino.jumping && dino.grounded) {
            dino.jumping = true;
            dino.grounded = false;
            dino.idling = false;
            dino.velY = -dino.speed * 3.5;
            dino.running = false;
        }
    }

    if (keys[39]) {
        // right arrow
        if (dino.x < width * .5) {
            if (dino.velX < dino.speed) {
                dino.velX += 3;
            }
        }
        dino.rightFacing = true;
        dino.idling = false;
        dino.running = true;
    }

    if (keys[37]) {
        // left arrow
        if (dino.velX > -dino.speed) {
            dino.velX -= 3;
        }
        dino.rightFacing = false;
        dino.idling = false;
        dino.running = true;
    }

    dino.velX *= friction;
    dino.velY += gravity;

    dino.grounded = false;
    for (let i = 2; i < boxes.length; i++) {
        if (dino.x < width * .5) {
            ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].w, boxes[i].h);
        } else if (dino.x > width * .5 && dino.running == false) {
            ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].w, boxes[i].h);
        } else if (dino.x > width * .5 && dino.running == true) {
            ctx.fillRect(boxes[i].x -= 8, boxes[i].y, boxes[i].w, boxes[i].h);
        }

        ctx.fillRect(boxes[0].x, boxes[0].y, boxes[0].w, boxes[0].h);
        ctx.fillRect(boxes[1].x, boxes[1].y, boxes[1].w, boxes[1].h);

        // if (dino.x < width * .5) {
        //     ctx.drawImage(bgImg, this.x, this.y)
        //     ctx.drawImage(bgImg, this.x + 1000, this.y)
        // } else if (dino.x > width * .5 && dino.running == false) {
        //     ctx.drawImage(bgImg, this.x, this.y)
        //     ctx.drawImage(bgImg, this.x + 1000, this.y)
        // } else if (dino.x > width * .5 && dino.running == true) {
        //     ctx.drawImage(bgImg, this.x -= 1, this.y)
        //     ctx.drawImage(bgImg, this.x + 1000, this.y)
        //     if (this.x <= -1000) {
        //         this.x = 0
        //     }
        // }

        let side = collisionCheck(dino, boxes[i]);
        if (side === "l" || side === "r") {
            dino.velX = 0;
            dino.jumping = false;
        } else if (side === "b") {
            dino.grounded = true;
            dino.jumping = false;
        } else if (side === "t") {
            dino.velY *= -1;
        }
    }

    if (dino.grounded) {
        dino.velY = 0;
    }

    dino.x += dino.velX;
    dino.y += dino.velY;
}

function collisionCheck(character, obstacle) {
    // get the vectors to check against
    let vX = (character.x + (character.w * .5)) - (obstacle.x + (obstacle.w / 2)),
        vY = (character.y + (character.h * .5)) - (obstacle.y + (obstacle.h / 2)),
        // add the half widths and half heights of the objects
        hWidths = (character.w * .4) + (obstacle.w / 2),
        hHeights = (character.h * .4) + (obstacle.h / 2),

        collisionSide = null;
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        let oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                collisionSide = "t";
                character.y += oY;
            } else {
                collisionSide = "b";
                character.y -= oY;
            }
        } else {
            if (vX > 0) {
                collisionSide = "l";
                character.x += oX;
            } else {
                collisionSide = "r";
                character.x -= oX;
            }
        }
    }
    return collisionSide;
}

////////////////////////////////////////////////////////////////////////////////
document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

let stages = {
    idleRight: { s: -30, w: 680, num: 10 },
    idleLeft: { s: 7080, w: 680, num: 10 },
    runRight: { s: 13620, w: 680, num: 8 },
    runLeft: { s: 19270, w: 680, num: 8 },
    jumpRight: { s: 24500, w: 680, num: 10 },
    jumpLeft: { s: 31510, w: 680, num: 10 },
    deadRight: { s: 38080, w: 680, num: 8 },
    deadLeft: { s: 43520, w: 680, num: 8 },
}

let action = 'idleRight'
let x = stages[action].s

function changeAction(newAction) {
    if (action != newAction) {
        action = newAction;
        x = stages[action].s
    }
}

function drawDino() {
    // ctx.fillStyle = "blue"
    // ctx.fillRect(dino.x, dino.y, dino.w, dino.h)
    ctx.drawImage(dinoImg, x, 0, 430, dinoImg.height, dino.x, dino.y, dino.w, dino.h)
}
dinoImg.onload = animate;

setInterval(function () {
    x += stages[action].w
    if (x >= (stages[action].w * stages[action].num) + stages[action].s) {
        x = stages[action].s
    }
    if (dino.jumping && dino.rightFacing) {
        changeAction('jumpRight');
        dino.running = false;
    } else if (dino.jumping && !dino.rightFacing) {
        changeAction('jumpLeft');
        dino.running = false;
    } else if (dino.idling && dino.rightFacing) {
        changeAction('idleRight');
        dino.running = false;
    } else if (dino.idling && !dino.rightFacing) {
        changeAction('idleLeft');
        dino.running = false;
    } else if (dino.running && dino.rightFacing) {
        changeAction('runRight');
    } else if (dino.running && !dino.rightFacing) {
        changeAction('runLeft');
    }
}, 65)

function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.clearRect(0, 0, width, height);
    // ctx.drawImage(bgImg, bg.x, bg.y, bg.w, bg.h)
    scrollingBackground.render()
    drawDino()
    update()
}