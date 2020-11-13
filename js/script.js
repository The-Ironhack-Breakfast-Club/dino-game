// import { levelOne } from "./level-one.js";

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

let width = canvas.width = 1000
let height = canvas.height = 750

const bgImg = new Image()
bgImg.src = './images/BG/BG.png'

const dinoImg = new Image()
dinoImg.src = `./images/dino-sprites/dino-sprite.png`

const enemyImg = new Image()
enemyImg.src = `./images/meteor-enemy/walking-sprite.png`

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
let gravity = 1.3;

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

    render() {
        for (let i = 0; i < 5; i++) {
            ctx.drawImage(syrup.img, syrup.sx, syrup.sy, syrup.sWidth, syrup.sHeight, syrup.dx + (40 * i), syrup.dy, syrup.dWidth, syrup.dHeight)
        }

        // for (let i = 0; i < 5; i++) {
        //     ctx.drawImage(syrup.img, syrup.sx, syrup.sy, syrup.sWidth, syrup.sHeight, syrup.dx + (40 * i), syrup.dy, syrup.dWidth * 1.1, syrup.dHeight * 1.1)
        // }
    }
}

let enemies = [];

class Enemy {
    constructor(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, speed, velX, velY, grounded, idling, walking, dying, rightFacing) {
        this.img = img,
            this.sx = sx,
            this.sy = sy,
            this.sWidth = sWidth,
            this.sHeight = sHeight,
            this.dx = dx,
            this.dy = dy,
            this.dWidth = dWidth,
            this.dHeight = dHeight,
            this.speed = speed,
            this.velX = velX,
            this.velY = velY,
            this.grounded = grounded,
            this.idling = idling,
            this.walking = walking,
            this.dying = dying,
            this.rightFacing = rightFacing
    }
}

let enemy = new Enemy(enemyImg, 0, 0, 0, 0, 500, 100, 365 / 8, 512 / 8, 6, 0, 0, false, false, true, false, true);

let syrup = new Objects(objectSprite, 1483, 0, 365, 512, 6, 10, 365 / 8, 512 / 8)

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

function update() {
    // check keys
    dino.idling = true;

    if (keys[38] || keys[32]) {
        // up arrow or space
        gravity = 1.3
        if (!dino.jumping && dino.grounded) {
            gravity = 1.3
            dino.jumping = true;
            dino.grounded = false;
            dino.idling = false;
            dino.velY = -dino.speed * 4.6;
            dino.running = false;
        }
    }

    if (keys[39]) {
        // right arrow
        gravity = 1.3
        if (dino.x < width * .5) {
            if (dino.velX < dino.speed) {
                dino.velX += 3;
            }
        }
        if (dino.x == 500) {
            enemy.dx -= 8;
        }
        dino.rightFacing = true;
        dino.idling = false;
        dino.running = true;
    }

    if (keys[37]) {
        // left arrow
        gravity = 1.3
        if (dino.velX > -dino.speed) {
            dino.velX -= 3;
        }
        dino.rightFacing = false;
        dino.idling = false;
        dino.running = true;
    }

    dino.velX *= friction;
    dino.velY += gravity;

    enemy.velX *= friction;
    enemy.velY += gravity;

    dino.grounded = false;
    enemy.grounded = false;

    // LEFT AND BOTTOM BOUNDARIES
    for (let i = 0; i < 2; i++) {
        ctx.fillRect(tiles[i].x, tiles[i].y, tiles[i].w, tiles[i].h);

        let side = collisionCheckCharObs(dino, tiles[i]);
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

    // chcaracter in relation to tiles AND PLATFORMS ETC
    for (let i = 2; i < tiles.length; i++) {
        if (dino.x < width * .5) {
            ctx.drawImage(tiles[i].img, tiles[i].sx, tiles[i].sy, tiles[i].sWidth, tiles[i].sHeight, tiles[i].dx, tiles[i].dy, tiles[i].dWidth, tiles[i].dHeight);
        } else if (dino.x >= width * .5 && dino.running == false) {
            ctx.drawImage(tiles[i].img, tiles[i].sx, tiles[i].sy, tiles[i].sWidth, tiles[i].sHeight, tiles[i].dx, tiles[i].dy, tiles[i].dWidth, tiles[i].dHeight);
        } else if (dino.x >= width * .5 && dino.running == true) {
            ctx.drawImage(tiles[i].img, tiles[i].sx, tiles[i].sy, tiles[i].sWidth, tiles[i].sHeight, tiles[i].dx -= 8, tiles[i].dy, tiles[i].dWidth, tiles[i].dHeight);
        }
        let side = collisionCheckCharObs(dino, tiles[i]);
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
        gravity = 0;
    }

    //Enemy in relation to obstacles
    for (let i = 2; i < tiles.length; i++) {
        let sideEnemy = collisionCheckEnemyObs(enemy, tiles[i]);
        if (sideEnemy === "l") {
            enemy.rightFacing = true;
        } else if (sideEnemy === "r") {
            enemy.rightFacing = false;
        } else if (sideEnemy === "b") {
            enemy.grounded = true;
        } else if (sideEnemy === "t") {
            enemy.velY *= -1;
        }
    }

    //character in relation to enemyStages[actionEnemy]
    let sideChar = collisionCheckCharEnemy(dino, enemy);
    if (sideChar === "l" || sideChar === "r") {
        dino.dying = true;
    } else if (sideChar === "b") {
        enemy.dying = true;
    } else if (sideChar === "t") {
        dino.dying = true;
    }

    if (enemy.grounded) {
        enemy.velY = 0;
    }

    dino.x = Math.min(dino.velX + dino.x, width * .5);
    dino.y += dino.velY;

    if (enemy.walking == true && enemy.rightFacing == true) {
        enemy.dx += 2;
    } else if (enemy.walking == true && enemy.rightFacing != true) {
        enemy.dx -= 2;
    }

    enemy.dy += enemy.velY;
}

function collisionCheckCharObs(character, obstacle) {
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

function collisionCheckEnemyObs(enemy, obstacle) {
    // get the vectors to check against
    let vX = (enemy.dx + (enemy.dWidth * .5)) - (obstacle.dx + (obstacle.dWidth / 2)),
        vY = (enemy.dy + (enemy.dHeight * .5)) - (obstacle.dy + (obstacle.dHeight / 2)),

        // add the half widths and half heights of the objects
        hWidths = (enemy.dWidth * .5) + (obstacle.dWidth / 2),
        hHeights = (enemy.dHeight * .5) + (obstacle.dHeight / 2),

        collisionSide = null;
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        let oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                collisionSide = "t";
                enemy.dy += oY;
            } else {
                collisionSide = "b";
                enemy.dy -= oY;
            }
        } else {
            if (vX > 0) {
                collisionSide = "l";
                enemy.dx += oX;
            } else {
                collisionSide = "r";
                enemy.dx -= oX;
            }
        }
    }
    return collisionSide;
}

