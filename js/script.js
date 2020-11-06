const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

canvas.height = window.innerHeight * .97
canvas.width = canvas.height * 1.5

const bgImg = new Image()
bgImg.src = '../images/BG/BG.png'

let bg = { x: 0, y: 0, w: canvas.width, h: canvas.height }

function animate() {
    animationId = requestAnimationFrame(animate)
    //Clear the whole board 
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bgImg, bg.x, bg.y, bg.w, bg.h)
}
animate()