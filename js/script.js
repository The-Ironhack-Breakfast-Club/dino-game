const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

let width = canvas.width = 800
let height = canvas.height = 450

const bgImg = new Image()
bgImg.src = './images/BG/BG.png'

const dinoImg = new Image()
dinoImg.src = `./images/dino-sprites/dino-sprite.png`


let bg = { x: 0, y: 0, w: width, h: height }

let dino = {
    x: 0,
    y: 0,
    w: 80,
    h: 80,
    // y: height * .8,
    // w: width,
    // h: height * .2,
    speed: 3,
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
let gravity = 0.3;

let boxes = [];

// BOTTOM BOUNDARY
boxes.push({
    x: 0,
    y: height,
    w: width,
    h: 5
});

boxes.push({
    x: width / 2,
    y: height - 50,
    w: 200,
    h: 50
})

idleNum = 1;
walkNum = 1;
jumpNum = 1;








// setInterval(function () {
//     if (dino.jumping && dino.rightFacing) {
//         dinoImg.src = `./images/dino-sprites/jump-right/Jump (${jumpNum}).png`
//         if (jumpNum < 10) {
//             jumpNum++
//         } else {
//             jumpNum = 1
//         }
//         console.log(jumpNum)
//     } else if (dino.jumping && !dino.rightFacing) {
//         dinoImg.src = `./images/dino-sprites/jump-left/Jump (${jumpNum}).png`

//         if (jumpNum < 10) {
//             jumpNum++
//         } else {
//             jumpNum = 1
//         }
//     } else if (dino.idling && dino.rightFacing) {
//         dinoImg.src = `./images/dino-sprites/idle-right/Idle (${idleNum}).png`
//         if (idleNum < 10) {
//             idleNum++
//         } else {
//             idleNum = 1
//         }
//     } else if (dino.idling && !dino.rightFacing) {
//         dinoImg.src = `./images/dino-sprites/idle-left/Idle (${idleNum}).png`
//         if (idleNum < 10) {
//             idleNum++
//         } else {
//             idleNum = 1
//         }
//     } else if (dino.running && dino.rightFacing) {
//         dinoImg.src = `./images/dino-sprites/run-right/Run (${walkNum}).png`
//         if (walkNum < 8) {
//             walkNum++
//         } else {
//             walkNum = 1
//         }
//     } else if (dino.running && !dino.rightFacing) {
//         dinoImg.src = `./images/dino-sprites/run-left/Run (${walkNum}).png`
//         if (walkNum < 8) {
//             walkNum++
//         } else {
//             walkNum = 1
//         }
//     }
// }, 75)

function changeAction(newAction) {
    if (action != newAction) {
        action = newAction;
        x = stages[action].s
    }
}

function update() {
    // check keys
    //dino.idling = true;

    if (keys[38] || keys[32]) {
        // up arrow or space
        if (dino.rightFacing == true) {
            changeAction('jumpRight')
        } else {
            changeAction('jumpLeft')
        }
        if (!dino.jumping && dino.grounded) {
            dino.jumping = true;
            dino.grounded = false;
            dino.idling = false;
            dino.velY = -dino.speed * 3;
            dino.running = false;
            jumpNum = 1;
        }
    }

    if (keys[39]) {
        // right arrow
        changeAction('runRight')
        if (dino.velX < dino.speed) {
            dino.velX++;
        }
        dino.rightFacing = true;
        dino.idling = false;
        dino.running = true;
    }

    if (keys[37]) {
        // left arrow
        changeAction('runLeft');
        if (dino.velX > -dino.speed) {
            dino.velX--;
        }
        dino.rightFacing = false;
        dino.idling = false;
        dino.running = true;
    }

    dino.velX *= friction;
    dino.velY += gravity;

    dino.grounded = false;
    for (let i = 0; i < boxes.length; i++) {
        ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].w, boxes[i].h);

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
    let vX = (character.x + (character.w / 2)) - (obstacle.x + (obstacle.w / 2)),
        vY = (character.y + (character.h / 2)) - (obstacle.y + (obstacle.h / 2)),
        // add the half widths and half heights of the objects
        hWidths = (character.w / 2) + (obstacle.w / 2),
        hHeights = (character.h / 2) + (obstacle.h / 2),

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
    if (dino.rightFacing == true) {
        action = 'idleRight'
    } else if (dino.rightFacing == false) {
        action = 'idleLeft'
    }
});

function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bgImg, bg.x, bg.y, bg.w, bg.h)
    drawDino()
    update()
}

let stages = {
    idleRight: { s: -30, w: 680, num: 10 },
    idleLeft: { s: 7085, w: 680, num: 10 },
    runRight: { s: 13620, w: 680, num: 8 },
    runLeft: { s: 19270, w: 680, num: 8 },
    jumpRight: { s: 24500, w: 680, num: 10 },
    jumpLeft: { s: 31510, w: 680, num: 10 },
    deadRight: { s: 38080, w: 680, num: 8 },
    deadLeft: { s: 43520, w: 680, num: 8 },
}

let action = 'idleRight'
let x = stages[action].s

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
}, 75)