function collisionCheckCharEnemy(character, enemy) {
    // get the vectors to check against
    let vX = (character.x + (character.w * .5)) - (enemy.dx + (enemy.dWidth / 2)),
        vY = (character.y + (character.h * .5)) - (enemy.dy + (enemy.dHeight / 2)),

        // add the half widths and half heights of the objects
        hWidths = (character.w * .4) + (enemy.dWidth / 2),
        hHeights = (character.h * .4) + (enemy.dHeight / 2),

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

let dinoStages = {
    idleRight: { s: -30, w: 680, num: 10 },
    idleLeft: { s: 7080, w: 680, num: 10 },
    runRight: { s: 13620, w: 680, num: 8 },
    runLeft: { s: 19270, w: 680, num: 8 },
    jumpRight: { s: 24500, w: 680, num: 10 },
    jumpLeft: { s: 31510, w: 680, num: 10 },
    deadRight: { s: 38080, w: 680, num: 8 },
    deadLeft: { s: 43520, w: 680, num: 8 },
}

let enemyStages = {
    walkRight: { s: 0, w: 375.291666666666667, num: 24 },
    walkLeft: { s: 9007, w: 375.291666666666667, num: 23 }
}

let action = 'idleRight'
let x = dinoStages[action].s

function changeAction(newAction) {
    if (action != newAction) {
        action = newAction;
        x = dinoStages[action].s
    }
}


let actionEnemy = 'walkRight'
let xEnemy = enemyStages[actionEnemy].s
function changeActionEnemy(newAction) {
    if (actionEnemy != newAction) {
        actionEnemy = newAction;
        xEnemy = enemyStages[actionEnemy].s
    }
}

function syrupSmall() {
    for (let i = 0; i < 5; i++) {
        ctx.drawImage(syrup.img, syrup.sx, syrup.sy, syrup.sWidth, syrup.sHeight, syrup.dx + (40 * i), syrup.dy, syrup.dWidth, syrup.dHeight)
    }
}

// function syrupLarge() {
//     for (let i = 0; i < 5; i++) {
//         ctx.drawImage(syrup.img, syrup.sx, syrup.sy, syrup.sWidth, syrup.sHeight, syrup.dx + (40 * i), syrup.dy, syrup.dWidth * 1.1, syrup.dHeight * 1.1)
//     }
// }

//SYRUP OF LIFE//
// setInterval(function () {
//     syrupLarge()
// }, 100)

function drawDino() {
    ctx.drawImage(dinoImg, x, 0, 430, dinoImg.height, dino.x, dino.y, dino.w, dino.h)
}
dinoImg.onload = animate;

function drawEnemy() {
    ctx.drawImage(enemyImg, xEnemy, 0, 375.291666666666667, enemyImg.height, enemy.dx, enemy.dy, enemy.dWidth, enemy.dHeight);
}

setInterval(function () {
    x += dinoStages[action].w
    if (x >= (dinoStages[action].w * dinoStages[action].num) + dinoStages[action].s) {
        x = dinoStages[action].s
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


setInterval(function () {
    xEnemy += enemyStages[actionEnemy].w
    if (xEnemy >= (enemyStages[actionEnemy].w * enemyStages[actionEnemy].num) + enemyStages[actionEnemy].s) {
        xEnemy = enemyStages[actionEnemy].s
    }
    if (!enemy.rightFacing) {
        changeActionEnemy('walkLeft')
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
    drawEnemy()
    syrupSmall()
    ctx.fillText(Math.abs(Math.floor(tiles[2].dx / 128)), canvas.width - 100, 60)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// LEVEL ONEEEEEEEE FUNCTIONS -- FIGHT! (DIABETES) ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function floor() {
    for (i = 0; i < 200; i++) {
        tiles.push(new Terrain(tileSprite, 128 * 1, 0, 128, 128, i * 128, height - 128, 128, 128))
    }
}
floor()


function floatingPlatform(img, xLocation, yLocation, width) {
    tiles.push(new Terrain(img, 128 * 12, 0, 128, 128, (xLocation - 2) * 128, height - (128 * yLocation), 138, 128))
    for (i = 0; i < width - 2; i++) {
        tiles.push(new Terrain(img, 128 * 13, 0, 128, 128, ((xLocation - 1 + i) * 128), height - (128 * yLocation), 138, 128))
    }
    tiles.push(new Terrain(img, 128 * 14, 0, 128, 128, ((xLocation) * 128) + (128 * (width - 3)), height - (128 * yLocation), 138, 128))
}

function platform(img, xLocation, width, height) {
    //////////////LAYER 1//////////////
    tiles.push(new Terrain(img, 128 * 6, 0, 128, 128, (xLocation - 1) * 128, canvas.height - 128, 138, 128))
    tiles.push(new Terrain(img, 128 * 7, 0, 128, 128, (xLocation) * 128, canvas.height - 128, 138, 128))
    for (i = 0; i < width - 2; i++) {
        tiles.push(new Terrain(img, 128 * 4, 0, 128, 128, (xLocation + (i + 1)) * 128, canvas.height - 128, 138, 128))
    }
    tiles.push(new Terrain(img, 128 * 9, 0, 128, 128, (xLocation + (width - 1)) * 128, canvas.height - 128, 138, 128))
    tiles.push(new Terrain(img, 128 * 10, 0, 128, 128, (xLocation + width) * 128, canvas.height - 128, 138, 128))
    //////////////LAYER 2//////////////
    if (height > 1) {
        for (i = 2; i <= height; i++) {
            tiles.push(new Terrain(img, 128 * 3, 0, 128, 128, (xLocation) * 128, canvas.height - 128 * i, 138, 128))
            for (j = 0; j < width - 2; j++) {
                tiles.push(new Terrain(img, 128 * 4, 0, 128, 128, (xLocation + j + 1) * 128, canvas.height - 128 * i, 138, 128))
            }
            tiles.push(new Terrain(img, 128 * 5, 0, 128, 128, (xLocation + (width - 1)) * 128, canvas.height - 128 * i, 138, 128))
        }
    }
    //////////////LAYER 3//////////////
    tiles.push(new Terrain(img, 128 * 0, 0, 128, 128, (xLocation) * 128, canvas.height - 128 * (height + 1), 138, 128))
    for (i = 0; i < width - 2; i++) {
        tiles.push(new Terrain(img, 128 * 1, 0, 128, 128, (xLocation + (i + 1)) * 128, canvas.height - 128 * (height + 1), 138, 128))
    }
    tiles.push(new Terrain(img, 128 * 2, 0, 128, 128, (xLocation + (width - 1)) * 128, canvas.height - 128 * (height + 1), 138, 128))
}

// function enemy() {

// }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////BUILD LEVEL 1//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
floatingPlatform(tileSprite, 6, 2.8, 3)
floatingPlatform(tileSprite, 10, 4.5, 2)
floatingPlatform(tileSprite, 14, 4, 2)
platform(tileSprite, 15, 7, 2)
floatingPlatform(tileSprite, 25, 5, 2) // 5
floatingPlatform(tileSprite, 28, 3.5, 2)
floatingPlatform(tileSprite, 32, 3.5, 2)
platform(tileSprite, 33, 10, 1)
floatingPlatform(tileSprite, 46, 2.8, 5)
floatingPlatform(tileSprite, 52, 3.8, 3) //10
platform(tileSprite, 58, 5, 2)
floatingPlatform(tileSprite, 57, 5, 2)
floatingPlatform(tileSprite, 67, 3.5, 2)
floatingPlatform(tileSprite, 72, 3.5, 2)
platform(tileSprite, 78, 5, 1) // 15
floatingPlatform(tileSprite, 80, 5.5, 5)
floatingPlatform(tileSprite, 85, 3.8, 3)
platform(tileSprite, 90, 5, 2)

