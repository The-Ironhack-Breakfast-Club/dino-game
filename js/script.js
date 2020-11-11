// import { levelOne } from "./level-one.js";

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

let width = canvas.width = 1000
let height = canvas.height = 750

const bgImg = new Image()
bgImg.src = './images/BG/BG.png'

const dinoImg = new Image()
dinoImg.src = `./images/dino-sprites/dino-sprite.png`

const tileSprite = new Image()
tileSprite.src = `./images/Tiles/tile-sprites.png`

const objectSprite = new Image()
objectSprite.src = `../images/Object/object-sprites.png`

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
        } else if (dino.x >= width * .5 && dino.running == false) {
            ctx.drawImage(bgImg, this.x, this.y)
            ctx.drawImage(bgImg, this.x + 1000, this.y)
        } else if (dino.x >= width * .5 && dino.running == true) {
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

let keys = [];
let friction = 0.8;
let gravity = 0.8;

let tiles = [];

class Objects {
    constructor(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        this.img = img,
            this.sx = sx,
            this.sy = sy,
            this.sWidth = sWidth,
            this.sHeight = sHeight,
            this.dx = dx,
            this.dy = dy,
            this.dWidth = dWidth,
            this.dHeight = dHeight
    }
}

class Terrain {
    constructor(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        this.img = img,
            this.sx = sx,
            this.sy = sy,
            this.sWidth = sWidth,
            this.sHeight = sHeight,
            this.dx = dx,
            this.dy = dy,
            this.dWidth = dWidth,
            this.dHeight = dHeight
    }
}

let bottomBoundary = new Terrain(0, 0, height, width, 5, 0, height, width, 5)
tiles.push(bottomBoundary)

let leftBoundary = new Terrain(0, 5, 0, 5, height, 5, 0, 5, height)
tiles.push(leftBoundary)

// let platform1 = new Terrain (0, 650, height - 400, 200, 200)
// tiles.push(platform1)

// let platform2 = new Terrain (0, 300, height - 200, 200 ,100)
// tiles.push(platform2)

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

    // LEFT AND BOTTOM BOUNDARIES
    for (let i = 0; i < 2; i++) {
        ctx.fillRect(tiles[i].x, tiles[i].y, tiles[i].w, tiles[i].h);

        let side = collisionCheck(dino, tiles[i]);
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

    // tiles AND PLATFORMS ETC
    for (let i = 2; i < tiles.length; i++) {
        if (dino.x < width * .5) {
            ctx.drawImage(tiles[i].img, tiles[i].sx, tiles[i].sy, tiles[i].sWidth, tiles[i].sHeight, tiles[i].dx, tiles[i].dy, tiles[i].dWidth, tiles[i].dHeight);
        } else if (dino.x >= width * .5 && dino.running == false) {
            ctx.drawImage(tiles[i].img, tiles[i].sx, tiles[i].sy, tiles[i].sWidth, tiles[i].sHeight, tiles[i].dx, tiles[i].dy, tiles[i].dWidth, tiles[i].dHeight);
        } else if (dino.x >= width * .5 && dino.running == true) {
            ctx.drawImage(tiles[i].img, tiles[i].sx, tiles[i].sy, tiles[i].sWidth, tiles[i].sHeight, tiles[i].dx -= 8, tiles[i].dy, tiles[i].dWidth, tiles[i].dHeight);
        }

        let side = collisionCheck(dino, tiles[i]);
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

    dino.x = Math.min(dino.velX + dino.x, width * .5);
    dino.y += dino.velY;
}

function collisionCheck(character, obstacle) {
    // get the vectors to check against
    let vX = (character.x + (character.w * .5)) - (obstacle.dx + (obstacle.dWidth / 2)),
        vY = (character.y + (character.h * .5)) - (obstacle.dy + (obstacle.dHeight / 2)),
        // add the half widths and half heights of the objects
        hWidths = (character.w * .4) + (obstacle.dWidth / 2),
        hHeights = (character.h * .4) + (obstacle.dHeight / 2),

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

ctx.font = "50px Arial"
function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.clearRect(0, 0, width, height);
    // ctx.drawImage(bgImg, bg.x, bg.y, bg.w, bg.h)
    scrollingBackground.render()
    drawDino()
    update()
    ctx.fillText(Math.abs(Math.floor(tiles[2].dx / 128)), canvas.width - 100, 60)
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// LEVEL ONEEEEEEEE FIGHT! (DIABETES) ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function lvl1Floor () {
    for (i = 0; i < 200; i++) {
        tiles.push(new Terrain(tileSprite, 128 * 1, 0, 128, 128, i * 128, height - 128, 128, 128))
    }
}
lvl1Floor()