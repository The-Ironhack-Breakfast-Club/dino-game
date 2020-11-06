const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

canvas.height = window.innerHeight * .97
canvas.width = canvas.height * 1.5

const bgImg = new Image()
bgImg.src = '../images/BG/BG.png'

const dinoImg = new Image()
dinoImg.src = `../images/dino-sprites/walk/Walk (4).png`

let bg = { x: 0, y: 0, w: canvas.width, h: canvas.height }

class Dino {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

let dino = new Dino(0, canvas.height - 200, 300, 200)

//Controls
var map = {}; // You could also use an array
onkeydown = onkeyup = function (e) {
    e = e || event; // to deal with IE
    map[e.key] = e.type == 'keydown';
    /* insert conditional here */
}



function moveDino() {
    for (let key in map) {
        if (map['ArrowLeft']) {
            dino.x -= 5
        }
        if (map['ArrowRight']) {
            dino.x += 5
        }
        if (map[' ']) {
            for (i = 0; i < 5; i++) {
                dino.y -= 5
            }
        }

        //Alternate space logic - WIP
        // if (map[' ']) {
        //     while (dino.y < canvas.height - dino.h) {
        //         setInterval(function () {
        //             dino.y -= 5
        //         }, 50)
        //     }
        // }
    }
}

function gravity() {
    while (dino.y < (canvas.height - dino.h)) {
        dino.y += 1
    }
}









////////////////////////////////////////////////////////////////////////////////


function animate() {
    animationId = requestAnimationFrame(animate)
    //Clear the whole board 
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bgImg, bg.x, bg.y, bg.w, bg.h)
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.w, dino.h)
    gravity()
    moveDino()
    //console.log(map)
}
animate()