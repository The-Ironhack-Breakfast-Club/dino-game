const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth * .97
canvas.height = canvas.width * .6

const bgImg = new Image()
bgImg.src = './images/BG/BG.png'

const dinoIdle = new Image()
dinoIdle.src = ``
i = 1

let bg = { x: 0, y: 0, w: canvas.width, h: canvas.height }

let dino = {
    x: 0,
    y: canvas.height * .8,
    w: canvas.width * .2,
    h: canvas.height * .2,
    speed: 3,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
    idling: true,
    walking: false,
    dying: false,
    rightFacing: true
}

let keys = [];
let friction = 0.8;
let gravity = 0.3;

let boxes = [];

// BOTTOM BOUNDARY
boxes.push({
    x: 0,
    y: canvas.height,
    w: canvas.width,
    h: 5
});

setInterval(function () {
    if (dino.idling && dino.rightFacing) {

        console.log(dino.jumping, dino.walking, dino.idling, dino.rightFacing)
        dinoIdle.src = `./images/dino-sprites/idle-right/Idle (${i}).png`
        if (i < 10) {
            i++
        } else {
            i = 1
        }
    } else if (dino.idling && !dino.rightFacing) {
        console.log(dino.jumping, dino.walking, dino.idling, dino.rightFacing)
        dinoIdle.src = `./images/dino-sprites/idle-left/Idle (${i}).png`
        if (i < 10) {
            i++
        } else {
            i = 1
        }
    }
}, 75)

function update() {
    // check keys
    if (keys[38] || keys[32]) {
        // up arrow or space
        if (!dino.jumping && dino.grounded) {
            dino.jumping = true;
            dino.grounded = false;
            dino.idling = false;
            dino.velY = -dino.speed * 2;
        }
    }
    if (keys[39]) {
        // right arrow
        if (dino.velX < dino.speed) {
            dino.velX++;
        }
        dino.rightFacing = true;
    }
    if (keys[37]) {
        // left arrow
        if (dino.velX > -dino.speed) {
            dino.velX--;
        }
        dino.rightFacing = false;
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
});

function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, bg.x, bg.y, bg.w, bg.h)
    ctx.drawImage(dinoIdle, dino.x, dino.y, dino.w, dino.h)
    update()
}
animate()


